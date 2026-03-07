import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/utils/supabase/middleware";

// next-intl locale routing middleware
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Determine if this is a locale-managed route (not API, not static, not _next)
    const isApiOrStatic = pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".");

    if (!isApiOrStatic) {
        // Let next-intl handle locale detection and redirect (/ → /en based on Accept-Language)
        const intlResponse = intlMiddleware(request);

        // If next-intl wants to redirect (e.g. / → /en), honour it immediately
        if (intlResponse.status === 307 || intlResponse.status === 302 || intlResponse.status === 301) {
            return intlResponse;
        }

        // Otherwise also refresh the Supabase session and return
        return await updateSession(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static, _next/image, favicon, images
         * - /api (API routes)
         * - Requests with next-action header (Server Actions - must bypass middleware)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
            missing: [{ type: "header", key: "next-action" }],
        },
    ],
};
