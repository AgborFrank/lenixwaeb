export type BankingCurrency = "USD" | "EUR" | "GBP";

export type TransferDirection =
  | "spot_to_funding"
  | "funding_to_spot"
  | "funding_to_bank"
  | "spot_to_bank";

export type TransferStatus = "completed" | "processing" | "review" | "failed";

export interface AssetBalance {
  symbol: string;
  name: string;
  location: "spot" | "funding";
  amount: number;
  priceUsd: number;
  usdValue: number;
  change24h: number;
}

export interface FiatBalance {
  currency: BankingCurrency;
  amount: number;
  usdValue: number;
  available: number;
}

export interface LinkedBankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountType: string;
  maskedNumber: string;
  currency: BankingCurrency;
  country: string;
  status: "verified" | "pending" | "rejected";
  isDefault: boolean;
  adminNotes?: string | null;
}

export interface BankingLimit {
  label: string;
  used: number;
  total: number;
  currency: BankingCurrency;
}

export interface TransferTimelineEvent {
  label: string;
  timestamp: string | null;
  status: "complete" | "current" | "upcoming" | "failed";
}

export interface TransferRecord {
  id: string;
  reference: string;
  direction: TransferDirection;
  asset: string;
  assetAmount: number;
  fiatCurrency: BankingCurrency;
  fiatAmount: number;
  feeUsd: number;
  status: TransferStatus;
  destination: string;
  createdAt: string;
  estimatedArrival: string;
  timeline: TransferTimelineEvent[];
}

export interface BankingOverview {
  profile: {
    accountName: string;
    accountTier: string;
    verificationStatus: "verified" | "pending";
    relationshipManager: string;
  };
  totalPortfolioUsd: number;
  spotBalanceUsd: number;
  fundingBalanceUsd: number;
  pendingSettlementUsd: number;
  assets: AssetBalance[];
  fiatBalances: FiatBalance[];
  bankAccounts: LinkedBankAccount[];
  limits: BankingLimit[];
  transactions: TransferRecord[];
}

export interface TransferRequest {
  direction: TransferDirection;
  asset: string;
  amount: number;
  payoutCurrency: BankingCurrency;
  bankAccountId?: string;
}

export interface TransferQuote {
  id: string;
  direction: TransferDirection;
  asset: string;
  assetAmount: number;
  assetPriceUsd: number;
  grossUsd: number;
  exchangeRate: number;
  payoutCurrency: BankingCurrency;
  platformFeeUsd: number;
  bankFeeUsd: number;
  totalFeeUsd: number;
  recipientAmount: number;
  estimatedArrival: string;
  expiresAt: string;
}

export type AssetPriceMap = Record<string, { symbol: string; priceUsd: number }>;
