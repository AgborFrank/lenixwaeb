import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";
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

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - they don't need i18n or session handling
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
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
    return NextResponse.redirect(url);
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
    return NextResponse.next();
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

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)",
  ],
};
