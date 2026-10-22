import fs from "fs";
import path from "path";
import { routing } from "@/i18n/routing";
import { sitemapExcludedPaths } from "@/lib/feature-flags";

/**
 * Indexable public paths, derived from `src/app` page files.
 *
 * This is the only place that decides what goes in /sitemap.xml.
 * A path is included when it is a concrete `[locale]` page and none of the
 * exclusion rules below match.
 */

const APP_DIR = path.join(process.cwd(), "src/app");
const PAGE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

/** Route groups that wrap signed-in or staff-only trees. They do not appear in the URL. */
const PRIVATE_ROUTE_GROUPS = new Set(["(account)", "(protected)", "(auth)"]);

/** URL segments that are never public marketing pages. */
const PRIVATE_SEGMENTS = new Set(["admin", "internal", "auth", "api"]);

/** Auth and onboarding flows. Matched against the locale-stripped path. */
const PRIVATE_PREFIXES = ["/login", "/signup", "/forgot-password", "/onboarding"];

export const SITEMAP_SITE_URL = "https://lenixprotocol.com";

function walkPages(dir: string): string[] {
  const found: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "api") continue;
      found.push(...walkPages(full));
      continue;
    }
    if (PAGE_FILES.has(entry.name)) found.push(full);
  }
  return found;
}

function readIfExists(file: string): string {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

/** Page or an ancestor layout sets robots index:false / noindex. */
function sourceIsNoindex(pageFile: string): boolean {
  let dir = path.dirname(pageFile);
  const root = path.resolve(APP_DIR);
  while (path.resolve(dir).startsWith(root)) {
    const names =
      path.resolve(dir) === path.dirname(pageFile)
        ? [path.basename(pageFile), "layout.tsx", "layout.ts", "layout.jsx", "layout.js"]
        : ["layout.tsx", "layout.ts", "layout.jsx", "layout.js"];
    for (const name of names) {
      const text = readIfExists(path.join(dir, name));
      if (/index\s*:\s*false/.test(text) || /\bnoindex\b/.test(text)) return true;
    }
    if (path.resolve(dir) === root) break;
    dir = path.dirname(dir);
  }
  return false;
}

/**
 * Locale-stripped path (`/` or `/about`) for a page file, or null when the
 * page must not be indexed.
 */
export function basePathForPage(pageFile: string): string | null {
  const rel = path.relative(APP_DIR, path.dirname(pageFile));
  const segments = rel.split(path.sep).filter(Boolean);
  if (segments[0] !== "[locale]") return null;

  const urlSegments: string[] = [];
  for (const segment of segments.slice(1)) {
    if (segment.startsWith("(") && segment.endsWith(")")) {
      if (PRIVATE_ROUTE_GROUPS.has(segment)) return null;
      continue;
    }
    if (segment.startsWith("[") || segment.startsWith("@")) return null;
    if (PRIVATE_SEGMENTS.has(segment)) return null;
    urlSegments.push(segment);
  }

  const base = urlSegments.length === 0 ? "/" : `/${urlSegments.join("/")}`;
  if (PRIVATE_PREFIXES.some((prefix) => base === prefix || base.startsWith(`${prefix}/`))) {
    return null;
  }
  if (sourceIsNoindex(pageFile)) return null;

  const hidden = new Set(sitemapExcludedPaths());
  if (hidden.has(base)) return null;
  for (const locale of routing.locales) {
    const localized = base === "/" ? `/${locale}` : `/${locale}${base}`;
    if (hidden.has(localized)) return null;
  }
  return base;
}

/** Sorted locale-stripped paths that belong in the sitemap. */
export function getIndexableBasePaths(): string[] {
  const bases = new Set<string>();
  for (const pageFile of walkPages(APP_DIR)) {
    const base = basePathForPage(pageFile);
    if (base) bases.add(base);
  }
  return [...bases].sort((a, b) => a.localeCompare(b));
}

export function localizedUrl(locale: string, basePath: string): string {
  if (basePath === "/") return `${SITEMAP_SITE_URL}/${locale}`;
  return `${SITEMAP_SITE_URL}/${locale}${basePath}`;
}
