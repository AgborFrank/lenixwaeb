"use client";

import { useRef, useState } from "react";
import { Country } from "country-state-city";
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
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Shield, Clock } from "lucide-react";
import { toast } from "sonner";

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

const countries = Country.getAllCountries() as {
  isoCode: string;
  name: string;
  phonecode: string;
}[];

export default function RecoveryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
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
      form.reset();
    } catch {
      toast.error("Failed to submit recovery request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = isSubmitted ? (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Request Submitted</h3>
      <p className="text-gray-400 mb-6">
        Our recovery team will review your case and contact you within 24–48 hours.
      </p>
      <Button
        variant="outline"
        className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
        onClick={() => setIsSubmitted(false)}
      >
        Submit Another Request
      </Button>
    </div>
  ) : (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="blockchain" id="blockchain" defaultValue="BTC" />
      <input type="hidden" name="currency" id="currency" defaultValue="USD" />
      <input type="hidden" name="country_phone_code" id="country_phone_code" defaultValue="US:+1" />

      {/* Step indicator */}
      <div className="flex gap-2">
        <div
          className={`h-1 flex-1 rounded-full transition-colors ${
            step >= 1 ? "bg-yellow-400" : "bg-white/10"
          }`}
        />
        <div
          className={`h-1 flex-1 rounded-full transition-colors ${
            step >= 2 ? "bg-yellow-400" : "bg-white/10"
          }`}
        />
      </div>
      <p className="text-sm text-gray-400">
        Step {step} of 2
      </p>

      <div className={step === 1 ? "space-y-6" : "hidden"}>
        <h3 className="text-lg font-semibold text-white">Contact & case basics</h3>
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="e.g. john@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Phone Number</Label>
              <PhoneCountrySelect countries={countries} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction_hash" className="text-gray-300">
                Transaction hash / Wallet address <span className="text-red-400">*</span>
              </Label>
              <Input
                id="transaction_hash"
                name="transaction_hash"
                type="text"
                required
                placeholder="Enter a hash or address (e.g. 0x1234...)"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount_stolen" className="text-gray-300">
                Approximate amount that was stolen <span className="text-red-400">*</span>
              </Label>
              <Input
                id="amount_stolen"
                name="amount_stolen"
                type="text"
                required
                placeholder="Enter estimated amount (e.g. 200000)"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blockchain-select" className="text-gray-300">
                  Blockchain <span className="text-red-400">*</span>
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
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11 [&>svg]:text-gray-400"
                  >
                    <SelectValue placeholder="Select blockchain" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/10">
                    {BLOCKCHAINS.map((b) => (
                      <SelectItem key={b.value} value={b.value} className="text-white focus:bg-white/10">
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency-select" className="text-gray-300">
                  Currency <span className="text-red-400">*</span>
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
                    className="bg-white/5 border-white/10 text-white rounded-xl h-11 [&>svg]:text-gray-400"
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/10">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white focus:bg-white/10">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        </div>
        <Button
          type="button"
          onClick={() => setStep(2)}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all"
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className={step === 2 ? "space-y-6" : "hidden"}>
        <h3 className="text-lg font-semibold text-white">Incident details</h3>
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incident_summary" className="text-gray-300">
                Incident Summary <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="incident_summary"
                name="incident_summary"
                required
                rows={4}
                placeholder="e.g. Funds were stolen via phishing scam..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl resize-y min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evidence" className="text-gray-300">
                Screenshot or other evidence supporting the claim
              </Label>
              <Input
                id="evidence"
                name="evidence"
                type="file"
                accept="image/*,.pdf"
                className="bg-white/5 border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-black file:font-medium rounded-xl h-11 file:cursor-pointer cursor-pointer"
              />
            </div>
        </div>

        <p className="text-sm text-gray-400">
            Lenix Protocol needs your contact information to reach out about your recovery case. For details, see our{" "}
            <a href="/privacy-policy" className="text-yellow-400 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

        <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Recovery Request
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
        </div>
      </div>
    </form>
  );

  return (
    <section className="bg-black py-24 px-4 relative border-t border-white/5" id="start-recovery">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Your
                <br />
                <span className="text-yellow-400">Recovery Case</span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                Time is critical in asset recovery. The sooner you report the loss, the higher the chances of a successful reclamation. Our team evaluates new cases within 24 hours.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { title: "Confidential Consultation", desc: "Your case details are protected by attorney-client privilege standards.", icon: Shield },
                { title: "Rapid Response Team", desc: "Immediate deployment of forensic tools to track asset movement.", icon: Clock },
                { title: "Risk-Free Assessment", desc: "We evaluate the recoverability of your case at no cost.", icon: CheckCircle },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
            <div className="relative z-10">{formContent}</div>
          </div>
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
    <div className="flex gap-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 h-11">
      <Select
        defaultValue={defaultCountry?.isoCode ?? "US"}
        onValueChange={(isoCode) => {
          const c = countries.find((x) => x.isoCode === isoCode);
          const el = typeof document !== "undefined"
            ? (document.getElementById("country_phone_code") as HTMLInputElement | null)
            : null;
          if (el && c) el.value = `${c.isoCode}:+${c.phonecode}`;
        }}
      >
        <SelectTrigger className="w-[100px] border-0 bg-transparent text-white rounded-none h-11 [&>svg]:text-gray-400 shrink-0 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black/95 border-white/10 max-h-[280px]">
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
        className="flex-1 min-w-0 bg-transparent border-0 px-3 py-2 text-white placeholder:text-gray-500 outline-none focus:ring-0 text-sm"
      />
    </div>
  );
}
