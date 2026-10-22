import type { MetadataRoute } from "next";

/**
 * Airdrop and giveaway are not Disallowed. Those URLs 404 and send noindex,
 * and a robots block would leave already indexed copies as "blocked by robots.txt".
 * They stay out of /sitemap.xml through sitemapExcludedPaths().
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://lenixprotocol.com/sitemap.xml",
  };
}
