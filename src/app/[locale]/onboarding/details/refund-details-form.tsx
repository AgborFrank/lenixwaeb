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
              <SelectTrigger id="currency-select" className={onboarding.input}>
                <SelectValue placeholder={tc("selectCurrency")} />
              </SelectTrigger>
              <SelectContent>
                {REFUND_ASSETS.map((asset) => (
                  <SelectItem key={asset} value={asset}>
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
              <SelectTrigger id="blockchain-select" className={onboarding.input}>
                <SelectValue placeholder={t("selectBlockchain")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("noChain")}</SelectItem>
                {REFUND_CHAINS.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              rows={5}
              placeholder={t("summaryPlaceholder")}
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
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              className={onboarding.input}
              onChange={(event) => {
                const file = event.target.files?.[0];
                setEvidenceName(file?.name ?? null);
              }}
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              {evidenceName ? evidenceName : t("evidenceHint")}
            </p>
          </div>
        </div>
      </div>

      <OnboardingActionBar>
        <OnboardingPendingSubmitButton label={tc("submitFinish")} />
      </OnboardingActionBar>
    </form>
  );
}
