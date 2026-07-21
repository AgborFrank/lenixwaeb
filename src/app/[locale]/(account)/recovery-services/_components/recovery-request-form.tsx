"use client";

import { useRef, useState } from "react";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";

const BLOCKCHAIN_KEYS = [
  "BTC",
  "ETH",
  "SOL",
  "TRX",
  "BNB",
  "MATIC",
  "AVAX",
  "ARB",
  "BASE",
  "FANTOM",
  "GNOSIS",
  "KAVA",
  "POL",
  "SUI",
  "OTHER",
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "BTC", "ETH"] as const;

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

export function RecoveryRequestForm() {
  const t = useTranslations("AccountRecoveryServices");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name")?.toString()?.trim();
    const transaction_hash = formData.get("transaction_hash")?.toString()?.trim();
    const amount_stolen = formData.get("amount_stolen")?.toString()?.trim();
    const incident_summary = formData.get("incident_summary")?.toString()?.trim();

    if (!name || !transaction_hash || !amount_stolen || !incident_summary) {
      toast.error(t("toast.required_fields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/recovery-request", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || t("toast.submit_failed"));
        return;
      }

      toast.success(t("toast.submit_success"));
      setIsSubmitted(true);
      form.reset();
    } catch {
      toast.error(t("toast.submit_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">{t("success.title")}</h3>
        <p className="mb-6 text-gray-400">{t("success.description")}</p>
        <Button
          variant="outline"
          className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
          onClick={() => setIsSubmitted(false)}
        >
          {t("success.submit_another")}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="blockchain" id="blockchain" defaultValue="BTC" />
      <input type="hidden" name="currency" id="currency" defaultValue="USD" />
      <input type="hidden" name="country_phone_code" id="country_phone_code" defaultValue="US:+1" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              {t("form.name")} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t("form.name_placeholder")}
              className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction_hash" className="text-gray-300">
              {t("form.transaction_hash")} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="transaction_hash"
              name="transaction_hash"
              type="text"
              required
              placeholder={t("form.transaction_hash_placeholder")}
              className="h-11 rounded-xl border-white/10 bg-white/5 font-mono text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount_stolen" className="text-gray-300">
              {t("form.amount_stolen")} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="amount_stolen"
              name="amount_stolen"
              type="text"
              required
              placeholder={t("form.amount_stolen_placeholder")}
              className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident_summary" className="text-gray-300">
              {t("form.incident_summary")} <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="incident_summary"
              name="incident_summary"
              required
              rows={4}
              placeholder={t("form.incident_summary_placeholder")}
              className="min-h-[100px] resize-y rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evidence" className="text-gray-300">
              {t("form.evidence")}
            </Label>
            <Input
              id="evidence"
              name="evidence"
              type="file"
              accept="image/*,.pdf"
              className="h-11 cursor-pointer rounded-xl border-white/10 bg-white/5 text-white file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:font-medium file:text-black"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">{t("form.phone_number")}</Label>
            <PhoneCountrySelect countries={countries} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockchain-select" className="text-gray-300">
              {t("form.blockchain")} <span className="text-red-400">*</span>
            </Label>
            <Select
              defaultValue="BTC"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector('[name="blockchain"]') as HTMLInputElement;
                if (el) el.value = value;
              }}
            >
              <SelectTrigger
                id="blockchain-select"
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white [&>svg]:text-gray-400"
              >
                <SelectValue placeholder={t("form.blockchain_placeholder")} />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/95">
                {BLOCKCHAIN_KEYS.map((key) => (
                  <SelectItem key={key} value={key} className="text-white focus:bg-white/10">
                    {t(`blockchains.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency-select" className="text-gray-300">
              {t("form.currency")} <span className="text-red-400">*</span>
            </Label>
            <Select
              defaultValue="USD"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector('[name="currency"]') as HTMLInputElement;
                if (el) el.value = value;
              }}
            >
              <SelectTrigger
                id="currency-select"
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white [&>svg]:text-gray-400"
              >
                <SelectValue placeholder={t("form.currency_placeholder")} />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/95">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-white focus:bg-white/10">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        {t("form.privacy_prefix")}{" "}
        <Link href="/privacy-policy" className="text-yellow-400 hover:underline">
          {t("form.privacy_policy")}
        </Link>
        {t("form.privacy_suffix")}
      </p>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-yellow-400 py-4 text-base font-bold text-black shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] disabled:opacity-70 md:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("form.submitting")}
          </>
        ) : (
          <>
            {t("form.submit")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

function PhoneCountrySelect({
  countries,
}: {
  countries: { isoCode: string; name: string; phonecode: string }[];
}) {
  const defaultCountry = countries.find((c) => c.isoCode === "US") ?? countries[0];
  const defaultPlaceholder = defaultCountry ? `+${defaultCountry.phonecode}` : "";

  return (
    <div className="flex h-11 gap-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <Select
        defaultValue={defaultCountry?.isoCode ?? "US"}
        onValueChange={(isoCode) => {
          const c = countries.find((x) => x.isoCode === isoCode);
          const el =
            typeof document !== "undefined"
              ? (document.getElementById("country_phone_code") as HTMLInputElement | null)
              : null;
          if (el && c) el.value = `${c.isoCode}:+${c.phonecode}`;
        }}
      >
        <SelectTrigger className="h-11 w-[100px] shrink-0 rounded-none border-0 bg-transparent text-white focus:ring-0 [&>svg]:text-gray-400">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[280px] border-white/10 bg-black/95">
          {countries.map((c) => (
            <SelectItem key={c.isoCode} value={c.isoCode} className="text-white focus:bg-white/10">
              {c.isoCode} +{c.phonecode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="tel"
        name="phone_number"
        placeholder={defaultPlaceholder}
        className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:ring-0"
      />
    </div>
  );
}
