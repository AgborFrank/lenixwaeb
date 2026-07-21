"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreVertical, ShieldAlert, Wallet, Landmark, Building2 } from "lucide-react";
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

  if (loans.length === 0) {
    return (
      <div className="mx-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <ShieldAlert className="h-6 w-6 text-zinc-500" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-white">{t("empty_title")}</h3>
        <p className="max-w-xs text-sm text-zinc-500">{t("empty_description")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{t("title")}</h2>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {t("active_count", { count: loans.length })}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loans.map((loan) => {
          const healthPercentage = (loan.health_factor / 3) * 100;
          const isRisky = loan.health_factor < 1.5;

          return (
            <div
              key={loan.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-5 transition-all hover:border-white/10"
            >
              <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-zinc-800/50 text-zinc-400 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-900">
                    <DropdownMenuItem
                      onClick={() => handleRepay(loan.id)}
                      className="cursor-pointer text-emerald-400 focus:bg-emerald-400/10 focus:text-emerald-400"
                    >
                      {repayingId === loan.id ? t("processing") : t("repay_loan")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDetailsLoan(loan)}
                      className="cursor-pointer text-white focus:bg-white/10"
                    >
                      {t("view_details")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex min-w-[200px] items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-gradient-to-br from-yellow-400/20 to-orange-500/20">
                    <span className="text-lg font-bold text-yellow-500">{loan.borrow_asset[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">{t("borrowed_amount")}</p>
                    <p className="text-2xl font-bold text-white">
                      {loan.borrow_amount.toLocaleString()}{" "}
                      <span className="text-sm font-normal text-zinc-500">{loan.borrow_asset}</span>
                    </p>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-6 lg:grid-cols-4">
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">{t("collateral")}</p>
                    <p className="text-sm font-medium text-white">
                      {loan.collateral_amount} {loan.collateral_asset}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-zinc-500">{t("apy")}</p>
                    <p className="text-sm font-medium text-emerald-400">{loan.apy}%</p>
                  </div>
                  <div className="col-span-2 lg:col-span-2">
                    <div className="mb-1 flex items-end justify-between">
                      <p className="text-xs text-zinc-500">{t("health_factor")}</p>
                      <span className={cn("text-xs font-bold", isRisky ? "text-red-400" : "text-emerald-400")}>
                        {loan.health_factor}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(healthPercentage, 100)}
                      className="h-1.5 bg-zinc-800"
                      indicatorColor={isRisky ? "bg-red-500" : "bg-emerald-500"}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0 px-3 py-1 capitalize",
                      loan.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400",
                    )}
                  >
                    {loan.status === "Active" ? (
                      <div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    ) : null}
                    {statusLabel(loan.status)}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!detailsLoan} onOpenChange={(open) => !open && setDetailsLoan(null)}>
        <DialogContent className="max-w-md border-white/10 bg-zinc-900 text-white">
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
                      <Wallet className="h-4 w-4 text-yellow-400" />
                    )}
                    {detailsLoan.request_details.payout_method === "wire_transfer" && (
                      <Landmark className="h-4 w-4 text-yellow-400" />
                    )}
                    {detailsLoan.request_details.payout_method === "bank" && (
                      <Building2 className="h-4 w-4 text-yellow-400" />
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
    </div>
  );
}
