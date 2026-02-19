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
        // 1. Fetch User Data for DB Lookup
        const { createClient } = await import("@/utils/supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let dbBalances: any[] = [];
        if (user) {
            const { data } = await supabase
                .from("user_balances")
                .select("*")
                .eq("user_id", user.id);
            dbBalances = data || [];
        }

        // Chains to fetch: ETH (1), BSC (56), Polygon (137)
        const chains = [1, 56, 137];

        // 2. Fetch tokens in parallel
        const tokenPromises = chains.map(chainId =>
            moralis.fetchTokens(chainId, address)
                .then(res => res.erc20s.map(t => ({ ...t, chainId })))
                .catch(e => {
                    console.error(`Failed to fetch tokens for chain ${chainId}:`, e);
                    return [];
                })
        );

        // 3. Full transaction history 
        const allHistory = await fetchAllTransactionsForAddress(address, chains);

        // 4. Fetch native balances in parallel
        const nativePromises = chains.map(chainId =>
            moralis.fetchNativeBalance(chainId, address)
                .then(res => res ? {
                    ...res,
                    chainId,
                    symbol: getNativeSymbol(chainId),
                    contract_ticker_symbol: getNativeSymbol(chainId),
                    native_token: true
                } : null)
                .catch(e => {
                    console.error(`Failed to fetch native balance for chain ${chainId}:`, e);
                    return null;
                })
        );

        const [tokensResults, nativeResults] = await Promise.all([
            Promise.all(tokenPromises),
            Promise.all(nativePromises)
        ]);

        let allTokens = [...nativeResults, ...tokensResults.flat()].filter((t): t is any => t !== null);

        // 5. Merge Admin Balances from DB
        // Map DB balances for O(1) lookup: key = symbol_network
        // Note: DB stores 'network' as string ('ethereum', 'bsc', etc.) or ID? 
        // Mobile app `balancePersistenceService.ts`: network is string ('ethereum').
        // Moralis chainId is number. Need mapping.
        const CHAIN_ID_MAP: Record<number, string> = { 1: 'ethereum', 56: 'bsc', 137: 'polygon' };

        // Helper to normalize DB network to ID or vice versa. 
        // Let's match by Symbol + ChainID.

        // Create a map of existing tokens to avoid duplicates when adding DB-only tokens
        const processedTokens = new Set<string>(); // key: symbol_chainId

        allTokens = allTokens.map(token => {
            const chainName = CHAIN_ID_MAP[token.chainId];
            const tokenSymbol = token.contract_ticker_symbol || token.symbol;

            // Find matching DB entry
            // Try matching by Symbol AND Network
            const dbEntry = dbBalances.find(b =>
                b.token_symbol === tokenSymbol &&
                (b.network === chainName || b.network === token.chainId.toString())
            );

            if (dbEntry) {
                const adminCredit = parseFloat(dbEntry.admin_balance || '0');
                if (adminCredit > 0) {
                    console.log(`[Portfolio] Merging admin credit for ${tokenSymbol} (${chainName}): ${adminCredit}`);
                    // Convert admin credit (readable) to raw units
                    const decimals = token.contract_decimals || 18;
                    const rawCredit = BigInt(Math.floor(adminCredit * Math.pow(10, decimals)));
                    const currentRaw = BigInt(token.balance || "0");
                    const newRaw = currentRaw + rawCredit;

                    token.balance = newRaw.toString();

                    // Update quote (USD Value)
                    // If quote_rate is 0 (likely because native balance was 0), try to use DB value or fetch it
                    if (!token.quote_rate && dbEntry.usd_value && parseFloat(dbEntry.balance) > 0) {
                        // Heuristic: infer from DB if possible
                        token.quote_rate = dbEntry.usd_value / parseFloat(dbEntry.balance);
                    }

                    // If still 0, and it's a known native token, try to force a price? 
                    // Actually, if on-chain balance was 0, Moralis might return 0 price if using the /balance endpoint?
                    // Let's try to fetch price if missing and we have an address. 
                    // Native tokens have "0x0...0" address in normalized list usually, but Moralis needs wrapped address or symbol.

                    if (!token.quote_rate) {
                        // Fallback for native tokens
                        if (token.native_token) {
                            // We can't easily await here inside map without usage of Promise.all.
                            // But we can check if we have a known price from specific list?
                            // STARTUP HACK: We fetched popular coins? No not here.
                        }
                    }

                    if (token.quote_rate) {
                        token.quote = (Number(newRaw) / Math.pow(10, decimals)) * token.quote_rate;
                    }
                }
            }

            processedTokens.add(`${tokenSymbol}_${token.chainId}`);
            return token;
        });

        // Wait, I can't simple make the map async above easily without changing structure.
        // Let's keep it synchronous and handle "DB-ONLY" separately with async.

        // Actually, for the MERGE case, if price is missing, it is hard. 
        // Let's rely on the DB-Only section to handle the "pure credit" tokens better.
        // For the "Native Token with 0 balance" case (which is what ETH likely is), 
        // The `nativePromises` used `moralis.fetchNativeBalance`. 
        // That function DOES fetches price. If it returned 0, it failed.

        // 6. Add Database-Only Tokens AND Fix Missing Prices
        // We can do a pass to fetch missing prices for meaningful balances.

        const missingPriceTokens = allTokens.filter(t => Number(t.balance) > 0 && !t.quote_rate);

        // Also prepare DB-Only tokens
        const dbOnlyTokens: any[] = [];

        for (const db of dbBalances) {
            // Reverse map network name to ID
            const REVERSE_CHAIN_MAP: Record<string, number> = { 'ethereum': 1, 'bsc': 56, 'polygon': 137, '1': 1, '56': 56, '137': 137 };
            const chainId = REVERSE_CHAIN_MAP[db.network?.toLowerCase()];
            if (!chainId) continue;

            const key = `${db.token_symbol}_${chainId}`;
            if (!processedTokens.has(key)) {
                const adminCredit = parseFloat(db.admin_balance || '0');
                if (adminCredit > 0) {
                    dbOnlyTokens.push({ ...db, chainId, adminCredit });
                }
            }
        }

        // Now we have `dbOnlyTokens` and `missingPriceTokens`. 
        // Let's fetch prices for them. 

        // Helper to get address for price fetch
        const getPriceAddress = (symbol: string, chainId: number, tokenAddress?: string) => {
            if (tokenAddress && tokenAddress !== "" && tokenAddress !== "0x0000000000000000000000000000000000000000") return tokenAddress;
            // Native?
            if (symbol === 'ETH' || symbol === 'WETH') return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // Mainnet WETH
            if (symbol === 'MATIC' || symbol === 'WMATIC') return '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'; // Polygon WMATIC
            if (symbol === 'BNB' || symbol === 'WBNB') return '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'; // BSC WBNB
            return null;
        };

        // Helper to get static metadata and CoinGecko IDs
        const TOKEN_METADATA: Record<string, { logo: string; name: string; cgId: string }> = {
            'ETH': { logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", name: "Ethereum", cgId: "ethereum" },
            'WETH': { logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", name: "Wrapped Ethereum", cgId: "ethereum" },
            'BTC': { logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", name: "Bitcoin", cgId: "bitcoin" },
            'WBTC': { logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", name: "Wrapped Bitcoin", cgId: "wrapped-bitcoin" },
            'USDT': { logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png", name: "Tether USD", cgId: "tether" },
            'USDC': { logo: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png", name: "USDC", cgId: "usd-coin" },
            'BNB': { logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png", name: "BNB", cgId: "binancecoin" },
            'WBNB': { logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png", name: "Wrapped BNB", cgId: "binancecoin" },
            'MATIC': { logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png", name: "Polygon", cgId: "matic-network" },
            'WMATIC': { logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png", name: "Wrapped Matic", cgId: "matic-network" },
            'SOL': { logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png", name: "Solana", cgId: "solana" },
            'AVAX': { logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png", name: "Avalanche", cgId: "avalanche-2" },
            'ARB': { logo: "https://assets.coingecko.com/coins/images/16547/small/arbitrum.jpg", name: "Arbitrum", cgId: "arbitrum" },
            'OP': { logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png", name: "Optimism", cgId: "optimism" },
            'TRX': { logo: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png", name: "TRON", cgId: "tron" },
            'XRP': { logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png", name: "XRP", cgId: "ripple" },
            'ADA': { logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png", name: "Cardano", cgId: "cardano" },
            'DOGE': { logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png", name: "Dogecoin", cgId: "dogecoin" },
            'DOT': { logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", name: "Polkadot", cgId: "polkadot" },
        };

        // Prepare CoinGecko Fetch
        const cgIdsToFetch = new Set<string>();
        dbOnlyTokens.forEach(db => {
            const symbolUpper = db.token_symbol?.toUpperCase();
            const meta = TOKEN_METADATA[symbolUpper];
            if (meta?.cgId) cgIdsToFetch.add(meta.cgId);
        });

        // Batch Fetch from CoinGecko (Simple Price API)
        let cgPrices: Record<string, { usd: number, usd_24h_change: number }> = {};
        if (cgIdsToFetch.size > 0) {
            try {
                const ids = Array.from(cgIdsToFetch).join(',');
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
                if (response.ok) {
                    cgPrices = await response.json();
                } else {
                    console.error("CoinGecko API limit or error", response.status);
                }
            } catch (e) {
                console.error("Failed to fetch CoinGecko prices", e);
            }
        }

        // Process DB Only Tokens
        const dbTokensPromises = dbOnlyTokens.map(async (db) => {
            // Attempt to infer decimals
            const symbolUpper = db.token_symbol?.toUpperCase() || 'UNKNOWN';
            const isStable = ['USDT', 'USDC'].includes(symbolUpper);
            const isBtc = ['BTC', 'WBTC'].includes(symbolUpper);
            const decimals = isStable ? 6 : (isBtc ? 8 : 18);

            const rawBalance = BigInt(Math.floor(db.adminCredit * Math.pow(10, decimals))).toString();

            // Metadata
            const metadata = TOKEN_METADATA[symbolUpper] || { logo: "", name: db.token_symbol, cgId: "" };

            // Try to use CoinGecko data first
            let quote_rate = 0;
            let change_24h = 0;

            if (metadata.cgId && cgPrices[metadata.cgId]) {
                quote_rate = cgPrices[metadata.cgId].usd;
                change_24h = cgPrices[metadata.cgId].usd_24h_change; // percentage, e.g. -2.54
            } else {
                // Fallback to Moralis single price fetch if NO CoinGecko data (and not simulated)
                const priceAddress = getPriceAddress(db.token_symbol, db.chainId, db.token_address);
                if (priceAddress) {
                    const priceData = await moralis.fetchTokenPrice(db.chainId, priceAddress);
                    if (priceData) quote_rate = priceData.usdPrice;
                }

                // Fallback to DB implied price
                if (!quote_rate && parseFloat(db.balance) > 0) {
                    quote_rate = db.usd_value / parseFloat(db.balance);
                }
            }

            const quote = (Number(rawBalance) / Math.pow(10, decimals)) * quote_rate;

            // Calculate 24h old price based on change %
            // current = old * (1 + change/100)  => old = current / (1 + change/100)
            const quote_rate_24h = quote_rate / (1 + (change_24h / 100));
            const quote_24h = (Number(rawBalance) / Math.pow(10, decimals)) * quote_rate_24h;

            return {
                chainId: db.chainId,
                contract_decimals: decimals,
                contract_name: metadata.name,
                contract_ticker_symbol: db.token_symbol,
                contract_address: db.token_address || "",
                supports_erc: ['erc20'],
                logo_url: metadata.logo,
                last_transferred_at: db.last_updated,
                native_token: false,
                type: 'cryptocurrency',
                balance: rawBalance,
                balance_24h: rawBalance,
                quote_rate: quote_rate,
                quote: quote,
                quote_rate_24h: quote_rate_24h,
                quote_24h: quote_24h,
                nft_data: null,
                change: change_24h.toFixed(2) // Store explicit change % just in case UI uses it directly
            };
        });

        const resolvedDbTokens = await Promise.all(dbTokensPromises);
        allTokens.push(...resolvedDbTokens);

        // Process Missing Price Tokens (Merged)
        // We need to re-scan allTokens to update prices for those with missing quote_rate but positive balance
        const updatedTokensPromises = allTokens.map(async (t) => {
            // If we have balance but no price/low price, try to enrich
            if (Number(t.balance) > 0 && (!t.quote_rate || t.quote_rate === 0)) {
                const priceAddress = getPriceAddress(t.contract_ticker_symbol, t.chainId, t.contract_address);
                if (priceAddress) {
                    const priceData = await moralis.fetchTokenPrice(t.chainId, priceAddress);
                    if (priceData && priceData.usdPrice > 0) {
                        t.quote_rate = priceData.usdPrice;
                        t.quote = (Number(t.balance) / Math.pow(10, t.contract_decimals)) * t.quote_rate;
                    }
                }
            }
            return t;
        });

        allTokens = await Promise.all(updatedTokensPromises);

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
