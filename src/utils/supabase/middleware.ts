import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

function getLocaleFromPathname(pathname: string): string {
  const maybeLocale = pathname.split("/")[1];
  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

/** Strip leading `/{locale}` so path checks work with localePrefix: "always". */
function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (pathname === `/${locale}`) return "/";
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(locale.length + 1) || "/";
  }
  return pathname;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if expired — required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const path = getPathnameWithoutLocale(pathname);
  const locale = getLocaleFromPathname(pathname);

  const allowedWithoutOnboarding = [
    "/login",
    "/signup",
    "/forgot-password",
    "/onboarding",
    "/auth",
  ].some((p) => path === p || path.startsWith(`${p}/`));

  if (user && !allowedWithoutOnboarding) {
    const { data: onboarding } = await supabase
      .from("web_onboarding")
      .select("step_completed")
      .eq("user_id", user.id)
      .single();

    const completed = onboarding && (onboarding.step_completed ?? 0) >= 2;
    if (!completed) {
      const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
      const redirectResponse = NextResponse.redirect(onboardingUrl);
      // Preserve cookies set by Supabase (e.g. session refresh)
      response.cookies.getAll().forEach((cookie) =>
        redirectResponse.cookies.set(cookie.name, cookie.value),
      );
      return redirectResponse;
    }
  }

  return response;
}
