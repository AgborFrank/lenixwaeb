"use client";

import { Fragment, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";

const TIMELINE = [
  {
    title: "Request submitted",
    description: "Your request has been securely received.",
  },
  {
    title: "Under review",
    description: "Our security team is analyzing your case.",
  },
  {
    title: "Verification",
    description: "Verifying wallet ownership and blockchain data.",
  },
  {
    title: "Recovery in progress",
    description: "Technical recovery operations are underway.",
  },
  {
    title: "Asset recovered",
    description: "Assets have been transferred to your wallet.",
  },
] as const;

function stepIndex(status: string) {
  const value = status.toLowerCase();
  if (value === "rejected") return -1;
  if (value === "completed") return 4;
  if (value === "processing") return 3;
  if (value === "verifying") return 2;
  if (value === "reviewing" || value === "in_progress") return 1;
  return 0;
}

function stepLabel(status: string) {
  const index = stepIndex(status);
  if (index < 0) return "Closed";
  return TIMELINE[index].title;
}

export interface RecoveryCaseRow {
  id: string;
  status: string;
  chain: string;
  trail: string;
  amount: string;
  currency: string;
  created_at: string;
}

interface RecoveryDeskProps {
  cases: RecoveryCaseRow[];
}

function statusClass(status: string) {
  const index = stepIndex(status);
  if (index === 4) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (index === 3) return "border-orange-400/30 bg-orange-400/10 text-orange-300";
  if (index === 2) return "border-violet-400/30 bg-violet-400/10 text-violet-300";
  if (index === 1) return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  if (index < 0) return "border-white/10 bg-white/[0.04] text-zinc-400";
  return "border-amber-500/30 bg-amber-500/10 text-amber-200";
}

function shortTrail(value: string) {
  if (value.length <= 18) return value;
  return `${value.slice(0, 8)}…${value.slice(-6)}`;
}

export function RecoveryDesk({ cases }: RecoveryDeskProps) {
  const t = useTranslations("AccountRecoveryServices.desk");

  const metrics = useMemo(() => {
    const openCount = cases.filter((row) => row.status === "pending").length;
    const active = cases.filter((row) =>
      ["in_progress", "reviewing", "verifying", "processing"].includes(row.status)
    ).length;
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
            <Link href="/refund-services">{t("refundLink")}</Link>
          </Button>
          <Button type="button" size="sm" className="h-9 bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/recovery-services/new">
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
              <Link href="/recovery-services/new">{t("newCase")}</Link>
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
                        {row.amount ? `${row.amount} ${row.currency}` : shortTrail(row.trail)}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
                        {shortTrail(row.trail)} · {row.chain || "—"}
                      </p>
                    </div>
                    <StatusBadge status={row.status} label={stepLabel(row.status)} />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{new Date(row.created_at).toLocaleDateString()}</p>
                  <RecoveryTimeline status={row.status} />
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className={adminGlass.tableHead}>{t("case")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("amount")}</th>
                    <th className={adminGlass.tableHead}>{t("chain")}</th>
                    <th className={adminGlass.tableHead}>{t("status")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("opened")}</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((row) => (
                    <Fragment key={row.id}>
                      <tr className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className={`${adminGlass.tableCell} font-mono text-xs text-white`}>{shortTrail(row.trail)}</td>
                        <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>
                          {row.amount ? `${row.amount} ${row.currency}` : "—"}
                        </td>
                        <td className={adminGlass.tableCell}>{row.chain || "—"}</td>
                        <td className={adminGlass.tableCell}>
                          <StatusBadge status={row.status} label={stepLabel(row.status)} />
                        </td>
                        <td className={`${adminGlass.tableCell} text-right text-xs text-zinc-500`}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="px-5 py-4" colSpan={5}>
                          <RecoveryTimeline status={row.status} />
                        </td>
                      </tr>
                    </Fragment>
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

function RecoveryTimeline({ status }: { status: string }) {
  const current = stepIndex(status);
  if (current < 0) {
    return <p className="text-sm text-zinc-400">Closed. This case will not continue.</p>;
  }

  return (
    <ol className="grid gap-3 sm:grid-cols-5">
      {TIMELINE.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "upcoming";
        return (
          <li key={step.title} className="flex gap-2 sm:block">
            <span
              className={`mt-1 size-2.5 shrink-0 rounded-full sm:mb-2 sm:mt-0 ${
                state === "upcoming" ? "bg-white/15" : "bg-[#F4E409]"
              }`}
            />
            <div>
              <p className={`text-sm font-medium ${state === "upcoming" ? "text-zinc-500" : "text-white"}`}>
                {step.title}
              </p>
              <p className={`mt-0.5 text-xs leading-5 ${state === "upcoming" ? "text-zinc-600" : "text-zinc-400"}`}>
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
