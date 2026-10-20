import { z } from "zod";
import { SYSTEM_CONFIG_KEYS } from "./defaults";

const email = z.string().email().or(z.literal(""));

const serviceToggle = z.object({
  enabled: z.boolean(),
  desk_email: email.optional(),
  public_intake: z.boolean().optional(),
});

export const platformConfigSchema = z.object({
  site_name: z.string().min(1).max(120),
  maintenance_mode: z.boolean(),
  maintenance_message: z.string().max(2000),
  support_email: z.string().email(),
  recovery_email: z.string().email(),
  loan_email: z.string().email(),
  privacy_email: z.string().email(),
  default_locale: z.string().min(2).max(10),
  announcement_banner: z.string().max(500).nullable(),
});

export const servicesConfigSchema = z.object({
  recovery: serviceToggle.extend({ require_evidence: z.boolean() }),
  refunds: serviceToggle,
  crypto_loans: serviceToggle.extend({ applications_open: z.boolean() }),
  banking: serviceToggle,
  vault: serviceToggle,
  lenix_wallet: serviceToggle,
  assets: serviceToggle,
  send: serviceToggle,
  receive: serviceToggle,
  transactions: serviceToggle,
  token_sale: serviceToggle,
  stripe_checkout: serviceToggle,
});

const chainKey = z.enum(["polygon", "mainnet", "sepolia", "bsc"]);

const chainToggle = z.object({
  enabled: z.boolean(),
  chain_id: z.number().int().positive(),
});

export const web3ConfigSchema = z.object({
  default_chain_id: z.number().int().positive(),
  chains: z.object({
    polygon: chainToggle,
    mainnet: chainToggle,
    sepolia: chainToggle,
    bsc: chainToggle,
  }),
  contracts: z.object({
    lnx_token: z.partialRecord(chainKey, z.string()).default({}),
    lnx_sale: z.partialRecord(chainKey, z.string()).default({}),
    usdt: z.partialRecord(chainKey, z.string()).default({}),
  }),
  treasury: z.object({
    evm_deposit: z.string().max(128),
    bitcoin_deposit: z.string().max(128),
    auto_transfer_destination: z.string().max(128),
  }),
  confirmations: z.object({
    evm: z.number().int().min(1).max(100),
    bitcoin: z.number().int().min(1).max(20),
  }),
});

export const financialConfigSchema = z.object({
  loan_interest_rate: z.number().min(0).max(100),
  loan_min_amount: z.number().min(0),
  loan_max_amount: z.number().min(0),
  loan_min_duration: z.number().int().min(1),
  loan_max_duration: z.number().int().min(1),
  collateral_ratio: z.number().min(100).max(500),
  withdrawal_fee_percent: z.number().min(0).max(100),
  min_withdrawal: z.number().min(0),
  max_withdrawal: z.number().min(0),
  large_withdrawal_alert_usd: z.number().min(0),
});

export const notificationSettingsSchema = z.object({
  email_new_user: z.boolean(),
  email_new_loan: z.boolean(),
  email_loan_status: z.boolean(),
  email_recovery_request: z.boolean(),
  email_refund_request: z.boolean(),
  email_large_withdrawal: z.boolean(),
  email_daily_summary: z.boolean(),
  push_enabled: z.boolean(),
  telegram_enabled: z.boolean(),
  telegram_chat_id: z.string().max(64),
});

export const apiConfigSchema = z.object({
  api_keys: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(120),
      key: z.string().min(8),
      created_at: z.string(),
      last_used: z.string().nullable(),
      permissions: z.array(z.string()),
    }),
  ),
  webhooks: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      events: z.array(z.string()),
      is_active: z.boolean(),
      created_at: z.string(),
    }),
  ),
});

const legacySystemConfigSchema = z.record(z.string(), z.unknown());

const schemaByKey: Record<string, z.ZodTypeAny> = {
  [SYSTEM_CONFIG_KEYS.platform]: platformConfigSchema,
  [SYSTEM_CONFIG_KEYS.services]: servicesConfigSchema,
  [SYSTEM_CONFIG_KEYS.web3]: web3ConfigSchema,
  [SYSTEM_CONFIG_KEYS.financial]: financialConfigSchema,
  [SYSTEM_CONFIG_KEYS.notifications]: notificationSettingsSchema,
  [SYSTEM_CONFIG_KEYS.api]: apiConfigSchema,
  [SYSTEM_CONFIG_KEYS.legacy]: legacySystemConfigSchema,
};

export const ALLOWED_CONFIG_KEYS = Object.keys(schemaByKey);

export function parseConfigValue(key: string, value: unknown) {
  const schema = schemaByKey[key];
  if (!schema) {
    return { success: false as const, error: "Unknown config key" };
  }
  const result = schema.safeParse(value);
  if (!result.success) {
    return {
      success: false as const,
      error: result.error.flatten().fieldErrors,
    };
  }
  return { success: true as const, data: result.data };
}
