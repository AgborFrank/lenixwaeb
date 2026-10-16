"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Download,
  MessageCircle,
  FileText,
  Package,
  Truck,
  Info,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { REFUND_LIFECYCLES, REFUND_STATUSES } from "@/lib/refund/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

export interface RefundCaseRow {
  id: string;
  status: string;
  lifecycle: string;
  amount: string;
  asset: string;
  created_at: string;
  updated_at?: string | null;
  role: string;
  order_ref: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  country_phone_code?: string | null;
  counterparty_name?: string | null;
  payment_tx_hash?: string | null;
  chain?: string | null;
  incident_summary?: string | null;
  evidence_url?: string | null;
  evidence_filename?: string | null;
  refund_mode?: string | null;
  payout_destination?: string | null;
  admin_notes?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
}

interface RefundDeskProps {
  cases: RefundCaseRow[];
}

function statusClass(status: string) {
  if (status === "completed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "in_progress") return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  if (status === "rejected") return "border-red-500/30 bg-red-500/10 text-red-300";
  return "border-amber-500/30 bg-amber-500/10 text-amber-200";
}

function getExplorerTxUrl(blockchain?: string | null, txHash?: string | null): string | undefined {
  if (!txHash) return undefined;
  const chain = (blockchain || "").toLowerCase();
  if (chain.includes("eth")) return `https://etherscan.io/tx/${txHash}`;
  if (chain.includes("btc") || chain.includes("bitcoin"))
    return `https://www.blockchain.com/explorer/transactions/btc/${txHash}`;
  if (chain.includes("bsc") || chain.includes("binance"))
    return `https://bscscan.com/tx/${txHash}`;
  if (chain.includes("polygon") || chain.includes("matic"))
    return `https://polygonscan.com/tx/${txHash}`;
  if (chain.includes("tron") || chain.includes("trx"))
    return `https://tronscan.org/#/transaction/${txHash}`;
  if (chain.includes("sol") || chain.includes("solana"))
    return `https://solscan.io/tx/${txHash}`;
  if (txHash.startsWith("0x") && txHash.length === 66)
    return `https://etherscan.io/tx/${txHash}`;
  return undefined;
}

function CopyInline({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(label ? `${label} copied` : "Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded p-1 text-zinc-400 hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
    </button>
  );
}

export function RefundDesk({ cases }: RefundDeskProps) {
  const t = useTranslations("PurchaseRefund.Account");
  const [selectedCase, setSelectedCase] = useState<RefundCaseRow | null>(null);

  const metrics = useMemo(() => {
    const openCount = cases.filter((row) => row.status === "pending").length;
    const active = cases.filter((row) => row.status === "in_progress").length;
    const closed = cases.filter((row) => row.status === "completed" || row.status === "rejected").length;
    return { openCount, active, closed, files: cases.length };
  }, [cases]);

  const selectedCaseRef = selectedCase ? `REF-${selectedCase.id.slice(0, 8).toUpperCase()}` : "";
  const selectedTxUrl = selectedCase ? getExplorerTxUrl(selectedCase.chain, selectedCase.payment_tx_hash) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8 text-zinc-100">
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
            {/* Mobile View */}
            <ul className="divide-y divide-white/[0.06] sm:hidden">
              {cases.map((row) => (
                <li key={row.id} className="p-4 space-y-3 hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {row.amount} {row.asset}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        {row.order_ref || row.id.slice(0, 8)} · {roleLabel(t, row.role)}
                      </p>
                    </div>
                    <StatusBadge status={row.status} label={statusLabel(t, row.status)} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-zinc-500">
                      {lifecycleLabel(t, row.lifecycle)} · {new Date(row.created_at).toLocaleDateString()}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCase(row)}
                      className={`h-7 px-2.5 text-xs ${adminGlass.field} hover:bg-white/[0.08]`}
                    >
                      <Eye className="mr-1 size-3" />
                      View Details
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className={adminGlass.tableHead}>{t("case")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("amount")}</th>
                    <th className={adminGlass.tableHead}>{t("status")}</th>
                    <th className={adminGlass.tableHead}>{t("lifecycle")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>{t("opened")}</th>
                    <th className={`${adminGlass.tableHead} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => setSelectedCase(row)}
                    >
                      <td className={adminGlass.tableCell}>
                        <p className="font-medium text-white">{row.order_ref || row.id.slice(0, 8)}</p>
                        <p className="text-xs text-zinc-400">{roleLabel(t, row.role)}</p>
                      </td>
                      <td className={`${adminGlass.tableCell} text-right tabular-nums text-white font-medium`}>
                        {row.amount} {row.asset}
                      </td>
                      <td className={adminGlass.tableCell}>
                        <StatusBadge status={row.status} label={statusLabel(t, row.status)} />
                      </td>
                      <td className={`${adminGlass.tableCell} text-zinc-400`}>
                        {lifecycleLabel(t, row.lifecycle)}
                      </td>
                      <td className={`${adminGlass.tableCell} text-right text-xs text-zinc-400`}>
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td className={`${adminGlass.tableCell} text-right`}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCase(row);
                          }}
                          className={`h-7 px-2.5 text-xs ${adminGlass.field} hover:bg-white/[0.08]`}
                        >
                          <Eye className="mr-1 size-3" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* CASE DETAILS MODAL / DIALOG */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${adminGlass.dialog} border border-white/10 p-5 sm:p-6 text-white`}>
          {selectedCase && (
            <div className="space-y-6">
              <DialogHeader className="space-y-2 border-b border-white/[0.08] pb-4 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-zinc-300">
                      #{selectedCaseRef}
                    </span>
                    <CopyInline value={selectedCaseRef} label="Refund Claim ID" />
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={selectedCase.status}
                      label={statusLabel(t, selectedCase.status)}
                    />
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-zinc-300">
                      {lifecycleLabel(t, selectedCase.lifecycle)}
                    </span>
                  </div>
                </div>

                <DialogTitle className="text-xl font-semibold tracking-tight text-white">
                  Refund Claim
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Opened on {new Date(selectedCase.created_at).toLocaleDateString()} · Reference:{" "}
                  <span className="font-medium text-zinc-200">
                    {selectedCase.order_ref || selectedCase.id.slice(0, 8)}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {/* Core Financial & Counterparty Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
                    Claimed Amount
                  </span>
                  <p className="text-lg font-semibold text-white tracking-tight font-mono">
                    {selectedCase.amount} {selectedCase.asset}
                  </p>
                  <span className="text-xs text-zinc-400 block capitalize">
                    Filing Role: {roleLabel(t, selectedCase.role)}
                  </span>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
                    Counterparty / Store
                  </span>
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedCase.counterparty_name || "Not specified"}
                  </p>
                  <span className="text-xs text-zinc-400 block truncate">
                    Order Ref: {selectedCase.order_ref || "None"}
                  </span>
                </div>
              </div>

              {/* Transaction & Settlement Details */}
              <div className="rounded-xl border border-white/[0.08] bg-black/30 divide-y divide-white/[0.06] text-xs">
                {/* Network / Blockchain */}
                <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                  <span className="font-medium text-zinc-400">Payment Chain / Method</span>
                  <span className="col-span-2 text-zinc-200 font-medium">
                    {selectedCase.chain || "Fiat / Non-crypto"}
                  </span>
                </div>

                {/* Payment Proof / Transaction Hash */}
                {selectedCase.payment_tx_hash && (
                  <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                    <span className="font-medium text-zinc-400">Payment Proof / Hash</span>
                    <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-zinc-300 truncate select-all">
                        {selectedCase.payment_tx_hash}
                      </span>
                      <CopyInline value={selectedCase.payment_tx_hash} label="Payment proof" />
                      {selectedTxUrl && (
                        <a
                          href={selectedTxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-white transition-colors"
                          title="Open in block explorer"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Payout Destination */}
                {selectedCase.payout_destination && (
                  <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                    <span className="font-medium text-zinc-400">Payout Destination</span>
                    <span className="col-span-2 font-mono text-zinc-300 truncate">
                      {selectedCase.payout_destination}
                    </span>
                  </div>
                )}

                {/* Carrier & Tracking */}
                {(selectedCase.carrier || selectedCase.tracking_number) && (
                  <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                    <span className="font-medium text-zinc-400 flex items-center gap-1">
                      <Truck className="size-3.5 text-zinc-400" /> Shipping & Tracking
                    </span>
                    <span className="col-span-2 text-zinc-200 font-mono">
                      {selectedCase.carrier ? `${selectedCase.carrier} - ` : ""}
                      {selectedCase.tracking_number || "—"}
                    </span>
                  </div>
                )}

                {/* Contact Declarant */}
                <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                  <span className="font-medium text-zinc-400">Filer Information</span>
                  <span className="col-span-2 text-zinc-300">
                    {selectedCase.full_name || selectedCase.email || "Registered Account"}
                    {selectedCase.phone ? ` (${selectedCase.phone})` : ""}
                  </span>
                </div>
              </div>

              {/* Incident Summary */}
              {selectedCase.incident_summary && (
                <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 space-y-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">
                    Incident Summary & Context
                  </span>
                  <blockquote className="border-l-2 border-amber-500/40 pl-3 text-xs leading-relaxed text-zinc-300 italic">
                    "{selectedCase.incident_summary}"
                  </blockquote>
                </div>
              )}

              {/* Evidence Attachment */}
              {selectedCase.evidence_filename && (
                <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0 text-amber-400">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                        Attached Evidence
                      </span>
                      <p className="text-xs text-zinc-300 truncate font-mono">
                        {selectedCase.evidence_filename}
                      </p>
                    </div>
                  </div>
                  {selectedCase.evidence_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-amber-300 hover:text-white hover:bg-white/[0.06]"
                      asChild
                    >
                      <a href={selectedCase.evidence_url} target="_blank" rel="noopener noreferrer">
                        <Download className="size-3.5" /> Download
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {/* Admin Analyst Notes */}
              {selectedCase.admin_notes && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-3.5 text-xs space-y-1">
                  <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1">
                    <Info className="size-3" /> Claim Review Note:
                  </span>
                  <p className="text-zinc-200 leading-relaxed">{selectedCase.admin_notes}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                <p className="text-xs text-zinc-500">
                  Quote Claim <span className="font-mono text-zinc-300">#{selectedCaseRef}</span> for inquiries.
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCase(null)}
                    className={`flex-1 sm:flex-initial h-9 ${adminGlass.field}`}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1 sm:flex-initial h-9 gap-1.5 bg-white text-black hover:bg-zinc-200"
                    asChild
                  >
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-4" />
                      Contact Claim Officer
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
