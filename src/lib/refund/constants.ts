export const REFUND_ROLES = ["buyer", "seller"] as const;
export const REFUND_STATUSES = ["pending", "in_progress", "completed", "rejected"] as const;
export const REFUND_MODES = ["instant", "standard", "reject"] as const;
export const REFUND_LIFECYCLES = [
  "intake",
  "underwriting",
  "terms_pending",
  "instant_paid",
  "awaiting_return",
  "in_transit",
  "received",
  "clawback_open",
  "settled",
  "rejected",
] as const;

export const REFUND_ASSETS = ["USD", "EUR", "GBP", "USDT", "USDC", "BTC", "ETH"] as const;
export const REFUND_CHAINS = [
  "BTC",
  "ETH",
  "SOL",
  "TRX",
  "BNB",
  "MATIC",
  "AVAX",
  "ARB",
  "BASE",
  "OTHER",
] as const;

export const MAX_EVIDENCE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_EVIDENCE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type RefundRole = (typeof REFUND_ROLES)[number];
export type RefundStatus = (typeof REFUND_STATUSES)[number];
export type RefundMode = (typeof REFUND_MODES)[number];
export type RefundLifecycle = (typeof REFUND_LIFECYCLES)[number];
