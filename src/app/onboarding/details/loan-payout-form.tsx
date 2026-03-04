"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const PAYOUT_METHODS = [
  { value: "crypto", label: "Crypto", desc: "Receive to your wallet address" },
  {
    value: "wire_transfer",
    label: "Wire Transfer",
    desc: "International SWIFT transfer",
  },
  { value: "bank", label: "Bank", desc: "Domestic ACH / local transfer" },
] as const;

const CRYPTO_NETWORKS = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "bsc", label: "BSC" },
  { value: "solana", label: "Solana" },
  { value: "bitcoin", label: "Bitcoin" },
];

export function LoanPayoutForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    payout_method: "crypto" as "crypto" | "wire_transfer" | "bank",
    phone_number: "",
    telegram_or_whatsapp: "",
    wallet_address: "",
    network: CRYPTO_NETWORKS[0]?.value ?? "ethereum",
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

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });

    const res = await fetch("/api/onboarding/loan-payout", {
      method: "POST",
      body: payload,
    });
    const result = await res.json();
    setIsSubmitting(false);

    if (!res.ok || result?.error) {
      if (result?.error === "Please log in") {
        router.push("/login");
      } else {
        toast.error(result?.error ?? "Something went wrong");
      }
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const method = formData.payout_method;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact details */}
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <div>
          <Label className="text-gray-300 font-medium">How can we contact you?</Label>
          <p className="text-xs text-gray-500 mt-1">Provide at least one so we can reach you about your application.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-gray-400 text-sm">Phone number</Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="e.g. +1 234 567 8900"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
              value={formData.phone_number}
              onChange={(e) => updateForm("phone_number", e.target.value)}
            />
            <p className="text-[11px] text-gray-500">For calls and SMS updates</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram_or_whatsapp" className="text-gray-400 text-sm">Telegram or WhatsApp</Label>
            <Input
              id="telegram_or_whatsapp"
              placeholder="e.g. @username or +1234567890"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
              value={formData.telegram_or_whatsapp}
              onChange={(e) => updateForm("telegram_or_whatsapp", e.target.value)}
            />
            <p className="text-[11px] text-gray-500">For quick messaging</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-gray-300">
          How would you like to receive your payout?{" "}
          <span className="text-red-400">*</span>
        </Label>
        <RadioGroup
          value={method}
          onValueChange={(v) => updateForm("payout_method", v as typeof method)}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {PAYOUT_METHODS.map((m) => (
            <label
              key={m.value}
              className="flex flex-col rounded-2xl border border-white/20 bg-white/5 p-4 cursor-pointer transition-all hover:bg-white/10 has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-yellow-400/50 has-[[data-state=checked]]:border-yellow-400/30"
            >
              <RadioGroupItem
                value={m.value}
                className="border-white/30 text-yellow-400"
              />
              <span className="text-white font-semibold mt-2 block">
                {m.label}
              </span>
              <span className="text-sm text-white/70">{m.desc}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {method === "crypto" && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <Label className="text-gray-300">Crypto payout details</Label>
          <div className="space-y-2">
            <Label htmlFor="wallet_address" className="text-gray-400 text-sm">
              Wallet address <span className="text-red-400">*</span>
            </Label>
            <Input
              id="wallet_address"
              required
              placeholder="0x... or your address"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
              value={formData.wallet_address}
              onChange={(e) => updateForm("wallet_address", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="network" className="text-gray-400 text-sm">
              Network <span className="text-red-400">*</span>
            </Label>
            <Select
              required
              value={formData.network}
              onValueChange={(v) => updateForm("network", v)}
            >
              <SelectTrigger
                id="network"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              >
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10">
                {CRYPTO_NETWORKS.map((n) => (
                  <SelectItem
                    key={n.value}
                    value={n.value}
                    className="text-white focus:bg-white/10"
                  >
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memo" className="text-gray-400 text-sm">
              Memo / tag (optional)
            </Label>
            <Input
              id="memo"
              placeholder="Required by some networks"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
              value={formData.memo}
              onChange={(e) => updateForm("memo", e.target.value)}
            />
          </div>
        </div>
      )}

      {method === "wire_transfer" && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <Label className="text-gray-300">Wire transfer details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name" className="text-gray-400 text-sm">
                Bank name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="bank_name"
                required
                placeholder="e.g. Chase, HSBC"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.bank_name}
                onChange={(e) => updateForm("bank_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swift_bic" className="text-gray-400 text-sm">
                SWIFT / BIC <span className="text-red-400">*</span>
              </Label>
              <Input
                id="swift_bic"
                required
                placeholder="e.g. CHASUS33"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.swift_bic}
                onChange={(e) => updateForm("swift_bic", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="account_number" className="text-gray-400 text-sm">
                Account number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_number"
                required
                placeholder="IBAN or account number"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.account_number}
                onChange={(e) => updateForm("account_number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_name" className="text-gray-400 text-sm">
                Account holder name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_name"
                required
                placeholder="Full name on account"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.account_name}
                onChange={(e) => updateForm("account_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-gray-400 text-sm">
                Reference (optional)
              </Label>
              <Input
                id="reference"
                placeholder="Payment reference"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.reference}
                onChange={(e) => updateForm("reference", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {method === "bank" && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <Label className="text-gray-300">Bank account details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name" className="text-gray-400 text-sm">
                Bank name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="bank_name"
                required
                placeholder="Your bank name"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.bank_name}
                onChange={(e) => updateForm("bank_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_holder" className="text-gray-400 text-sm">
                Account holder name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_holder"
                required
                placeholder="Full name"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.account_holder}
                onChange={(e) => updateForm("account_holder", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_number" className="text-gray-400 text-sm">
                Account number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_number"
                required
                placeholder="Account number"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.account_number}
                onChange={(e) => updateForm("account_number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routing_iban" className="text-gray-400 text-sm">
                Routing number / IBAN <span className="text-red-400">*</span>
              </Label>
              <Input
                id="routing_iban"
                required
                placeholder="Routing (US) or IBAN"
                className="bg-black/30 border-white/10 text-white rounded-xl"
                value={formData.routing_iban}
                onChange={(e) => updateForm("routing_iban", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)] disabled:opacity-70"
      >
        {isSubmitting ? "Submitting…" : "Submit and Continue"}
        <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}
