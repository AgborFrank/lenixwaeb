"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2, UploadCloud } from "lucide-react";
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
import { submitOnboardingDetails } from "../actions";
import { OnboardingActionBar } from "../components/onboarding-action-bar";
import { OnboardingPendingSubmitButton } from "../components/onboarding-pending-submit-button";
import { OnboardingPhoneField } from "../components/onboarding-form-fields";
import { onboarding } from "@/lib/onboarding-styles";

const BLOCKCHAIN_KEYS = [
  "BTC", "ETH", "SOL", "TRX", "BNB", "MATIC", "AVAX", "ARB", "BASE", "FANTOM", "GNOSIS", "KAVA", "POL", "SUI", "OTHER",
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "BTC", "ETH"] as const;

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

export function RecoveryDetailsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const submissionError = searchParams.get("error");
  const [evidenceName, setEvidenceName] = useState<string | null>(null);
  const t = useTranslations("Onboarding.RecoveryForm");
  const tc = useTranslations("Onboarding.Common");
  const tb = useTranslations("Onboarding.Blockchains");

  return (
    <form ref={formRef} action={submitOnboardingDetails}>
      <input type="hidden" name="blockchain" id="blockchain" defaultValue="BTC" />
      <input type="hidden" name="currency" id="currency" defaultValue="USD" />
      <input type="hidden" name="country_phone_code" id="country_phone_code" defaultValue="US:+1" />

      <div className={`${onboarding.cardBody} ${onboarding.fieldStack}`}>
        {submissionError && (
          <div className={onboarding.error} role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            <p>{submissionError}</p>
          </div>
        )}

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
            <Label htmlFor="phone_number" className={onboarding.label}>
              {tc("phoneNumber")}
            </Label>
            <OnboardingPhoneField countries={countries} phoneInputId="phone_number" />
          </div>

          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="transaction_hash" className={onboarding.label}>
              {t("transactionHash")} <span className={onboarding.required}>*</span>
            </Label>
            <Input
              id="transaction_hash"
              name="transaction_hash"
              type="text"
              required
              placeholder={t("transactionPlaceholder")}
              className={`${onboarding.input} font-mono text-xs`}
            />
          </div>

          {/* 3-Column compact row for loss metrics */}
          <div className={`${onboarding.field} md:col-span-2`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={onboarding.field}>
                <Label htmlFor="amount_stolen" className={onboarding.label}>
                  {t("amountLost")} <span className={onboarding.required}>*</span>
                </Label>
                <Input
                  id="amount_stolen"
                  name="amount_stolen"
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
                    const el = formRef.current?.querySelector('[name="currency"]') as HTMLInputElement;
                    if (el) el.value = value;
                  }}
                >
                  <SelectTrigger id="currency-select" className={onboarding.selectTrigger}>
                    <SelectValue placeholder={tc("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent className={onboarding.selectContent}>
                    {CURRENCIES.map((key) => (
                      <SelectItem key={key} value={key} className={onboarding.selectItem}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className={onboarding.field}>
                <Label htmlFor="blockchain-select" className={onboarding.label}>
                  {t("blockchain")} <span className={onboarding.required}>*</span>
                </Label>
                <Select
                  defaultValue="BTC"
                  onValueChange={(value) => {
                    const el = formRef.current?.querySelector('[name="blockchain"]') as HTMLInputElement;
                    if (el) el.value = value;
                  }}
                >
                  <SelectTrigger id="blockchain-select" className={onboarding.selectTrigger}>
                    <SelectValue placeholder={tc("selectBlockchain")} />
                  </SelectTrigger>
                  <SelectContent className={onboarding.selectContent}>
                    {BLOCKCHAIN_KEYS.map((key) => (
                      <SelectItem key={key} value={key} className={onboarding.selectItem}>
                        {tb(key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="incident_summary" className={onboarding.label}>
              {t("incidentSummary")} <span className={onboarding.required}>*</span>
            </Label>
            <Textarea
              id="incident_summary"
              name="incident_summary"
              required
              rows={3}
              placeholder={t("incidentPlaceholder")}
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
                accept="image/*,.pdf"
                onChange={(event) => setEvidenceName(event.target.files?.[0]?.name ?? null)}
                className="sr-only"
              />
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-zinc-400 group-hover:text-amber-300 group-hover:border-amber-400/30 transition-colors">
                  <UploadCloud className="h-3.5 w-3.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {evidenceName ? evidenceName : "Select or drag file to attach"}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    PNG, JPG, PDF up to 10 MB (optional)
                  </p>
                </div>
              </div>
              {evidenceName ? (
                <span className="flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Attached
                </span>
              ) : (
                <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-colors">
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

