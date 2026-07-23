"use client";

import { Building2, Check, Clock3, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { LinkedBankAccount, TransferQuote, TransferRecord } from "@/lib/banking/types";

interface TransferReviewProps {
  quote: TransferQuote;
  bankAccount?: LinkedBankAccount;
}

export function TransferReview({ quote, bankAccount }: TransferReviewProps) {
  const t = useTranslations("AccountBanking.review");
  const locale = useLocale();
  const formatUsd = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(value);
  const formatPayout = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: quote.payoutCurrency }).format(value);
  const isBankTransfer = quote.direction.endsWith("_to_bank");

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-center">
        <p className="text-xs uppercase tracking-widest text-zinc-500">{t("recipient_receives")}</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-white">
          {isBankTransfer ? formatPayout(quote.recipientAmount) : `${quote.recipientAmount.toLocaleString(locale)} ${quote.asset}`}
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          {t("from_amount", { amount: quote.assetAmount.toLocaleString(locale), asset: quote.asset })}
        </p>
      </div>
      {bankAccount && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-800 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-300">
            <Building2 className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white" title={bankAccount.bankName}>{bankAccount.bankName}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-500" title={`${bankAccount.accountName} · ${bankAccount.maskedNumber}`}> 
              {bankAccount.accountName} · {bankAccount.maskedNumber}
            </p>
          </div>
        </div>
      )}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{t("market_value")}</dt>
          <dd className="font-medium tabular-nums text-white">{formatUsd(quote.grossUsd)}</dd>
        </div>
        {isBankTransfer && (
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">{t("exchange_rate")}</dt>
            <dd className="font-medium tabular-nums text-white">
              {t("exchange_rate_value", { rate: quote.exchangeRate, currency: quote.payoutCurrency })}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{t("platform_fee")}</dt>
          <dd className="font-medium tabular-nums text-white">{formatUsd(quote.platformFeeUsd)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">{t("banking_fee")}</dt>
          <dd className="font-medium tabular-nums text-white">{formatUsd(quote.bankFeeUsd)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-800 pt-3">
          <dt className="text-zinc-400">{t("estimated_arrival")}</dt>
          <dd className="font-semibold text-white">{quote.estimatedArrival}</dd>
        </div>
      </dl>
      <div className="flex gap-2 rounded-lg bg-amber-500/10 px-3 py-3 text-xs leading-relaxed text-amber-100">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
        {t("authorization")}
      </div>
    </div>
  );
}

export function TransferSuccess({ transfer }: { transfer: TransferRecord }) {
  const t = useTranslations("AccountBanking.review");
  const isBankTransfer = transfer.direction.endsWith("_to_bank");

  return (
    <div className="py-2 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
        <Check className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="mt-4 text-xl font-semibold text-white">
        {isBankTransfer ? t("withdrawal_submitted") : t("transfer_completed")}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
        {isBankTransfer ? t("withdrawal_desc") : t("transfer_desc")}
      </p>
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-500">{t("reference")}</span>
          <span className="font-mono text-sm text-white">{transfer.reference}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-500">{t("status")}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-300">
            {isBankTransfer && <Clock3 className="h-3.5 w-3.5" aria-hidden />}
            {isBankTransfer ? t("processing") : t("completed")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-500">{t("destination")}</span>
          <span className="max-w-[60%] wrap-break-word text-right text-sm font-medium text-white">{transfer.destination}</span>
        </div>
      </div>
    </div>
  );
}
