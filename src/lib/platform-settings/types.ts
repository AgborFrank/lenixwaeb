export interface PlatformConfig {
  site_name: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  support_email: string;
  recovery_email: string;
  loan_email: string;
  privacy_email: string;
  default_locale: string;
  announcement_banner: string | null;
}

export interface ServiceToggle {
  enabled: boolean;
  desk_email?: string;
  public_intake?: boolean;
}

export interface ServicesConfig {
  recovery: ServiceToggle & { require_evidence: boolean };
  refunds: ServiceToggle;
  crypto_loans: ServiceToggle & { applications_open: boolean };
  banking: ServiceToggle;
  vault: ServiceToggle;
  lenix_wallet: ServiceToggle;
  assets: ServiceToggle;
  send: ServiceToggle;
  receive: ServiceToggle;
  transactions: ServiceToggle;
  token_sale: ServiceToggle;
  stripe_checkout: ServiceToggle;
}

export type Web3ChainKey = "polygon" | "mainnet" | "sepolia" | "bsc";

export interface Web3Config {
  default_chain_id: number;
  chains: Record<Web3ChainKey, { enabled: boolean; chain_id: number }>;
  contracts: {
    lnx_token: Partial<Record<Web3ChainKey, string>>;
    lnx_sale: Partial<Record<Web3ChainKey, string>>;
    usdt: Partial<Record<Web3ChainKey, string>>;
  };
  treasury: {
    evm_deposit: string;
    bitcoin_deposit: string;
    auto_transfer_destination: string;
  };
  confirmations: { evm: number; bitcoin: number };
}

export interface FinancialConfig {
  loan_interest_rate: number;
  loan_min_amount: number;
  loan_max_amount: number;
  loan_min_duration: number;
  loan_max_duration: number;
  collateral_ratio: number;
  withdrawal_fee_percent: number;
  min_withdrawal: number;
  max_withdrawal: number;
  large_withdrawal_alert_usd: number;
}

export interface NotificationSettings {
  email_new_user: boolean;
  email_new_loan: boolean;
  email_loan_status: boolean;
  email_recovery_request: boolean;
  email_refund_request: boolean;
  email_large_withdrawal: boolean;
  email_daily_summary: boolean;
  push_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  permissions: string[];
}

export interface WebhookRecord {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
}

export interface ApiConfig {
  api_keys: ApiKeyRecord[];
  webhooks: WebhookRecord[];
}

export interface LegacySystemConfig {
  loan_interest_rate?: number;
  loan_min_amount?: number;
  loan_max_amount?: number;
  loan_min_duration?: number;
  loan_max_duration?: number;
  collateral_ratio?: number;
  withdrawal_fee_percent?: number;
  min_withdrawal?: number;
  max_withdrawal?: number;
  maintenance_mode?: boolean;
  support_email?: string;
}
