"use client";

import { useState } from "react";
import { Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "../../_hooks/use-wallet";
import { toast } from "sonner";

interface ImportWalletFlowProps {
  onComplete: () => void;
}

export function ImportWalletFlow({ onComplete }: ImportWalletFlowProps) {
  const { importWallet } = useWallet();
  const [step, setStep] = useState<"input" | "encrypt">("input");
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputSubmit = () => {
    const words = mnemonicInput.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      toast.error(`Invalid recovery phrase. Expected 12 or 24 words, got ${words.length}.`);
      return;
    }
    setStep("encrypt");
  };

  const handleImport = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsProcessing(true);
    try {
      await importWallet(mnemonicInput.trim(), password);
      toast.success("Wallet imported successfully!");
      onComplete();
    } catch (e: any) {
      toast.error(e.message || "Failed to import wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "input") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Import Recovery Phrase</h3>
          <p className="text-sm text-zinc-400">
            Enter your 12 or 24-word recovery phrase to restore your wallet.
          </p>
        </div>

        <Textarea
          placeholder="apple banana cherry..."
          className="bg-zinc-900/50 border-zinc-700 text-white min-h-[150px] resize-none"
          value={mnemonicInput}
          onChange={(e) => setMnemonicInput(e.target.value)}
        />

        <Button 
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500" 
          onClick={handleInputSubmit}
          disabled={!mnemonicInput.trim()}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Set a secure password</h3>
        <p className="text-sm text-zinc-400">
          This password will be used to encrypt your wallet on this device.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-300">Password</Label>
          <Input
            type="password"
            className="bg-zinc-900/50 border-zinc-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Confirm Password</Label>
          <Input
            type="password"
            className="bg-zinc-900/50 border-zinc-700 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <Button 
        className="w-full bg-yellow-400 text-black hover:bg-yellow-500" 
        onClick={handleImport}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>processing...</>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Import Wallet
          </>
        )}
      </Button>
    </div>
  );
}
