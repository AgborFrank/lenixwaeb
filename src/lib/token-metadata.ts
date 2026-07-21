/**
 * Token metadata and price enrichment service
 * Provides reliable logos and prices when API providers fail
 */

import { cache, CACHE_TTL } from './cache';

// Base URL for Cryptofonts icons, served through jsDelivr's CDN rather than
// raw.githubusercontent.com directly. GitHub's raw file server isn't a CDN and
// applies aggressive, unpredictable rate-limiting to hotlinked traffic with only
// a 5-minute cache; jsDelivr mirrors the same repo through an edge CDN with a
// 7-day cache, which is what causes logos to intermittently fail to load.
const ICON_BASE_URL = 'https://cdn.jsdelivr.net/gh/Cryptofonts/cryptoicons@master/SVG';

// Helper to get icon URL
const getIconUrl = (symbol: string) => `${ICON_BASE_URL}/${symbol.toLowerCase()}.svg`;

// Known token metadata with CoinGecko IDs for price lookup
export const TOKEN_REGISTRY: Record<string, {
  name: string;
  symbol: string;
  logo: string;
  cgId: string;
  decimals?: number;
}> = {
  // Native tokens
  'ETH': {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: getIconUrl('eth'),
    cgId: 'ethereum',
    decimals: 18,
  },
  'BNB': {
    name: 'BNB',
    symbol: 'BNB',
    logo: getIconUrl('bnb'),
    cgId: 'binancecoin',
    decimals: 18,
  },
  'MATIC': {
    name: 'Polygon',
    symbol: 'MATIC',
    logo: getIconUrl('matic'),
    cgId: 'polygon-ecosystem-token',
    decimals: 18,
  },
  'POL': {
    name: 'POL (ex-MATIC)',
    symbol: 'POL',
    logo: getIconUrl('matic'),
    cgId: 'polygon-ecosystem-token',
    decimals: 18,
  },
  'BTC': {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: getIconUrl('btc'),
    cgId: 'bitcoin',
    decimals: 8,
  },
  // Wrapped tokens
  'WETH': {
    name: 'Wrapped Ethereum',
    symbol: 'WETH',
    logo: getIconUrl('weth'),
    cgId: 'ethereum',
    decimals: 18,
  },
  'WBNB': {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    logo: getIconUrl('wbnb'),
    cgId: 'binancecoin',
    decimals: 18,
  },
  'WMATIC': {
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    logo: getIconUrl('wmatic'),
    cgId: 'polygon-ecosystem-token',
    decimals: 18,
  },
  'WBTC': {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    logo: getIconUrl('wbtc'),
    cgId: 'wrapped-bitcoin',
    decimals: 8,
  },
  // Stablecoins
  'USDT': {
    name: 'Tether USD',
    symbol: 'USDT',
    logo: getIconUrl('usdt'),
    cgId: 'tether',
    decimals: 6,
  },
  'USDC': {
    name: 'USD Coin',
    symbol: 'USDC',
    logo: getIconUrl('usdc'),
    cgId: 'usd-coin',
    decimals: 6,
  },
  'DAI': {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    logo: getIconUrl('dai'),
    cgId: 'dai',
    decimals: 18,
  },
  'BUSD': {
    name: 'Binance USD',
    symbol: 'BUSD',
    logo: getIconUrl('busd'),
    cgId: 'binance-usd',
    decimals: 18,
  },
  // Popular tokens
  'LINK': {
    name: 'Chainlink',
    symbol: 'LINK',
    logo: getIconUrl('link'),
    cgId: 'chainlink',
    decimals: 18,
  },
  'UNI': {
    name: 'Uniswap',
    symbol: 'UNI',
    logo: getIconUrl('uni'),
    cgId: 'uniswap',
    decimals: 18,
  },
  'AAVE': {
    name: 'Aave',
    symbol: 'AAVE',
    logo: getIconUrl('aave'),
    cgId: 'aave',
    decimals: 18,
  },
  'CRV': {
    name: 'Curve DAO Token',
    symbol: 'CRV',
    logo: getIconUrl('crv'),
    cgId: 'curve-dao-token',
    decimals: 18,
  },
  'MKR': {
    name: 'Maker',
    symbol: 'MKR',
    logo: getIconUrl('mkr'),
    cgId: 'maker',
    decimals: 18,
  },
  'COMP': {
    name: 'Compound',
    symbol: 'COMP',
    logo: getIconUrl('comp'),
    cgId: 'compound-governance-token',
    decimals: 18,
  },
  'SUSHI': {
    name: 'SushiSwap',
    symbol: 'SUSHI',
    logo: getIconUrl('sushi'),
    cgId: 'sushi',
    decimals: 18,
  },
  'SHIB': {
    name: 'Shiba Inu',
    symbol: 'SHIB',
    logo: getIconUrl('shib'),
    cgId: 'shiba-inu',
    decimals: 18,
  },
  'PEPE': {
    name: 'Pepe',
    symbol: 'PEPE',
    logo: getIconUrl('pepe'),
    cgId: 'pepe',
    decimals: 18,
  },
  'ARB': {
    name: 'Arbitrum',
    symbol: 'ARB',
    logo: getIconUrl('arb'),
    cgId: 'arbitrum',
    decimals: 18,
  },
  'OP': {
    name: 'Optimism',
    symbol: 'OP',
    logo: getIconUrl('op'),
    cgId: 'optimism',
    decimals: 18,
  },
  'SOL': {
    name: 'Solana',
    symbol: 'SOL',
    logo: getIconUrl('sol'),
    cgId: 'solana',
    decimals: 9,
  },
  'AVAX': {
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: getIconUrl('avax'),
    cgId: 'avalanche-2',
    decimals: 18,
  },
  'DOGE': {
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: getIconUrl('doge'),
    cgId: 'dogecoin',
    decimals: 8,
  },
  'XRP': {
    name: 'XRP',
    symbol: 'XRP',
    logo: getIconUrl('xrp'),
    cgId: 'ripple',
    decimals: 6,
  },
  'ADA': {
    name: 'Cardano',
    symbol: 'ADA',
    logo: getIconUrl('ada'),
    cgId: 'cardano',
    decimals: 6,
  },
  'DOT': {
    name: 'Polkadot',
    symbol: 'DOT',
    logo: getIconUrl('dot'),
    cgId: 'polkadot',
    decimals: 10,
  },
  'TRX': {
    name: 'TRON',
    symbol: 'TRX',
    logo: getIconUrl('trx'),
    cgId: 'tron',
    decimals: 6,
  },
  'LTC': {
    name: 'Litecoin',
    symbol: 'LTC',
    logo: getIconUrl('ltc'),
    cgId: 'litecoin',
    decimals: 8,
  },
  'ATOM': {
    name: 'Cosmos',
    symbol: 'ATOM',
    logo: getIconUrl('atom'),
    cgId: 'cosmos',
    decimals: 6,
  },
  'FTM': {
    name: 'Fantom',
    symbol: 'FTM',
    logo: getIconUrl('ftm'),
    cgId: 'fantom',
    decimals: 18,
  },
  'NEAR': {
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    logo: getIconUrl('near'),
    cgId: 'near',
    decimals: 24,
  },
  'APT': {
    name: 'Aptos',
    symbol: 'APT',
    logo: getIconUrl('apt'),
    cgId: 'aptos',
    decimals: 8,
  },
  'CAKE': {
    name: 'PancakeSwap',
    symbol: 'CAKE',
    logo: getIconUrl('cake'),
    cgId: 'pancakeswap-token',
    decimals: 18,
  },
  // Additional popular tokens
  '1INCH': {
    name: '1inch',
    symbol: '1INCH',
    logo: getIconUrl('1inch'),
    cgId: '1inch',
    decimals: 18,
  },
  'SNX': {
    name: 'Synthetix',
    symbol: 'SNX',
    logo: getIconUrl('snx'),
    cgId: 'havven',
    decimals: 18,
  },
  'ENJ': {
    name: 'Enjin Coin',
    symbol: 'ENJ',
    logo: getIconUrl('enj'),
    cgId: 'enjincoin',
    decimals: 18,
  },
  'MANA': {
    name: 'Decentraland',
    symbol: 'MANA',
    logo: getIconUrl('mana'),
    cgId: 'decentraland',
    decimals: 18,
  },
  'SAND': {
    name: 'The Sandbox',
    symbol: 'SAND',
    logo: getIconUrl('sand'),
    cgId: 'the-sandbox',
    decimals: 18,
  },
  'AXS': {
    name: 'Axie Infinity',
    symbol: 'AXS',
    logo: getIconUrl('axs'),
    cgId: 'axie-infinity',
    decimals: 18,
  },
  'GALA': {
    name: 'Gala',
    symbol: 'GALA',
    logo: getIconUrl('gala'),
    cgId: 'gala',
    decimals: 8,
  },
  'APE': {
    name: 'ApeCoin',
    symbol: 'APE',
    logo: getIconUrl('ape'),
    cgId: 'apecoin',
    decimals: 18,
  },
  'LDO': {
    name: 'Lido DAO',
    symbol: 'LDO',
    logo: getIconUrl('ldo'),
    cgId: 'lido-dao',
    decimals: 18,
  },
  'IMX': {
    name: 'Immutable X',
    symbol: 'IMX',
    logo: getIconUrl('imx'),
    cgId: 'immutable-x',
    decimals: 18,
  },
  'GRT': {
    name: 'The Graph',
    symbol: 'GRT',
    logo: getIconUrl('grt'),
    cgId: 'the-graph',
    decimals: 18,
  },
  'FIL': {
    name: 'Filecoin',
    symbol: 'FIL',
    logo: getIconUrl('fil'),
    cgId: 'filecoin',
    decimals: 18,
  },
  'THETA': {
    name: 'Theta Network',
    symbol: 'THETA',
    logo: getIconUrl('theta'),
    cgId: 'theta-token',
    decimals: 18,
  },
  'VET': {
    name: 'VeChain',
    symbol: 'VET',
    logo: getIconUrl('vet'),
    cgId: 'vechain',
    decimals: 18,
  },
  'ALGO': {
    name: 'Algorand',
    symbol: 'ALGO',
    logo: getIconUrl('algo'),
    cgId: 'algorand',
    decimals: 6,
  },
  'XLM': {
    name: 'Stellar',
    symbol: 'XLM',
    logo: getIconUrl('xlm'),
    cgId: 'stellar',
    decimals: 7,
  },
  'EOS': {
    name: 'EOS',
    symbol: 'EOS',
    logo: getIconUrl('eos'),
    cgId: 'eos',
    decimals: 4,
  },
  'XTZ': {
    name: 'Tezos',
    symbol: 'XTZ',
    logo: getIconUrl('xtz'),
    cgId: 'tezos',
    decimals: 6,
  },
  'FLOW': {
    name: 'Flow',
    symbol: 'FLOW',
    logo: getIconUrl('flow'),
    cgId: 'flow',
    decimals: 8,
  },
  'HBAR': {
    name: 'Hedera',
    symbol: 'HBAR',
    logo: getIconUrl('hbar'),
    cgId: 'hedera-hashgraph',
    decimals: 8,
  },
  'QNT': {
    name: 'Quant',
    symbol: 'QNT',
    logo: getIconUrl('qnt'),
    cgId: 'quant-network',
    decimals: 18,
  },
  'EGLD': {
    name: 'MultiversX',
    symbol: 'EGLD',
    logo: getIconUrl('egld'),
    cgId: 'elrond-erd-2',
    decimals: 18,
  },
  'ICP': {
    name: 'Internet Computer',
    symbol: 'ICP',
    logo: getIconUrl('icp'),
    cgId: 'internet-computer',
    decimals: 8,
  },
  'RUNE': {
    name: 'THORChain',
    symbol: 'RUNE',
    logo: getIconUrl('rune'),
    cgId: 'thorchain',
    decimals: 8,
  },
  'KCS': {
    name: 'KuCoin Token',
    symbol: 'KCS',
    logo: getIconUrl('kcs'),
    cgId: 'kucoin-shares',
    decimals: 6,
  },
  'ZEC': {
    name: 'Zcash',
    symbol: 'ZEC',
    logo: getIconUrl('zec'),
    cgId: 'zcash',
    decimals: 8,
  },
  'XMR': {
    name: 'Monero',
    symbol: 'XMR',
    logo: getIconUrl('xmr'),
    cgId: 'monero',
    decimals: 12,
  },
  'DASH': {
    name: 'Dash',
    symbol: 'DASH',
    logo: getIconUrl('dash'),
    cgId: 'dash',
    decimals: 8,
  },
  'ETC': {
    name: 'Ethereum Classic',
    symbol: 'ETC',
    logo: getIconUrl('etc'),
    cgId: 'ethereum-classic',
    decimals: 18,
  },
  'BCH': {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    logo: getIconUrl('bch'),
    cgId: 'bitcoin-cash',
    decimals: 8,
  },
  'BSV': {
    name: 'Bitcoin SV',
    symbol: 'BSV',
    logo: getIconUrl('bsv'),
    cgId: 'bitcoin-cash-sv',
    decimals: 8,
  },
  'NEO': {
    name: 'Neo',
    symbol: 'NEO',
    logo: getIconUrl('neo'),
    cgId: 'neo',
    decimals: 0,
  },
  'WAVES': {
    name: 'Waves',
    symbol: 'WAVES',
    logo: getIconUrl('waves'),
    cgId: 'waves',
    decimals: 8,
  },
  'ZIL': {
    name: 'Zilliqa',
    symbol: 'ZIL',
    logo: getIconUrl('zil'),
    cgId: 'zilliqa',
    decimals: 12,
  },
  'BAT': {
    name: 'Basic Attention Token',
    symbol: 'BAT',
    logo: getIconUrl('bat'),
    cgId: 'basic-attention-token',
    decimals: 18,
  },
  'CHZ': {
    name: 'Chiliz',
    symbol: 'CHZ',
    logo: getIconUrl('chz'),
    cgId: 'chiliz',
    decimals: 18,
  },
  'HOT': {
    name: 'Holo',
    symbol: 'HOT',
    logo: getIconUrl('hot'),
    cgId: 'holotoken',
    decimals: 18,
  },
  'ZRX': {
    name: '0x Protocol',
    symbol: 'ZRX',
    logo: getIconUrl('zrx'),
    cgId: '0x',
    decimals: 18,
  },
  'KNC': {
    name: 'Kyber Network',
    symbol: 'KNC',
    logo: getIconUrl('knc'),
    cgId: 'kyber-network-crystal',
    decimals: 18,
  },
  'REN': {
    name: 'Ren',
    symbol: 'REN',
    logo: getIconUrl('ren'),
    cgId: 'republic-protocol',
    decimals: 18,
  },
  'BAL': {
    name: 'Balancer',
    symbol: 'BAL',
    logo: getIconUrl('bal'),
    cgId: 'balancer',
    decimals: 18,
  },
  'YFI': {
    name: 'yearn.finance',
    symbol: 'YFI',
    logo: getIconUrl('yfi'),
    cgId: 'yearn-finance',
    decimals: 18,
  },
  'OCEAN': {
    name: 'Ocean Protocol',
    symbol: 'OCEAN',
    logo: getIconUrl('ocean'),
    cgId: 'ocean-protocol',
    decimals: 18,
  },
  'ANKR': {
    name: 'Ankr',
    symbol: 'ANKR',
    logo: getIconUrl('ankr'),
    cgId: 'ankr',
    decimals: 18,
  },
  'STORJ': {
    name: 'Storj',
    symbol: 'STORJ',
    logo: getIconUrl('storj'),
    cgId: 'storj',
    decimals: 8,
  },
  'SKL': {
    name: 'SKALE',
    symbol: 'SKL',
    logo: getIconUrl('skl'),
    cgId: 'skale',
    decimals: 18,
  },
  'IOTX': {
    name: 'IoTeX',
    symbol: 'IOTX',
    logo: getIconUrl('iotx'),
    cgId: 'iotex',
    decimals: 18,
  },
  'CKB': {
    name: 'Nervos Network',
    symbol: 'CKB',
    logo: getIconUrl('ckb'),
    cgId: 'nervos-network',
    decimals: 8,
  },
  'ONT': {
    name: 'Ontology',
    symbol: 'ONT',
    logo: getIconUrl('ont'),
    cgId: 'ontology',
    decimals: 0,
  },
  'QTUM': {
    name: 'Qtum',
    symbol: 'QTUM',
    logo: getIconUrl('qtum'),
    cgId: 'qtum',
    decimals: 8,
  },
  'ICX': {
    name: 'ICON',
    symbol: 'ICX',
    logo: getIconUrl('icx'),
    cgId: 'icon',
    decimals: 18,
  },
  'OMG': {
    name: 'OMG Network',
    symbol: 'OMG',
    logo: getIconUrl('omg'),
    cgId: 'omisego',
    decimals: 18,
  },
  'TUSD': {
    name: 'TrueUSD',
    symbol: 'TUSD',
    logo: getIconUrl('tusd'),
    cgId: 'true-usd',
    decimals: 18,
  },
  'FRAX': {
    name: 'Frax',
    symbol: 'FRAX',
    logo: getIconUrl('frax'),
    cgId: 'frax',
    decimals: 18,
  },
  'LUSD': {
    name: 'Liquity USD',
    symbol: 'LUSD',
    logo: getIconUrl('lusd'),
    cgId: 'liquity-usd',
    decimals: 18,
  },
  'GUSD': {
    name: 'Gemini Dollar',
    symbol: 'GUSD',
    logo: getIconUrl('gusd'),
    cgId: 'gemini-dollar',
    decimals: 2,
  },
  'USDP': {
    name: 'Pax Dollar',
    symbol: 'USDP',
    logo: getIconUrl('usdp'),
    cgId: 'paxos-standard',
    decimals: 18,
  },
  'RAI': {
    name: 'Rai Reflex Index',
    symbol: 'RAI',
    logo: getIconUrl('rai'),
    cgId: 'rai',
    decimals: 18,
  },
  'sUSD': {
    name: 'sUSD',
    symbol: 'sUSD',
    logo: getIconUrl('susd'),
    cgId: 'nusd',
    decimals: 18,
  },
  'cUSDC': {
    name: 'Compound USDC',
    symbol: 'cUSDC',
    logo: getIconUrl('cusdc'),
    cgId: 'compound-usd-coin',
    decimals: 8,
  },
  'cETH': {
    name: 'Compound ETH',
    symbol: 'cETH',
    logo: getIconUrl('ceth'),
    cgId: 'compound-ether',
    decimals: 8,
  },
  'stETH': {
    name: 'Lido Staked ETH',
    symbol: 'stETH',
    logo: getIconUrl('steth'),
    cgId: 'staked-ether',
    decimals: 18,
  },
  'rETH': {
    name: 'Rocket Pool ETH',
    symbol: 'rETH',
    logo: getIconUrl('reth'),
    cgId: 'rocket-pool-eth',
    decimals: 18,
  },
  'cbETH': {
    name: 'Coinbase Wrapped Staked ETH',
    symbol: 'cbETH',
    logo: getIconUrl('cbeth'),
    cgId: 'coinbase-wrapped-staked-eth',
    decimals: 18,
  },
};

interface PriceData {
  usd: number;
  usd_24h_change?: number;
}

// CoinCap API ID mapping (different from CoinGecko)
const COINCAP_IDS: Record<string, string> = {
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'BNB': 'binance-coin',
  'MATIC': 'matic-network', // CoinCap still uses old ID
  'POL': 'matic-network',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'DAI': 'multi-collateral-dai',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'DOGE': 'dogecoin',
  'SOL': 'solana',
  'AVAX': 'avalanche-2',
  'DOT': 'polkadot',
  'ADA': 'cardano',
  'XRP': 'xrp',
  'TRX': 'tron',
  'LTC': 'litecoin',
  'ATOM': 'cosmos',
  'SHIB': 'shiba-inu',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'FTM': 'fantom',
  'NEAR': 'near-protocol',
  'WETH': 'ethereum',
  'WBNB': 'binance-coin',
  'WMATIC': 'matic-network',
  'WBTC': 'wrapped-bitcoin',
};

/**
 * Fetch prices from CoinGecko (primary)
 */
async function fetchFromCoinGecko(cgIds: string[]): Promise<Record<string, { usd: number; usd_24h_change: number }> | null> {
  try {
    const ids = [...new Set(cgIds)].join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.warn(`[Prices] CoinGecko failed: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn('[Prices] CoinGecko error:', error);
    return null;
  }
}

/**
 * Fetch prices from CoinCap (backup 1)
 */
async function fetchFromCoinCap(symbols: string[]): Promise<Record<string, PriceData>> {
  try {
    const coincapIds = symbols
      .map(s => COINCAP_IDS[s.toUpperCase()])
      .filter((id): id is string => !!id);

    if (coincapIds.length === 0) return {};

    const ids = [...new Set(coincapIds)].join(',');
    const response = await fetch(
      `https://api.coincap.io/v2/assets?ids=${ids}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.warn(`[Prices] CoinCap failed: ${response.status}`);
      return {};
    }

    const data = await response.json();
    const result: Record<string, PriceData> = {};

    for (const asset of data.data || []) {
      // Map back to symbol
      for (const [symbol, coincapId] of Object.entries(COINCAP_IDS)) {
        if (coincapId === asset.id) {
          result[symbol] = {
            usd: parseFloat(asset.priceUsd) || 0,
            usd_24h_change: parseFloat(asset.changePercent24Hr) || 0,
          };
        }
      }
    }

    console.log(`[Prices] CoinCap returned ${Object.keys(result).length} prices`);
    return result;
  } catch (error) {
    console.warn('[Prices] CoinCap error:', error);
    return {};
  }
}

/**
 * Fetch prices from CryptoCompare (backup 2)
 */
async function fetchFromCryptoCompare(symbols: string[]): Promise<Record<string, PriceData>> {
  try {
    const validSymbols = symbols.filter(s => TOKEN_REGISTRY[s.toUpperCase()]);
    if (validSymbols.length === 0) return {};

    const fsyms = validSymbols.join(',');
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=USD`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      console.warn(`[Prices] CryptoCompare failed: ${response.status}`);
      return {};
    }

    const data = await response.json();
    const result: Record<string, PriceData> = {};

    for (const symbol of validSymbols) {
      const raw = data.RAW?.[symbol.toUpperCase()]?.USD;
      if (raw) {
        result[symbol.toUpperCase()] = {
          usd: raw.PRICE || 0,
          usd_24h_change: raw.CHANGEPCT24HOUR || 0,
        };
      }
    }

    console.log(`[Prices] CryptoCompare returned ${Object.keys(result).length} prices`);
    return result;
  } catch (error) {
    console.warn('[Prices] CryptoCompare error:', error);
    return {};
  }
}

/**
 * Fetch prices with multiple fallbacks
 * Priority: CoinGecko → CoinCap → CryptoCompare
 */
export async function fetchCoinGeckoPrices(symbols: string[]): Promise<Record<string, PriceData>> {
  if (symbols.length === 0) return {};

  const cacheKey = `prices_${symbols.sort().join('_').slice(0, 100)}`;
  
  // Check cache first
  const cached = cache.get<Record<string, PriceData>>(cacheKey);
  if (cached) {
    console.log(`[Prices] Returning cached prices for ${symbols.length} symbols`);
    return cached;
  }

  const result: Record<string, PriceData> = {};
  const missingSymbols = new Set(symbols.map(s => s.toUpperCase()));

  // 1. Try CoinGecko first
  const cgIds = symbols
    .map(s => TOKEN_REGISTRY[s.toUpperCase()]?.cgId)
    .filter((id): id is string => !!id);

  if (cgIds.length > 0) {
    const cgData = await fetchFromCoinGecko(cgIds);
    if (cgData) {
      for (const symbol of symbols) {
        const meta = TOKEN_REGISTRY[symbol.toUpperCase()];
        if (meta?.cgId && cgData[meta.cgId]) {
          result[symbol.toUpperCase()] = {
            usd: cgData[meta.cgId].usd || 0,
            usd_24h_change: cgData[meta.cgId].usd_24h_change || 0,
          };
          missingSymbols.delete(symbol.toUpperCase());
        }
      }
      console.log(`[Prices] CoinGecko returned ${Object.keys(result).length} prices`);
    }
  }

  // 2. Try CoinCap for missing symbols
  if (missingSymbols.size > 0) {
    const coincapPrices = await fetchFromCoinCap([...missingSymbols]);
    for (const [symbol, price] of Object.entries(coincapPrices)) {
      if (missingSymbols.has(symbol)) {
        result[symbol] = price;
        missingSymbols.delete(symbol);
      }
    }
  }

  // 3. Try CryptoCompare for any still missing
  if (missingSymbols.size > 0) {
    const ccPrices = await fetchFromCryptoCompare([...missingSymbols]);
    for (const [symbol, price] of Object.entries(ccPrices)) {
      if (missingSymbols.has(symbol)) {
        result[symbol] = price;
        missingSymbols.delete(symbol);
      }
    }
  }

  // Log any symbols still without prices
  if (missingSymbols.size > 0) {
    console.warn(`[Prices] No price found for: ${[...missingSymbols].join(', ')}`);
  }

  // Cache the result
  if (Object.keys(result).length > 0) {
    cache.set(cacheKey, result, CACHE_TTL.PRICES);
  }

  return result;
}

/**
 * Get token metadata (logo, name) for a symbol
 */
export function getTokenMetadata(symbol: string): { name: string; logo: string } | null {
  const meta = TOKEN_REGISTRY[symbol.toUpperCase()];
  if (!meta) return null;
  return { name: meta.name, logo: meta.logo };
}

/**
 * Enrich a token with metadata - ALWAYS use registry logo if available
 */
export function enrichTokenMetadata(token: any): any {
  const symbol = (token.contract_ticker_symbol || token.symbol || '').toUpperCase();
  const meta = TOKEN_REGISTRY[symbol];

  if (!meta) return token;

  // ALWAYS prefer registry logo over API response (which may be empty or outdated)
  return {
    ...token,
    contract_name: meta.name || token.contract_name,
    logo_url: meta.logo, // Always use registry logo for known tokens
  };
}

/**
 * Batch enrich tokens with metadata and prices
 * Uses multiple price API fallbacks
 */
export async function enrichTokensWithPrices(tokens: any[]): Promise<any[]> {
  if (tokens.length === 0) return [];

  // Get ALL symbols for price fetching (not just missing ones)
  // This ensures we have the latest prices for everything
  const allSymbols = tokens
    .map(t => t.contract_ticker_symbol || t.symbol)
    .filter((s): s is string => !!s);

  // Fetch prices with fallbacks
  const prices = await fetchCoinGeckoPrices([...new Set(allSymbols)]);

  // Enrich tokens
  return tokens.map(token => {
    // First apply metadata (logos, names)
    const enriched = enrichTokenMetadata(token);
    const symbol = (token.contract_ticker_symbol || token.symbol || '').toUpperCase();
    const price = prices[symbol];

    // Apply price if we got one from any provider
    if (price && price.usd > 0) {
      const decimals = enriched.contract_decimals || 18;
      const balance = Number(enriched.balance || '0') / Math.pow(10, decimals);
      const change = price.usd_24h_change || 0;

      return {
        ...enriched,
        quote_rate: price.usd,
        quote: balance * price.usd,
        quote_rate_24h: price.usd / (1 + change / 100),
        quote_24h: balance * (price.usd / (1 + change / 100)),
        change: change.toFixed(2),
      };
    }

    return enriched;
  });
}
