"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitLoanStep1 } from "../actions";
import { OnboardingActionBar } from "../components/onboarding-action-bar";
import { OnboardingPendingSubmitButton } from "../components/onboarding-pending-submit-button";
import { onboarding } from "@/lib/onboarding-styles";

export type LoanType = {
  id: number;
  name: string;
  ltv: string | number;
  interest_rate: string | number;
  min_collateral: string | number;
  max_collateral: string | number;
};

const COLLATERAL_KEYS = ["BTC", "ETH", "SOL", "USDT", "USDC"] as const;
const DURATION_KEYS = ["6", "12", "24"] as const;

interface LoanApplicationFormProps {
  loanTypes: LoanType[];
}

export function LoanApplicationForm({ loanTypes }: LoanApplicationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const submissionError = searchParams.get("error");
  const t = useTranslations("Onboarding.LoanForm");
  const tc = useTranslations("Onboarding.Common");
  const ta = useTranslations("Onboarding.CollateralAssets");

  return (
    <form ref={formRef} action={submitLoanStep1}>
      <input type="hidden" name="loan_type_id" id="loan_type_id" defaultValue={loanTypes[0] ? String(loanTypes[0].id) : ""} />
      <input type="hidden" name="collateral_asset" id="collateral_asset" defaultValue="BTC" />
      <input type="hidden" name="duration" id="duration" defaultValue="12" />

      <div className={`${onboarding.cardBody} ${onboarding.fieldStack}`}>
        {submissionError && (
          <div className={onboarding.error} role="alert">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <p>{submissionError}</p>
          </div>
        )}
        {loanTypes.length === 0 && <p className={onboarding.warning}>{t("noProducts")}</p>}

        <div className={onboarding.field}>
          <Label className={onboarding.label}>{t("productTitle")}</Label>
          <RadioGroup
            defaultValue={loanTypes[0] ? String(loanTypes[0].id) : ""}
            onValueChange={(value) => {
              const el = formRef.current?.querySelector('[name="loan_type_id"]') as HTMLInputElement;
              if (el) el.value = value;
            }}
            className={onboarding.tileGrid}
          >
            {loanTypes.map((lt) => (
              <label key={lt.id} className={onboarding.choiceTile}>
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={String(lt.id)}
                    className="mt-0.5 border-zinc-600 text-yellow-400"
                  />
                  <span className="min-w-0">
                    <span className={onboarding.choiceTileTitle}>{lt.name}</span>
                    <p className={onboarding.choiceTileDesc}>
                      {t("productApr", { rate: String(lt.interest_rate), ltv: String(lt.ltv) })}
                    </p>
                    <p className={onboarding.choiceTileMeta}>
                      {t("productCollateral", {
                        min: String(lt.min_collateral),
                        max: String(lt.max_collateral),
                      })}
                    </p>
                  </span>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
          <div className={onboarding.field}>
            <Label htmlFor="loan_amount" className={onboarding.label}>
              {t("loanAmount")} <span className={onboarding.required}>*</span>
            </Label>
            <Input
              id="loan_amount"
              name="loan_amount"
              type="number"
              required
              placeholder={t("loanAmountPlaceholder")}
              min={1}
              className={onboarding.input}
            />
          </div>
          <div className={onboarding.field}>
            <Label htmlFor="collateral_asset_trigger" className={onboarding.label}>
              {t("collateralAsset")} <span className={onboarding.required}>*</span>
            </Label>
            <Select
              defaultValue="BTC"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector("#collateral_asset") as HTMLInputElement;
                if (el) el.value = value;
              }}
            >
              <SelectTrigger id="collateral_asset_trigger" className={onboarding.selectTrigger}>
                <SelectValue placeholder={tc("selectAsset")} />
              </SelectTrigger>
              <SelectContent className={onboarding.selectContent}>
                {COLLATERAL_KEYS.map((key) => (
                  <SelectItem key={key} value={key} className={onboarding.selectItem}>
                    {ta(key)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className={`${onboarding.field} md:col-span-2`}>
            <Label className={onboarding.label}>
              {t("loanTerm")} <span className={onboarding.required}>*</span>
            </Label>
            <RadioGroup
              defaultValue="12"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector("#duration") as HTMLInputElement;
                if (el) el.value = value;
              }}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            >
              {DURATION_KEYS.map((key) => (
                <label key={key} className={onboarding.choiceTile}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={key} className="border-zinc-600 text-yellow-400" />
                    <span className="text-sm text-white">{t(`durations.${key}`)}</span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      <OnboardingActionBar>
        <OnboardingPendingSubmitButton
          label={tc("continuePayout")}
          pendingLabel={tc("submitting")}
          disabled={loanTypes.length === 0}
        />
      </OnboardingActionBar>
      
    </form>
  );
}
