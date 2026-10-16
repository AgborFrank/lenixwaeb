"use client";

import { useMemo, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  FileText,
  Printer,
  CheckCircle2,
  XCircle,
  Download,
  Info,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { CopyBadge } from "./copy-badge";

const TELEGRAM_URL = "https://t.me/Verified_protocol";

interface DashboardViewProps {
  userEmail: string;
  onboarding: {
    id?: string;
    user_id: string;
    service_type: string;
    details: Record<string, any> | null;
    step_completed: number;
    created_at: string;
    updated_at: string;
    status: string;
    admin_notes?: string | null;
    reviewed_at?: string | null;
  };
  labels: {
    statusTitle: string;
    receivedTitle: string;
    receivedDesc: string;
    reviewTitle: string;
    reviewDesc: string;
    submittedDetails: string;
    serviceType: string;
    serviceTypeLabel: string;
    contactSupport: string;
    supportTitle: string;
    supportDesc: string;
  };
}

type NormalizedStatus = "pending" | "in_progress" | "completed" | "rejected";

function normalizeStatus(status?: string | null): NormalizedStatus {
  const s = (status || "").toLowerCase().trim();
  if (["completed", "approved", "settled", "resolved", "verified"].includes(s)) return "completed";
  if (["in_progress", "under_review", "reviewing", "investigating"].includes(s)) return "in_progress";
  if (["rejected", "declined", "closed"].includes(s)) return "rejected";
  return "pending";
}

function getExplorerTxUrl(blockchain?: string, txHash?: string): string | undefined {
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
  return `https://etherscan.io/tx/${txHash}`;
}

function formatAmount(amount?: string | number, currency?: string): string {
  if (!amount) return "--";
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  const curr = (currency || "USD").toUpperCase();
  if (isNaN(num)) return `${amount} ${curr}`;
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${curr}`;
}

export function DashboardView({
  userEmail,
  onboarding,
  labels,
}: DashboardViewProps) {
  const router = useRouter();

  // Auto-refresh when admin updates status
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  const serviceType = onboarding.service_type || "recovery";
  const isRecovery = serviceType === "recovery";
  const isRefund = serviceType === "refund";
  const isBanking = serviceType === "banking";
  const isLoan = serviceType === "loan";

  const details = onboarding.details || {};
  const caseId = (onboarding.id || onboarding.user_id || "7F83B1A8").slice(0, 8).toUpperCase();
  const caseRef = `LEN-${serviceType.slice(0, 3).toUpperCase()}-${caseId}`;

  const formattedDate = useMemo(() => {
    try {
      return new Date(onboarding.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recent";
    }
  }, [onboarding.created_at]);

  const rawTxHash = details.transaction_hash || details.payment_tx_hash;
  const blockchain = details.blockchain || (isRecovery ? "Ethereum" : undefined);
  const amountVal = details.amount_stolen || details.amount || details.loan_amount;
  const currencyVal = details.currency || (isRecovery ? "USDT" : "USD");
  const incidentSummary = details.incident_summary || details.notes;
  const declarantName = details.name || details.counterparty_name;
  const phoneVal = details.phone_number
    ? `${details.country_phone_code || ""} ${details.phone_number}`.trim()
    : undefined;
  const evidenceFile = details.evidence;
  const evidenceUrl = details.evidence_url;

  const explorerUrl = getExplorerTxUrl(blockchain, rawTxHash);

  const normalized = normalizeStatus(onboarding.status);

  // Overall status labels & classes
  const statusLabel =
    normalized === "completed"
      ? "Case Resolved & Approved"
      : normalized === "in_progress"
        ? "Investigation In Progress"
        : normalized === "rejected"
          ? "Case Closed / Declined"
          : "Application Pending Review";

  const statusPillClass =
    normalized === "completed"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : normalized === "in_progress"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
        : normalized === "rejected"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Stepper connection tracks
  const line1to2Class =
    normalized === "in_progress" || normalized === "completed" || normalized === "rejected"
      ? "bg-emerald-500"
      : "bg-white/[0.08]";

  const line2to3Class =
    normalized === "completed"
      ? "bg-emerald-500"
      : normalized === "rejected"
        ? "bg-red-500/50"
        : "bg-white/[0.08]";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-zinc-100">
      {/* 1. CLEAN ENTERPRISE HEADER */}
      <header className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-semibold text-zinc-400">
              Case #{caseRef}
            </span>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusPillClass}`}>
              <span className="mr-1.5 size-1.5 rounded-full bg-current" />
              {statusLabel}
            </span>
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {labels.statusTitle || "Case Overview"}
          </h1>
          <p className="text-xs text-zinc-400 sm:text-sm">
            Submitted on {formattedDate} • Track: <span className="text-zinc-200 capitalize">{labels.serviceTypeLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className={`h-9 ${adminGlass.field} hover:bg-white/[0.06]`}
          >
            <Printer className="size-4" />
            <span className="hidden sm:inline">Print Summary</span>
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 border border-white/20 bg-white text-black hover:bg-zinc-200"
            asChild
          >
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              Contact Case Officer
            </a>
          </Button>
        </div>
      </header>

      {/* 2. CORE KEY PARAMETERS */}
      <section className={`${adminGlass.surface} divide-y divide-white/[0.06] sm:divide-y-0 sm:grid sm:grid-cols-3 sm:divide-x`} aria-label="Key Case Parameters">
        <div className="p-4 sm:p-5 space-y-1">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            Service Track
          </p>
          <p className="text-sm font-semibold text-white capitalize">{labels.serviceTypeLabel}</p>
          <p className="text-xs text-zinc-400">
            {isRecovery
              ? "Asset Recovery & Forensics"
              : isRefund
                ? "Commercial Dispute Desk"
                : isBanking
                  ? "Corporate Settlement"
                  : "Credit Facility"}
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-1">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            {isRecovery ? "Reported Loss / Claim" : isLoan ? "Requested Principal" : "Disputed Amount"}
          </p>
          <p className="text-sm font-semibold text-white font-mono">
            {formatAmount(amountVal, currencyVal)}
          </p>
          <p className="text-xs text-zinc-400">
            {blockchain ? `Network: ${blockchain}` : "Subject to ledger verification"}
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-1">
          <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
            Investigation Status
          </p>
          <p className="text-sm font-semibold text-white flex items-center gap-1.5">
            {normalized === "completed" && <CheckCircle2 className="size-3.5 text-emerald-400" />}
            {normalized === "in_progress" && <Clock className="size-3.5 text-amber-400" />}
            {normalized === "pending" && <Clock className="size-3.5 text-zinc-400" />}
            {normalized === "rejected" && <XCircle className="size-3.5 text-red-400" />}
            {statusLabel}
          </p>
          <p className="text-xs text-zinc-400">Assigned: Forensics Intake Desk</p>
        </div>
      </section>

      {/* 3. TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* MAIN COLUMN (8 COLS) */}
        <div className="space-y-6 lg:col-span-8">
          {/* A. DYNAMIC INVESTIGATION MILESTONES */}
          <section className={`${adminGlass.surface} p-5 sm:p-6 space-y-6`} aria-label="Investigation Timeline">
            <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white sm:text-base">
                  Investigation Milestones
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Live operational stages updated directly by the case review desk.
                </p>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${statusPillClass}`}>
                {statusLabel}
              </span>
            </div>

            <div className="relative pl-6 space-y-6">
              {/* Connector line between Step 1 and Step 2 */}
              <div className={`absolute left-2.5 top-3 h-[42%] w-0.5 transition-colors duration-300 ${line1to2Class}`} />
              {/* Connector line between Step 2 and Step 3 */}
              <div className={`absolute left-2.5 top-[50%] bottom-3 w-0.5 transition-colors duration-300 ${line2to3Class}`} />

              {/* Milestone 1: Intake Received (Always completed when user is on dashboard) */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-400">
                  <CheckCircle2 className="size-3" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{labels.receivedTitle}</h3>
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-300">
                      Logged
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 ml-auto">{formattedDate}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {labels.receivedDesc}
                  </p>
                </div>
              </div>

              {/* Milestone 2: Technical Review & Investigation */}
              <div className="relative">
                {normalized === "pending" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-zinc-400">
                      <Clock className="size-3" />
                    </div>
                    <div className="space-y-1.5 rounded-lg border border-white/[0.08] bg-black/20 p-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-300">Stage 02: Awaiting Technical Review</h3>
                        <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                          In Queue
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Your submission is queued in the intake system. An assigned forensics analyst will begin review within the standard 24–48 hour turnaround window.
                      </p>
                    </div>
                  </>
                )}

                {normalized === "in_progress" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-amber-500/50 bg-amber-950 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                      <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </div>
                    <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/[0.04] p-3.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-amber-200">Stage 02: Technical Review & Investigation</h3>
                        <span className="rounded border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          Active Investigation
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {labels.reviewDesc || "Forensic specialists are analyzing transaction trails, smart contract interactions, and coordinating with exchange compliance desks."}
                      </p>

                      {onboarding.admin_notes && (
                        <div className="mt-2.5 rounded border border-amber-500/30 bg-black/50 p-2.5 text-xs space-y-1">
                          <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                            <Info className="size-3" /> Case Analyst Update:
                          </span>
                          <p className="text-zinc-200 leading-relaxed">{onboarding.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {normalized === "completed" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950 text-emerald-400">
                      <CheckCircle2 className="size-3" />
                    </div>
                    <div className="space-y-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.02] p-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-emerald-200">Stage 02: Technical Review Concluded</h3>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                          Verified & Closed
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Forensic analysis and investigation concluded with positive evidentiary verification.
                      </p>
                      {onboarding.admin_notes && (
                        <div className="mt-2 rounded border border-white/10 bg-black/40 p-2 text-xs text-zinc-300">
                          <span className="text-[11px] font-medium text-zinc-400 block mb-0.5">Analyst Summary:</span>
                          {onboarding.admin_notes}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {normalized === "rejected" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-zinc-500/40 bg-zinc-900 text-zinc-400">
                      <CheckCircle2 className="size-3" />
                    </div>
                    <div className="space-y-1.5 rounded-lg border border-white/[0.08] bg-black/20 p-3.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-300">Stage 02: Technical Review Concluded</h3>
                        <span className="rounded border border-zinc-500/30 bg-zinc-500/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                          Concluded
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Case investigation completed.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Milestone 3: Resolution & Final Determination */}
              <div className="relative">
                {normalized === "pending" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-600">
                      <span className="size-1.5 rounded-full bg-zinc-700" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-400">Stage 03: Resolution & Settlement</h3>
                        <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                          Upcoming
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Final evidentiary determination, dispute arbitration, or restitution payout.
                      </p>
                    </div>
                  </>
                )}

                {normalized === "in_progress" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-600">
                      <span className="size-1.5 rounded-full bg-zinc-700" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-400">Stage 03: Resolution & Settlement</h3>
                        <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                          Pending Findings
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Final restitution scheduling or dispute determination will be issued upon conclusion of the active investigation.
                      </p>
                    </div>
                  </>
                )}

                {normalized === "completed" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="size-3" />
                    </div>
                    <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.05] p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-emerald-200">Stage 03: Case Resolved & Approved</h3>
                        <span className="rounded border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        Your case has been successfully resolved and approved. Settlement documents, recovery allocations, or facility accounts have been provisioned.
                      </p>
                      {onboarding.admin_notes && (
                        <div className="mt-2.5 rounded border border-emerald-500/30 bg-black/50 p-2.5 text-xs text-emerald-300">
                          <span className="text-[11px] font-medium text-emerald-400 block mb-0.5">Settlement Notice:</span>
                          <p className="text-zinc-200">{onboarding.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {normalized === "rejected" && (
                  <>
                    <div className="absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border border-red-500/50 bg-red-950 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                      <XCircle className="size-3" />
                    </div>
                    <div className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/[0.04] p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-red-200">Stage 03: Case Closed / Declined</h3>
                        <span className="rounded border border-red-500/40 bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                          Declined
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        This application or case could not be approved or resolved under current compliance and risk criteria.
                      </p>
                      {onboarding.admin_notes && (
                        <div className="mt-2.5 rounded border border-red-500/30 bg-black/50 p-2.5 text-xs space-y-1">
                          <span className="text-[11px] font-medium text-red-400 block">Decline Reason:</span>
                          <p className="text-zinc-200 leading-relaxed">{onboarding.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* B. SUBMITTED CASE RECORD (CLEAN TABLE) */}
          <section className={`${adminGlass.surface} p-5 sm:p-6 space-y-4`} aria-label="Submitted Information">
            <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white sm:text-base">
                  Submitted Case Record
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Intake details logged for this file.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Record #{caseId}</span>
            </div>

            <div className="rounded-lg border border-white/[0.08] divide-y divide-white/[0.06] text-xs">
              {declarantName && (
                <div className="grid grid-cols-3 p-3 sm:px-4">
                  <span className="font-medium text-zinc-400">Client / Declarant</span>
                  <span className="col-span-2 text-zinc-200 font-medium">{declarantName}</span>
                </div>
              )}

              {rawTxHash && (
                <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                  <span className="font-medium text-zinc-400">Transaction Hash</span>
                  <div className="col-span-2">
                    <CopyBadge
                      value={rawTxHash}
                      label="Transaction Hash"
                      explorerUrl={explorerUrl}
                    />
                  </div>
                </div>
              )}

              {incidentSummary && (
                <div className="grid grid-cols-3 p-3 sm:px-4">
                  <span className="font-medium text-zinc-400">Incident Context</span>
                  <div className="col-span-2 text-zinc-300 leading-relaxed">
                    {incidentSummary}
                  </div>
                </div>
              )}

              {phoneVal && (
                <div className="grid grid-cols-3 p-3 sm:px-4">
                  <span className="font-medium text-zinc-400">Contact Number</span>
                  <span className="col-span-2 font-mono text-zinc-300">{phoneVal}</span>
                </div>
              )}

              {evidenceFile && (
                <div className="grid grid-cols-3 p-3 sm:px-4 items-center">
                  <span className="font-medium text-zinc-400">Attached Document</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-mono text-zinc-300 truncate">{evidenceFile}</span>
                    {evidenceUrl && (
                      <a
                        href={evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <Download className="size-3" /> Download
                      </a>
                    )}
                  </div>
                </div>
              )}

              {Object.entries(details)
                .filter(([k]) => ![
                  "transaction_hash",
                  "payment_tx_hash",
                  "blockchain",
                  "amount_stolen",
                  "amount",
                  "loan_amount",
                  "currency",
                  "incident_summary",
                  "notes",
                  "name",
                  "counterparty_name",
                  "phone_number",
                  "country_phone_code",
                  "evidence",
                  "evidence_url",
                ].includes(k))
                .map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 p-3 sm:px-4">
                    <span className="font-medium text-zinc-400 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="col-span-2 text-zinc-200">{String(value)}</span>
                  </div>
                ))}
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 flex items-start gap-2.5 text-xs text-zinc-400">
              <Info className="size-4 shrink-0 text-zinc-400 mt-0.5" />
              <p className="leading-relaxed">
                Need to submit additional transaction logs, explorer links, or exchange tickets? Quote{" "}
                <span className="font-mono text-zinc-200 font-medium">#{caseRef}</span> when communicating with your assigned case officer.
              </p>
            </div>
          </section>
        </div>

        {/* SIDEBAR COLUMN (4 COLS) */}
        <aside className="space-y-6 lg:col-span-4">
          {/* 1. CASE SUMMARY METADATA */}
          <div className={`${adminGlass.surface} p-5 space-y-4`} aria-label="Case Information">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Case Information
            </h3>

            <div className="space-y-3 text-xs divide-y divide-white/[0.06]">
              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-400">Reference ID</span>
                <span className="font-mono text-zinc-200 font-medium">#{caseRef}</span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-zinc-400">Current Status</span>
                <span className={`font-medium ${statusPillClass} px-1.5 py-0.5 rounded text-[10px]`}>
                  {statusLabel}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-zinc-400">Date Logged</span>
                <span className="text-zinc-200">{formattedDate}</span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-zinc-400">Investigation Desk</span>
                <span className="text-zinc-200">Lenix Forensics Unit</span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <span className="text-zinc-400">Priority Queue</span>
                <span className="text-zinc-300">Tier-1 Intake</span>
              </div>
            </div>
          </div>

          {/* 2. DIRECT SUPPORT DESK */}
          <div className={`${adminGlass.surface} p-5 space-y-4`} aria-label="Support Desk">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Direct Support Channel</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly with the case management team on Telegram for real-time status updates and evidence submission.
              </p>
            </div>

            <Button
              className="w-full h-9 gap-2 border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.14] transition-colors text-xs font-medium"
              asChild
            >
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-3.5 text-zinc-300" />
                Open Telegram Support
              </a>
            </Button>

            <div className="border-t border-white/[0.06] pt-3 text-[11px] text-zinc-500 leading-relaxed">
              <ShieldCheck className="size-3.5 text-emerald-400 inline mr-1" />
              Verified Protocol Desk: @Verified_protocol
            </div>
          </div>

          {/* 3. SECURITY & INTEGRITY NOTICE */}
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-[11px] text-zinc-500 leading-relaxed space-y-1.5">
            <p className="font-medium text-zinc-400">Chain of Custody Notice</p>
            <p>
              Submitted hashes and evidence records are preserved in an immutable audit log for legal, regulatory, and asset recovery proceedings.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
