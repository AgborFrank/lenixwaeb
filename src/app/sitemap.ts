import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getIndexableBasePaths, localizedUrl } from "@/lib/public-sitemap";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return getIndexableBasePaths().flatMap((basePath) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = localizedUrl(locale, basePath);
    }
    languages["x-default"] = localizedUrl(routing.defaultLocale, basePath);

    return routing.locales.map((locale) => ({
      url: localizedUrl(locale, basePath),
      lastModified,
      alternates: { languages },
    }));
  });
}
