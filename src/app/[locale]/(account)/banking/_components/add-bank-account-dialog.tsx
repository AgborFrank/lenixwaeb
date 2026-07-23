"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { BankingCurrency } from "@/lib/banking/types";

interface AddBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: () => void;
}

const CURRENCIES: BankingCurrency[] = ["USD", "EUR", "GBP"];
type RequiredField = "bankName" | "accountHolderName" | "accountNumber" | "country";

export function AddBankAccountDialog({ open, onOpenChange, onAdded }: AddBankAccountDialogProps) {
  const t = useTranslations("AccountBanking.add_account");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [iban, setIban] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [currency, setCurrency] = useState<BankingCurrency>("USD");
  const [country, setCountry] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setBankName("");
    setAccountHolderName("");
    setAccountNumber("");
    setRoutingNumber("");
    setIban("");
    setSwiftBic("");
    setAccountType("checking");
    setCurrency("USD");
    setCountry("");
    setFieldErrors({});
  };

  const clearFieldError = (field: RequiredField) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const requiredError = t("required_fields");
    const nextErrors: Partial<Record<RequiredField, string>> = {};

    if (!bankName.trim()) nextErrors.bankName = requiredError;
    if (!accountHolderName.trim()) nextErrors.accountHolderName = requiredError;
    if (!accountNumber.trim()) nextErrors.accountNumber = requiredError;
    if (!country.trim()) nextErrors.country = requiredError;

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/banking/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName: bankName.trim(),
          accountHolderName: accountHolderName.trim(),
          accountNumber: accountNumber.trim(),
          routingNumber: routingNumber.trim(),
          iban: iban.trim(),
          swiftBic: swiftBic.trim(),
          accountType,
          currency,
          country: country.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("failed"));

      toast.success(t("success"));
      handleOpenChange(false);
      onAdded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto overscroll-contain border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{t("title")}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-zinc-500">{t("description")}</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("fields.bank_name")} required error={fieldErrors.bankName}>
              <input
                name="bankName"
                autoComplete="organization"
                required
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  clearFieldError("bankName");
                }}
                placeholder={t("fields.bank_name_placeholder")}
                aria-invalid={Boolean(fieldErrors.bankName)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              />
            </Field>
            <Field label={t("fields.account_holder")} required error={fieldErrors.accountHolderName}>
              <input
                name="accountHolderName"
                autoComplete="name"
                required
                value={accountHolderName}
                onChange={(e) => {
                  setAccountHolderName(e.target.value);
                  clearFieldError("accountHolderName");
                }}
                placeholder={t("fields.account_holder_placeholder")}
                aria-invalid={Boolean(fieldErrors.accountHolderName)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              />
            </Field>
          </div>

          <Field label={t("fields.account_number")} required error={fieldErrors.accountNumber}>
            <input
              name="accountNumber"
              autoComplete="off"
              inputMode="numeric"
              spellCheck={false}
              required
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                clearFieldError("accountNumber");
              }}
              placeholder={t("fields.account_number_placeholder")}
              aria-invalid={Boolean(fieldErrors.accountNumber)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={t("fields.routing_number")}>
              <input
                name="routingNumber"
                autoComplete="off"
                inputMode="numeric"
                spellCheck={false}
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder={t("fields.optional")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              />
            </Field>
            <Field label={t("fields.swift_bic")}>
              <input
                name="swiftBic"
                autoComplete="off"
                spellCheck={false}
                value={swiftBic}
                onChange={(e) => setSwiftBic(e.target.value)}
                placeholder={t("fields.optional")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label={t("fields.account_type")}>
              <select
                name="accountType"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as "checking" | "savings")}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              >
                <option value="checking">{t("fields.checking")}</option>
                <option value="savings">{t("fields.savings")}</option>
              </select>
            </Field>
            <Field label={t("fields.currency")}>
              <select
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as BankingCurrency)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("fields.country")} required error={fieldErrors.country}>
              <input
                name="country"
                autoComplete="country"
                required
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  clearFieldError("country");
                }}
                placeholder={t("fields.country_placeholder")}
                aria-invalid={Boolean(fieldErrors.country)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 h-10 text-sm text-white placeholder-zinc-500 focus:border-[#FCD535] focus:outline-none focus:ring-1 focus:ring-[#FCD535]/50"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#FCD535] px-4 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
        {required && <span className="text-[#FCD535]"> *</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1.5 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
