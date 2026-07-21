"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingActionBar } from "../components/onboarding-action-bar";
import { onboarding } from "@/lib/onboarding-styles";

const PAYOUT_METHOD_KEYS = ["crypto", "wire_transfer", "bank"] as const;
const NETWORK_KEYS = [
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
  "bsc",
  "solana",
  "bitcoin",
] as const;

export function LoanPayoutForm({ error }: { error?: string }) {
  const router = useRouter();
  const t = useTranslations("Onboarding.PayoutForm");
  const tc = useTranslations("Onboarding.Common");
  const tn = useTranslations("Onboarding.Networks");

  const [formData, setFormData] = useState({
    payout_method: "crypto" as (typeof PAYOUT_METHOD_KEYS)[number],
    phone_number: "",
    telegram_or_whatsapp: "",
    wallet_address: "",
    network: NETWORK_KEYS[0] ?? "ethereum",
    memo: "",
    bank_name: "",
    swift_bic: "",
    account_number: "",
    account_name: "",
    account_holder: "",
    routing_iban: "",
    reference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(error ?? null);

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });

    try {
      const res = await fetch("/api/onboarding/loan-payout", {
        method: "POST",
        body: payload,
      });
      const result = await res.json();

      if (!res.ok || result?.error) {
        if (result?.error === "Please log in") {
          router.push("/login");
          return;
        }
        setSubmissionError(result?.error ?? tc("somethingWrong"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setSubmissionError(tc("somethingWrong"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const method = formData.payout_method;

  return (
    <form onSubmit={handleSubmit}>
      <div className={`${onboarding.cardBody} ${onboarding.fieldStack}`}>
        {submissionError && (
          <div className={onboarding.error} role="alert">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <p>{submissionError}</p>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
          <div className={onboarding.field}>
            <Label htmlFor="phone_number" className={onboarding.label}>
              {tc("phoneNumber")}
            </Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder={t("phonePlaceholder")}
              className={onboarding.input}
              value={formData.phone_number}
              onChange={(e) => updateForm("phone_number", e.target.value)}
            />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="telegram_or_whatsapp" className={onboarding.label}>
              {t("telegramWhatsapp")}
            </Label>
            <Input
              id="telegram_or_whatsapp"
              placeholder={t("telegramPlaceholder")}
              className={onboarding.input}
              value={formData.telegram_or_whatsapp}
              onChange={(e) => updateForm("telegram_or_whatsapp", e.target.value)}
            />
          </div>
        </div>

        <div className={onboarding.field}>
          <Label className={onboarding.label}>{t("methodTitle")}</Label>
          <div className={onboarding.choiceList}>
            {PAYOUT_METHOD_KEYS.map((key) => (
              <label key={key} className={`${onboarding.choiceRow} items-start`}>
                <input
                  type="radio"
                  name="payout_method"
                  value={key}
                  checked={method === key}
                  onChange={() => updateForm("payout_method", key)}
                  className="sr-only"
                />
                <span className={onboarding.choiceContent}>
                  <span className={`${onboarding.choiceTitle} block`}>{t(`methods.${key}.label`)}</span>
                </span>
                <span className={`${onboarding.choiceIndicator} mt-0.5`} aria-hidden>
                  <span className={onboarding.choiceIndicatorDot} />
                </span>
              </label>
            ))}
          </div>
        </div>

        {method === "crypto" && (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
            <div className={`${onboarding.field} md:col-span-2`}>
              <Label htmlFor="wallet_address" className={onboarding.label}>
                {t("walletAddress")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="wallet_address"
                required
                placeholder={t("walletPlaceholder")}
                className={`${onboarding.input} font-mono text-[13px]`}
                value={formData.wallet_address}
                onChange={(e) => updateForm("wallet_address", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="network" className={onboarding.label}>
                {t("network")} <span className={onboarding.required}>*</span>
              </Label>
              <Select
                required
                value={formData.network}
                onValueChange={(v) => updateForm("network", v)}
              >
                <SelectTrigger id="network" className={onboarding.selectTrigger}>
                  <SelectValue placeholder={tc("selectNetwork")} />
                </SelectTrigger>
                <SelectContent className={onboarding.selectContent}>
                  {NETWORK_KEYS.map((key) => (
                    <SelectItem key={key} value={key} className={onboarding.selectItem}>
                      {tn(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="memo" className={onboarding.label}>
                {t("memo")}
              </Label>
              <Input
                id="memo"
                placeholder={t("memoPlaceholder")}
                className={onboarding.input}
                value={formData.memo}
                onChange={(e) => updateForm("memo", e.target.value)}
              />
            </div>
          </div>
        )}

        {method === "wire_transfer" && (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
            <div className={onboarding.field}>
              <Label htmlFor="bank_name" className={onboarding.label}>
                {t("bankName")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="bank_name"
                required
                placeholder={t("bankNamePlaceholder")}
                className={onboarding.input}
                value={formData.bank_name}
                onChange={(e) => updateForm("bank_name", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="swift_bic" className={onboarding.label}>
                {t("swiftBic")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="swift_bic"
                required
                placeholder={t("swiftPlaceholder")}
                className={onboarding.input}
                value={formData.swift_bic}
                onChange={(e) => updateForm("swift_bic", e.target.value)}
              />
            </div>
            <div className={`${onboarding.field} md:col-span-2`}>
              <Label htmlFor="account_number" className={onboarding.label}>
                {t("accountIban")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="account_number"
                required
                className={onboarding.input}
                value={formData.account_number}
                onChange={(e) => updateForm("account_number", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="account_name" className={onboarding.label}>
                {t("accountHolder")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="account_name"
                required
                className={onboarding.input}
                value={formData.account_name}
                onChange={(e) => updateForm("account_name", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="reference" className={onboarding.label}>
                {t("reference")}
              </Label>
              <Input
                id="reference"
                className={onboarding.input}
                value={formData.reference}
                onChange={(e) => updateForm("reference", e.target.value)}
              />
            </div>
          </div>
        )}

        {method === "bank" && (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
            <div className={onboarding.field}>
              <Label htmlFor="bank_name" className={onboarding.label}>
                {t("bankName")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="bank_name"
                required
                className={onboarding.input}
                value={formData.bank_name}
                onChange={(e) => updateForm("bank_name", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="account_holder" className={onboarding.label}>
                {t("accountHolder")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="account_holder"
                required
                className={onboarding.input}
                value={formData.account_holder}
                onChange={(e) => updateForm("account_holder", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="account_number" className={onboarding.label}>
                {t("accountNumber")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="account_number"
                required
                className={onboarding.input}
                value={formData.account_number}
                onChange={(e) => updateForm("account_number", e.target.value)}
              />
            </div>
            <div className={onboarding.field}>
              <Label htmlFor="routing_iban" className={onboarding.label}>
                {t("routingIban")} <span className={onboarding.required}>*</span>
              </Label>
              <Input
                id="routing_iban"
                required
                className={onboarding.input}
                value={formData.routing_iban}
                onChange={(e) => updateForm("routing_iban", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <OnboardingActionBar>
        <button type="submit" disabled={isSubmitting} className={onboarding.btnPrimary}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {tc("submitting")}
            </>
          ) : (
            tc("submitFinish")
          )}
        </button>
      </OnboardingActionBar>
    </form>
  );
}
