/**
 * Unified Crypto Provider with automatic failover
 * 
 * For EVM chains: Moralis (primary) -> Moralis Key 2 (backup) -> Alchemy
 * For Bitcoin: Alchemy (primary) -> Blockstream (backup)
 */

import { MoralisClient, NormalizedToken, FetchTokensResult } from './moralis-client';

// Environment keys
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const MORALIS_API_KEY_2 = process.env.MORALIS_API_KEY_2;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Alchemy chain mappings
const ALCHEMY_CHAIN_URLS: Record<number, string> = {
  1: 'https://eth-mainnet.g.alchemy.com/v2',
  10: 'https://opt-mainnet.g.alchemy.com/v2',
  56: 'https://bnb-mainnet.g.alchemy.com/v2', // Note: Alchemy may not support BSC
  137: 'https://polygon-mainnet.g.alchemy.com/v2',
  42161: 'https://arb-mainnet.g.alchemy.com/v2',
};

export interface ProviderResult<T> {
  data: T;
  provider: 'moralis' | 'moralis_backup' | 'alchemy' | 'blockstream';
}

class CryptoProvider {
  private moralisClient: MoralisClient | null = null;
  private moralisBackupClient: MoralisClient | null = null;

  constructor() {
    if (MORALIS_API_KEY) {
      this.moralisClient = new MoralisClient(MORALIS_API_KEY);
    }
    if (MORALIS_API_KEY_2) {
      this.moralisBackupClient = new MoralisClient(MORALIS_API_KEY_2);
    }
  }

  /**
   * Fetch ERC20 tokens with automatic fallback
   */
  async fetchTokens(
    chainId: number,
    address: string,
    blacklistAddresses: string[] = []
  ): Promise<ProviderResult<FetchTokensResult>> {
    const errors: string[] = [];

    // Try Moralis primary
    if (this.moralisClient) {
      try {
        const result = await this.moralisClient.fetchTokens(chainId, address, blacklistAddresses);
        return { data: result, provider: 'moralis' };
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Moralis primary: ${msg}`);
        console.warn(`Moralis primary failed for chain ${chainId}: ${msg}`);
      }
    }

    // Try Moralis backup
    if (this.moralisBackupClient) {
      try {
        const result = await this.moralisBackupClient.fetchTokens(chainId, address, blacklistAddresses);
        return { data: result, provider: 'moralis_backup' };
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Moralis backup: ${msg}`);
        console.warn(`Moralis backup failed for chain ${chainId}: ${msg}`);
      }
    }

    // Try Alchemy as final fallback
    if (ALCHEMY_API_KEY && ALCHEMY_CHAIN_URLS[chainId]) {
      try {
        const result = await this.fetchTokensFromAlchemy(chainId, address);
        return { data: result, provider: 'alchemy' };
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Alchemy: ${msg}`);
        console.warn(`Alchemy failed for chain ${chainId}: ${msg}`);
      }
    }

    // All providers failed
    console.error(`All providers failed for chain ${chainId}:`, errors);
    return { data: { erc20s: [], nfts: [] }, provider: 'moralis' };
  }

  /**
   * Fetch native balance with automatic fallback
   */
  async fetchNativeBalance(
    chainId: number,
    address: string
  ): Promise<ProviderResult<NormalizedToken | null>> {
    // Try Moralis primary
    if (this.moralisClient) {
      try {
        const result = await this.moralisClient.fetchNativeBalance(chainId, address);
        if (result) return { data: result, provider: 'moralis' };
      } catch (error) {
        console.warn(`Moralis primary native balance failed: ${error}`);
      }
    }

    // Try Moralis backup
    if (this.moralisBackupClient) {
      try {
        const result = await this.moralisBackupClient.fetchNativeBalance(chainId, address);
        if (result) return { data: result, provider: 'moralis_backup' };
      } catch (error) {
        console.warn(`Moralis backup native balance failed: ${error}`);
      }
    }

    // Try Alchemy
    if (ALCHEMY_API_KEY && ALCHEMY_CHAIN_URLS[chainId]) {
      try {
        const result = await this.fetchNativeBalanceFromAlchemy(chainId, address);
        if (result) return { data: result, provider: 'alchemy' };
      } catch (error) {
        console.warn(`Alchemy native balance failed: ${error}`);
      }
    }

    return { data: null, provider: 'moralis' };
  }

  /**
   * Fetch transactions with automatic fallback
   */
  async fetchTransactions(
    chainId: number,
    address: string,
    limit: number = 10
  ): Promise<ProviderResult<any[]>> {
    // Try Moralis primary
    if (this.moralisClient) {
      try {
        const result = await this.moralisClient.fetchTransactions(chainId, address, limit);
        return { data: result, provider: 'moralis' };
      } catch (error) {
        console.warn(`Moralis primary transactions failed: ${error}`);
      }
    }

    // Try Moralis backup
    if (this.moralisBackupClient) {
      try {
        const result = await this.moralisBackupClient.fetchTransactions(chainId, address, limit);
        return { data: result, provider: 'moralis_backup' };
      } catch (error) {
        console.warn(`Moralis backup transactions failed: ${error}`);
      }
    }

    return { data: [], provider: 'moralis' };
  }

  /**
   * Fetch ERC20 transfers with automatic fallback
   */
  async fetchErc20Transfers(
    chainId: number,
    address: string,
    limit: number = 50
  ): Promise<ProviderResult<any[]>> {
    // Try Moralis primary
    if (this.moralisClient) {
      try {
        const result = await this.moralisClient.fetchErc20Transfers(chainId, address, limit);
        return { data: result, provider: 'moralis' };
      } catch (error) {
        console.warn(`Moralis primary ERC20 transfers failed: ${error}`);
      }
    }

    // Try Moralis backup
    if (this.moralisBackupClient) {
      try {
        const result = await this.moralisBackupClient.fetchErc20Transfers(chainId, address, limit);
        return { data: result, provider: 'moralis_backup' };
      } catch (error) {
        console.warn(`Moralis backup ERC20 transfers failed: ${error}`);
      }
    }

    return { data: [], provider: 'moralis' };
  }

  /**
   * Alchemy token fetch implementation
   */
  private async fetchTokensFromAlchemy(
    chainId: number,
    address: string
  ): Promise<FetchTokensResult> {
    const baseUrl = ALCHEMY_CHAIN_URLS[chainId];
    if (!baseUrl || !ALCHEMY_API_KEY) {
      throw new Error(`Alchemy not available for chain ${chainId}`);
    }

    const url = `${baseUrl}/${ALCHEMY_API_KEY}`;

    // Use Alchemy's alchemy_getTokenBalances
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [address, 'erc20'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Alchemy API failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'Alchemy RPC error');
    }

    const tokenBalances = data.result?.tokenBalances || [];

    // Filter non-zero balances and fetch metadata
    const nonZeroTokens = tokenBalances.filter(
      (t: any) => t.tokenBalance && t.tokenBalance !== '0x0' && t.tokenBalance !== '0x'
    );

    // Fetch metadata for tokens with balance
    const erc20s: NormalizedToken[] = [];

    for (const token of nonZeroTokens.slice(0, 50)) { // Limit to 50 tokens
      try {
        const metadata = await this.fetchAlchemyTokenMetadata(chainId, token.contractAddress);
        const balance = BigInt(token.tokenBalance).toString();
        
        erc20s.push({
          contract_decimals: metadata.decimals || 18,
          contract_name: metadata.name || 'Unknown',
          contract_ticker_symbol: metadata.symbol || 'UNKNOWN',
          contract_address: token.contractAddress,
          supports_erc: ['erc20'],
          logo_url: metadata.logo || '',
          last_transferred_at: new Date().toISOString(),
          native_token: false,
          type: 'cryptocurrency',
          balance: balance,
          balance_24h: balance,
          quote_rate: 0,
          quote_rate_24h: 0,
          quote: 0,
          quote_24h: 0,
          nft_data: null,
        });
      } catch (e) {
        console.warn(`Failed to fetch metadata for ${token.contractAddress}:`, e);
      }
    }

    return { erc20s, nfts: [] };
  }

  private async fetchAlchemyTokenMetadata(
    chainId: number,
    tokenAddress: string
  ): Promise<{ name?: string; symbol?: string; decimals?: number; logo?: string }> {
    const baseUrl = ALCHEMY_CHAIN_URLS[chainId];
    if (!baseUrl || !ALCHEMY_API_KEY) return {};

    const url = `${baseUrl}/${ALCHEMY_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenMetadata',
        params: [tokenAddress],
      }),
    });

    if (!response.ok) return {};

    const data = await response.json();
    return data.result || {};
  }

  private async fetchNativeBalanceFromAlchemy(
    chainId: number,
    address: string
  ): Promise<NormalizedToken | null> {
    const baseUrl = ALCHEMY_CHAIN_URLS[chainId];
    if (!baseUrl || !ALCHEMY_API_KEY) return null;

    const url = `${baseUrl}/${ALCHEMY_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.error || !data.result) return null;

    const balance = BigInt(data.result).toString();

    const NATIVE_DETAILS: Record<number, { symbol: string; name: string; logo: string }> = {
      1: { symbol: 'ETH', name: 'Ethereum', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
      56: { symbol: 'BNB', name: 'BNB', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
      137: { symbol: 'MATIC', name: 'Polygon', logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
      10: { symbol: 'ETH', name: 'Optimism ETH', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
      42161: { symbol: 'ETH', name: 'Arbitrum ETH', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    };

    const details = NATIVE_DETAILS[chainId] || { symbol: 'NATIVE', name: 'Native Token', logo: '' };

    return {
      contract_decimals: 18,
      contract_name: details.name,
      contract_ticker_symbol: details.symbol,
      contract_address: '0x0000000000000000000000000000000000000000',
      supports_erc: ['erc20'],
      logo_url: details.logo,
      last_transferred_at: new Date().toISOString(),
      native_token: true,
      type: 'cryptocurrency',
      balance: balance,
      balance_24h: balance,
      quote_rate: 0,
      quote_rate_24h: 0,
      quote: 0,
      quote_24h: 0,
      nft_data: null,
    };
  }
}

// Export singleton instance
export const cryptoProvider = new CryptoProvider();

// Export class for testing
export { CryptoProvider };
