"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Country } from "country-state-city";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { OnboardingActionBar } from "../components/onboarding-action-bar";
import { OnboardingPhoneField } from "../components/onboarding-form-fields";
import { onboarding } from "@/lib/onboarding-styles";

const BANKING_SERVICE_KEYS = ["transfer", "receive", "liquidation", "lending", "custody"] as const;

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

export function BankingDetailsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const t = useTranslations("Onboarding.BankingForm");
  const tc = useTranslations("Onboarding.Common");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState("US");
  const [countryPhoneCode, setCountryPhoneCode] = useState("US:+1");
  const [bankingService, setBankingService] = useState("transfer");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | null => {
    if (name === "name") {
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
    }
    if (name === "phone_number" && value) {
      const phoneRegex = /^[0-9\s\-\(\)\+]+$/;
      if (!phoneRegex.test(value)) return "Invalid phone number format";
    }
    return null;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const payload = {
        name: formData.get("name") as string,
        phone_number: formData.get("phone_number") as string,
        country_phone_code: countryPhoneCode,
        country: country,
        banking_service: bankingService,
        notes: formData.get("notes") as string,
      };

      const nameError = validateField("name", payload.name);
      if (nameError) {
        setTouched((prev) => ({ ...prev, name: true }));
        setFieldErrors({ name: nameError });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/onboarding/banking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.error || "Failed to submit banking request");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setFieldErrors({});
    formRef.current?.requestSubmit();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className={`${onboarding.cardBody} ${onboarding.fieldStack}`}>
        {error && (
          <div className="rounded-lg border border-red-600/20 bg-red-600/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-2 text-xs text-red-500 underline underline-offset-2 transition-colors hover:text-red-400"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 ${onboarding.gridGap}`}>
          <div className={onboarding.field}>
            <Label htmlFor="name" className={onboarding.label}>
              {tc("fullName")} <span className={onboarding.required}>*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                type="text"
                required
                disabled={isSubmitting}
                placeholder={tc("placeholderName")}
                onBlur={handleBlur}
                className={`${onboarding.input} ${fieldErrors.name && touched.name ? "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}`}
              />
              {touched.name && !fieldErrors.name && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
              )}
            </div>
            {fieldErrors.name && touched.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className={onboarding.field}>
            <Label htmlFor="phone_number" className={onboarding.label}>
              {tc("phoneNumber")}
            </Label>
            <OnboardingPhoneField
              countries={countries}
              phoneInputId="phone_number"
              describedBy={fieldErrors.phone_number ? "phone_number_error" : undefined}
              disabled={isSubmitting}
              onBlur={handleBlur}
              onPhoneCodeChange={setCountryPhoneCode}
            />
            {fieldErrors.phone_number && touched.phone_number && (
              <p id="phone_number_error" className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {fieldErrors.phone_number}
              </p>
            )}
          </div>

          <div className={onboarding.field}>
            <Label htmlFor="country-select" className={onboarding.label}>
              {t("countryCorridor")} <span className={onboarding.required}>*</span>
            </Label>
            <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
              <SelectTrigger id="country-select" className={onboarding.selectTrigger}>
                <SelectValue placeholder={tc("selectCountry")} />
              </SelectTrigger>
              <SelectContent className={onboarding.selectContent}>
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.isoCode} className={onboarding.selectItem}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={onboarding.field}>
            <Label htmlFor="banking-service-select" className={onboarding.label}>
              {t("serviceNeeded")} <span className={onboarding.required}>*</span>
            </Label>
            <Select value={bankingService} onValueChange={setBankingService} disabled={isSubmitting}>
              <SelectTrigger id="banking-service-select" className={onboarding.selectTrigger}>
                <SelectValue placeholder={tc("selectService")} />
              </SelectTrigger>
              <SelectContent className={onboarding.selectContent}>
                {BANKING_SERVICE_KEYS.map((key) => (
                  <SelectItem key={key} value={key} className={onboarding.selectItem}>
                    {t(`services.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`${onboarding.field} md:col-span-2`}>
            <Label htmlFor="notes" className={onboarding.label}>
              {t("additionalDetails")}
            </Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              disabled={isSubmitting}
              placeholder={t("notesPlaceholder")}
              className={onboarding.textarea}
            />
          </div>
        </div>
      </div>

      <OnboardingActionBar>
        <button type="submit" disabled={isSubmitting} className={onboarding.btnPrimary}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
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
