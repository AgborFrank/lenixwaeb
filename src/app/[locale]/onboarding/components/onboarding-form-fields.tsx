"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboarding } from "@/lib/onboarding-styles";

interface OnboardingPhoneFieldProps {
  countries: { isoCode: string; name: string; phonecode: string }[];
  countryPhoneCodeId?: string;
  phoneInputId?: string;
  describedBy?: string;
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onPhoneCodeChange?: (value: string) => void;
}

export function OnboardingPhoneField({
  countries,
  countryPhoneCodeId = "country_phone_code",
  phoneInputId = "phone_number",
  describedBy,
  disabled = false,
  onBlur,
  onPhoneCodeChange,
}: OnboardingPhoneFieldProps) {
  const defaultCountry = countries.find((c) => c.isoCode === "US") ?? countries[0];
  const defaultPlaceholder = defaultCountry ? `+${defaultCountry.phonecode}` : "";

  return (
    <div className={onboarding.phoneWrap}>
      <Select
        defaultValue={defaultCountry?.isoCode ?? "US"}
        disabled={disabled}
        onValueChange={(isoCode) => {
          const c = countries.find((x) => x.isoCode === isoCode);
          if (c) {
            const phoneCode = `${c.isoCode}:+${c.phonecode}`;
            const el = document.getElementById(countryPhoneCodeId) as HTMLInputElement | null;
            if (el) el.value = phoneCode;
            if (onPhoneCodeChange) onPhoneCodeChange(phoneCode);
          }
        }}
      >
        <SelectTrigger className={onboarding.phoneSelect} aria-label="Country code">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={`${onboarding.selectContent} max-h-[280px]`}>
          {countries.map((c) => (
            <SelectItem key={c.isoCode} value={c.isoCode} className={onboarding.selectItem}>
              {c.isoCode} +{c.phonecode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="tel"
        id={phoneInputId}
        name="phone_number"
        placeholder={defaultPlaceholder}
        disabled={disabled}
        aria-label="Phone number"
        aria-describedby={describedBy}
        onBlur={onBlur}
        className={onboarding.phoneInput}
      />
    </div>
  );
}
