"use client";

import { useState } from "react";
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
import { submitLoanPayout } from "../actions";
import { ArrowRight } from "lucide-react";

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
  const [method, setMethod] = useState<"crypto" | "wire_transfer" | "bank">(
    "crypto"
  );
  const [network, setNetwork] = useState(
    CRYPTO_NETWORKS[0]?.value ?? "ethereum"
  );

  return (
    <form action={submitLoanPayout} className="space-y-6">
      <input type="hidden" name="payout_method" value={method} />

      <div className="space-y-3">
        <Label className="text-gray-300">
          How would you like to receive your payout?{" "}
          <span className="text-red-400">*</span>
        </Label>
        <RadioGroup
          value={method}
          onValueChange={(v) =>
            setMethod(v as "crypto" | "wire_transfer" | "bank")
          }
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
              name="wallet_address"
              required
              placeholder="0x... or your address"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="network" className="text-gray-400 text-sm">
              Network <span className="text-red-400">*</span>
            </Label>
            <input type="hidden" name="network" value={network} />
            <Select required value={network} onValueChange={setNetwork}>
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
              name="memo"
              placeholder="Required by some networks"
              className="bg-black/30 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
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
                name="bank_name"
                required
                placeholder="e.g. Chase, HSBC"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swift_bic" className="text-gray-400 text-sm">
                SWIFT / BIC <span className="text-red-400">*</span>
              </Label>
              <Input
                id="swift_bic"
                name="swift_bic"
                required
                placeholder="e.g. CHASUS33"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="account_number" className="text-gray-400 text-sm">
                Account number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_number"
                name="account_number"
                required
                placeholder="IBAN or account number"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_name" className="text-gray-400 text-sm">
                Account holder name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_name"
                name="account_name"
                required
                placeholder="Full name on account"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference" className="text-gray-400 text-sm">
                Reference (optional)
              </Label>
              <Input
                id="reference"
                name="reference"
                placeholder="Payment reference"
                className="bg-black/30 border-white/10 text-white rounded-xl"
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
                name="bank_name"
                required
                placeholder="Your bank name"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_holder" className="text-gray-400 text-sm">
                Account holder name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_holder"
                name="account_holder"
                required
                placeholder="Full name"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_number" className="text-gray-400 text-sm">
                Account number <span className="text-red-400">*</span>
              </Label>
              <Input
                id="account_number"
                name="account_number"
                required
                placeholder="Account number"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routing_iban" className="text-gray-400 text-sm">
                Routing number / IBAN <span className="text-red-400">*</span>
              </Label>
              <Input
                id="routing_iban"
                name="routing_iban"
                required
                placeholder="Routing (US) or IBAN"
                className="bg-black/30 border-white/10 text-white rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)]"
      >
        Submit and Continue
        <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}
