"use client";

import { useRef } from "react";
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
import { submitOnboardingDetails } from "../actions";
import { ArrowRight } from "lucide-react";

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

export function RecoveryDetailsForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={submitOnboardingDetails} className="space-y-6">
      {/* Hidden inputs for Select values (submitted with form) */}
      <input
        type="hidden"
        name="blockchain"
        id="blockchain"
        defaultValue="BTC"
      />
      <input type="hidden" name="currency" id="currency" defaultValue="USD" />
      <input
        type="hidden"
        name="country_phone_code"
        id="country_phone_code"
        defaultValue="US:+1"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
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
            <Label htmlFor="transaction_hash" className="text-gray-300">
              Transaction hash / Wallet address{" "}
              <span className="text-red-400">*</span>
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
              Approximate amount that was stolen{" "}
              <span className="text-red-400">*</span>
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

        {/* Right column */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Phone Number</Label>
            <PhoneCountrySelect countries={countries} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockchain-select" className="text-gray-300">
              Select Blockchain <span className="text-red-400">*</span>
            </Label>
            <Select
              name="blockchain"
              defaultValue="BTC"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector(
                  '[name="blockchain"]'
                ) as HTMLInputElement;
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

          <div className="space-y-2">
            <Label htmlFor="currency-select" className="text-gray-300">
              Select currency <span className="text-red-400">*</span>
            </Label>
            <Select
              name="currency"
              defaultValue="USD"
              onValueChange={(value) => {
                const el = formRef.current?.querySelector(
                  '[name="currency"]'
                ) as HTMLInputElement;
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
      </div>

      <p className="text-sm text-gray-400">
        Global Ledger needs your contact information to reach out about our
        products and services. You can unsubscribe anytime. For details, see our{" "}
        <a href="/privacy" className="text-yellow-400 hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <Button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all"
      >
        Submit and Continue
        <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}

function PhoneCountrySelect({
  countries,
}: {
  countries: { isoCode: string; name: string; phonecode: string }[];
}) {
  const defaultCountry =
    countries.find((c) => c.isoCode === "US") ?? countries[0];
  const defaultPlaceholder = defaultCountry
    ? `+${defaultCountry.phonecode}`
    : "";

  return (
    <div className="flex gap-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 h-11">
      <Select
        defaultValue={defaultCountry?.isoCode ?? "US"}
        onValueChange={(isoCode) => {
          const c = countries.find((x) => x.isoCode === isoCode);
          const el =
            typeof document !== "undefined"
              ? (document.getElementById(
                  "country_phone_code"
                ) as HTMLInputElement | null)
              : null;
          if (el && c) el.value = `${c.isoCode}:+${c.phonecode}`;
        }}
      >
        <SelectTrigger className="w-[100px] border-0 bg-transparent text-white rounded-none h-11 [&>svg]:text-gray-400 shrink-0 focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black/95 border-white/10 max-h-[280px]">
          {countries.map((c) => (
            <SelectItem
              key={c.isoCode}
              value={c.isoCode}
              className="text-white focus:bg-white/10"
            >
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
