import { z } from 'zod';

/**
 * Moralis API client for fetching ERC-20 token balances across multiple chains
 */

// Chain ID to Moralis chain name mapping
const CHAIN_ID_TO_MORALIS_CHAIN: Record<number, string> = {
  1: 'eth',
  10: 'optimism',
  56: 'bsc',
  100: 'gnosis',
  137: 'polygon',
  42161: 'arbitrum',
} as const;

// Zod schema for a single token balance response from Moralis
const MoralisTokenSchema = z.object({
  token_address: z.string(),
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  logo: z.string().url().nullable().optional(),
  thumbnail: z.string().url().nullable().optional(),
  decimals: z.number().int().min(0).max(255),
  balance: z.string(), // Raw balance as string to handle large numbers
  balance_formatted: z.string().optional(),
  usd_price: z.number().nullable().optional(),
  usd_value: z.number().nullable().optional(),
  usd_price_24hr_percent_change: z.number().nullable().optional(),
  usd_value_24hr_ago: z.number().nullable().optional(),
  possible_spam: z.boolean().optional(),
  verified_contract: z.boolean().optional(),
  native_token: z.boolean().optional(),
});

// Zod schema for Moralis Wallet API response (object with result array)
const MoralisWalletResponseSchema = z.object({
  result: z.array(MoralisTokenSchema),
  cursor: z.string().nullable().optional(),
});

// Also support array response for direct /erc20 endpoint
const MoralisResponseSchema = z.union([
  MoralisWalletResponseSchema,
  z.array(MoralisTokenSchema),
]);

// Export the inferred types
export type MoralisToken = z.infer<typeof MoralisTokenSchema>;
export type MoralisResponse =
  | z.infer<typeof MoralisWalletResponseSchema>
  | z.infer<typeof MoralisTokenSchema>[];

// Normalized token type that matches the existing codebase structure
export interface NormalizedToken {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: ['erc20'];
  logo_url: string;
  last_transferred_at: string;
  native_token: boolean;
  type: 'cryptocurrency' | 'stablecoin';
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: null;
}

export interface FetchTokensResult {
  erc20s: ReadonlyArray<NormalizedToken>;
  nfts: ReadonlyArray<never>; // NFTs not included in this implementation
}

export class MoralisClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://deep-index.moralis.io/api/v2.2';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Moralis API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Fetches ERC-20 token balances for a given address on a specific chain
   * @param chainId - The chain ID (1 for Ethereum, 137 for Polygon, etc.)
   * @param evmAddress - The wallet address to fetch balances for
   * @param blacklistAddresses - Array of token addresses to exclude from results
   * @returns Object containing ERC-20 tokens and NFTs (empty array)
   */
  async fetchTokens(
    chainId: number,
    evmAddress: string,
    blacklistAddresses: string[] = [],
  ): Promise<FetchTokensResult> {
    const chainName = this.getChainName(chainId);
    // Use the wallet API endpoint that includes price data
    const url = `${this.baseUrl}/wallets/${evmAddress}/tokens`;

    const params = new URLSearchParams({
      chain: chainName,
      exclude_spam: 'true', // Exclude tokens marked as spam
      exclude_unverified_contracts: 'false', // Include unverified contracts but we'll filter by price
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Moralis API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Validate response with Zod
    const validatedData = MoralisResponseSchema.parse(data);

    // Extract tokens array from response
    const tokens = Array.isArray(validatedData)
      ? validatedData
      : validatedData.result;

    // Normalize and filter tokens
    const normalizedTokens = this.normalizeTokens(tokens);

    // Filter out blacklisted addresses and apply business logic
    const erc20s = normalizedTokens.filter((token) => {
      // Exclude blacklisted addresses (case-insensitive)
      if (
        blacklistAddresses.some(
          (addr) => addr.toLowerCase() === token.contract_address.toLowerCase(),
        )
      ) {
        return false;
      }

      // Only include tokens with non-zero balance
      if (token.balance === '0') {
        return false;
      }

      return true;
    });

    return {
      erc20s,
      nfts: [], // NFTs not included in this implementation
    };
  }

  /**
   * Fetches the native balance for a given address on a specific chain
   */
  async fetchNativeBalance(
    chainId: number,
    address: string
  ): Promise<NormalizedToken | null> {
    const chainName = this.getChainName(chainId);
    const url = `${this.baseUrl}/wallets/${address}/balance`;

    const params = new URLSearchParams({
      chain: chainName,
    });

    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        console.error(`Moralis native balance failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      // data.balance is in wei

      // We need price for the native token to calculate USD value
      // We can use the fetchTokenPrice with the wrapped native token address or a known symbol
      // But Moralis usually returns native price with /balance endpoint? No, it just returns balance in wei.
      // We need to fetch native price separately or assume it's fetched elsewhere. 
      // Actually, let's look at the fetchTokens response, maybe it includes native? 
      // No, /tokens is ERC20. 
      // We need to fetch price for the native coin. 

      // Map chain to wrapped native address for price lookup
      const WRAPPED_NATIVE: Record<number, string> = {
        1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
        137: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
      };

      let priceData = { usdPrice: 0, usdPrice24hrChange: 0 };
      const wrappedAddress = WRAPPED_NATIVE[chainId];

      if (wrappedAddress) {
        const price = await this.fetchTokenPrice(chainId, wrappedAddress);
        if (price) priceData = price;
      }

      const decimals = 18;
      const balance = data.balance;
      const quoteRate = priceData.usdPrice;
      const quote = (Number(balance) / Math.pow(10, decimals)) * quoteRate;

      // Construct normalized token
      // Token details
      const NATIVE_DETAILS: Record<number, any> = {
        1: { symbol: 'ETH', name: 'Ethereum', logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
        56: { symbol: 'BNB', name: 'BNB', logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
        137: { symbol: 'MATIC', name: 'Polygon', logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" }
      };

      const details = NATIVE_DETAILS[chainId] || { symbol: 'NATIVE', name: 'Native Token', logo: '' };

      return {
        contract_decimals: decimals,
        contract_name: details.name,
        contract_ticker_symbol: details.symbol,
        contract_address: "0x0000000000000000000000000000000000000000", // Standard for native
        supports_erc: ['erc20'], // technically not, but fits the schema
        logo_url: details.logo,
        last_transferred_at: new Date().toISOString(),
        native_token: true,
        type: 'cryptocurrency',
        balance: balance,
        balance_24h: balance, // simplified
        quote_rate: quoteRate,
        quote_rate_24h: quoteRate, // simplified
        quote: quote,
        quote_24h: quote, // simplified
        nft_data: null
      };

    } catch (e) {
      console.error("fetchNativeBalance error:", e);
      return null;
    }
  }

  /**
   * Normalizes Moralis token response to match existing codebase structure
   */
  private normalizeTokens(
    tokens: MoralisToken[],
  ): ReadonlyArray<NormalizedToken> {
    return tokens.map((token) => {
      // Calculate balance_24h (current balance - change)
      // Since Moralis doesn't provide historical balance, we estimate it
      const currentUsdValue = token.usd_value || 0;
      const usdValue24hAgo = token.usd_value_24hr_ago || currentUsdValue;

      // Estimate balance 24h ago based on value change
      const balance24h =
        token.usd_price && token.usd_price > 0
          ? String(
            Math.floor(
              (usdValue24hAgo / token.usd_price) *
              Math.pow(10, token.decimals),
            ),
          )
          : token.balance;

      // Calculate quote_rate_24h from percentage change
      const quoteRate = token.usd_price || 0;
      const percentChange = token.usd_price_24hr_percent_change || 0;
      const quoteRate24h = quoteRate / (1 + percentChange / 100);

      // Determine if it's a stablecoin (simple heuristic based on symbol)
      const stablecoinSymbols = [
        'USDT',
        'USDC',
        'DAI',
        'BUSD',
        'UST',
        'TUSD',
        'USDP',
        'USDD',
        'GUSD',
        'FRAX',
      ];
      const isStablecoin = stablecoinSymbols.includes(
        token.symbol?.toUpperCase() || '',
      );

      return {
        contract_decimals: token.decimals,
        contract_name: token.name || 'Unknown Token',
        contract_ticker_symbol: token.symbol || 'UNKNOWN',
        contract_address: token.token_address,
        supports_erc: ['erc20'] as ['erc20'],
        logo_url: token.logo || token.thumbnail || '',
        last_transferred_at: new Date().toISOString(), // Moralis doesn't provide this
        native_token: false as const,
        type: isStablecoin ? 'stablecoin' : 'cryptocurrency',
        balance: token.balance,
        balance_24h: balance24h,
        quote_rate: quoteRate,
        quote_rate_24h: quoteRate24h,
        quote: currentUsdValue,
        quote_24h: usdValue24hAgo,
        nft_data: null,
      };
    });
  }

  /**
   * Fetches native transactions for a given address
   */
  async fetchTransactions(
    chainId: number,
    address: string,
    limit: number = 10
  ): Promise<any[]> { // We can refine type later if needed
    const chainName = this.getChainName(chainId);
    const url = `${this.baseUrl}/wallets/${address}/history`;

    const params = new URLSearchParams({
      chain: chainName,
      limit: limit.toString(),
      order: "DESC",
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      // Allow failure for history (return empty) to not break entire dashboard
      console.error(`Moralis history failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.result || [];
  }

  /**
   * Fetches token price
   */
  async fetchTokenPrice(
    chainId: number,
    address: string
  ): Promise<{ usdPrice: number; usdPrice24hrChange: number } | null> {
    const chainName = this.getChainName(chainId);
    const url = `${this.baseUrl}/erc20/${address}/price`;

    const params = new URLSearchParams({
      chain: chainName,
    });

    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        console.warn(`Moralis price failed for ${address}: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return {
        usdPrice: data.usdPrice,
        usdPrice24hrChange: 0, // Moralis /price endpoint might not return 24h change directly, strict /price usually just returns price. 
        // We might need to fetch OHLCV or just accept current price. 
        // For now, let's just return price.
      };
    } catch (e) {
      console.error("fetchTokenPrice error:", e);
      return null;
    }
  }

  /**
   * Fetches ERC20 token transfers for a given address
   */
  async fetchErc20Transfers(
    chainId: number,
    address: string,
    limit: number = 50
  ): Promise<any[]> {
    const chainName = this.getChainName(chainId);
    const url = `${this.baseUrl}/${address}/erc20/transfers`;

    const params = new URLSearchParams({
      chain: chainName,
      limit: limit.toString(),
      order: "DESC",
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-API-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Moralis ERC20 transfers failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.result || [];
  }

  /**
   * Maps chain ID to Moralis chain name
   */
  private getChainName(chainId: number): string {
    const chainName = CHAIN_ID_TO_MORALIS_CHAIN[chainId];
    if (!chainName) {
      throw new Error(
        `Chain ID ${chainId} is not supported. Supported chains: ${Object.keys(CHAIN_ID_TO_MORALIS_CHAIN).join(', ')}`,
      );
    }
    return chainName;
  }

  /**
   * Gets the list of supported chain IDs
   */
  static getSupportedChainIds(): number[] {
    return Object.keys(CHAIN_ID_TO_MORALIS_CHAIN).map(Number);
  }
}
