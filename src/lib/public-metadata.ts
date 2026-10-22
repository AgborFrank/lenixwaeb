import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl, SITEMAP_SITE_URL } from "@/lib/public-sitemap";

/**
 * Canonical, hreflang, and og:url for one public page.
 *
 * URLs come from `localizedUrl` in `src/lib/public-sitemap.ts`, so the
 * tags match the sitemap (absolute https://lenixprotocol.com/{locale}{path},
 * x-default on the English URL).
 */

export function basePathFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const [first, ...rest] = segments;
  if (first && (routing.locales as readonly string[]).includes(first)) {
    return rest.length === 0 ? "/" : `/${rest.join("/")}`;
  }
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function publicAlternates(locale: string, basePath: string): {
  canonical: string;
  languages: Record<string, string>;
  url: string;
} {
  const trimmed = (basePath.startsWith("/") ? basePath : `/${basePath}`).replace(/\/+$/, "") || "/";
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localizedUrl(loc, trimmed);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, trimmed);
  const url = localizedUrl(locale, trimmed);
  return { canonical: url, languages, url };
}

/** Merge self-canonical, 13 locales + x-default, and this page's og:url. */
export function withPublicMetadata(
  locale: string,
  basePath: string,
  metadata: Metadata = {},
): Metadata {
  const { canonical, languages, url } = publicAlternates(locale, basePath);
  const openGraph =
    metadata.openGraph && !Array.isArray(metadata.openGraph) ? metadata.openGraph : {};
  const alternates = metadata.alternates ?? {};

  return {
    ...metadata,
    metadataBase: metadata.metadataBase ?? new URL(SITEMAP_SITE_URL),
    alternates: {
      ...alternates,
      canonical,
      languages,
    },
    openGraph: {
      ...openGraph,
      url,
    },
  };
}
