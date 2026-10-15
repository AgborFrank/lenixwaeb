"use client";

import { useRef, useState } from "react";
import { Country } from "country-state-city";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { glass } from "@/lib/recovery-styles";
import { REFUND_ASSETS, REFUND_CHAINS } from "@/lib/refund/constants";

const selectTriggerClass =
  "h-11 w-full rounded-md border border-white/10 bg-black/30 text-sm text-white [&>svg]:text-neutral-500 focus:ring-2 focus:ring-yellow-400/25 focus:ring-offset-0";

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

interface RefundRequestFormProps {
  defaultEmail?: string;
  defaultName?: string;
  embedded?: boolean;
}

export default function RefundRequestForm({
  defaultEmail,
  defaultName,
  embedded = false,
}: RefundRequestFormProps) {
  const t = useTranslations("PurchaseRefund.Form");
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  const validateStepOne = (): boolean => {
    const form = formRef.current;
    if (!form) return false;

    const required = ["name", "email", "payment_tx_hash", "amount"] as const;
    for (const field of required) {
      const value = (form.elements.namedItem(field) as HTMLInputElement | null)?.value?.trim();
      if (!value) {
        toast.error(t("errors.requiredContinue"));
        return false;
      }
    }

    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t("errors.email"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    formData.set("role", role);

    const name = formData.get("name")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim();
    const payment_tx_hash = formData.get("payment_tx_hash")?.toString()?.trim();
    const amount = formData.get("amount")?.toString()?.trim();
    const incident_summary = formData.get("incident_summary")?.toString()?.trim();

    if (!name || !email || !payment_tx_hash || !amount || !incident_summary) {
      toast.error(t("errors.required"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t("errors.email"));
      return;
    }

    if (payment_tx_hash.length < 8 || incident_summary.length < 20) {
      toast.error(t("errors.required"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/refund-request", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || t("errors.failed"));
        return;
      }

      toast.success(t("errors.success"));
      setIsSubmitted(true);
      setStep(1);
      form.reset();
      setRole("buyer");
    } catch {
      toast.error(t("errors.failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={embedded ? "" : `${glass.section} bg-black`} id="start-refund">
      <div className={embedded ? "" : glass.container}>
        {!embedded && (
        <header className="mb-10 lg:mb-12 max-w-2xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4 text-neutral-300`}>{t("description")}</p>
        </header>
        )}

        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className={`${glass.panel} rounded-xl p-10 text-center`}>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{t("submittedTitle")}</h3>
              <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">{t("submittedBody")}</p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={glass.btnGlass}
              >
                {t("submitAnother")}
              </button>
            </div>
          ) : (
            <div className={`${glass.panel} rounded-xl overflow-hidden`}>
              <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="border-b lg:border-b-0 lg:border-r border-white/10 bg-black/25 p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-4">
                    {t("steps")}
                  </p>
                  <ol className="space-y-3">
                    {([1, 2] as const).map((id) => {
                      const isActive = step === id;
                      const isComplete = step > id;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (id === 2 && !validateStepOne()) return;
                              setStep(id);
                            }}
                            className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-white/20 bg-white/10"
                                : "border-transparent hover:bg-white/5"
                            }`}
                          >
                            <p
                              className={`text-xs font-medium mb-0.5 ${
                                isActive || isComplete ? "text-yellow-400" : "text-neutral-500"
                              }`}
                            >
                              {t("step", { id })}
                            </p>
                            <p className="text-sm font-semibold text-white leading-snug">
                              {t(id === 1 ? "step1Title" : "step2Title")}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                              {t(id === 1 ? "step1Desc" : "step2Desc")}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </aside>

                <div className="p-6 sm:p-8">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <input type="hidden" name="role" value={role} />
                    <input type="hidden" name="blockchain" defaultValue="ETH" />
                    <input type="hidden" name="currency" defaultValue="USDT" />
                    <input type="hidden" name="country_phone_code" id="refund_country_phone_code" defaultValue="US:+1" />

                    <div className={step === 1 ? "space-y-4" : "hidden"}>
                        <fieldset>
                          <legend className={glass.label}>{t("role")}</legend>
                          <div className="grid grid-cols-2 gap-2">
                            {(["buyer", "seller"] as const).map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setRole(value)}
                                className={`h-11 rounded-md border text-sm font-medium transition-colors ${
                                  role === value
                                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                                    : "border-white/10 bg-black/30 text-neutral-300 hover:bg-white/5"
                                }`}
                              >
                                {value === "buyer" ? t("roleBuyer") : t("roleSeller")}
                              </button>
                            ))}
                          </div>
                        </fieldset>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="refund-name" className={glass.label}>
                              {t("fullName")} <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="refund-name"
                              name="name"
                              type="text"
                              defaultValue={defaultName}
                              placeholder={t("namePlaceholder")}
                              className={glass.field}
                            />
                          </div>
                          <div>
                            <label htmlFor="refund-email" className={glass.label}>
                              {t("email")} <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="refund-email"
                              name="email"
                              type="email"
                              defaultValue={defaultEmail}
                              placeholder={t("emailPlaceholder")}
                              className={glass.field}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={glass.label}>{t("phone")}</label>
                          <PhoneCountrySelect countries={countries} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="counterparty_name" className={glass.label}>
                              {t("counterparty")}
                            </label>
                            <input
                              id="counterparty_name"
                              name="counterparty_name"
                              type="text"
                              placeholder={t("counterpartyPlaceholder")}
                              className={glass.field}
                            />
                          </div>
                          <div>
                            <label htmlFor="order_ref" className={glass.label}>
                              {t("orderRef")}
                            </label>
                            <input
                              id="order_ref"
                              name="order_ref"
                              type="text"
                              placeholder={t("orderPlaceholder")}
                              className={glass.field}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="payment_tx_hash" className={glass.label}>
                            {t("paymentProof")} <span className="text-red-400/90">*</span>
                          </label>
                          <input
                            id="payment_tx_hash"
                            name="payment_tx_hash"
                            type="text"
                            placeholder={t("paymentPlaceholder")}
                            className={`${glass.field} font-mono text-xs sm:text-sm`}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="refund-amount" className={glass.label}>
                              {t("amount")} <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="refund-amount"
                              name="amount"
                              type="text"
                              inputMode="decimal"
                              placeholder={t("amountPlaceholder")}
                              className={glass.field}
                            />
                          </div>
                          <div>
                            <label htmlFor="refund-currency" className={glass.label}>
                              {t("currency")}
                            </label>
                            <Select
                              defaultValue="USDT"
                              onValueChange={(value) => {
                                const el = formRef.current?.querySelector(
                                  '[name="currency"]',
                                ) as HTMLInputElement | null;
                                if (el) el.value = value;
                              }}
                            >
                              <SelectTrigger id="refund-currency" className={selectTriggerClass}>
                                <SelectValue placeholder={t("currency")} />
                              </SelectTrigger>
                              <SelectContent className="bg-neutral-950 border-white/10">
                                {REFUND_ASSETS.map((asset) => (
                                  <SelectItem
                                    key={asset}
                                    value={asset}
                                    className="text-white focus:bg-white/10"
                                  >
                                    {asset}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="refund-chain" className={glass.label}>
                            {t("blockchain")}
                          </label>
                          <Select
                            defaultValue="ETH"
                            onValueChange={(value) => {
                              const el = formRef.current?.querySelector(
                                '[name="blockchain"]',
                              ) as HTMLInputElement | null;
                              if (el) el.value = value;
                            }}
                          >
                            <SelectTrigger id="refund-chain" className={selectTriggerClass}>
                              <SelectValue placeholder={t("selectBlockchain")} />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-950 border-white/10 max-h-[280px]">
                              {REFUND_CHAINS.map((chain) => (
                                <SelectItem
                                  key={chain}
                                  value={chain}
                                  className="text-white focus:bg-white/10"
                                >
                                  {chain === "OTHER" ? t("otherChain") : chain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (validateStepOne()) setStep(2);
                            }}
                            className={`${glass.btnPrimary} w-full sm:w-auto`}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </div>
                    <div className={step === 2 ? "space-y-4" : "hidden"}>
                        <div>
                          <label htmlFor="incident_summary" className={glass.label}>
                            {t("summary")} <span className="text-red-400/90">*</span>
                          </label>
                          <textarea
                            id="incident_summary"
                            name="incident_summary"
                            rows={5}
                            placeholder={t("summaryPlaceholder")}
                            className={glass.textarea}
                          />
                        </div>

                        <div>
                          <label htmlFor="refund-evidence" className={glass.label}>
                            {t("evidence")}
                          </label>
                          <input
                            id="refund-evidence"
                            name="evidence"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            className={`${glass.field} h-auto py-2.5 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-white/15 cursor-pointer`}
                          />
                          <p className="text-xs text-neutral-500 mt-1.5">{t("evidenceHint")}</p>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {t.rich("privacy", {
                            link: (chunks) => (
                              <Link href="/privacy-policy" className={glass.textLink}>
                                {chunks}
                              </Link>
                            ),
                          })}
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`${glass.btnGlass} w-full sm:w-auto`}
                          >
                            {t("back")}
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${glass.btnPrimary} w-full sm:flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t("submitting")}
                              </>
                            ) : (
                              t("submit")
                            )}
                          </button>
                        </div>
                      </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {!embedded && (
        <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {(["confidential", "review", "fee"] as const).map((key) => (
            <article key={key} className={`${glass.card} px-4 py-4 text-center sm:text-left`}>
              <p className="text-sm font-semibold text-white mb-1">{t(`points.${key}.title`)}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{t(`points.${key}.desc`)}</p>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

function PhoneCountrySelect({
  countries,
}: {
  countries: { isoCode: string; name: string; phonecode: string }[];
}) {
  const defaultCountry = countries.find((country) => country.isoCode === "US") ?? countries[0];
  const defaultPlaceholder = defaultCountry ? `+${defaultCountry.phonecode}` : "";

  return (
    <div className="flex overflow-hidden rounded-md border border-white/10 bg-black/30 h-11">
      <Select
        defaultValue={defaultCountry?.isoCode ?? "US"}
        onValueChange={(isoCode) => {
          const country = countries.find((item) => item.isoCode === isoCode);
          const el = document.getElementById("refund_country_phone_code") as HTMLInputElement | null;
          if (el && country) el.value = `${country.isoCode}:+${country.phonecode}`;
        }}
      >
        <SelectTrigger className="w-[108px] h-11 border-0 border-r border-white/10 bg-transparent rounded-none text-sm text-white [&>svg]:text-neutral-500 shrink-0 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-neutral-950 border-white/10 max-h-[280px]">
          {countries.map((country) => (
            <SelectItem
              key={country.isoCode}
              value={country.isoCode}
              className="text-white focus:bg-white/10"
            >
              {country.isoCode} +{country.phonecode}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="tel"
        name="phone_number"
        placeholder={defaultPlaceholder}
        className="flex-1 min-w-0 bg-transparent border-0 px-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-0"
      />
    </div>
  );
}
