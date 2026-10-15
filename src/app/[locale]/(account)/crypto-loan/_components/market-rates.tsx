"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";

export interface LoanPlan {
  id: number;
  name: string;
  ltv: string | number;
  interest_rate: string | number;
}

export function MarketRates({ loanTypes }: { loanTypes: LoanPlan[] }) {
  const t = useTranslations("AccountCryptoLoan");

  return (
    <section className={`${adminGlass.surface} overflow-hidden`} aria-label={t("desk.markets")}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <h2 className="text-sm font-medium text-white">{t("desk.markets")}</h2>
        <p className="text-xs text-zinc-500">{t("market_rates.available_plans")}</p>
      </div>
      {loanTypes.length === 0 ? (
        <p className="px-5 py-8 text-sm text-zinc-500">{t("market_rates.available_plans")}</p>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {loanTypes.map((plan) => (
            <li key={plan.id}>
              <Link
                href="/crypto-loan?mode=apply"
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{plan.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{t("market_rates.ltv", { ltv: plan.ltv })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-white">{plan.interest_rate}%</p>
                  <p className="text-[11px] text-zinc-500">{t("market_rates.interest_rate")}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
