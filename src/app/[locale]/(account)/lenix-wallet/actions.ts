"use server";

import { cryptoProvider } from "@/lib/crypto-provider";
import { MoralisClient } from "@/lib/moralis-client";
import { cache, CACHE_TTL } from "@/lib/cache";
import { enrichTokensWithPrices, fetchCoinGeckoPrices, TOKEN_REGISTRY } from "@/lib/token-metadata";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || "";
const moralis = MORALIS_API_KEY ? new MoralisClient(MORALIS_API_KEY) : null;

function getNativeSymbol(chainId: number): string {
    switch (chainId) {
        case 1: return 'ETH';
        case 56: return 'BNB';
        case 137: return 'MATIC';
        default: return 'ETH';
    }
}

/** Fetches all transactions (native + ERC20, 20 per chain) for a given address. Uses crypto provider with fallback. */
async function fetchAllTransactionsForAddress(address: string, chains: number[]): Promise<any[]> {
    if (!address) return [];
    const limit = 20;
    const nativePromises = chains.map(chainId =>
        cryptoProvider.fetchTransactions(chainId, address, limit)
            .then(({ data: txs }) => txs.map((tx: any) => ({
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
        cryptoProvider.fetchErc20Transfers(chainId, address, limit)
            .then(({ data: txs }) => txs.map((tx: any) => ({
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
    if (!address) {
        return { tokens: [], transactions: [], totalBalanceUsd: 0 };
    }

    // Check cache first
    const cacheKey = `portfolio_${address.toLowerCase()}`;
    const cached = cache.get<WalletPortfolio>(cacheKey);
    if (cached) {
        console.log(`[Portfolio] Returning cached data for ${address.slice(0, 8)}...`);
        return cached;
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
        let allHistory: any[] = [];
        let tokensResults: any[][] = [];
        let nativeResults: any[] = [];

        // Pre-fetch CoinGecko prices for native tokens (more reliable than API providers)
        const nativeSymbols = ['ETH', 'BNB', 'MATIC', 'BTC'];
        const nativePrices = await fetchCoinGeckoPrices(nativeSymbols);
        console.log(`[Portfolio] Pre-fetched prices for native tokens`);

        // Use crypto provider with automatic fallback
        const tokenPromises = chains.map(chainId =>
            cryptoProvider.fetchTokens(chainId, address)
                .then(({ data: res, provider }) => {
                    console.log(`[Portfolio] Chain ${chainId} tokens fetched via ${provider}`);
                    return res.erc20s.map(t => ({ ...t, chainId }));
                })
                .catch(e => {
                    console.error(`Failed to fetch tokens for chain ${chainId}:`, e);
                    return [];
                })
        );

        allHistory = await fetchAllTransactionsForAddress(address, chains);

        const nativePromises = chains.map(chainId =>
            cryptoProvider.fetchNativeBalance(chainId, address)
                .then(({ data: res, provider }) => {
                    if (res) {
                        console.log(`[Portfolio] Chain ${chainId} native balance fetched via ${provider}`);
                        const symbol = getNativeSymbol(chainId);
                        const cgPrice = nativePrices[symbol];

                        // Enrich with CoinGecko price if provider didn't return price
                        let quote_rate = res.quote_rate || 0;
                        let quote = res.quote || 0;

                        if ((!quote_rate || quote_rate === 0) && cgPrice) {
                            quote_rate = cgPrice.usd;
                            const decimals = res.contract_decimals || 18;
                            const balance = Number(res.balance || '0') / Math.pow(10, decimals);
                            quote = balance * quote_rate;
                        }

                        const meta = TOKEN_REGISTRY[symbol];

                        return {
                            ...res,
                            chainId,
                            symbol,
                            contract_ticker_symbol: symbol,
                            contract_name: meta?.name || res.contract_name,
                            logo_url: meta?.logo || res.logo_url,
                            native_token: true,
                            quote_rate,
                            quote,
                        };
                    }
                    return null;
                })
                .catch(e => {
                    console.error(`Failed to fetch native balance for chain ${chainId}:`, e);
                    return null;
                })
        );

        [tokensResults, nativeResults] = await Promise.all([
            Promise.all(tokenPromises),
            Promise.all(nativePromises)
        ]);

        let allTokens = [...nativeResults, ...tokensResults.flat()].filter((t): t is any => t !== null);

        // 5. Merge Admin Balances from DB
        // Map DB balances for O(1) lookup: key = symbol_network
        // Note: DB stores 'network' as string ('ethereum', 'bsc', etc.) or ID? 
        // Mobile app `balancePersistenceService.ts`: network is string ('ethereum').
        // Moralis chainId is number. Need mapping.
        const CHAIN_ID_MAP: Record<number, string> = { 0: 'bitcoin', 1: 'ethereum', 56: 'bsc', 137: 'polygon' };

        // Helper to normalize DB network to ID or vice versa. 
        // Let's match by Symbol + ChainID.

        // Create a map of existing tokens to avoid duplicates when adding DB-only tokens
        const processedTokens = new Set<string>(); // key: symbol_chainId

        const bitcoinBalance = dbBalances.find(
            (balance) => balance.token_symbol?.toUpperCase() === 'BTC' && balance.network?.toLowerCase() === 'bitcoin'
        );
        // Check both balance and admin_balance for Bitcoin
        const btcBalanceAmount = Number(bitcoinBalance?.balance || 0);
        const btcAdminAmount = Number(bitcoinBalance?.admin_balance || 0);
        const btcTotalAmount = btcBalanceAmount + btcAdminAmount;
        
        if (bitcoinBalance && btcTotalAmount > 0) {
            const btcAmount = btcTotalAmount;
            let btcPriceUsd = btcAmount > 0 ? Number(bitcoinBalance.usd_value || 0) / btcAmount : 0;
            let btcChange24h = 0;
            if (!btcPriceUsd) {
                try {
                    const priceResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true");
                    if (priceResponse.ok) {
                        const priceData = await priceResponse.json();
                        btcPriceUsd = Number(priceData.bitcoin?.usd || 0);
                        btcChange24h = Number(priceData.bitcoin?.usd_24h_change || 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch Bitcoin price", error);
                }
            }
            allTokens.push({
                balance: BigInt(Math.round(btcAmount * 100_000_000)).toString(),
                // Admin-credited BTC (admin_balance) only ever exists in this internal
                // ledger — it was never actually deposited on-chain, so it can't be
                // included in what's real-world spendable. Real withdrawals build their
                // PSBT straight from live on-chain UTXOs (see /api/btc/withdrawals) and
                // will reject anything beyond this regardless, but we cap the UI's
                // "available to send" here too so users don't hit a confusing failure.
                spendableBalance: BigInt(Math.round(btcBalanceAmount * 100_000_000)).toString(),
                contract_decimals: 8,
                contract_ticker_symbol: 'BTC',
                contract_name: 'Bitcoin',
                chainId: 0,
                symbol: 'BTC',
                quote: btcAmount * btcPriceUsd,
                quote_rate: btcPriceUsd,
                quote_24h: btcAmount * (btcPriceUsd / (1 + btcChange24h / 100 || 1)),
                network: 'bitcoin',
                native_token: true,
                logo_url: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
            });
        }

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
                if (!token.quote_rate && dbEntry.usd_value && parseFloat(dbEntry.balance) > 0) {
                    token.quote_rate = dbEntry.usd_value / parseFloat(dbEntry.balance);
                }

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
            const REVERSE_CHAIN_MAP: Record<string, number> = { 'bitcoin': 0, 'ethereum': 1, 'bsc': 56, 'polygon': 137, '1': 1, '56': 56, '137': 137 };
            const chainId = REVERSE_CHAIN_MAP[db.network?.toLowerCase()];
            if (chainId === undefined || chainId === 0) continue;

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

        // Prepare CoinGecko fetch for DB-only tokens
        const dbOnlySymbols = dbOnlyTokens.map(db => db.token_symbol?.toUpperCase()).filter(Boolean);
        const cgPrices = await fetchCoinGeckoPrices(dbOnlySymbols);

        // Process DB Only Tokens
        const dbTokensPromises = dbOnlyTokens.map(async (db) => {
            const symbolUpper = db.token_symbol?.toUpperCase() || 'UNKNOWN';
            const meta = TOKEN_REGISTRY[symbolUpper];
            
            // Get decimals from registry or infer
            const isStable = ['USDT', 'USDC'].includes(symbolUpper);
            const isBtc = ['BTC', 'WBTC'].includes(symbolUpper);
            const decimals = meta?.decimals || (isStable ? 6 : (isBtc ? 8 : 18));

            const rawBalance = BigInt(Math.floor(db.adminCredit * Math.pow(10, decimals))).toString();

            // Try to use CoinGecko data first
            let quote_rate = 0;
            let change_24h = 0;

            if (cgPrices[symbolUpper]) {
                quote_rate = cgPrices[symbolUpper].usd;
                change_24h = cgPrices[symbolUpper].usd_24h_change || 0;
            } else {
                // Fallback to Moralis single price fetch
                const priceAddress = getPriceAddress(db.token_symbol, db.chainId, db.token_address);
                if (priceAddress && moralis) {
                    try {
                        const priceData = await moralis.fetchTokenPrice(db.chainId, priceAddress);
                        if (priceData) quote_rate = priceData.usdPrice;
                    } catch (e) {
                        console.warn(`Price fetch failed for ${db.token_symbol}:`, e);
                    }
                }

                // Fallback to DB implied price
                if (!quote_rate && parseFloat(db.balance) > 0) {
                    quote_rate = db.usd_value / parseFloat(db.balance);
                }
            }

            const quote = (Number(rawBalance) / Math.pow(10, decimals)) * quote_rate;
            const quote_rate_24h = quote_rate / (1 + (change_24h / 100));
            const quote_24h = (Number(rawBalance) / Math.pow(10, decimals)) * quote_rate_24h;

            return {
                chainId: db.chainId,
                contract_decimals: decimals,
                contract_name: meta?.name || db.token_symbol,
                contract_ticker_symbol: db.token_symbol,
                contract_address: db.token_address || "",
                supports_erc: ['erc20'],
                logo_url: meta?.logo || "",
                last_transferred_at: db.last_updated,
                native_token: false,
                type: 'cryptocurrency',
                balance: rawBalance,
                balance_24h: rawBalance,
                quote_rate,
                quote,
                quote_rate_24h,
                quote_24h,
                nft_data: null,
                change: change_24h.toFixed(2),
            };
        });

        const resolvedDbTokens = await Promise.all(dbTokensPromises);
        allTokens.push(...resolvedDbTokens);

        // Process Missing Price Tokens (Merged)
        // We need to re-scan allTokens to update prices for those with missing quote_rate but positive balance
        const updatedTokensPromises = allTokens.map(async (t) => {
            // If we have balance but no price/low price, try to enrich
            if (t.chainId !== 0 && Number(t.balance) > 0 && (!t.quote_rate || t.quote_rate === 0)) {
                const priceAddress = getPriceAddress(t.contract_ticker_symbol, t.chainId, t.contract_address);
                if (priceAddress && moralis) {
                    try {
                        const priceData = await moralis.fetchTokenPrice(t.chainId, priceAddress);
                        if (priceData && priceData.usdPrice > 0) {
                            t.quote_rate = priceData.usdPrice;
                            t.quote = (Number(t.balance) / Math.pow(10, t.contract_decimals)) * t.quote_rate;
                        }
                    } catch (e) {
                        console.warn(`Price fetch failed for ${t.contract_ticker_symbol}:`, e);
                    }
                }
            }
            return t;
        });

        allTokens = await Promise.all(updatedTokensPromises);

        // Enrich all tokens with metadata and prices from CoinGecko
        allTokens = await enrichTokensWithPrices(allTokens);

        // Attach admin freeze state (set via /api/admin/freeze) so the UI can show a
        // frozen badge and block sends. Match by symbol + network first, falling back
        // to symbol-only since some tokens' `network` naming doesn't line up 1:1.
        allTokens = allTokens.map(token => {
            const symbol = (token.contract_ticker_symbol || token.symbol || '').toUpperCase();
            const chainName = CHAIN_ID_MAP[token.chainId];
            const dbEntry =
                dbBalances.find(b => b.token_symbol?.toUpperCase() === symbol && b.network === chainName) ||
                dbBalances.find(b => b.token_symbol?.toUpperCase() === symbol);

            if (dbEntry?.is_frozen) {
                return {
                    ...token,
                    isFrozen: true,
                    freezeReason: dbEntry.freeze_reason ?? null,
                    freezeFeeAmount: dbEntry.freeze_fee_amount ?? null,
                    freezeFeeCurrency: dbEntry.freeze_fee_currency ?? null,
                };
            }
            return token;
        });

        // Calculate total balance
        const totalBalanceUsd = allTokens.reduce((acc, token) => acc + (token.quote || 0), 0);

        // Merge in internal transactions (admin credits/debits, BTC deposits) so they
        // show up here too, not just on the locked/no-unlock-required path.
        let allTransactions = allHistory;
        if (user) {
            const internalTxs = await getInternalTransactionsForUser(supabase, user.id);
            allTransactions = [...allHistory, ...internalTxs].sort((a, b) =>
                new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime()
            );
        }

        const result: WalletPortfolio = {
            tokens: allTokens,
            transactions: allTransactions,
            totalBalanceUsd
        };

        // Cache for 30 seconds
        cache.set(cacheKey, result, CACHE_TTL.PORTFOLIO);
        console.log(`[Portfolio] Cached data for ${address.slice(0, 8)}... (TTL: ${CACHE_TTL.PORTFOLIO}s)`);

        return result;

    } catch (error) {
        console.error("getWalletPortfolio error:", error);
        return { tokens: [], transactions: [], totalBalanceUsd: 0 };
    }
}

export async function getPopularCoins() {
    // ETH, WBTC, USDT, BNB, MATIC - use CoinGecko IDs for reliable pricing
    const coins = [
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', chainId: 1, decimals: 18, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
        { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', chainId: 1, decimals: 8, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
        { id: 'tether', symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chainId: 1, decimals: 6, logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
        { id: 'binancecoin', symbol: 'BNB', name: 'BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', chainId: 56, decimals: 18, logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
        { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', chainId: 137, decimals: 18, logo: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
    ];

    // Fetch prices from CoinGecko (free, no API key required, more reliable)
    let cgPrices: Record<string, { usd: number; usd_24h_change?: number }> = {};
    try {
        const ids = coins.map(c => c.id).join(',');
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
            { next: { revalidate: 60 } }
        );
        if (response.ok) {
            cgPrices = await response.json();
        }
    } catch (e) {
        console.error('CoinGecko price fetch failed:', e);
    }

    // Fallback to Moralis if CoinGecko fails
    const results = await Promise.all(coins.map(async (coin) => {
        let price = cgPrices[coin.id]?.usd || 0;
        let change = cgPrices[coin.id]?.usd_24h_change || 0;

        // If CoinGecko failed, try Moralis
        if (!price && moralis) {
            try {
                const priceData = await moralis.fetchTokenPrice(coin.chainId, coin.address);
                price = priceData?.usdPrice || 0;
            } catch (e) {
                console.warn(`Moralis price failed for ${coin.symbol}:`, e);
            }
        }

        return {
            ...coin,
            quote: price,
            change: change.toFixed(2),
            contract_address: coin.address,
            contract_ticker_symbol: coin.symbol,
            contract_name: coin.name,
            logo_url: coin.logo,
            balance: "0"
        };
    }));

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
    type: 'native' | 'erc20' | 'internal';
    token_name?: string;
    token_address?: string;
    // Additional fields for internal transactions
    is_internal?: boolean;
    status?: string;
    gas_used?: string;
    gas_price?: string;
    gas_fee?: string;
    block_number?: number;
    confirmations?: number;
    usd_value?: string;
    balance_before?: string;
    balance_after?: string;
    transaction_type?: string;
}

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
    'ethereum': 1, 'eth': 1,
    'bsc': 56, 'binance': 56,
    'polygon': 137, 'matic': 137,
    'bitcoin': 0, 'btc': 0,
};

/**
 * Fetch internal (non-blockchain) transactions for a user — admin credits/debits
 * and Bitcoin deposits recorded directly in `user_transactions`. Shared by both
 * the unlocked-wallet portfolio path and the locked/no-unlock-required path so
 * these always show consistently regardless of wallet lock state.
 */
async function getInternalTransactionsForUser(
    supabase: Awaited<ReturnType<typeof import("@/utils/supabase/server").createClient>>,
    userId: string,
    filterChainId?: string | number,
): Promise<Transaction[]> {
    const { data: internalTxs, error } = await supabase
        .from("user_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Failed to fetch internal transactions:", error);
        return [];
    }

    return (internalTxs || [])
        .map((tx: any): Transaction | null => {
            const chainId = NETWORK_TO_CHAIN_ID[tx.network?.toLowerCase()] ?? 1;

            if (filterChainId && filterChainId !== 'all' && chainId !== Number(filterChainId)) {
                return null;
            }

            // Internal transactions store amount as actual value (e.g., "100" = 100 BTC),
            // so decimals is 0 to avoid dividing again on display.
            return {
                hash: tx.transaction_hash,
                from_address: tx.from_address,
                to_address: tx.to_address,
                value: tx.amount,
                block_timestamp: tx.timestamp || tx.created_at,
                chainId,
                symbol: tx.token_symbol || 'ETH',
                decimals: 0,
                type: 'internal' as const,
                token_name: tx.token_symbol,
                token_address: tx.token_address || undefined,
                status: tx.status,
                gas_used: tx.gas_used,
                gas_price: tx.gas_price,
                gas_fee: tx.gas_fee,
                block_number: tx.block_number,
                confirmations: tx.confirmations || 999999,
                usd_value: tx.usd_value,
                balance_before: tx.balance_before,
                balance_after: tx.balance_after,
                transaction_type: tx.transaction_type,
                is_internal: true,
            };
        })
        .filter((tx): tx is Transaction => tx !== null);
}

export async function getWalletHistory(address: string, filterChainId?: string | number): Promise<Transaction[]> {
    if (!address) return [];
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

    // Fetch blockchain transactions and internal (admin credit / BTC deposit) transactions in parallel
    const [blockchainTxs, formattedInternalTxs] = await Promise.all([
        getWalletHistory(address, filterChainId),
        getInternalTransactionsForUser(supabase, user.id, filterChainId),
    ]);

    // Merge and sort by timestamp (most recent first)
    const allTransactions = [...blockchainTxs, ...formattedInternalTxs].sort((a, b) => 
        new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime()
    );

    return { transactions: allTransactions, walletAddress: address };
}

export interface InternalTransaction extends Transaction {
    is_internal: true;
    status: string;
    gas_used?: string;
    gas_price?: string;
    gas_fee?: string;
    block_number?: number;
    confirmations?: number;
    usd_value?: string;
    balance_before?: string;
    balance_after?: string;
    transaction_type?: string;
}
