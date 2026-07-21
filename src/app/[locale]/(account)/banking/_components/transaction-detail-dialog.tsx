"use client";

import { Check, Clock3, Download, ShieldCheck, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TransferRecord } from "@/lib/banking/types";

interface TransactionDetailDialogProps {
  transaction: TransferRecord | null;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDialog({ transaction, onOpenChange }: TransactionDetailDialogProps) {
  const t = useTranslations("AccountBanking.detail");

  if (!transaction) return null;

  const formatMoney = (value: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

  const statusLabel = (status: TransferRecord["status"]) => {
    if (status === "review") return t("status.under_review");
    return t(`status.${status}` as "status.completed" | "status.processing" | "status.failed");
  };

  return (
    <Dialog open={Boolean(transaction)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 p-0 text-white sm:max-w-xl">
        <DialogHeader className="border-b border-zinc-800 px-5 py-5 text-left sm:px-6">
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {t("reference", { reference: transaction.reference })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-5 pb-6 sm:px-6">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-800 py-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{t("payout_amount")}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatMoney(transaction.fiatAmount, transaction.fiatCurrency)}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {transaction.assetAmount.toLocaleString()} {transaction.asset}
              </p>
            </div>
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200">
              {statusLabel(transaction.status)}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-zinc-500">{t("destination")}</dt>
              <dd className="mt-1 font-medium text-white">{transaction.destination}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">{t("estimated_arrival")}</dt>
              <dd className="mt-1 font-medium text-white">{transaction.estimatedArrival}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">{t("fees")}</dt>
              <dd className="mt-1 font-medium text-white">{formatMoney(transaction.feeUsd)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">{t("requested")}</dt>
              <dd className="mt-1 font-medium text-white">{new Date(transaction.createdAt).toLocaleString()}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              {t("timeline_title")}
            </h3>
            <ol className="mt-4 space-y-0">
              {transaction.timeline.map((event, index) => {
                const Icon =
                  event.status === "failed"
                    ? XCircle
                    : event.status === "complete"
                      ? Check
                      : event.status === "current"
                        ? Clock3
                        : ShieldCheck;
                return (
                  <li key={`${event.label}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < transaction.timeline.length - 1 && (
                      <span className="absolute left-4 top-8 h-[calc(100%-1rem)] w-px bg-zinc-800" />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        event.status === "complete"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : event.status === "current"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                            : event.status === "failed"
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-zinc-800 bg-zinc-900 text-zinc-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-medium text-white">{event.label}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{event.timestamp ?? t("pending")}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <Download className="h-4 w-4" aria-hidden />
            {t("download_receipt")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
