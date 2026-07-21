import { cache, CACHE_TTL } from "@/lib/cache";
import { fetchCoinGeckoPrices, TOKEN_REGISTRY } from "@/lib/token-metadata";

type MarketSymbol =
  | "BTC"
  | "ETH"
  | "USDT"
  | "BNB"
  | "MATIC"
  | "SOL"
  | "XRP"
  | "ADA";

const POPULAR_SYMBOLS: MarketSymbol[] = [
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "MATIC",
  "SOL",
  "XRP",
  "ADA",
];

export interface MarketTickerEntry {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  logo: string;
}

const CACHE_KEY = "market_ticker";

export async function getMarketTickerData(): Promise<{
  updatedAt: string;
  entries: MarketTickerEntry[];
}> {
  const cached = cache.get<{ updatedAt: string; entries: MarketTickerEntry[] }>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  const prices = await fetchCoinGeckoPrices(POPULAR_SYMBOLS);

  const entries: MarketTickerEntry[] = POPULAR_SYMBOLS.map((symbol) => {
    const meta = TOKEN_REGISTRY[symbol];
    const price = prices[symbol]?.usd ?? 0;
    const change24h = prices[symbol]?.usd_24h_change ?? 0;

    return {
      symbol,
      name: meta?.name ?? symbol,
      priceUsd: Number.isFinite(price) ? price : 0,
      change24h: Number.isFinite(change24h) ? change24h : 0,
      logo: meta?.logo ?? "",
    };
  });

  const payload = {
    updatedAt: new Date().toISOString(),
    entries,
  };

  cache.set(CACHE_KEY, payload, CACHE_TTL.POPULAR_COINS);

  return payload;
}
