"use client";

import { ArrowDownToLine, ArrowLeftRight, Building2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BankingOverview, TransferDirection } from "@/lib/banking/types";

interface BankingSummaryProps {
  overview: BankingOverview;
  onTransfer: (direction: TransferDirection) => void;
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function BankingSummary({ overview, onTransfer }: BankingSummaryProps) {
  const t = useTranslations("AccountBanking.summary");
  const [balancesVisible, setBalancesVisible] = useState(true);
  const display = (value: number) => (balancesVisible ? currency.format(value) : "••••••");

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">{t("title")}</h1>
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
          <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTransfer("spot_to_funding")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
            {t("transfer")}
          </button>
          <button
            type="button"
            onClick={() => onTransfer("spot_to_bank")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FCD535] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden />
            {t("withdraw_to_bank")}
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="border-b border-zinc-800 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
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
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {display(overview.totalPortfolioUsd)}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-zinc-500">
              {t("account")} <span className="font-medium text-zinc-300">{overview.profile.accountName}</span>
            </span>
            <span className="text-zinc-500">
              {t("tier")} <span className="font-medium text-zinc-300">{overview.profile.accountTier}</span>
            </span>
            <span className="text-zinc-500">
              {t("relationship_manager")}{" "}
              <span className="font-medium text-zinc-300">{overview.profile.relationshipManager}</span>
            </span>
          </div>
        </div>
        <div className="grid divide-y divide-zinc-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <button
            type="button"
            onClick={() => onTransfer("spot_to_funding")}
            className="p-5 text-left transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FCD535]/50"
          >
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900">
                <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
              </span>
              {t("spot_wallet")}
            </span>
            <span className="mt-3 block text-xl font-semibold text-white">{display(overview.spotBalanceUsd)}</span>
            <span className="mt-1 block text-xs text-zinc-500">{t("spot_available")}</span>
          </button>
          <button
            type="button"
            onClick={() => onTransfer("funding_to_bank")}
            className="p-5 text-left transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FCD535]/50"
          >
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900">
                <Building2 className="h-3.5 w-3.5" aria-hidden />
              </span>
              {t("funding_wallet")}
            </span>
            <span className="mt-3 block text-xl font-semibold text-white">{display(overview.fundingBalanceUsd)}</span>
            <span className="mt-1 block text-xs text-zinc-500">{t("funding_available")}</span>
          </button>
          <div className="p-5">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-300">
                <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden />
              </span>
              {t("in_settlement")}
            </span>
            <span className="mt-3 block text-xl font-semibold text-white">{display(overview.pendingSettlementUsd)}</span>
            <span className="mt-1 block text-xs text-zinc-500">{t("pending_payouts")}</span>
          </div>
        </div>
      </section>
    </>
  );
}
