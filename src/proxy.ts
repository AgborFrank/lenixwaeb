import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";
import { isDisabledPromoPath } from "@/lib/feature-flags";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/register"];
const ADMIN_COOKIE_NAME = "admin_session";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return new TextEncoder().encode(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = getJwtSecret();
    if (!secret) return false;
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function getLocaleFromPathname(pathname: string): string {
  const maybeLocale = pathname.split("/")[1];
  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1) || "/";
  }
  return pathname;
}

/**
 * Unprefixed paths (`/` and `/wallet-decryption`) are permanent.
 * next-intl emits 307 so the locale cookie can still change; upgrade only
 * the "add a locale prefix, keep the rest of the path" redirects to 308.
 * Auth and onboarding redirects stay temporary.
 */
function isLocalePrefixRedirect(pathname: string, location: string, baseUrl: string): boolean {
  let dest: URL;
  try {
    dest = new URL(location, baseUrl);
  } catch {
    return false;
  }

  const currentSegments = pathname.split("/").filter(Boolean);
  const first = currentSegments[0];
  if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
    return false;
  }

  const destSegments = dest.pathname.split("/").filter(Boolean);
  const destLocale = destSegments[0];
  if (!destLocale || !routing.locales.includes(destLocale as (typeof routing.locales)[number])) {
    return false;
  }

  const rest = destSegments.slice(1).join("/");
  const currentRest = currentSegments.join("/");
  return rest.replace(/\/+$/, "") === currentRest.replace(/\/+$/, "");
}

function promoteLocaleRedirect(request: NextRequest, response: NextResponse): NextResponse {
  if (response.status !== 307 && response.status !== 302) return response;
  const location = response.headers.get("location");
  if (!location || !isLocalePrefixRedirect(request.nextUrl.pathname, location, request.url)) {
    return response;
  }

  const redirected = NextResponse.redirect(location, 308);
  response.cookies.getAll().forEach((cookie) => {
    redirected.cookies.set(cookie);
  });
  return redirected;
}

/** Continue the request and tell the locale layout which URL is being rendered. */
function nextWithPathname(request: NextRequest): NextResponse {
  const headers = new Headers(request.headers);
  headers.set("x-lenix-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

/** So the locale layout can build a self canonical for this request. */
function attachPathname(response: NextResponse, pathname: string): NextResponse {
  if (response.status >= 300 && response.status < 400) return response;
  const key = "x-lenix-pathname";
  response.headers.set(`x-middleware-request-${key}`, pathname);
  const existing = response.headers.get("x-middleware-override-headers");
  const names = new Set(
    (existing ?? "")
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean),
  );
  names.add(key);
  response.headers.set("x-middleware-override-headers", [...names].join(","));
  return response;
}

function disabledPromoResponse(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/").filter(Boolean)[0];
  const hasLocale =
    !!first &&
    routing.locales.includes(first as (typeof routing.locales)[number]);

  // Unprefixed /airdrop and /giveaway would otherwise 307 to /en/... .
  // Rewrite onto the locale route so the page can call notFound() (status 404).
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}${pathname}`.replace(/\/{2,}/g, "/");
    const headers = new Headers(request.headers);
    headers.set("X-NEXT-INTL-LOCALE", routing.defaultLocale);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return intlMiddleware(request);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - they don't need i18n or session handling
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // robots.txt / sitemap.xml must not be locale-redirected.
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // Hidden promo routes: real 404, no redirect to another page.
  // Unprefixed /airdrop and /giveaway are rewritten, not sent to /en/...
  if (isDisabledPromoPath(pathname)) {
    return attachPathname(disabledPromoResponse(request), pathname);
  }

  // Unprefixed /admin → /{locale}/admin (admin always uses locale in the URL)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const locale =
      request.cookies.get("NEXT_LOCALE")?.value &&
      routing.locales.includes(
        request.cookies.get("NEXT_LOCALE")!.value as (typeof routing.locales)[number],
      )
        ? request.cookies.get("NEXT_LOCALE")!.value
        : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url, 308);
  }

  const path = getPathnameWithoutLocale(pathname);
  const locale = getLocaleFromPathname(pathname);
  const isAdminPath = path === "/admin" || path.startsWith("/admin/");

  if (isAdminPath) {
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some(
      (p) => path === p || path.startsWith(`${p}/`),
    );

    if (!isPublicAdminPath) {
      const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

      if (!token || !(await verifyAdminToken(token))) {
        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Keep locale in the URL; skip Supabase user-session gate for admin
    return nextWithPathname(request);
  }

  // For non-admin routes: update Supabase session first
  const sessionResponse = await updateSession(request);

  // If updateSession returned a redirect or error, use that
  if (sessionResponse.status !== 200) {
    return sessionResponse;
  }

  // Apply i18n middleware and merge any session cookies
  const intlResponse = intlMiddleware(request);

  // Copy session cookies to the i18n response
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  attachPathname(intlResponse, pathname);
  return promoteLocaleRedirect(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
