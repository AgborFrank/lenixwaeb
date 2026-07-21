"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateAvailableBalance } from "@/lib/banking/transfer";
import type { BankingCurrency, BankingOverview, TransferDirection, TransferQuote, TransferRecord } from "@/lib/banking/types";
import { TransferFormFields } from "./transfer-form-fields";
import { TransferReview, TransferSuccess } from "./transfer-review";

interface BankingTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overview: BankingOverview;
  initialDirection: TransferDirection;
  onTransferCreated: (transfer: TransferRecord) => void;
}

type DialogStep = "form" | "review" | "success";

export function BankingTransferDialog({
  open,
  onOpenChange,
  overview,
  initialDirection,
  onTransferCreated,
}: BankingTransferDialogProps) {
  const t = useTranslations("AccountBanking.transfer");
  const [step, setStep] = useState<DialogStep>("form");
  const [direction, setDirection] = useState<TransferDirection>(initialDirection);
  const [asset, setAsset] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [payoutCurrency, setPayoutCurrency] = useState<BankingCurrency>("USD");
  const [bankAccountId, setBankAccountId] = useState(
    overview.bankAccounts.find((account) => account.isDefault)?.id ?? "",
  );
  const [quote, setQuote] = useState<TransferQuote | null>(null);
  const [transfer, setTransfer] = useState<TransferRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const selectedAccount = useMemo(
    () => overview.bankAccounts.find((account) => account.id === bankAccountId),
    [bankAccountId, overview.bankAccounts],
  );

  const reset = (nextDirection = initialDirection) => {
    setStep("form");
    setDirection(nextDirection);
    setAsset("USDC");
    setAmount("");
    setPayoutCurrency("USD");
    setQuote(null);
    setTransfer(null);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  const handleDirectionChange = (nextDirection: TransferDirection) => {
    setDirection(nextDirection);
    const location = nextDirection.startsWith("spot") ? "spot" : "funding";
    setAsset(overview.assets.find((item) => item.location === location)?.symbol ?? "USDC");
    setAmount("");
    setError(null);
  };

  const requestPayload = () => ({
    direction,
    asset,
    amount: Number(amount),
    payoutCurrency,
    bankAccountId: direction.endsWith("_to_bank") ? bankAccountId : undefined,
  });

  const handlePayoutCurrencyChange = (currency: BankingCurrency) => {
    setPayoutCurrency(currency);
    const matchingAccount = overview.bankAccounts.find(
      (account) => account.status === "verified" && account.currency === currency,
    );
    setBankAccountId(matchingAccount?.id ?? "");
    setError(null);
  };

  const handleContinue = async () => {
    setError(null);
    const payload = requestPayload();
    const balanceValidation = validateAvailableBalance(payload, overview.assets);
    if (!balanceValidation.valid) {
      setError(balanceValidation.error);
      return;
    }
    setIsPending(true);
    try {
      const response = await fetch("/api/banking/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload()),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("quote_failed"));
      setQuote(result.data);
      setStep("review");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("quote_failed"));
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirm = async () => {
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch("/api/banking/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload()),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("transfer_failed"));
      setTransfer(result.data);
      setStep("success");
      onTransferCreated(result.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("transfer_failed"));
    } finally {
      setIsPending(false);
    }
  };

  const stepNumber = step === "form" ? 1 : step === "review" ? 2 : 3;
  const title = step === "form" ? t("title_form") : step === "review" ? t("title_review") : t("title_success");
  const description =
    step === "form" ? t("desc_form") : step === "review" ? t("desc_review") : t("desc_success");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-zinc-800 bg-zinc-950 p-0 text-white sm:max-w-2xl">
        <DialogHeader className="border-b border-zinc-800 px-5 py-5 text-left sm:px-6">
          <div className="flex items-center gap-3">
            {step === "review" && (
              <button
                type="button"
                aria-label={t("back_label")}
                onClick={() => setStep("form")}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
            )}
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-zinc-500">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 pb-6 sm:px-6">
          <div className="mb-6 mt-5 flex items-center gap-2" aria-label={t("step_label", { step: stepNumber })}>
            {["form", "review", "success"].map((item, index) => (
              <span
                key={item}
                className={`h-1 flex-1 rounded-full ${["form", "review", "success"].indexOf(step) >= index ? "bg-[#FCD535]" : "bg-zinc-800"}`}
              />
            ))}
          </div>

          {step === "form" && (
            <TransferFormFields
              direction={direction}
              onDirectionChange={handleDirectionChange}
              asset={asset}
              onAssetChange={setAsset}
              amount={amount}
              onAmountChange={setAmount}
              payoutCurrency={payoutCurrency}
              onPayoutCurrencyChange={handlePayoutCurrencyChange}
              bankAccountId={bankAccountId}
              onBankAccountChange={setBankAccountId}
              assets={overview.assets}
              bankAccounts={overview.bankAccounts}
              error={error}
            />
          )}
          {step === "review" && quote && <TransferReview quote={quote} bankAccount={selectedAccount} />}
          {step === "success" && transfer && <TransferSuccess transfer={transfer} />}
          {step === "review" && error && (
            <div role="alert" className="mt-4 rounded-lg border border-red-600/30 bg-red-600/10 px-3 py-2.5 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {step !== "success" && (
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                {t("cancel")}
              </button>
            )}
            {step === "form" && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleContinue}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCD535] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {t("review_transfer")}
              </button>
            )}
            {step === "review" && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FCD535] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {t("confirm_submit")}
              </button>
            )}
            {step === "success" && (
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#FCD535] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B]"
              >
                {t("done")}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
