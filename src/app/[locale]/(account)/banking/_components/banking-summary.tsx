"use client";

import { ArrowDownToLine, ArrowLeftRight, Building2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { BankingOverview, TransferDirection } from "@/lib/banking/types";

interface BankingSummaryProps {
  overview: BankingOverview;
  onTransfer: (direction: TransferDirection) => void;
}

export function BankingSummary({ overview, onTransfer }: BankingSummaryProps) {
  const t = useTranslations("AccountBanking.summary");
  const locale = useLocale();
  const [balancesVisible, setBalancesVisible] = useState(true);
  const display = (value: number) =>
    balancesVisible ? new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value) : "••••••";

  return (
    <>
      <header className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-white sm:text-xl lg:text-2xl xl:text-3xl">{t("title")}</h1>
            {overview.profile.verificationStatus === "verified" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {t("verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {t("verification_pending")}
              </span>
            )}
          </div>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onTransfer("spot_to_funding")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
            {t("transfer")}
          </button>
          <button
            type="button"
            onClick={() => onTransfer("spot_to_bank")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FCD535] px-4 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden />
            {t("withdraw_to_bank")}
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-0 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
            <span>{t("total_treasury")}</span>
            <button
              type="button"
              onClick={() => setBalancesVisible((value) => !value)}
              aria-label={balancesVisible ? t("hide_balances") : t("show_balances")}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
            >
              {balancesVisible ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          <p className="mt-2 text-3xl sm:text-3xl font-semibold tabular-nums tracking-tight text-white lg:text-4xl">
            {display(overview.totalPortfolioUsd)}
          </p>
          <div className="mt-3 flex flex-col gap-1.5 text-xs sm:mt-4 sm:flex-row sm:items-center sm:gap-5 sm:text-sm">
            <p className="min-w-0 truncate text-zinc-500" title={overview.profile.accountName}>
              {t("account")} <span className="font-medium text-zinc-300">{overview.profile.accountName}</span>
            </p>
            <p className="min-w-0 truncate text-zinc-500" title={overview.profile.accountTier}>
              {t("tier")} <span className="font-medium text-zinc-300">{overview.profile.accountTier}</span>
            </p>
            <p className="min-w-0 truncate text-zinc-500" title={overview.profile.relationshipManager}>
              {t("relationship_manager")} <span className="font-medium text-zinc-300">{overview.profile.relationshipManager}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap divide-y divide-zinc-800 sm:flex-row sm:divide-x sm:divide-y-0">
          <button
            type="button"
            onClick={() => onTransfer("spot_to_funding")}
            className="flex-1 p-2 sm:p-5 text-left transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FCD535]/50"
          >
            <span className="flex items-center gap-2 text-[11px] sm:text-xs font-medium  uppercase text-white">
            
              {t("spot_wallet")}
            </span>
            <span className="mt-2.5 sm:mt-3 block text-lg sm:text-xl font-semibold tabular-nums text-white">{display(overview.spotBalanceUsd)}</span>
            <span className="mt-1 block text-[10px] leading-3 text-zinc-500">{t("spot_available")}</span>
          </button>
          <button
            type="button"
            onClick={() => onTransfer("funding_to_bank")}
            className="flex-1 p-2 sm:p-5 text-left transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FCD535]/50"
          >
            <span className="flex items-center gap-2 text-[11px] sm:text-xs font-medium  uppercase text-white">
             
              {t("funding_wallet")}
            </span>
            <span className="mt-2.5 sm:mt-3 block text-lg sm:text-xl font-semibold tabular-nums text-white">{display(overview.fundingBalanceUsd)}</span>
            <span className="mt-1 block text-[10px] leading-3 text-zinc-500">{t("funding_available")}</span>
          </button>
          <div className="flex-1 p-2 sm:p-5">
            <span className="flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase text-white">
             
              {t("in_settlement")}
            </span>
            <span className="mt-2.5 sm:mt-3 block text-lg sm:text-xl font-semibold tabular-nums text-white">{display(overview.pendingSettlementUsd)}</span>
            <span className="mt-1 block text-[10px] leading-3 text-zinc-500">{t("pending_payouts")}</span>
          </div>
        </div>
      </section>
    </>
  );
}
