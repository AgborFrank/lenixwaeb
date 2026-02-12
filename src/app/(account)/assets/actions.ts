"use server";

import { createClient } from "@/utils/supabase/server";

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  avalanche: 43114,
  solana: 0, // not EVM
};

/** Token row from user_balances, normalized to the shape expected by Overview/AssetTable */
export interface DbHoldingToken {
  contract_ticker_symbol: string;
  contract_name: string;
  balance: string;
  quote: number;
  quote_rate: number;
  network: string;
  chainId: number;
  contract_decimals: number;
  logo_url?: string;
  contract_address?: string;
  quote_24h?: number;
  change?: string;
}

export interface DbHoldingsResult {
  tokens: DbHoldingToken[];
  totalBalanceUsd: number;
}

/**
 * Fetch the current user's token holdings from user_balances (Lenix wallet backend).
 * Works for web users whose wallets are in user_wallets with user_id = auth.uid().
 */
export async function getHoldingsFromDb(): Promise<DbHoldingsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { tokens: [], totalBalanceUsd: 0 };

  // Get wallets owned by this user (web app uses auth.uid() as user_id)
  const { data: wallets, error: walletsError } = await supabase
    .from("user_wallets")
    .select("id")
    .eq("user_id", user.id);

  if (walletsError || !wallets?.length) {
    return { tokens: [], totalBalanceUsd: 0 };
  }

  const walletIds = wallets.map((w) => w.id);
  const { data: rows, error } = await supabase
    .from("user_balances")
    .select("token_symbol, balance, usd_value, network")
    .in("wallet_id", walletIds);

  if (error || !rows?.length) {
    return { tokens: [], totalBalanceUsd: 0 };
  }

  const tokens: DbHoldingToken[] = rows.map((r) => {
    const balance = String(r.balance ?? "0");
    const usdValue = Number(r.usd_value) ?? 0;
    const balanceNum = parseFloat(balance) || 0;
    const quoteRate = balanceNum > 0 ? usdValue / balanceNum : 0;
    const network = (r.network || "ethereum").toLowerCase();
    const chainId = NETWORK_TO_CHAIN_ID[network] ?? 1;

    return {
      contract_ticker_symbol: (r.token_symbol || "?").toUpperCase(),
      contract_name: r.token_symbol || "Unknown",
      balance,
      quote: usdValue,
      quote_rate: quoteRate,
      network,
      chainId,
      contract_decimals: 18,
      contract_address: undefined,
      quote_24h: undefined,
      change: undefined,
    };
  });

  const totalBalanceUsd = tokens.reduce((acc, t) => acc + t.quote, 0);

  return { tokens, totalBalanceUsd };
}
