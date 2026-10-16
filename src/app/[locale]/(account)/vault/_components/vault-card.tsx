"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { adminGlass } from "@/lib/admin-glass";
import { useSettings } from "@/app/[locale]/(account)/_providers/settings-provider";

interface VaultCardProps {
  totalBalance: number;
  change24h: number;
  isLoading?: boolean;
}

export function VaultCard({ totalBalance, change24h, isLoading }: VaultCardProps) {
  const t = useTranslations("AccountVault.card");
  const { formatCurrency } = useSettings();
  const [showBalance, setShowBalance] = useState(true);
  const isPositive = change24h >= 0;

  if (isLoading) {
    return <div className={`${adminGlass.surface} h-20 animate-pulse`} aria-busy="true" />;
  }

  return (
    <section className={`${adminGlass.surface} flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:py-4`}>
      <div>
        <p className="text-[11px] font-medium tracking-wide text-zinc-500">{t("total_value")}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-white sm:text-3xl">
            {showBalance ? formatCurrency(totalBalance) : "••••••"}
          </p>
          <button
            type="button"
            onClick={() => setShowBalance((current) => !current)}
            className="rounded-md p-1 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${
            isPositive
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {isPositive ? "+" : ""}
          {t("change_24h", { percent: change24h.toFixed(2) })}
        </span>
        <p className="text-xs text-zinc-500">{t("last_synced")}</p>
      </div>
    </section>
  );
}
