"use server";

import { MoralisClient } from "@/lib/moralis-client";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";
const moralis = new MoralisClient(MORALIS_API_KEY);

function getNativeSymbol(chainId: number): string {
    switch (chainId) {
        case 1: return 'ETH';
        case 56: return 'BNB';
        case 137: return 'MATIC';
        default: return 'ETH';
    }
}

/** Fetches all transactions (native + ERC20, 20 per chain) for a given address. Used by portfolio and Transactions page. */
async function fetchAllTransactionsForAddress(address: string, chains: number[]): Promise<any[]> {
    if (!address || !MORALIS_API_KEY) return [];
    const limit = 20;
    const nativePromises = chains.map(chainId =>
        moralis.fetchTransactions(chainId, address, limit)
            .then(txs => txs.map((tx: any) => ({
                hash: tx.hash,
                from_address: tx.from_address,
                to_address: tx.to_address,
                value: tx.value,
                block_timestamp: tx.block_timestamp,
                chainId,
                symbol: getNativeSymbol(chainId),
                decimals: 18,
                type: 'native' as const
            })))
            .catch(e => { console.error(`Failed to fetch native history for chain ${chainId}:`, e); return []; })
    );
    const erc20Promises = chains.map(chainId =>
        moralis.fetchErc20Transfers(chainId, address, limit)
            .then(txs => txs.map((tx: any) => ({
                hash: tx.transaction_hash,
                from_address: tx.from_address,
                to_address: tx.to_address,
                value: tx.value,
                block_timestamp: tx.block_timestamp,
                chainId,
                symbol: tx.token_symbol || 'Unknown',
                decimals: Number(tx.token_decimals || 18),
                type: 'erc20' as const,
                token_name: tx.token_name,
                token_address: tx.address
            })))
            .catch(e => { console.error(`Failed to fetch ERC20 history for chain ${chainId}:`, e); return []; })
    );
    const [nativeResults, erc20Results] = await Promise.all([Promise.all(nativePromises), Promise.all(erc20Promises)]);
    const all = [...nativeResults.flat(), ...erc20Results.flat()];
    return all.sort((a, b) => new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime());
}

export interface WalletPortfolio {
    tokens: any[];
    transactions: any[];
    totalBalanceUsd: number;
}

export async function getWalletPortfolio(address: string): Promise<WalletPortfolio> {
    if (!address || !MORALIS_API_KEY) {
        return { tokens: [], transactions: [], totalBalanceUsd: 0 };
    }

    try {
        // Chains to fetch: ETH (1), BSC (56), Polygon (137)
        // We can add more, but let's start with these major ones for performance
        const chains = [1, 56, 137];

        // Fetch tokens in parallel
        const tokenPromises = chains.map(chainId =>
            moralis.fetchTokens(chainId, address)
                .then(res => res.erc20s.map(t => ({ ...t, chainId }))) // Add chainId to token
                .catch(e => {
                    console.error(`Failed to fetch tokens for chain ${chainId}:`, e);
                    return [];
                })
        );

        // Full transaction history (native + ERC20, 20 per chain) — same as Transactions page / Recent Activity
        const allHistory = await fetchAllTransactionsForAddress(address, chains);

        // Fetch native balances in parallel
        const nativePromises = chains.map(chainId =>
            moralis.fetchNativeBalance(chainId, address)
                .then(res => res ? { ...res, chainId } : null)
                .catch(e => {
                    console.error(`Failed to fetch native balance for chain ${chainId}:`, e);
                    return null;
                })
        );

        const [tokensResults, nativeResults] = await Promise.all([
            Promise.all(tokenPromises),
            Promise.all(nativePromises)
        ]);

        const allTokens = [...nativeResults, ...tokensResults.flat()].filter((t): t is any => t !== null);

        // Calculate total balance
        const totalBalanceUsd = allTokens.reduce((acc, token) => acc + (token.quote || 0), 0);

        return {
            tokens: allTokens,
            transactions: allHistory,
            totalBalanceUsd
        };

    } catch (error) {
        console.error("getWalletPortfolio error:", error);
        return { tokens: [], transactions: [], totalBalanceUsd: 0 };
    }
}

export async function getPopularCoins() {
    if (!MORALIS_API_KEY) return [];

    // ETH, WBTC, USDT, BNB, MATIC
    const coins = [
        { id: 'eth', symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', chainId: 1, decimals: 18, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
        { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', chainId: 1, decimals: 8, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" }, // Using WBTC as proxy
        { id: 'usdt', symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chainId: 1, decimals: 6, logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
        { id: 'bnb', symbol: 'BNB', name: 'BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', chainId: 56, decimals: 18, logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
        { id: 'matic', symbol: 'MATIC', name: 'Polygon', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', chainId: 137, decimals: 18, logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
    ];

    const promises = coins.map(async (coin) => {
        const priceData = await moralis.fetchTokenPrice(coin.chainId, coin.address);
        return {
            ...coin,
            quote: priceData?.usdPrice || 0,
            // Synthesize a random change if 0, just for visuals in "demo" mode if API doesn't return it
            change: (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2),
            contract_address: coin.address,
            contract_ticker_symbol: coin.symbol,
            contract_name: coin.name,
            logo_url: coin.logo,
            balance: "0" // It's a market view, not balance
        };
    });

    const results = await Promise.all(promises);
    return results;
}

export interface Transaction {
    hash: string;
    from_address: string;
    to_address: string;
    value: string;
    block_timestamp: string;
    chainId: number;
    symbol: string;
    decimals: number;
    type: 'native' | 'erc20';
    token_name?: string;
    token_address?: string;
}

export async function getWalletHistory(address: string, filterChainId?: string | number): Promise<Transaction[]> {
    if (!address || !MORALIS_API_KEY) return [];
    try {
        const chains = filterChainId && filterChainId !== 'all'
            ? [Number(filterChainId)]
            : [1, 56, 137];
        const all = await fetchAllTransactionsForAddress(address, chains);
        return all as Transaction[];
    } catch (error) {
        console.error("getWalletHistory error:", error);
        return [];
    }
}

export interface TransactionsForUserResult {
    transactions: Transaction[];
    walletAddress: string | null;
}

/** Fetch transactions for the current user's Lenix wallet (no unlock required). Uses wallet address from DB. */
export async function getTransactionsForCurrentUser(filterChainId?: string | number): Promise<TransactionsForUserResult> {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { transactions: [], walletAddress: null };

    const { data: wallet } = await supabase
        .from("user_wallets")
        .select("ethereum_address")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    const address = wallet?.ethereum_address ?? null;
    if (!address) return { transactions: [], walletAddress: null };

    const transactions = await getWalletHistory(address, filterChainId);
    return { transactions, walletAddress: address };
}
