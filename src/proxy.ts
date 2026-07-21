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

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - they don't need i18n or session handling
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.includes("/admin")) {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
    const isAdminPath = pathWithoutLocale.startsWith("/admin");
    const isPublicAdminPath = ADMIN_PUBLIC_PATHS.some(
      (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
    );

    if (isAdminPath && !isPublicAdminPath) {
      const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

      if (!token || !(await verifyAdminToken(token))) {
        const locale =
          pathname.match(/^\/([a-z]{2}(-[A-Z]{2})?)\//)?.[1] || "en";
        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Admin routes don't need full i18n middleware processing
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
