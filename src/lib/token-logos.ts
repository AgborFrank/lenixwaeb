import { TOKEN_REGISTRY } from "./token-metadata";

/**
 * Token logo URLs — CoinGecko (free CDN) and local assets where available.
 * This is checked first because these sources are the most reliable (local
 * assets never fail; CoinGecko's asset CDN has a long cache). Anything not
 * listed here falls back to `TOKEN_REGISTRY` in `token-metadata.ts`, which
 * covers ~90 more tokens, so callers get one consistent, complete lookup
 * instead of two disconnected, partial registries.
 */
export const TOKEN_LOGOS: Record<string, string> = {
  BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  WBTC: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  ETH: "/assets/img/eth.svg",
  WETH: "/assets/img/eth.svg",
  LNX: "/assets/img/logo.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  USDT: "/assets/img/usdt.svg",
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  DAI: "https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
};

export function getTokenLogo(symbol: string): string | undefined {
  const upper = symbol.toUpperCase();
  return TOKEN_LOGOS[upper] ?? TOKEN_REGISTRY[upper]?.logo;
}
