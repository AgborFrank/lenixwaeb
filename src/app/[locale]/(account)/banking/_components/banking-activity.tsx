"use client";

import { ArrowDownToLine, ArrowLeftRight, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { TransferDirection, TransferRecord } from "@/lib/banking/types";

interface BankingActivityProps {
  transactions: TransferRecord[];
  onSelect: (transaction: TransferRecord) => void;
}

const statusStyle = {
  completed: "bg-green-500/10 text-green-400",
  processing: "bg-amber-500/10 text-amber-300",
  review: "bg-amber-500/10 text-amber-300",
  failed: "bg-red-500/10 text-red-400",
} as const;

export function BankingActivity({ transactions, onSelect }: BankingActivityProps) {
  const t = useTranslations("AccountBanking.activity");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesStatus = status === "all" || transaction.status === status;
      const matchesQuery =
        !normalized ||
        transaction.reference.toLowerCase().includes(normalized) ||
        transaction.asset.toLowerCase().includes(normalized) ||
        transaction.destination.toLowerCase().includes(normalized);
      return matchesStatus && matchesQuery;
    });
  }, [query, status, transactions]);

  const statusLabel = (value: TransferRecord["status"]) => {
    if (value === "review") return t("status.under_review");
    return t(`status.${value}` as "status.completed" | "status.processing" | "status.failed");
  };

  return (
    <section className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
      <div className="flex flex-col gap-3 border-b border-zinc-800 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white">{t("title")}</h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <label className="relative flex-1 sm:w-56">
            <span className="sr-only">{t("search_label")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search_placeholder")}
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#FCD535]"
            />
          </label>
          <select
            aria-label={t("filter_label")}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-300 outline-none focus:border-[#FCD535]"
          >
            <option value="all">{t("filter_all")}</option>
            <option value="completed">{t("status.completed")}</option>
            <option value="processing">{t("status.processing")}</option>
            <option value="review">{t("status.review")}</option>
            <option value="failed">{t("status.failed")}</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-zinc-800 xl:hidden">
        {filtered.map((transaction) => {
          const Icon = transaction.direction.endsWith("_to_bank") ? ArrowDownToLine : ArrowLeftRight;
          return (
            <button
              key={transaction.id}
              type="button"
              onClick={() => onSelect(transaction)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FCD535]/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-zinc-300">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-white">
                  {t(`direction.${transaction.direction}` as `direction.${TransferDirection}`)}
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-500">{transaction.reference}</span>
                <span className="mt-1 block text-xs tabular-nums text-zinc-400">
                  {transaction.assetAmount.toLocaleString(locale)} {transaction.asset} · {" "}
                  {new Intl.NumberFormat(locale, { style: "currency", currency: transaction.fiatCurrency }).format(transaction.fiatAmount)}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyle[transaction.status]}`}>
                  {statusLabel(transaction.status)}
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-600" aria-hidden />
              </div>
            </button>
          );
        })}
      </div>

      <div className="hidden xl:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/70 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-5 py-3">{t("columns.transaction")}</th>
              <th className="px-5 py-3">{t("columns.amount")}</th>
              <th className="px-5 py-3">{t("columns.destination")}</th>
              <th className="px-5 py-3">{t("columns.status")}</th>
              <th className="px-5 py-3">{t("columns.date")}</th>
              <th className="w-12 px-3 py-3">
                <span className="sr-only">{t("columns.view")}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.map((transaction) => {
              const Icon = transaction.direction.endsWith("_to_bank") ? ArrowDownToLine : ArrowLeftRight;
              return (
                <tr key={transaction.id} className="transition-colors hover:bg-zinc-900/60">
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(transaction)}
                      className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-300">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-medium text-white">
                          {t(`direction.${transaction.direction}` as `direction.${TransferDirection}`)}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">{transaction.reference}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium tabular-nums text-white">
                      {transaction.assetAmount.toLocaleString(locale)} {transaction.asset}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {new Intl.NumberFormat(locale, { style: "currency", currency: transaction.fiatCurrency }).format(transaction.fiatAmount)}
                    </span>
                  </td>
                  <td className="max-w-48 truncate px-5 py-4 text-zinc-300">{transaction.destination}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle[transaction.status]}`}>
                      {statusLabel(transaction.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 tabular-nums text-zinc-400">{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(transaction.createdAt))}</td>
                  <td className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => onSelect(transaction)}
                      aria-label={t("view_transaction", { reference: transaction.reference })}
                      className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="px-4 py-10 sm:px-5 sm:py-12 text-center">
          <p className="text-sm font-medium text-white">{t("empty_title")}</p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">{t("empty_description")}</p>
        </div>
      )}
    </section>
  );
}
