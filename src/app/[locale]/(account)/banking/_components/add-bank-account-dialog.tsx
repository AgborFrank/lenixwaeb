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
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bankName.trim() || !accountHolderName.trim() || !accountNumber.trim() || !country.trim()) {
      toast.error(t("required_fields"));
      return;
    }

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
      <DialogContent className="max-w-lg border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="text-zinc-500">{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("fields.bank_name")} required>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder={t("fields.bank_name_placeholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </Field>
            <Field label={t("fields.account_holder")} required>
              <input
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder={t("fields.account_holder_placeholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </Field>
          </div>

          <Field label={t("fields.account_number")} required>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={t("fields.account_number_placeholder")}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("fields.routing_number")}>
              <input
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder={t("fields.optional")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </Field>
            <Field label={t("fields.swift_bic")}>
              <input
                value={swiftBic}
                onChange={(e) => setSwiftBic(e.target.value)}
                placeholder={t("fields.optional")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label={t("fields.account_type")}>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as "checking" | "savings")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              >
                <option value="checking">{t("fields.checking")}</option>
                <option value="savings">{t("fields.savings")}</option>
              </select>
            </Field>
            <Field label={t("fields.currency")}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as BankingCurrency)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("fields.country")} required>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("fields.country_placeholder")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FCD535] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#F0B90B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label}
        {required && <span className="text-yellow-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
