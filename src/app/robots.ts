import type { MetadataRoute } from "next";
import { sitemapExcludedPaths } from "@/lib/feature-flags";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: sitemapExcludedPaths(),
    },
    sitemap: "https://lenixprotocol.com/sitemap.xml",
  };
}
