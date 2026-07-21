import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssetBalance,
  AssetPriceMap,
  BankingCurrency,
  BankingOverview,
  FiatBalance,
  LinkedBankAccount,
  TransferRecord,
  TransferStatus,
  TransferTimelineEvent,
} from "./types";

const STABLECOINS = new Set(["USDT", "USDC", "DAI", "BUSD", "TUSD", "USD"]);

const TOKEN_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "BNB",
  USDT: "Tether",
  USDC: "USD Coin",
  DAI: "Dai",
  POL: "Polygon",
  MATIC: "Polygon",
  SOL: "Solana",
  AVAX: "Avalanche",
  XRP: "XRP",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  TRX: "TRON",
  DOT: "Polkadot",
};

interface BalanceRow {
  token_symbol: string | null;
  balance: string | null;
  usd_value: string | number | null;
  network: string | null;
  admin_balance: string | number | null;
}

interface BankAccountRow {
  id: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  account_type: string;
  currency: string;
  country: string;
  status: string;
  is_default: boolean;
  admin_notes: string | null;
}

interface FiatBalanceRow {
  currency: string;
  balance: string | number | null;
}

function maskAccountNumber(accountNumber: string): string {
  const digitsOnly = accountNumber.replace(/\D/g, "") || accountNumber;
  const lastFour = digitsOnly.slice(-4) || accountNumber.slice(-4);
  return `••••${lastFour}`;
}

function buildBankAccounts(rows: BankAccountRow[]): LinkedBankAccount[] {
  return rows.map((row) => ({
    id: row.id,
    bankName: row.bank_name,
    accountName: row.account_holder_name,
    accountType: row.account_type,
    maskedNumber: maskAccountNumber(row.account_number),
    currency: (row.currency as BankingCurrency) ?? "USD",
    country: row.country,
    status: (row.status as LinkedBankAccount["status"]) ?? "pending",
    isDefault: row.is_default,
    adminNotes: row.admin_notes,
  }));
}

function buildFiatBalances(rows: FiatBalanceRow[]): FiatBalance[] {
  return rows
    .map((row) => {
      const amount = toNumber(row.balance);
      return {
        currency: (row.currency as BankingCurrency) ?? "USD",
        amount,
        usdValue: amount, // 1:1 placeholder until live FX rates are wired in for EUR/GBP
        available: amount,
      };
    })
    .filter((balance) => balance.amount > 0);
}

interface TransactionRow {
  transaction_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  amount: string | null;
  token_symbol: string | null;
  network: string | null;
  status: string | null;
  transaction_type: string | null;
  usd_value: string | number | null;
  timestamp: string | null;
  created_at: string | null;
}

function tokenName(symbol: string) {
  return TOKEN_NAMES[symbol.toUpperCase()] ?? symbol.toUpperCase();
}

function isStablecoin(symbol: string) {
  return STABLECOINS.has(symbol.toUpperCase());
}

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function truncateAddress(value: string | null): string {
  if (!value) return "External address";
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

function mapStatus(status: string | null): TransferStatus {
  const normalized = (status ?? "").toLowerCase();
  if (["confirmed", "completed", "success", "successful"].includes(normalized)) {
    return "completed";
  }
  if (["failed", "error", "rejected", "cancelled", "canceled"].includes(normalized)) {
    return "failed";
  }
  if (["review", "under_review"].includes(normalized)) {
    return "review";
  }
  return "processing";
}

function buildTimeline(status: TransferStatus, isReceive: boolean): TransferTimelineEvent[] {
  const opened: TransferTimelineEvent = {
    label: isReceive ? "Deposit detected" : "Transfer submitted",
    timestamp: "Recorded",
    status: "complete",
  };

  if (status === "completed") {
    return [
      opened,
      {
        label: isReceive ? "Credited to wallet" : "Settlement completed",
        timestamp: "Completed",
        status: "complete",
      },
    ];
  }

  if (status === "failed") {
    return [opened, { label: "Transfer failed", timestamp: null, status: "failed" }];
  }

  return [
    opened,
    { label: "Processing on network", timestamp: "In progress", status: "current" },
    { label: "Settlement completed", timestamp: null, status: "upcoming" },
  ];
}

function buildAssets(rows: BalanceRow[]): AssetBalance[] {
  const assets: AssetBalance[] = [];

  for (const row of rows) {
    const symbol = (row.token_symbol ?? "").toUpperCase();
    if (!symbol) continue;

    const usdValue = toNumber(row.usd_value);
    const amount = toNumber(row.admin_balance) > 0 ? toNumber(row.admin_balance) : toNumber(row.balance);

    // Skip empty holdings
    if (usdValue <= 0 && amount <= 0) continue;

    const priceUsd = amount > 0 ? usdValue / amount : 0;

    assets.push({
      symbol,
      name: tokenName(symbol),
      location: isStablecoin(symbol) ? "funding" : "spot",
      amount,
      priceUsd,
      usdValue,
      change24h: 0,
    });
  }

  return assets.sort((a, b) => b.usdValue - a.usdValue);
}

function buildTransactions(rows: TransactionRow[]): TransferRecord[] {
  return rows.map((row) => {
    const type = (row.transaction_type ?? "").toLowerCase();
    const isReceive = type === "receive" || type === "deposit" || type === "credit";
    const status = mapStatus(row.status);
    const hash = row.transaction_hash ?? crypto.randomUUID();
    const reference = `LNX-${hash.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`;
    const createdAt = row.timestamp ?? row.created_at ?? new Date().toISOString();

    return {
      id: hash,
      reference,
      direction: isReceive ? "funding_to_spot" : "spot_to_bank",
      asset: (row.token_symbol ?? "").toUpperCase(),
      assetAmount: toNumber(row.amount),
      fiatCurrency: "USD" as BankingCurrency,
      fiatAmount: toNumber(row.usd_value),
      feeUsd: 0,
      status,
      destination: isReceive ? "Spot wallet" : truncateAddress(row.to_address),
      createdAt,
      estimatedArrival: status === "completed" ? "Completed" : "Processing",
      timeline: buildTimeline(status, isReceive),
    };
  });
}

export function buildAssetPriceMap(assets: AssetBalance[]): AssetPriceMap {
  const map: AssetPriceMap = {};
  for (const asset of assets) {
    if (!map[asset.symbol] && asset.priceUsd > 0) {
      map[asset.symbol] = { symbol: asset.symbol, priceUsd: asset.priceUsd };
    }
  }
  return map;
}

export async function getBankingOverviewForUser(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | null,
): Promise<BankingOverview> {
  const [{ data: balanceRows }, { data: transactionRows }, { data: onboarding }, { data: bankAccountRows }, { data: fiatBalanceRows }] =
    await Promise.all([
      supabase
        .from("user_balances")
        .select("token_symbol, balance, usd_value, network, admin_balance")
        .eq("user_id", userId),
      supabase
        .from("user_transactions")
        .select(
          "transaction_hash, from_address, to_address, amount, token_symbol, network, status, transaction_type, usd_value, timestamp, created_at",
        )
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(50),
      supabase
        .from("web_onboarding")
        .select("details, step_completed")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_bank_accounts")
        .select("id, bank_name, account_holder_name, account_number, account_type, currency, country, status, is_default, admin_notes")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("user_fiat_balances")
        .select("currency, balance")
        .eq("user_id", userId),
    ]);

  const assets = buildAssets((balanceRows ?? []) as BalanceRow[]);
  const transactions = buildTransactions((transactionRows ?? []) as TransactionRow[]);
  const bankAccounts = buildBankAccounts((bankAccountRows ?? []) as BankAccountRow[]);
  const fiatBalances = buildFiatBalances((fiatBalanceRows ?? []) as FiatBalanceRow[]);

  const spotBalanceUsd = assets
    .filter((asset) => asset.location === "spot")
    .reduce((sum, asset) => sum + asset.usdValue, 0);
  const fundingBalanceUsd = assets
    .filter((asset) => asset.location === "funding")
    .reduce((sum, asset) => sum + asset.usdValue, 0);
  const totalPortfolioUsd = spotBalanceUsd + fundingBalanceUsd;
  const pendingSettlementUsd = transactions
    .filter((tx) => tx.status === "processing" || tx.status === "review")
    .reduce((sum, tx) => sum + tx.fiatAmount, 0);

  const onboardingDetails = (onboarding?.details ?? {}) as Record<string, unknown>;
  const accountName =
    (typeof onboardingDetails.name === "string" && onboardingDetails.name.trim()) ||
    userEmail ||
    "Lenix Account";

  const verificationStatus: "verified" | "pending" =
    (onboarding?.step_completed ?? 0) >= 2 || totalPortfolioUsd > 0 ? "verified" : "pending";

  const roundedTotal = Math.round((totalPortfolioUsd + Number.EPSILON) * 100) / 100;

  return {
    profile: {
      accountName,
      accountTier: roundedTotal >= 250000 ? "Enterprise" : "Business",
      verificationStatus,
      relationshipManager: "Lenix Treasury Desk",
    },
    totalPortfolioUsd: roundedTotal,
    spotBalanceUsd: Math.round((spotBalanceUsd + Number.EPSILON) * 100) / 100,
    fundingBalanceUsd: Math.round((fundingBalanceUsd + Number.EPSILON) * 100) / 100,
    pendingSettlementUsd: Math.round((pendingSettlementUsd + Number.EPSILON) * 100) / 100,
    assets,
    fiatBalances,
    bankAccounts,
    limits: [
      { label: "Daily bank withdrawal", used: 0, total: 250000, currency: "USD" },
      { label: "Monthly bank withdrawal", used: 0, total: 2000000, currency: "USD" },
    ],
    transactions,
  };
}
