"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CheckCircle2, ShieldCheck, Landmark, Building2, Wallet } from "lucide-react";
import { applyForLoan } from "../actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define locally to match DB schema
type LoanType = {
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
];

const DURATIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

export function LoanApplication({ loanTypes }: { loanTypes: LoanType[] }) {
   const [step, setStep] = useState(1);
   const [formData, setFormData] = useState<any>({
      loan_type_id: loanTypes[0]?.id?.toString() || "",
      loan_amount: "",
      collateral_asset: "BTC",
      duration: "12",
      payout_method: "crypto"
   });
   const [isSubmitting, setIsSubmitting] = useState(false);

   const updateForm = (key: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [key]: value }));
   };

   const handleNext = (e: React.FormEvent) => {
      e.preventDefault();
      setStep(prev => prev + 1);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
         payload.append(key, value as string);
      });

      const result = await applyForLoan(payload);
      setIsSubmitting(false);

      if (result?.error) {
         toast.error(result.error);
      } else {
         toast.success("Application submitted successfully!");
         // Optionally redirect or refresh via server action
      }
   }

   return (
      <div className="max-w-2xl mx-auto py-10">
         {/* Stepper Status */}
         <div className="text-center mb-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs mb-4 border border-white/10 uppercase tracking-widest">
               Step {step} of 2 — {step === 1 ? "Loan Details" : "Payout Preferences"}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">
               {step === 1 ? "Request Crypto Loan" : "Receiving Funds"}
            </h1>
            <p className="text-zinc-400">
               {step === 1 
                  ? "Customize your loan terms to fit your needs." 
                  : "Choose where you want us to send your loan details."}
            </p>
         </div>

         <div className="rounded-3xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            {step === 1 ? (
               <StepOne 
                  loanTypes={loanTypes} 
                  formData={formData} 
                  updateForm={updateForm} 
                  onNext={handleNext} 
               />
            ) : (
               <StepTwo 
                  formData={formData} 
                  updateForm={updateForm} 
                  onSubmit={handleSubmit}
                  onBack={() => setStep(1)}
                  isSubmitting={isSubmitting}
               />
            )}
         </div>
      </div>
   );
}

function StepOne({ loanTypes, formData, updateForm, onNext }: any) {
   return (
      <form onSubmit={onNext} className="space-y-6">
         {/* Loan Type Selection */}
         <div className="space-y-3">
            <Label className="text-zinc-300">Select Loan Type</Label>
            <RadioGroup 
               value={formData.loan_type_id} 
               onValueChange={(v) => updateForm("loan_type_id", v)}
               className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
               {loanTypes.map((type: LoanType, i: number) => (
                  <label 
                     key={type.id}
                     className={cn(
                        "relative flex flex-col rounded-2xl border bg-gradient-to-br p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg", 
                        CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                        formData.loan_type_id === type.id.toString() ? "ring-2 ring-yellow-400/50" : "border-white/10"
                     )}
                  >
                     <RadioGroupItem value={type.id.toString()} className="absolute top-4 right-4 border-white/30 text-yellow-400" />
                     <span className="text-lg font-bold text-white pr-8">{type.name}</span>
                     <p className="text-sm text-white/80 mt-1">
                        {type.interest_rate}% APR · Up to {type.ltv}% LTV
                     </p>
                  </label>
               ))}
            </RadioGroup>
         </div>

         {/* Amounts */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <Label className="text-zinc-300">Borrow Amount (USD)</Label>
               <Input 
                  type="number" 
                  value={formData.loan_amount}
                  onChange={(e) => updateForm("loan_amount", e.target.value)}
                  placeholder="e.g. 5000"
                  className="bg-zinc-950/50 border-white/10 text-white h-12"
                  required
               />
            </div>
            <div className="space-y-2">
               <Label className="text-zinc-300">Collateral Asset</Label>
               <Select 
                  value={formData.collateral_asset} 
                  onValueChange={(v) => updateForm("collateral_asset", v)}
               >
                  <SelectTrigger className="bg-zinc-950/50 border-white/10 text-white h-12">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                     <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                     <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                     <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Duration */}
         <div className="space-y-3">
            <Label className="text-zinc-300">Duration</Label>
            <RadioGroup 
               value={formData.duration} 
               onValueChange={(v) => updateForm("duration", v)}
               className="grid grid-cols-3 gap-3"
            >
               {DURATIONS.map(d => (
                  <label key={d.value} className={cn(
                     "flex items-center justify-center py-3 px-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/5",
                     formData.duration === d.value ? "bg-yellow-400/20 border-yellow-400/50 text-yellow-400" : "bg-white/5 text-zinc-400"
                  )}>
                     <RadioGroupItem value={d.value} className="sr-only" />
                     <span className="font-medium text-sm">{d.label}</span>
                  </label>
               ))}
            </RadioGroup>
         </div>

         <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 text-lg">
            Continue to Payout
         </Button>
      </form>
   )
}

function StepTwo({ formData, updateForm, onSubmit, onBack, isSubmitting }: any) {
   return (
      <form onSubmit={onSubmit} className="space-y-6">
         <RadioGroup 
            value={formData.payout_method} 
            onValueChange={(v) => updateForm("payout_method", v)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
         >
            <PayoutOption value="crypto" icon={Wallet} label="Crypto Wallet" sub="Instant Transfer" selected={formData.payout_method === "crypto"} />
            <PayoutOption value="wire_transfer" icon={Landmark} label="Wire Transfer" sub="1-3 Business Days" selected={formData.payout_method === "wire_transfer"} />
            <PayoutOption value="bank" icon={Building2} label="Bank Deposit" sub="ACH / SEPA" selected={formData.payout_method === "bank"} />
         </RadioGroup>

         <div className="p-6 bg-zinc-950/30 rounded-2xl border border-white/10 space-y-4">
            {formData.payout_method === "crypto" && (
                <>
                   <div className="space-y-2">
                      <Label className="text-zinc-400">Wallet Address</Label>
                      <Input 
                         required
                         placeholder="0x..." 
                         className="bg-black/20 border-white/10 text-white font-mono"
                         onChange={(e) => updateForm("wallet_address", e.target.value)}
                         value={formData.wallet_address || ""}
                      />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-zinc-400">Network</Label>
                     <Select 
                        value={formData.network || ""} 
                        onValueChange={(v) => updateForm("network", v)}
                     >
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                           <SelectValue placeholder="Select Network" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                           <SelectItem value="ERC20">Ethereum (ERC20)</SelectItem>
                           <SelectItem value="TRC20">Tron (TRC20)</SelectItem>
                           <SelectItem value="BSC">Binance Smart Chain (BEP20)</SelectItem>
                        </SelectContent>
                     </Select>
                   </div>
                </>
            )}

            {(formData.payout_method === "wire_transfer" || formData.payout_method === "bank") && (
                <div className="text-center py-8">
                   <p className="text-zinc-400 text-sm">
                      Bank details form would go here. <br/>
                      <span className="text-xs text-zinc-600">(Simplified for this demo)</span>
                   </p>
                   {/* In real app, render full bank form inputs here */}
                   <Input 
                      className="hidden" 
                      name="bank_placeholder" 
                      defaultValue="mock_bank_details" 
                   />
                </div>
            )}
         </div>

         <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12 border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 text-lg">
               {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
         </div>
      </form>
   )
}

function PayoutOption({ value, icon: Icon, label, sub, selected }: any) {
   return (
      <label className={cn(
         "relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5",
         selected ? "bg-yellow-400/10 border-yellow-400 text-yellow-400" : "border-white/10 text-zinc-400 bg-white/5"
      )}>
         <RadioGroupItem value={value} className="sr-only" />
         <Icon className={cn("w-6 h-6 mb-2", selected ? "text-yellow-400" : "text-zinc-500")} />
         <span className="font-bold text-sm text-center">{label}</span>
         <span className="text-[10px] opacity-70">{sub}</span>
         {selected && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-400" />
         )}
      </label>
   )
}
