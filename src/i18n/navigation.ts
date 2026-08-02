import { createNavigation } from "next-intl/navigation";
import { getLocale } from "next-intl/server";
import { routing } from "./routing";

const navigation = createNavigation(routing);

export const { Link, usePathname, useRouter, getPathname } = navigation;

type IntlRedirectArgs = Parameters<typeof navigation.redirect>[0];

/**
 * Locale-aware redirect for Server Components / Server Actions.
 * Accepts either a path string or next-intl's `{ href, locale?, ... }` object.
 * Always resolves the current locale when omitted (required by next-intl).
 */
export async function redirect(
  hrefOrArgs: string | IntlRedirectArgs,
): Promise<never> {
  const locale = await getLocale();
  if (typeof hrefOrArgs === "string") {
    return navigation.redirect({ href: hrefOrArgs, locale }) as Promise<never>;
  }
  return navigation.redirect({
    ...hrefOrArgs,
    locale: hrefOrArgs.locale ?? locale,
  }) as Promise<never>;
}
