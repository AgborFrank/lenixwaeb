"use client";

import { Info, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LoanOverview() {
  const t = useTranslations("AccountCryptoLoan.overview");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all hover:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-400">
              {t("total_borrowed")}
              <InfoIcon tooltip={t("total_borrowed_tooltip")} />
            </span>
            <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">$12,450.00</h3>
            <p className="text-xs text-zinc-500">
              {t("current_interest")}: <span className="text-red-400">+ $42.15</span>
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all hover:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-400">
              {t("collateral_value")}
              <InfoIcon tooltip={t("collateral_tooltip")} />
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">$45,200.00</h3>
            <p className="text-xs text-zinc-500">
              {t("ltv_label")}: <span className="text-emerald-400">27.5%</span> ({t("low_risk")})
            </p>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all hover:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-400">
              {t("health_factor")}
              <InfoIcon tooltip={t("health_tooltip")} />
            </span>
            <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-emerald-400">2.45</h3>
              <span className="text-sm font-medium text-zinc-500">{t("safe")}</span>
            </div>
            <div className="space-y-1">
              <Progress
                value={75}
                className="h-1.5 bg-zinc-800"
                indicatorColor="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
              />
              <div className="flex justify-between font-mono text-[10px] text-zinc-600">
                <span>{t("liquidated")}</span>
                <span>{t("safe_threshold")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 cursor-help text-zinc-600 transition-colors hover:text-zinc-400" />
        </TooltipTrigger>
        <TooltipContent className="border-zinc-800 bg-zinc-900 text-xs text-zinc-400">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
