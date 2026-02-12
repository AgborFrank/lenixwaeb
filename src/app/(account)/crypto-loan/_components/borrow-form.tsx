"use client";

import { useState } from "react";
import { ArrowDown, Info, Calculator, Percent, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Ensure this component exists or use native input range
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/app/(account)/_providers/settings-provider";

export function BorrowForm() {
  const [ltv, setLtv] = useState([50]);
  const [amount, setAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const { formatCurrency } = useSettings();

  // clientAction removed


  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 h-full flex flex-col">
      <div className="mb-6">
         <h3 className="text-xl font-semibold text-white mb-1">Loan Calculator</h3>
         <p className="text-sm text-zinc-500">Calculate your loan terms instantly.</p>
      </div>

      <Tabs defaultValue="borrow" className="flex-1 flex flex-col">
         <TabsList className="grid grid-cols-2 bg-zinc-950/50 p-1 mb-6">
            <TabsTrigger value="borrow" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Borrow</TabsTrigger>
            <TabsTrigger value="repay" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Repay</TabsTrigger>
         </TabsList>

         <TabsContent value="borrow" className="space-y-6 flex-1 flex flex-col">
            <div className="space-y-6 flex-1 flex flex-col">
                {/* Input Section */}
                <div className="space-y-4">
                {/* Borrow Amount */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">I want to borrow</label>
                    <div className="relative">
                        <Input 
                            name="borrowAmount"
                            type="number" 
                            step="any"
                            placeholder="0.00" 
                            className="bg-zinc-950/50 border-zinc-800 h-12 text-lg pl-4 pr-32 focus-visible:ring-yellow-500/20"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        <div className="absolute right-1 top-1 bottom-1 w-28">
                            <Select name="borrowAsset" defaultValue="USDT">
                            <SelectTrigger className="h-full border-0 bg-transparent hover:bg-zinc-900 focus:ring-0">
                                <SelectValue placeholder="Asset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USDT">USDT</SelectItem>
                                <SelectItem value="USDC">USDC</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Collateral Amount */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">My Collateral</label>
                    <div className="relative">
                        <Input 
                            name="collateralAmount"
                            type="number" 
                            step="any"
                            placeholder="0.00" 
                            className="bg-zinc-950/50 border-zinc-800 h-12 text-lg pl-4 pr-32 focus-visible:ring-yellow-500/20"
                            value={collateralAmount}
                            onChange={(e) => setCollateralAmount(e.target.value)}
                            required
                        />
                        <div className="absolute right-1 top-1 bottom-1 w-28">
                            <Select name="collateralAsset" defaultValue="BTC">
                            <SelectTrigger className="h-full border-0 bg-transparent hover:bg-zinc-900 focus:ring-0">
                                <SelectValue placeholder="Asset" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BTC">BTC</SelectItem>
                                <SelectItem value="ETH">ETH</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                </div>

                {/* LTV Slider */}
                <div className="space-y-4 py-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm "><span className="text-zinc-400">LTV:</span> <span className="text-white font-bold ml-1">{ltv[0]}%</span></label>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low Risk</span>
                    </div>
                    <Slider 
                        value={ltv} 
                        onValueChange={setLtv} 
                        max={85} 
                        step={1} 
                        className="py-2 cursor-pointer"
                    />
                </div>

                {/* Loan Summary */}
                <div className="bg-zinc-950/30 rounded-xl p-4 space-y-3 border border-white/5 mt-auto">
                    <SummaryRow label="APY" value="5.5%" highlight />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-300">Total Repayment</span>
                        <span className="text-lg font-bold text-white">
                            {formatCurrency(Number(amount))}
                        </span>
                    </div>
                </div>

                <SubmitButton />
            </div>
         </TabsContent>

         <TabsContent value="repay" className="space-y-6 text-center py-10">
            <div className="rounded-full bg-zinc-800/50 w-16 h-16 mx-auto flex items-center justify-center mb-4">
               <Lock className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-white">Manage Repayments</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">
               Please use the "Active Loans" list to manage and repay your specific loans.
            </p>
         </TabsContent>
      </Tabs>
    </div>
  );
}

function SubmitButton() {
   return (
      <Button 
        asChild
        size="lg" 
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium h-12 shadow-lg shadow-yellow-500/20"
      >
         <a href="/crypto-loan?mode=apply">Apply for New Loan</a>
      </Button>
   );
}

function SummaryRow({ label, value, sublabel, highlight }: any) {
   return (
      <div className="flex justify-between items-center text-sm">
         <span className="text-zinc-500">{label}</span>
         <div className="text-right">
            <span className={`font-medium ${highlight ? "text-emerald-400" : "text-zinc-200"}`}>{value}</span>
            {sublabel && <span className="text-xs text-zinc-500 ml-1">{sublabel}</span>}
         </div>
      </div>
   )
}
