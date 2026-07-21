"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
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
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
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
              className={`${onboarding.input} font-mono text-[13px]`}
            />
          </div>
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

          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="incident_summary" className={onboarding.label}>
              {t("incidentSummary")} <span className={onboarding.required}>*</span>
            </Label>
            <Textarea
              id="incident_summary"
              name="incident_summary"
              required
              rows={4}
              placeholder={t("incidentPlaceholder")}
              className={onboarding.textarea}
            />
          </div>
          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="evidence" className={onboarding.label}>
              {t("evidence")}
            </Label>
            <Input
              id="evidence"
              name="evidence"
              type="file"
              accept="image/*,.pdf"
              onChange={(event) => setEvidenceName(event.target.files?.[0]?.name ?? null)}
              className={`${onboarding.input} cursor-pointer file:mr-3 file:border-0 file:bg-transparent file:text-sm file:text-zinc-400`}
            />
            <p className={onboarding.hint}>{evidenceName ?? t("evidenceHint")}</p>
          </div>
        </div>
      </div>

      <OnboardingActionBar>
        <OnboardingPendingSubmitButton label={tc("submitFinish")} pendingLabel={tc("submitting")} />
      </OnboardingActionBar>
    </form>
  );
}
