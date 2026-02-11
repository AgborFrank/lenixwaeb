"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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

export type LoanType = {
  id: number;
  name: string;
  ltv: string | number;
  interest_rate: string | number;
  min_collateral: string | number;
  max_collateral: string | number;
};

const CARD_GRADIENTS = [
  "from-amber-500/15 via-yellow-500/10 to-orange-500/15 border-amber-400/20",
  "from-blue-500/15 via-cyan-500/10 to-sky-500/15 border-blue-400/20",
  "from-emerald-500/15 via-teal-500/10 to-green-500/15 border-emerald-400/20",
  "from-violet-500/15 via-purple-500/10 to-fuchsia-500/15 border-violet-400/20",
  "from-rose-500/15 via-pink-500/10 to-red-500/15 border-rose-400/20",
];

const COLLATERAL_ASSETS = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "SOL", label: "Solana (SOL)" },
  { value: "USDT", label: "USDT" },
  { value: "USDC", label: "USDC" },
];

const DURATIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

export function LoanApplicationForm({ loanTypes }: { loanTypes: LoanType[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(
    loanTypes[0] ?? null
  );

  return (
    <form ref={formRef} action={submitLoanStep1} className="space-y-6">
      <input
        type="hidden"
        name="loan_type_id"
        id="loan_type_id"
        defaultValue={loanTypes[0] ? String(loanTypes[0].id) : ""}
      />
      <input
        type="hidden"
        name="collateral_asset"
        id="collateral_asset"
        defaultValue="BTC"
      />
      <input type="hidden" name="duration" id="duration" defaultValue="12" />

      {loanTypes.length === 0 && (
        <p className="text-sm text-amber-400 rounded-lg bg-amber-400/10 border border-amber-400/20 p-3">
          No loan options are available right now. Check back soon!
        </p>
      )}

      {/* Loan type cards */}
      <div className="space-y-3">
        <Label className="text-gray-300">
          Which loan works best for you? <span className="text-red-400">*</span>
        </Label>
        <RadioGroup
          defaultValue={loanTypes[0] ? String(loanTypes[0].id) : ""}
          onValueChange={(value) => {
            const el = formRef.current?.querySelector(
              '[name="loan_type_id"]'
            ) as HTMLInputElement;
            if (el) el.value = value;
            const lt = loanTypes.find((t) => String(t.id) === value);
            setSelectedLoanType(lt ?? null);
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {loanTypes.map((lt, i) => {
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
            return (
              <label
                key={lt.id}
                className={`relative flex flex-col rounded-2xl border bg-gradient-to-br p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-yellow-400/50 ${gradient}`}
              >
                <RadioGroupItem
                  value={String(lt.id)}
                  className="absolute top-4 right-4 border-white/30 text-yellow-400"
                />
                <span className="text-lg font-semibold text-white pr-8">
                  {lt.name}
                </span>
                <p className="text-sm text-white/80 mt-1">
                  {String(lt.interest_rate)}% APR · Up to {String(lt.ltv)}% LTV
                </p>
                <p className="text-xs text-white/60 mt-2">
                  Collateral: ${String(lt.min_collateral)} – $
                  {String(lt.max_collateral)}
                </p>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="loan_amount" className="text-gray-300">
            How much would you like to borrow?{" "}
            <span className="text-red-400">*</span>
          </Label>
          <Input
            id="loan_amount"
            name="loan_amount"
            type="number"
            required
            placeholder="e.g. 5,000"
            min={1}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="collateral_asset" className="text-gray-300">
            What will you use as collateral?{" "}
            <span className="text-red-400">*</span>
          </Label>
          <Select
            defaultValue="BTC"
            onValueChange={(value) => {
              const el = formRef.current?.querySelector(
                "#collateral_asset"
              ) as HTMLInputElement;
              if (el) el.value = value;
            }}
          >
            <SelectTrigger
              id="collateral_asset_trigger"
              className="bg-white/5 border-white/10 text-white rounded-xl h-11 [&>svg]:text-gray-400"
            >
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-white/10">
              {COLLATERAL_ASSETS.map((a) => (
                <SelectItem
                  key={a.value}
                  value={a.value}
                  className="text-white focus:bg-white/10"
                >
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-gray-300">
            How long do you need? <span className="text-red-400">*</span>
          </Label>
          <RadioGroup
            defaultValue="12"
            onValueChange={(value) => {
              const el = formRef.current?.querySelector(
                "#duration"
              ) as HTMLInputElement;
              if (el) el.value = value;
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {DURATIONS.map((d) => (
              <label
                key={d.value}
                className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 py-3 px-4 cursor-pointer hover:bg-white/10 has-[[data-state=checked]]:bg-yellow-400/20 has-[[data-state=checked]]:border-yellow-400/50 transition-colors"
              >
                <RadioGroupItem
                  value={d.value}
                  className="border-white/30 text-yellow-400"
                />
                <span className="text-white font-medium">{d.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loanTypes.length === 0}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl h-12 text-base shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        Continue to payout details
      </Button>
    </form>
  );
}
