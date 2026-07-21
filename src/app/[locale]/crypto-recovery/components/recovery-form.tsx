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
import { glass } from "@/lib/recovery-styles";

const BLOCKCHAINS = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "SOL", label: "Solana (SOL)" },
  { value: "TRX", label: "Tron (TRX)" },
  { value: "BNB", label: "Binance Smart Chain (BNB)" },
  { value: "MATIC", label: "Polygon Mainnet (MATIC)" },
  { value: "AVAX", label: "Avalanche C-Chain (AVAX)" },
  { value: "ARB", label: "Arbitrum One (ARB)" },
  { value: "BASE", label: "Base (BASE)" },
  { value: "FANTOM", label: "Fantom (Fantom)" },
  { value: "GNOSIS", label: "Gnosis Chain (GNOSIS)" },
  { value: "KAVA", label: "Kava (KAVA)" },
  { value: "POL", label: "Polkadot (POL)" },
  { value: "SUI", label: "Sui (SUI)" },
  { value: "OTHER", label: "Other" },
];

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "BTC", label: "BTC" },
  { value: "ETH", label: "ETH" },
];

const INTAKE_POINTS = [
  {
    title: "Confidential",
    desc: "Encrypted intake and restricted case access.",
  },
  {
    title: "24h review",
    desc: "Initial assessment within one business day.",
  },
  {
    title: "No upfront fee",
    desc: "Terms confirmed before investigative work.",
  },
];

const FORM_STEPS = [
  { id: 1 as const, title: "Contact & loss details", desc: "Who you are and what was lost." },
  { id: 2 as const, title: "Incident report", desc: "Summary and supporting evidence." },
];

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

const selectTriggerClass =
  "h-11 w-full rounded-md border border-white/10 bg-black/30 text-sm text-white [&>svg]:text-neutral-500 focus:ring-2 focus:ring-yellow-400/25 focus:ring-offset-0";

export default function RecoveryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateStepOne = (): boolean => {
    const form = formRef.current;
    if (!form) return false;

    const required = ["name", "email", "transaction_hash", "amount_stolen"] as const;
    for (const field of required) {
      const value = (form.elements.namedItem(field) as HTMLInputElement | null)?.value?.trim();
      if (!value) {
        toast.error("Please complete all required fields before continuing.");
        return false;
      }
    }

    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

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
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/recovery-request", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || "Failed to submit recovery request");
        return;
      }

      toast.success("Recovery request submitted. Our team will contact you soon.");
      setIsSubmitted(true);
      setStep(1);
      form.reset();
    } catch {
      toast.error("Failed to submit recovery request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`${glass.section} bg-black`} id="start-recovery">
      <div className={glass.container}>
        <header className="mb-10 lg:mb-12 max-w-2xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>Case intake</p>
          <h2 className={glass.titleCenter}>Submit a recovery request</h2>
          <p className={`${glass.leadCenter} mt-4 text-neutral-300`}>
            Provide transaction details and a brief incident summary. Our investigators use this to
            determine traceability before any engagement terms are discussed.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          {isSubmitted ? (
            <div className={`${glass.panel} rounded-xl p-10 text-center`}>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Request submitted</h3>
              <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
                Our recovery team will review your case and contact you within 24–48 hours.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={glass.btnGlass}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <div className={`${glass.panel} rounded-xl overflow-hidden`}>
              <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="border-b lg:border-b-0 lg:border-r border-white/10 bg-black/25 p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-4">
                    Steps
                  </p>
                  <ol className="space-y-3">
                    {FORM_STEPS.map((item) => {
                      const isActive = step === item.id;
                      const isComplete = step > item.id;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.id === 2 && !validateStepOne()) return;
                              setStep(item.id);
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
                              Step {item.id}
                            </p>
                            <p className="text-sm font-semibold text-white leading-snug">
                              {item.title}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                              {item.desc}
                            </p>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </aside>

                <div className="p-6 sm:p-8">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <input type="hidden" name="blockchain" id="blockchain" defaultValue="BTC" />
                    <input type="hidden" name="currency" id="currency" defaultValue="USD" />
                    <input
                      type="hidden"
                      name="country_phone_code"
                      id="country_phone_code"
                      defaultValue="US:+1"
                    />

                    {step === 1 ? (
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className={glass.label}>
                              Full name <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              required
                              placeholder="John Doe"
                              className={glass.field}
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className={glass.label}>
                              Email <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              placeholder="john@example.com"
                              className={glass.field}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={glass.label}>Phone (optional)</label>
                          <PhoneCountrySelect countries={countries} />
                        </div>

                        <div>
                          <label htmlFor="transaction_hash" className={glass.label}>
                            Transaction hash or wallet address{" "}
                            <span className="text-red-400/90">*</span>
                          </label>
                          <input
                            id="transaction_hash"
                            name="transaction_hash"
                            type="text"
                            required
                            placeholder="0x… or bc1…"
                            className={`${glass.field} font-mono text-xs sm:text-sm`}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="amount_stolen" className={glass.label}>
                              Approximate amount lost <span className="text-red-400/90">*</span>
                            </label>
                            <input
                              id="amount_stolen"
                              name="amount_stolen"
                              type="text"
                              required
                              placeholder="e.g. 50000"
                              className={glass.field}
                            />
                          </div>
                          <div>
                            <label htmlFor="currency-select" className={glass.label}>
                              Currency
                            </label>
                            <Select
                              defaultValue="USD"
                              onValueChange={(value) => {
                                const el = formRef.current?.querySelector(
                                  '[name="currency"]'
                                ) as HTMLInputElement;
                                if (el) el.value = value;
                              }}
                            >
                              <SelectTrigger id="currency-select" className={selectTriggerClass}>
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                              <SelectContent className="bg-neutral-950 border-white/10">
                                {CURRENCIES.map((c) => (
                                  <SelectItem
                                    key={c.value}
                                    value={c.value}
                                    className="text-white focus:bg-white/10"
                                  >
                                    {c.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="blockchain-select" className={glass.label}>
                            Blockchain
                          </label>
                          <Select
                            defaultValue="BTC"
                            onValueChange={(value) => {
                              const el = formRef.current?.querySelector(
                                '[name="blockchain"]'
                              ) as HTMLInputElement;
                              if (el) el.value = value;
                            }}
                          >
                            <SelectTrigger id="blockchain-select" className={selectTriggerClass}>
                              <SelectValue placeholder="Select blockchain" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-950 border-white/10 max-h-[280px]">
                              {BLOCKCHAINS.map((b) => (
                                <SelectItem
                                  key={b.value}
                                  value={b.value}
                                  className="text-white focus:bg-white/10"
                                >
                                  {b.label}
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
                            Continue to incident details
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="incident_summary" className={glass.label}>
                            Incident summary <span className="text-red-400/90">*</span>
                          </label>
                          <textarea
                            id="incident_summary"
                            name="incident_summary"
                            required
                            rows={5}
                            placeholder="Describe what happened, when it occurred, and any platforms or wallets involved."
                            className={glass.textarea}
                          />
                        </div>

                        <div>
                          <label htmlFor="evidence" className={glass.label}>
                            Supporting evidence (optional)
                          </label>
                          <input
                            id="evidence"
                            name="evidence"
                            type="file"
                            accept="image/*,.pdf"
                            className={`${glass.field} h-auto py-2.5 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-white/15 cursor-pointer`}
                          />
                          <p className="text-xs text-neutral-500 mt-1.5">
                            Screenshots, exchange emails, or police reports (PDF, PNG, JPG).
                          </p>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Lenix Protocol uses your contact details to respond about this case. See
                          our{" "}
                          <a href="/privacy-policy" className={glass.textLink}>
                            Privacy Policy
                          </a>
                          .
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`${glass.btnGlass} w-full sm:w-auto`}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${glass.btnPrimary} w-full sm:flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting…
                              </>
                            ) : (
                              "Submit recovery request"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {INTAKE_POINTS.map((item) => (
            <article key={item.title} className={`${glass.card} px-4 py-4 text-center sm:text-left`}>
              <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
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
    <div className="flex overflow-hidden rounded-md border border-white/10 bg-black/30 h-11">
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
        <SelectTrigger className="w-[108px] h-11 border-0 border-r border-white/10 bg-transparent rounded-none text-sm text-white [&>svg]:text-neutral-500 shrink-0 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-neutral-950 border-white/10 max-h-[280px]">
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
        className="flex-1 min-w-0 bg-transparent border-0 px-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-0"
      />
    </div>
  );
}
