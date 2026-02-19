"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { AlertTriangle, ArrowRight, Check, Loader2, ScanLine, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TOKENS = [
  { value: "eth", label: "Ethereum", symbol: "ETH", balance: "14.82", icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { value: "btc", label: "Bitcoin", symbol: "BTC", balance: "1.245", icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { value: "usdt", label: "Tether USD", symbol: "USDT", balance: "25,480.00", icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
];

export function SendForm() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txStep, setTxStep] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!address || !address.startsWith("0x") || address.length !== 42) {
        toast.error("Please enter a valid wallet address");
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
    }

    setIsSending(true);
    setTxError(null);

    try {
        // Step 1: Validate
        setTxStep("Validating transaction...");
        await new Promise(r => setTimeout(r, 1500));

        // Step 2: Estimate gas
        setTxStep("Estimating gas fees...");
        await new Promise(r => setTimeout(r, 2000));

        // Step 3: Simulate broadcast
        setTxStep("Broadcasting to network...");
        await new Promise(r => setTimeout(r, 2500));

        // Throw realistic error
        throw new Error(
            "execution reverted: ERC20: transfer amount exceeds allowance. " +
            "Your account has been flagged for additional verification. " +
            "Please contact support or complete identity verification to enable outbound transfers. " +
            "Error Code: 0x08c379a0 | Gas Used: 23,412"
        );
    } catch (e: any) {
        setTxError(e.message);
        toast.error("Transaction Failed", {
            description: "Your transfer could not be completed.",
            duration: 6000
        });
    } finally {
        setIsSending(false);
        setTxStep(null);
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 md:p-8 space-y-8 max-w-3xl w-full mx-auto shadow-xl">
      <div className="space-y-2 text-center">
         <h2 className="text-2xl font-bold text-white">Send Assets</h2>
         <p className="text-zinc-500">Transfer crypto securely to any wallet.</p>
      </div>

      <div className="space-y-6">
         {/* Asset Selection */}
         <div className="space-y-2">
            <Label className="text-zinc-400 font-medium">Select Asset</Label>
            <Select defaultValue="eth">
               <SelectTrigger className="w-full h-14 bg-zinc-950/50 border-zinc-800 focus:ring-yellow-500/20">
                  <SelectValue placeholder="Select asset" />
               </SelectTrigger>
               <SelectContent className="bg-zinc-900 border-zinc-800">
                  {TOKENS.map((token) => (
                     <SelectItem key={token.value} value={token.value} className="focus:bg-zinc-800 focus:text-white cursor-pointer py-3">
                        <div className="flex items-center justify-between w-full gap-4">
                           <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                 <AvatarImage src={token.icon} />
                                 <AvatarFallback>{token.symbol[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-white">{token.label}</span>
                           </div>
                           <span className="text-zinc-500 text-xs text-right">Bal: {token.balance} {token.symbol}</span>
                        </div>
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         {/* Recipient Address */}
         <div className="space-y-2">
            <div className="flex justify-between">
               <Label className="text-zinc-400 font-medium">To Address</Label>
               <button className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                  <ScanLine className="h-3 w-3" /> Scan QR
               </button>
            </div>
            <div className="relative">
               <Input 
                  placeholder="0x..." 
                  className="bg-zinc-950/50 border-zinc-800 h-12 pr-10 font-mono text-sm focus-visible:ring-yellow-500/20"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setTxError(null); }}
               />
               {address.length > 0 && (
                  <div className="absolute right-3 top-3.5">
                     {address.startsWith("0x") && address.length === 42 ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                     ) : (
                        <div className="h-2 w-2 rounded-full bg-zinc-700 animate-pulse" />
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* Amount Input */}
         <div className="space-y-2">
            <div className="flex justify-between">
               <Label className="text-zinc-400 font-medium">Amount</Label>
               <span className="text-xs text-zinc-500">Available: 14.82 ETH</span>
            </div>
            <div className="relative">
               <Input 
                  type="number"
                  placeholder="0.00" 
                  className="bg-zinc-950/50 border-zinc-800 h-16 text-2xl font-bold pl-4 pr-20 focus-visible:ring-yellow-500/20"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setTxError(null); }}
               />
               <button 
                  className="absolute right-4 top-4 px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded hover:bg-yellow-500/20 transition-colors"
                  onClick={() => setAmount("14.82")}
               >
                  MAX
               </button>
            </div>
             <p className="text-xs text-zinc-500 text-right">≈ ${amount ? (parseFloat(amount) * 2240.50).toLocaleString() : "0.00"} USD</p>
         </div>

         {/* Network Fee Estimate */}
         <div className="bg-zinc-950/30 rounded-xl p-4 border border-white/5 space-y-3">
            <div className="flex justify-between text-sm">
               <span className="text-zinc-500">Network Fee</span>
               <div className="flex items-center gap-1 text-zinc-300">
                  <span>0.0012 ETH</span>
                  <span className="text-zinc-500">($2.68)</span>
               </div>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-zinc-500">Total</span>
               <div className="text-right">
                  <span className="block font-bold text-white">{(parseFloat(amount || "0") + 0.0012).toFixed(4)} ETH</span>
               </div>
            </div>
         </div>

         {/* Transaction Progress */}
         {txStep && (
             <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20 animate-pulse">
                 <Loader2 className="h-4 w-4 text-yellow-400 animate-spin shrink-0" />
                 <span className="text-sm text-yellow-400 font-medium">{txStep}</span>
             </div>
         )}

         {/* Error Display */}
         {txError && (
             <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 space-y-3">
                 <div className="flex items-start gap-3">
                     <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                         <p className="text-sm font-semibold text-red-400">Transaction Reverted</p>
                         <p className="text-xs text-red-300/80 leading-relaxed">{txError}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-2 pt-1 border-t border-red-500/20">
                     <AlertTriangle className="h-3 w-3 text-orange-400" />
                     <p className="text-[11px] text-orange-400/80">
                         Contact Lenix Support for assistance with this error.
                     </p>
                 </div>
             </div>
         )}
      </div>

      <Button 
        size="lg" 
        className="w-full h-12 bg-yellow-500 hover:bg-yellow-400 text-black font-medium shadow-lg shadow-yellow-500/20"
        disabled={isSending}
        onClick={handleSend}
      >
        {isSending ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
            </>
        ) : txError ? (
            <>
                Retry Transaction <ArrowRight className="ml-2 h-4 w-4" />
            </>
        ) : (
            <>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </>
        )}
      </Button>
    </div>
  );
}
