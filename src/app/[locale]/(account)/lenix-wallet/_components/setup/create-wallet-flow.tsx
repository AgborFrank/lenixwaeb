"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Eye, EyeOff, Copy, Check, AlertTriangle, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWallet } from "../../_hooks/use-wallet";
import { toast } from "sonner"; // Assuming sonner is available based on package.json

interface CreateWalletFlowProps {
  onComplete: () => void;
}

export function CreateWalletFlow({ onComplete }: CreateWalletFlowProps) {
  const { createWallet } = useWallet();
  const [step, setStep] = useState<"generate" | "verify" | "encrypt">("generate");
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [confirmedMnemonic, setConfirmedMnemonic] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationIndices, setVerificationIndices] = useState<number[]>([]);
  
  // Generate mnemonic on mount
  useEffect(() => {
    const wallet = ethers.Wallet.createRandom();
    if (wallet.mnemonic) {
      setMnemonic(wallet.mnemonic.phrase.split(" "));
      // Pick 3 random indices for verification
      const indices = [];
      while(indices.length < 3){
        const r = Math.floor(Math.random() * 12);
        if(indices.indexOf(r) === -1) indices.push(r);
      }
      setVerificationIndices(indices.sort((a, b) => a - b));
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic.join(" "));
    toast.success("Recovery phrase copied to clipboard");
  };

  const verifyWord = (index: number, word: string) => {
    const newConfirmed = [...confirmedMnemonic];
    newConfirmed[index] = word;
    setConfirmedMnemonic(newConfirmed);
  };

  const handleVerificationSubmit = () => {
    const isValid = verificationIndices.every(
      idx => confirmedMnemonic[idx] === mnemonic[idx]
    );
    
    if (isValid) {
      setStep("encrypt");
    } else {
      toast.error("Incorrect words. Please try again.");
    }
  };

  const handleCreate = async () => {
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
      // We actually need to recreate the wallet from the stored mnemonic to ensure consistency
      // or just trust the hook to create a NEW one. 
      // The hook creates a random one. To respect the one we showed the user, 
      // we should use importWallet logic effectively, but with the mnemonic we just generated.
      // However, the hook `createWallet` generates a new one. 
      // Let's modify the plan slightly: We will use `importWallet` with the mnemonic we generated.
      // Wait, I can't access `importWallet` from here easily without refactoring useWallet to accept mnemonic for creation?
      // Actually `useWallet` has `importWallet`. So I will use that.
      
      const { importWallet } = useWallet(); // We need to instantiate this or move it up
      // Note: useWallet is a hook, so we need to validly call it at top level.
      // I am calling it at top level.
      
      // But wait! `createWallet` in `useWallet` generates a random one and saves it. 
      // If I show a mnemonic here, and then call `createWallet`, it will generate a DIFFERENT one.
      // Correct approach: Use `importWallet` with the mnemonic I generated here.
      
      // Re-fetching importWallet from hook (it's already there in the scope if I destructure it)
      // I destructured `createWallet` but missed `importWallet`.
      
      // Let's fix this in the next tool call properly or just use `importWallet` logic here.
      // I'll grab it from the props or context? No, `useWallet` is local state.
      // I'll fix the destructuring in the code below.
    } catch (e) {
      toast.error("Failed to create wallet");
      setIsProcessing(false);
    }
  };

  // Re-declare to include importWallet
  const { importWallet } = useWallet();

  const finalCreate = async () => {
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
      await importWallet(mnemonic.join(" "), password);
      toast.success("Wallet created successfully!");
      onComplete();
    } catch (e: any) {
      toast.error(e.message || "Failed to create wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "generate") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Back up your recovery phrase</h3>
          <p className="text-sm text-zinc-400">
            Write down these 12 words in order and keep them safe. If you lose them, you verify losing your funds forever.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-black/40 rounded-xl border border-white/10 relative">
           {mnemonic.map((word, i) => (
             <div key={i} className="flex items-center gap-2 bg-zinc-800/50 p-2 rounded-md">
               <span className="text-xs text-zinc-500 w-4">{i + 1}.</span>
               <span className="text-sm font-medium text-white">{word}</span>
             </div>
           ))}
           <Button
             size="icon"
             variant="ghost" 
             className="absolute top-2 right-2 hover:bg-white/10"
             onClick={handleCopy}
           >
             <Copy className="h-4 w-4" />
           </Button>
        </div>

        <Alert variant="destructive" className="bg-red-900/10 border-red-900/20 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">Security Check</AlertTitle>
          <AlertDescription className="text-red-200/80">
            Never share this phrase with anyone. Lenix support will never ask for it.
          </AlertDescription>
        </Alert>

        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500" onClick={() => setStep("verify")}>
          I have saved my recovery phrase
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Verify recovery phrase</h3>
          <p className="text-sm text-zinc-400">
            Confirm you saved your phrase by entering the requested words below.
          </p>
        </div>

        <div className="space-y-4">
          {verificationIndices.map((idx) => (
            <div key={idx} className="space-y-2">
              <Label className="text-zinc-300">Word #{idx + 1}</Label>
              <Input
                placeholder={`Enter word #${idx + 1}`}
                className="bg-zinc-900/50 border-zinc-700 text-white"
                onChange={(e) => verifyWord(idx, e.target.value.trim().toLowerCase())}
              />
            </div>
          ))}
        </div>

        <Button 
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500" 
          onClick={handleVerificationSubmit}
          disabled={verificationIndices.some(idx => !confirmedMnemonic[idx])}
        >
          Verify & Continue
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
        onClick={finalCreate}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>processing...</>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Create Wallet
          </>
        )}
      </Button>
    </div>
  );
}
