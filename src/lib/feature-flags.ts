import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

/**
 * Public wallet, airdrop, and giveaway surfaces.
 *
 * Each flag is OFF unless the env var is exactly "true" or "1".
 * Unset variables stay off, including on Vercel, with no dashboard change.
 * NEXT_PUBLIC_* values are inlined at build time, so turning a flag on
 * requires a new build.
 *
 * This app does not generate sitemap.xml. `sitemapExcludedPaths()` is the
 * list a future sitemap must skip while the matching flag is off.
 * `src/app/robots.ts` Disallows the same paths and replaces public/robots.txt.
 */

function envEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

/** Reown AppKit / WalletConnect connect flow. */
export const walletConnectEnabled = envEnabled(process.env.NEXT_PUBLIC_ENABLE_WALLET);

/** `/[locale]/airdrop` and unprefixed `/airdrop`. */
export const airdropEnabled = envEnabled(process.env.NEXT_PUBLIC_ENABLE_AIRDROP);

/** `/[locale]/giveaway` and unprefixed `/giveaway`. */
export const giveawayEnabled = envEnabled(process.env.NEXT_PUBLIC_ENABLE_GIVEAWAY);

const PROMO_ROOTS = ["airdrop", "giveaway"] as const;
type PromoRoot = (typeof PROMO_ROOTS)[number];

function isLocale(segment: string): segment is Locale {
  return (routing.locales as readonly string[]).includes(segment);
}

export function promoRootFromPathname(pathname: string): PromoRoot | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const root = isLocale(segments[0]) ? segments[1] : segments[0];
  if (root === "airdrop" || root === "giveaway") return root;
  return null;
}

/** True when this request should 404 instead of rendering the promo page. */
export function isDisabledPromoPath(pathname: string): boolean {
  const root = promoRootFromPathname(pathname);
  if (root === "airdrop") return !airdropEnabled;
  if (root === "giveaway") return !giveawayEnabled;
  return false;
}

/** Locale-prefixed and unprefixed paths that must stay out of any sitemap. */
export function sitemapExcludedPaths(): string[] {
  const paths: string[] = [];
  const roots: PromoRoot[] = [];
  if (!airdropEnabled) roots.push("airdrop");
  if (!giveawayEnabled) roots.push("giveaway");
  for (const root of roots) {
    paths.push(`/${root}`);
    for (const locale of routing.locales) {
      paths.push(`/${locale}/${root}`);
    }
  }
  return paths;
}

const DROP = Symbol("drop");

function shouldDropKey(key: string): boolean {
  if (!airdropEnabled && /airdrop/i.test(key)) return true;
  if (!giveawayEnabled && /giveaway/i.test(key)) return true;
  return false;
}

function shouldDropString(value: string): boolean {
  if (!airdropEnabled && /airdrop/i.test(value)) return true;
  if (!giveawayEnabled && /giveaway/i.test(value)) return true;
  if (!walletConnectEnabled && /connect wallet/i.test(value)) return true;
  return false;
}

function walk(value: unknown): unknown {
  if (typeof value === "string") {
    return shouldDropString(value) ? DROP : value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => walk(entry)).filter((entry) => entry !== DROP);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (shouldDropKey(key)) continue;
      const next = walk(entry);
      if (next !== DROP) out[key] = next;
    }
    return out;
  }
  return value;
}

/**
 * Remove airdrop, giveaway, and "Connect Wallet" copy from the message
 * catalog while the matching flag is off, so it is not serialized into HTML.
 */
export function stripHiddenPromoCopy<T>(messages: T): T {
  return walk(messages) as T;
}
