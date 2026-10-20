import type {
  ApiConfig,
  FinancialConfig,
  NotificationSettings,
  PlatformConfig,
  ServicesConfig,
  Web3Config,
} from "./types";

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  site_name: "Lenix Protocol",
  maintenance_mode: false,
  maintenance_message:
    "We are performing scheduled maintenance. Please check back shortly.",
  support_email: "support@lenixprotocol.com",
  recovery_email: "recovery@lenixprotocol.com",
  loan_email: "loan@lenixprotocol.com",
  privacy_email: "privacy@lenixprotocol.com",
  default_locale: "en",
  announcement_banner: null,
};

export const DEFAULT_SERVICES_CONFIG: ServicesConfig = {
  recovery: {
    enabled: true,
    public_intake: true,
    desk_email: "recovery@lenixprotocol.com",
    require_evidence: true,
  },
  refunds: {
    enabled: true,
    public_intake: true,
    desk_email: "recovery@lenixprotocol.com",
  },
  crypto_loans: {
    enabled: true,
    applications_open: true,
    desk_email: "loan@lenixprotocol.com",
  },
  banking: { enabled: true, desk_email: "support@lenixprotocol.com" },
  vault: { enabled: true },
  lenix_wallet: { enabled: true },
  assets: { enabled: true },
  send: { enabled: true },
  receive: { enabled: true },
  transactions: { enabled: true },
  token_sale: { enabled: true },
  stripe_checkout: { enabled: true },
};

export const DEFAULT_WEB3_CONFIG: Web3Config = {
  default_chain_id: 137,
  chains: {
    polygon: { enabled: true, chain_id: 137 },
    mainnet: { enabled: true, chain_id: 1 },
    sepolia: { enabled: true, chain_id: 11155111 },
    bsc: { enabled: true, chain_id: 56 },
  },
  contracts: {
    lnx_token: {},
    lnx_sale: {},
    usdt: {},
  },
  treasury: {
    evm_deposit: "",
    bitcoin_deposit: "",
    auto_transfer_destination: "",
  },
  confirmations: { evm: 12, bitcoin: 3 },
};

export const DEFAULT_FINANCIAL_CONFIG: FinancialConfig = {
  loan_interest_rate: 12,
  loan_min_amount: 100,
  loan_max_amount: 100000,
  loan_min_duration: 7,
  loan_max_duration: 365,
  collateral_ratio: 150,
  withdrawal_fee_percent: 0.5,
  min_withdrawal: 10,
  max_withdrawal: 50000,
  large_withdrawal_alert_usd: 10000,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email_new_user: true,
  email_new_loan: true,
  email_loan_status: true,
  email_recovery_request: true,
  email_refund_request: true,
  email_large_withdrawal: true,
  email_daily_summary: false,
  push_enabled: false,
  telegram_enabled: false,
  telegram_chat_id: "",
};

export const DEFAULT_API_CONFIG: ApiConfig = {
  api_keys: [],
  webhooks: [],
};

/** Keys persisted in `system_configs`. */
export const SYSTEM_CONFIG_KEYS = {
  platform: "platform_config",
  services: "services_config",
  web3: "web3_config",
  financial: "financial_config",
  notifications: "notification_settings",
  api: "api_config",
  /** @deprecated use `financial_config` + `platform_config` */
  legacy: "system_config",
} as const;

export type SystemConfigKey =
  (typeof SYSTEM_CONFIG_KEYS)[keyof typeof SYSTEM_CONFIG_KEYS];
