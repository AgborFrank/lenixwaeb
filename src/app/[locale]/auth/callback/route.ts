import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { routing } from "@/i18n/routing";

function withLocalePrefix(path: string, locale: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (routing.locales.some((l) => normalized === `/${l}` || normalized.startsWith(`/${l}/`))) {
    return normalized;
  }
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";

  const cookieLocale = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/)?.[1];
  const locale =
    cookieLocale && routing.locales.includes(cookieLocale as (typeof routing.locales)[number])
      ? cookieLocale
      : routing.defaultLocale;

  const next = withLocalePrefix(nextParam, locale);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
