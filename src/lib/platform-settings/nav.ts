import type { ServicesConfig } from "./types";

/** Map account nav href → services_config key */
export const ACCOUNT_NAV_SERVICE_MAP: Record<string, keyof ServicesConfig | null> = {
  "/dashboard": null,
  "/vault": "vault",
  "/lenix-wallet": "lenix_wallet",
  "/banking": "banking",
  "/recovery-services": "recovery",
  "/refund-services": "refunds",
  "/crypto-loan": "crypto_loans",
  "/assets": "assets",
  "/send": "send",
  "/receive": "receive",
  "/transactions": "transactions",
  "/settings": null,
};

export function isAccountRouteEnabled(href: string, services: ServicesConfig): boolean {
  const key = ACCOUNT_NAV_SERVICE_MAP[href];
  if (!key) return true;
  return services[key]?.enabled ?? true;
}
