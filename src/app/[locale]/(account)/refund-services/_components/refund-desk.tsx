"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { REFUND_LIFECYCLES, REFUND_STATUSES } from "@/lib/refund/constants";
import { Button } from "@/components/ui/button";

export interface RefundCaseRow {
  id: string;
  status: string;
  lifecycle: string;
  amount: string;
  asset: string;
  created_at: string;
  role: string;
  order_ref: string | null;
}

interface RefundDeskProps {
  cases: RefundCaseRow[];
}

function statusClass(status: string) {
  if (status === "completed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "in_progress") return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  if (status === "rejected") return "border-white/10 bg-white/[0.04] text-zinc-400";
  return "border-amber-500/30 bg-amber-500/10 text-amber-200";
}

export function RefundDesk({ cases }: RefundDeskProps) {
  const t = useTranslations("PurchaseRefund.Account");

  const metrics = useMemo(() => {
    const openCount = cases.filter((row) => row.status === "pending").length;
    const active = cases.filter((row) => row.status === "in_progress").length;
    const closed = cases.filter((row) => row.status === "completed" || row.status === "rejected").length;
    return { openCount, active, closed, files: cases.length };
  }, [cases]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className={adminGlass.eyebrow}>{t("eyebrow")}</p>
          <h1 className={adminGlass.title}>{t("title")}</h1>
          <p className={adminGlass.description}>{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" className={`h-9 ${adminGlass.field}`} asChild>
            <Link href="/recovery-services">{t("stolenLink")}</Link>
          </Button>
          <Button type="button" size="sm" className="h-9 bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/refund-services/new">
              <Plus className="size-4" />
              {t("newCase")}
            </Link>
          </Button>
        </div>
      </header>

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label={t("metrics.open")}>
        <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] lg:grid-cols-4 lg:divide-y-0">
          {(
            [
              ["open", String(metrics.openCount)],
              ["active", String(metrics.active)],
              ["closed", String(metrics.closed)],
              ["files", String(metrics.files)],
            ] as const
          ).map(([key, value]) => (
            <div key={key} className="px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="text-[11px] font-medium tracking-wide text-zinc-500">{t(`metrics.${key}`)}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-white sm:text-xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${adminGlass.surface} overflow-hidden`} aria-label={t("yourCases")}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <h2 className="text-sm font-medium text-white">{t("yourCases")}</h2>
          <p className="text-xs tabular-nums text-zinc-500">{t("showing", { count: cases.length })}</p>
        </div>
        {cases.length === 0 ? (
          <div className="px-4 py-12 text-center sm:px-6">
            <p className="text-sm font-medium text-zinc-200">{t("emptyTitle")}</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">{t("emptyBody")}</p>
            <Button type="button" size="sm" className="mt-5 bg-white text-black hover:bg-zinc-200" asChild>
              <Link href="/refund-services/new">{t("newCase")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-white/[0.06] sm:hidden">
              {cases.map((row) => (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {row.amount} {row.asset}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {row.order_ref || row.id.slice(0, 8)} · {roleLabel(t, row.role)}
                      </p>
                    </div>
                    <StatusBadge status={row.status} label={statusLabel(t, row.status)} />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    {lifecycleLabel(t, row.lifecycle)} · {new Date(row.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className={adminGlass.tableHead}>{t("case")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("amount")}</th>
                    <th className={adminGlass.tableHead}>{t("status")}</th>
                    <th className={adminGlass.tableHead}>{t("lifecycle")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("opened")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className={adminGlass.tableCell}>
                        <p className="font-medium text-white">{row.order_ref || row.id.slice(0, 8)}</p>
                        <p className="text-xs text-zinc-500">{roleLabel(t, row.role)}</p>
                      </td>
                      <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>
                        {row.amount} {row.asset}
                      </td>
                      <td className={adminGlass.tableCell}>
                        <StatusBadge status={row.status} label={statusLabel(t, row.status)} />
                      </td>
                      <td className={`${adminGlass.tableCell} text-zinc-400`}>{lifecycleLabel(t, row.lifecycle)}</td>
                      <td className={`${adminGlass.tableCell} text-right text-xs text-zinc-500`}>
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${statusClass(status)}`}>
      {label}
    </span>
  );
}

function roleLabel(
  t: ReturnType<typeof useTranslations<"PurchaseRefund.Account">>,
  role: string,
) {
  if (role === "buyer") return t("open.roleBuyer");
  if (role === "seller") return t("open.roleSeller");
  return role;
}

function statusLabel(
  t: ReturnType<typeof useTranslations<"PurchaseRefund.Account">>,
  status: string,
) {
  if ((REFUND_STATUSES as readonly string[]).includes(status)) {
    return t(`statuses.${status as (typeof REFUND_STATUSES)[number]}`);
  }
  return status;
}

function lifecycleLabel(
  t: ReturnType<typeof useTranslations<"PurchaseRefund.Account">>,
  lifecycle: string,
) {
  if ((REFUND_LIFECYCLES as readonly string[]).includes(lifecycle)) {
    return t(`lifecycles.${lifecycle as (typeof REFUND_LIFECYCLES)[number]}`);
  }
  return lifecycle.replace(/_/g, " ");
}
