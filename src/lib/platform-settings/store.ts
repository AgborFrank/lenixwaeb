import { createServiceRoleClient } from "@/utils/supabase/server";
import {
  DEFAULT_API_CONFIG,
  DEFAULT_FINANCIAL_CONFIG,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PLATFORM_CONFIG,
  DEFAULT_SERVICES_CONFIG,
  DEFAULT_WEB3_CONFIG,
  SYSTEM_CONFIG_KEYS,
  type SystemConfigKey,
} from "./defaults";
import type {
  ApiConfig,
  FinancialConfig,
  LegacySystemConfig,
  NotificationSettings,
  PlatformConfig,
  ServicesConfig,
  Web3Config,
} from "./types";

function mergePartial<T extends object>(defaults: T, partial: unknown): T {
  if (!partial || typeof partial !== "object") return defaults;
  return { ...defaults, ...(partial as Partial<T>) };
}

function legacyToFinancial(legacy: LegacySystemConfig): Partial<FinancialConfig> {
  return {
    loan_interest_rate: legacy.loan_interest_rate,
    loan_min_amount: legacy.loan_min_amount,
    loan_max_amount: legacy.loan_max_amount,
    loan_min_duration: legacy.loan_min_duration,
    loan_max_duration: legacy.loan_max_duration,
    collateral_ratio: legacy.collateral_ratio,
    withdrawal_fee_percent: legacy.withdrawal_fee_percent,
    min_withdrawal: legacy.min_withdrawal,
    max_withdrawal: legacy.max_withdrawal,
  };
}

function legacyToPlatform(legacy: LegacySystemConfig): Partial<PlatformConfig> {
  return {
    maintenance_mode: legacy.maintenance_mode,
    support_email: legacy.support_email,
  };
}

async function readRaw(key: string): Promise<unknown | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("system_configs")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error(`Failed to read system_configs.${key}:`, error);
    return null;
  }
  return data?.value ?? null;
}

export async function getPlatformConfig(): Promise<PlatformConfig> {
  const [platform, legacy] = await Promise.all([
    readRaw(SYSTEM_CONFIG_KEYS.platform),
    readRaw(SYSTEM_CONFIG_KEYS.legacy),
  ]);
  let merged = mergePartial(DEFAULT_PLATFORM_CONFIG, platform);
  if (legacy && typeof legacy === "object") {
    merged = mergePartial(merged, legacyToPlatform(legacy as LegacySystemConfig));
  }
  return merged;
}

export async function getServicesConfig(): Promise<ServicesConfig> {
  const raw = await readRaw(SYSTEM_CONFIG_KEYS.services);
  const partial = (raw && typeof raw === "object" ? raw : {}) as Partial<ServicesConfig>;
  return {
    ...DEFAULT_SERVICES_CONFIG,
    ...partial,
    recovery: { ...DEFAULT_SERVICES_CONFIG.recovery, ...partial.recovery },
    refunds: { ...DEFAULT_SERVICES_CONFIG.refunds, ...partial.refunds },
    crypto_loans: { ...DEFAULT_SERVICES_CONFIG.crypto_loans, ...partial.crypto_loans },
    banking: { ...DEFAULT_SERVICES_CONFIG.banking, ...partial.banking },
    vault: { ...DEFAULT_SERVICES_CONFIG.vault, ...partial.vault },
    lenix_wallet: { ...DEFAULT_SERVICES_CONFIG.lenix_wallet, ...partial.lenix_wallet },
    assets: { ...DEFAULT_SERVICES_CONFIG.assets, ...partial.assets },
    send: { ...DEFAULT_SERVICES_CONFIG.send, ...partial.send },
    receive: { ...DEFAULT_SERVICES_CONFIG.receive, ...partial.receive },
    transactions: { ...DEFAULT_SERVICES_CONFIG.transactions, ...partial.transactions },
    token_sale: { ...DEFAULT_SERVICES_CONFIG.token_sale, ...partial.token_sale },
    stripe_checkout: { ...DEFAULT_SERVICES_CONFIG.stripe_checkout, ...partial.stripe_checkout },
  };
}

export async function getWeb3Config(): Promise<Web3Config> {
  const raw = await readRaw(SYSTEM_CONFIG_KEYS.web3);
  const partial = (raw && typeof raw === "object" ? raw : {}) as Partial<Web3Config>;
  return {
    ...DEFAULT_WEB3_CONFIG,
    ...partial,
    chains: { ...DEFAULT_WEB3_CONFIG.chains, ...partial.chains },
    contracts: {
      lnx_token: {
        ...DEFAULT_WEB3_CONFIG.contracts.lnx_token,
        ...partial.contracts?.lnx_token,
      },
      lnx_sale: {
        ...DEFAULT_WEB3_CONFIG.contracts.lnx_sale,
        ...partial.contracts?.lnx_sale,
      },
      usdt: { ...DEFAULT_WEB3_CONFIG.contracts.usdt, ...partial.contracts?.usdt },
    },
    treasury: { ...DEFAULT_WEB3_CONFIG.treasury, ...partial.treasury },
    confirmations: { ...DEFAULT_WEB3_CONFIG.confirmations, ...partial.confirmations },
  };
}

export async function getFinancialConfig(): Promise<FinancialConfig> {
  const [financial, legacy] = await Promise.all([
    readRaw(SYSTEM_CONFIG_KEYS.financial),
    readRaw(SYSTEM_CONFIG_KEYS.legacy),
  ]);
  let merged = mergePartial(DEFAULT_FINANCIAL_CONFIG, financial);
  if (legacy && typeof legacy === "object") {
    merged = mergePartial(merged, legacyToFinancial(legacy as LegacySystemConfig));
  }
  return merged;
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const raw = await readRaw(SYSTEM_CONFIG_KEYS.notifications);
  return mergePartial(DEFAULT_NOTIFICATION_SETTINGS, raw);
}

export async function getApiConfig(): Promise<ApiConfig> {
  const raw = await readRaw(SYSTEM_CONFIG_KEYS.api);
  return mergePartial(DEFAULT_API_CONFIG, raw);
}

export async function getConfigByKey(key: SystemConfigKey): Promise<unknown> {
  switch (key) {
    case SYSTEM_CONFIG_KEYS.platform:
      return getPlatformConfig();
    case SYSTEM_CONFIG_KEYS.services:
      return getServicesConfig();
    case SYSTEM_CONFIG_KEYS.web3:
      return getWeb3Config();
    case SYSTEM_CONFIG_KEYS.financial:
      return getFinancialConfig();
    case SYSTEM_CONFIG_KEYS.notifications:
      return getNotificationSettings();
    case SYSTEM_CONFIG_KEYS.api:
      return getApiConfig();
    case SYSTEM_CONFIG_KEYS.legacy:
      return readRaw(key);
    default:
      return readRaw(key);
  }
}
