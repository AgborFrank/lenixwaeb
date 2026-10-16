"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { Country } from "country-state-city";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REFUND_ASSETS, REFUND_CHAINS, REFUND_ROLES } from "@/lib/refund/constants";
import { submitRefundOnboardingDetails } from "../actions";
import { OnboardingActionBar } from "../components/onboarding-action-bar";
import { OnboardingPendingSubmitButton } from "../components/onboarding-pending-submit-button";
import { OnboardingPhoneField } from "../components/onboarding-form-fields";
import { onboarding } from "@/lib/onboarding-styles";

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

interface RefundDetailsFormProps {
  defaultEmail?: string;
}

export function RefundDetailsForm({ defaultEmail }: RefundDetailsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const submissionError = searchParams.get("error");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const t = useTranslations("Onboarding.RefundForm");
  const tc = useTranslations("Onboarding.Common");

  return (
    <form ref={formRef} action={submitRefundOnboardingDetails}>
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="currency" id="currency" defaultValue="USD" />
      <input type="hidden" name="blockchain" id="blockchain" defaultValue="" />
      <input type="hidden" name="country_phone_code" id="country_phone_code" defaultValue="US:+1" />

      <div className={`${onboarding.cardBody} ${onboarding.fieldStack}`}>
        {submissionError && (
          <div className={onboarding.error} role="alert">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <p>{submissionError}</p>
          </div>
        )}

        <div className={onboarding.field}>
          <span className={onboarding.label}>{t("role")}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {REFUND_ROLES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={
                  role === value
                    ? "rounded-md border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300"
                    : "rounded-md border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-400 hover:border-white/20"
                }
              >
                {value === "buyer" ? t("roleBuyer") : t("roleSeller")}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
          <div className={onboarding.field}>
            <Label htmlFor="name" className={onboarding.label}>
              {tc("fullName")} <span className={onboarding.required}>*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder={tc("placeholderName")}
              className={onboarding.input}
            />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="email" className={onboarding.label}>
              {t("email")} <span className={onboarding.required}>*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              placeholder={t("emailPlaceholder")}
              className={onboarding.input}
            />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="phone_number" className={onboarding.label}>
              {tc("phoneNumber")}
            </Label>
            <OnboardingPhoneField countries={countries} phoneInputId="phone_number" />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="counterparty_name" className={onboarding.label}>
              {t("counterparty")}
            </Label>
            <Input
              id="counterparty_name"
              name="counterparty_name"
              type="text"
              placeholder={t("counterpartyPlaceholder")}
              className={onboarding.input}
            />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="order_ref" className={onboarding.label}>
              {t("orderRef")}
            </Label>
            <Input
              id="order_ref"
              name="order_ref"
              type="text"
              placeholder={t("orderPlaceholder")}
              className={onboarding.input}
            />
          </div>
          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="payment_tx_hash" className={onboarding.label}>
              {t("paymentProof")} <span className={onboarding.required}>*</span>
            </Label>
            <Input
              id="payment_tx_hash"
              name="payment_tx_hash"
              type="text"
              required
              placeholder={t("paymentPlaceholder")}
              className={`${onboarding.input} font-mono text-[13px]`}
            />
          </div>
          <div className={`${onboarding.field} md:col-span-2`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={onboarding.field}>
                <Label htmlFor="amount" className={onboarding.label}>
                  {t("amount")} <span className={onboarding.required}>*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  required
                  placeholder={t("amountPlaceholder")}
                  className={onboarding.input}
                />
              </div>

              <div className={onboarding.field}>
                <Label htmlFor="currency-select" className={onboarding.label}>
                  {t("currency")} <span className={onboarding.required}>*</span>
                </Label>
                <Select
                  defaultValue="USD"
                  onValueChange={(value) => {
                    const el = document.getElementById("currency") as HTMLInputElement | null;
                    if (el) el.value = value;
                  }}
                >
                  <SelectTrigger id="currency-select" className={onboarding.selectTrigger}>
                    <SelectValue placeholder={tc("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent className={onboarding.selectContent}>
                    {REFUND_ASSETS.map((asset) => (
                      <SelectItem key={asset} value={asset} className={onboarding.selectItem}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={onboarding.field}>
                <Label htmlFor="blockchain-select" className={onboarding.label}>
                  {t("blockchain")}
                </Label>
                <Select
                  onValueChange={(value) => {
                    const el = document.getElementById("blockchain") as HTMLInputElement | null;
                    if (el) el.value = value === "none" ? "" : value;
                  }}
                >
                  <SelectTrigger id="blockchain-select" className={onboarding.selectTrigger}>
                    <SelectValue placeholder={t("selectBlockchain")} />
                  </SelectTrigger>
                  <SelectContent className={onboarding.selectContent}>
                    <SelectItem value="none" className={onboarding.selectItem}>{t("noChain")}</SelectItem>
                    {REFUND_CHAINS.map((chain) => (
                      <SelectItem key={chain} value={chain} className={onboarding.selectItem}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="incident_summary" className={onboarding.label}>
              {t("summary")} <span className={onboarding.required}>*</span>
            </Label>
            <Textarea
              id="incident_summary"
              name="incident_summary"
              required
              minLength={20}
              rows={3}
              placeholder={t("summaryPlaceholder")}
              className={onboarding.textarea}
            />
          </div>

          {/* Compact Enterprise Evidence Dropzone */}
          <div className={`${onboarding.field} md:col-span-2`}>
            <Label className={onboarding.label}>{t("evidence")}</Label>
            <label
              htmlFor="evidence"
              className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-3.5 py-2.5 transition-all hover:border-amber-400/40 hover:bg-white/[0.04]"
            >
              <input
                id="evidence"
                name="evidence"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setEvidenceName(file?.name ?? null);
                }}
                className="sr-only"
              />
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-400 group-hover:text-amber-300 group-hover:border-amber-400/30 transition-colors">
                  <span className="text-sm">📎</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {evidenceName ? evidenceName : "Attach proof of purchase or payment"}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    PDF, JPG, PNG up to 10 MB (optional)
                  </p>
                </div>
              </div>
              {evidenceName ? (
                <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                  Attached
                </span>
              ) : (
                <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                  Browse
                </span>
              )}
            </label>
          </div>
        </div>
      </div>

      <OnboardingActionBar>
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400">
            {tc("privacyPrefix")}{" "}
            <a href="/privacy" className={onboarding.link} target="_blank" rel="noreferrer">
              {tc("privacyPolicy")}
            </a>
          </span>
          <OnboardingPendingSubmitButton label={tc("submitFinish")} pendingLabel={tc("submitting")} />
        </div>
      </OnboardingActionBar>
    </form>
  );
}
