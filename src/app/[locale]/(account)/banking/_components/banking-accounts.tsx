"use client";

import { useState } from "react";
import { Building2, Check, Clock3, Plus, ShieldCheck, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BankingLimit, LinkedBankAccount } from "@/lib/banking/types";
import { AddBankAccountDialog } from "./add-bank-account-dialog";

function StatusBadge({ status }: { status: LinkedBankAccount["status"] }) {
  const t = useTranslations("AccountBanking.accounts.status");

  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
        <Check className="h-3.5 w-3.5" aria-hidden />
        {t("verified")}
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
        <XCircle className="h-3.5 w-3.5" aria-hidden />
        {t("rejected")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300">
      <Clock3 className="h-3.5 w-3.5" aria-hidden />
      {t("pending")}
    </span>
  );
}

export function BankingAccounts({
  accounts,
  limits,
  onAccountAdded,
}: {
  accounts: LinkedBankAccount[];
  limits: BankingLimit[];
  onAccountAdded?: () => void;
}) {
  const t = useTranslations("AccountBanking.accounts");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">{t("linked_title")}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t("linked_subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            {t("add_account")}
          </button>
        </div>
        {accounts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-zinc-400">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-medium text-white">{t("empty_title")}</p>
            <p className="mt-1 text-sm text-zinc-500">{t("empty_description")}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-zinc-300">
                  <Building2 className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">{account.bankName}</p>
                    {account.isDefault && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase text-zinc-400">
                        {t("default")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {account.accountType} · {account.maskedNumber} · {account.currency}
                  </p>
                  {account.status === "rejected" && account.adminNotes && (
                    <p className="mt-1 text-xs text-red-400/80">{account.adminNotes}</p>
                  )}
                </div>
                <StatusBadge status={account.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <AddBankAccountDialog open={addOpen} onOpenChange={setAddOpen} onAdded={() => onAccountAdded?.()} />

      <section className="rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">{t("limits_title")}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t("limits_subtitle")}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <div className="space-y-5 p-5">
          {limits.map((limit) => {
            const percentage = Math.min(100, (limit.used / limit.total) * 100);
            return (
              <div key={limit.label}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-300">{limit.label}</span>
                  <span className="font-medium text-white">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: limit.currency, maximumFractionDigits: 0 }).format(limit.used)} /{" "}
                    {new Intl.NumberFormat("en-US", { notation: "compact", style: "currency", currency: limit.currency }).format(limit.total)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-[#FCD535]" style={{ width: `${percentage}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">
                  {t("remaining", { percent: (100 - percentage).toFixed(1) })}
                </p>
              </div>
            );
          })}
          <div className="rounded-lg bg-zinc-900 px-3 py-3 text-xs leading-relaxed text-zinc-400">
            {t("limits_note")}
          </div>
        </div>
      </section>
    </div>
  );
}
