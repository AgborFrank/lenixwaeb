"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, Wallet, Landmark, Building2 } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import { Link } from "@/i18n/navigation";
import { repayLoan, type Loan } from "../actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UserPayout {
  method: string;
  details: Record<string, string> | null;
}

interface ActiveLoansProps {
  loans: Loan[];
  userPayout?: UserPayout | null;
}

function PayoutDetails({
  payout,
  t,
}: {
  payout: { method: string; details: Record<string, string> | null };
  t: ReturnType<typeof useTranslations<"AccountCryptoLoan.active_loans">>;
}) {
  const { method, details } = payout;
  if (!details) return <p className="text-sm text-zinc-500">{t("no_payout_details")}</p>;
  if (method === "crypto") {
    return (
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-zinc-500">{t("wallet")}:</span>{" "}
          <span className="break-all font-mono text-white">{details.wallet_address || "—"}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("network")}:</span>{" "}
          <span className="text-white">{details.network || "—"}</span>
        </p>
      </div>
    );
  }
  if (method === "wire_transfer") {
    return (
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-zinc-500">{t("bank")}:</span>{" "}
          <span className="text-white">{details.bank_name || "—"}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("swift_bic")}:</span>{" "}
          <span className="font-mono text-white">{details.swift_bic || "—"}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("account")}:</span>{" "}
          <span className="font-mono text-white">****{String(details.account_number || "").slice(-4)}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("holder")}:</span>{" "}
          <span className="text-white">{details.account_name || "—"}</span>
        </p>
      </div>
    );
  }
  if (method === "bank") {
    return (
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-zinc-500">{t("bank")}:</span>{" "}
          <span className="text-white">{details.bank_name || "—"}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("routing_iban")}:</span>{" "}
          <span className="font-mono text-white">****{String(details.routing_iban || "").slice(-4)}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("account")}:</span>{" "}
          <span className="font-mono text-white">****{String(details.account_number || "").slice(-4)}</span>
        </p>
        <p>
          <span className="text-zinc-500">{t("holder")}:</span>{" "}
          <span className="text-white">{details.account_holder || "—"}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function ActiveLoans({ loans, userPayout }: ActiveLoansProps) {
  const t = useTranslations("AccountCryptoLoan.active_loans");
  const tDuration = useTranslations("AccountCryptoLoan.duration");
  const tStatus = useTranslations("AccountCryptoLoan.status");
  const tPayout = useTranslations("AccountCryptoLoan.payout_methods");
  const tToast = useTranslations("AccountCryptoLoan.toast");
  const router = useRouter();
  const [repayingId, setRepayingId] = useState<string | null>(null);
  const [detailsLoan, setDetailsLoan] = useState<Loan | null>(null);

  const handleRepay = async (id: string) => {
    setRepayingId(id);
    const result = await repayLoan(id);
    setRepayingId(null);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(tToast("repay_success"));
      router.refresh();
    }
  };

  const durationLabel = (value?: string) => {
    if (!value) return "—";
    const key = value as "6" | "12" | "24";
    return tDuration.has(key) ? tDuration(key) : tDuration("months", { count: value });
  };

  const statusLabel = (status: string) => {
    return tStatus.has(status as "Active") ? tStatus(status as "Active") : status;
  };

  const desk = useTranslations("AccountCryptoLoan.desk");

  if (loans.length === 0) {
    return (
      <section className={`${adminGlass.surface} overflow-hidden`} aria-label={desk("positions")}>
        <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <h2 className="text-sm font-medium text-white">{desk("positions")}</h2>
        </div>
        <div className="px-4 py-12 text-center sm:px-6">
          <p className="text-sm font-medium text-zinc-200">{t("empty_title")}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">{t("empty_description")}</p>
          <Button type="button" size="sm" className="mt-5 bg-white text-black hover:bg-zinc-200" asChild>
            <Link href="/crypto-loan?mode=apply">{desk("borrow")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={`${adminGlass.surface} overflow-hidden`} aria-label={desk("positions")}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <h2 className="text-sm font-medium text-white">{desk("positions")}</h2>
        <p className="text-xs tabular-nums text-zinc-500">{desk("showing", { count: loans.length })}</p>
      </div>

      <ul className="divide-y divide-white/[0.06] sm:hidden">
        {loans.map((loan) => {
          const isRisky = loan.health_factor < 1.5;
          return (
            <li key={loan.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium tabular-nums text-white">
                    {loan.borrow_amount.toLocaleString()} {loan.borrow_asset}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {loan.collateral_amount} {loan.collateral_asset} · {loan.apy}%
                  </p>
                </div>
                <LoanMenu
                  repaying={repayingId === loan.id}
                  onRepay={() => handleRepay(loan.id)}
                  onDetails={() => setDetailsLoan(loan)}
                  repayLabel={t("repay_loan")}
                  processingLabel={t("processing")}
                  detailsLabel={t("view_details")}
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <StatusBadge status={loan.status} label={statusLabel(loan.status)} />
                <span className={cn("text-xs tabular-nums", isRisky ? "text-red-300" : "text-emerald-300")}>
                  {t("health_factor")} {loan.health_factor}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className={adminGlass.tableHead}>{t("borrowed_amount")}</th>
              <th className={adminGlass.tableHead}>{t("collateral")}</th>
              <th className={`${adminGlass.tableHead} text-right`}>{t("apy")}</th>
              <th className={adminGlass.tableHead}>{t("health_factor")}</th>
              <th className={adminGlass.tableHead}>{desk("status")}</th>
              <th className={`${adminGlass.tableHead} text-right`} />
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const healthPercentage = (loan.health_factor / 3) * 100;
              const isRisky = loan.health_factor < 1.5;
              return (
                <tr key={loan.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className={`${adminGlass.tableCell} font-medium tabular-nums text-white`}>
                    {loan.borrow_amount.toLocaleString()} {loan.borrow_asset}
                  </td>
                  <td className={`${adminGlass.tableCell} tabular-nums`}>
                    {loan.collateral_amount} {loan.collateral_asset}
                  </td>
                  <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>{loan.apy}%</td>
                  <td className={adminGlass.tableCell}>
                    <div className="flex min-w-[7rem] items-center gap-2">
                      <span className={cn("text-xs tabular-nums", isRisky ? "text-red-300" : "text-emerald-300")}>
                        {loan.health_factor}
                      </span>
                      <Progress
                        value={Math.min(healthPercentage, 100)}
                        className="h-1 bg-white/10"
                        indicatorColor={isRisky ? "bg-red-400" : "bg-emerald-400"}
                      />
                    </div>
                  </td>
                  <td className={adminGlass.tableCell}>
                    <StatusBadge status={loan.status} label={statusLabel(loan.status)} />
                  </td>
                  <td className={`${adminGlass.tableCell} text-right`}>
                    <LoanMenu
                      repaying={repayingId === loan.id}
                      onRepay={() => handleRepay(loan.id)}
                      onDetails={() => setDetailsLoan(loan)}
                      repayLabel={t("repay_loan")}
                      processingLabel={t("processing")}
                      detailsLabel={t("view_details")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!detailsLoan} onOpenChange={(open) => !open && setDetailsLoan(null)}>
        <DialogContent className={`max-w-md ${adminGlass.dialog}`}>
          <DialogHeader>
            <DialogTitle className="text-xl">{t("details_title")}</DialogTitle>
          </DialogHeader>
          {detailsLoan && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("borrowed")}</p>
                  <p className="font-bold text-white">
                    {detailsLoan.borrow_amount.toLocaleString()} {detailsLoan.borrow_asset}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("collateral")}</p>
                  <p className="font-bold text-white">
                    {detailsLoan.collateral_amount} {detailsLoan.collateral_asset}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("apy")}</p>
                  <p className="font-bold text-emerald-400">{detailsLoan.apy}%</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("health_factor")}</p>
                  <p className="font-bold text-white">{detailsLoan.health_factor}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("duration")}</p>
                  <p className="text-white">{durationLabel(detailsLoan.request_details?.duration)}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{t("start_date")}</p>
                  <p className="text-white">
                    {detailsLoan.start_date ? new Date(detailsLoan.start_date).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">{t("contact_details")}</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-zinc-500">{t("phone")}:</span>{" "}
                    <span className="text-white">{detailsLoan.request_details?.phone_number || t("not_provided")}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">{t("telegram_whatsapp")}:</span>{" "}
                    <span className="text-white">
                      {detailsLoan.request_details?.telegram_or_whatsapp || t("not_provided")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">{t("payout_method")}</p>
                {detailsLoan.request_details?.payout_method ? (
                  <div className="mb-3 flex items-center gap-2">
                    {detailsLoan.request_details.payout_method === "crypto" && (
                      <Wallet className="h-4 w-4 text-zinc-400" />
                    )}
                    {detailsLoan.request_details.payout_method === "wire_transfer" && (
                      <Landmark className="h-4 w-4 text-zinc-400" />
                    )}
                    {detailsLoan.request_details.payout_method === "bank" && (
                      <Building2 className="h-4 w-4 text-zinc-400" />
                    )}
                    <span className="capitalize text-white">
                      {tPayout.has(detailsLoan.request_details.payout_method as "crypto")
                        ? tPayout(detailsLoan.request_details.payout_method as "crypto")
                        : detailsLoan.request_details.payout_method.replace("_", " ")}
                    </span>
                  </div>
                ) : null}
                <PayoutDetails
                  t={t}
                  payout={
                    detailsLoan.request_details?.payout_details
                      ? {
                          method: detailsLoan.request_details.payout_method || "crypto",
                          details: detailsLoan.request_details.payout_details,
                        }
                      : userPayout || { method: "crypto", details: null }
                  }
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone =
    status === "Active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : status === "Pending"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : status === "Liquidated"
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-white/10 bg-white/[0.04] text-zinc-400";
  return <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
}

function LoanMenu({
  repaying,
  onRepay,
  onDetails,
  repayLabel,
  processingLabel,
  detailsLabel,
}: {
  repaying: boolean;
  onRepay: () => void;
  onDetails: () => void;
  repayLabel: string;
  processingLabel: string;
  detailsLabel: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:bg-white/[0.06] hover:text-white">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={adminGlass.menu}>
        <DropdownMenuItem onClick={onRepay} className="cursor-pointer">
          {repaying ? processingLabel : repayLabel}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDetails} className="cursor-pointer">
          {detailsLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
