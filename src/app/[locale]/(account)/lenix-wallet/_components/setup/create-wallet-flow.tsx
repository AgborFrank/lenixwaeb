"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Copy, AlertTriangle, ArrowRight, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWallet } from "../../_hooks/use-wallet";
import { toast } from "sonner";

interface CreateWalletFlowProps {
  onComplete: () => void;
}

export function CreateWalletFlow({ onComplete }: CreateWalletFlowProps) {
  const t = useTranslations("AccountLenixWallet.setup");
  const tToast = useTranslations("AccountLenixWallet.toast");
  const { importWallet } = useWallet();
  const [step, setStep] = useState<"generate" | "verify" | "encrypt">("generate");
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [confirmedMnemonic, setConfirmedMnemonic] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationIndices, setVerificationIndices] = useState<number[]>([]);

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom();
    if (wallet.mnemonic) {
      setMnemonic(wallet.mnemonic.phrase.split(" "));
      const indices: number[] = [];
      while (indices.length < 3) {
        const r = Math.floor(Math.random() * 12);
        if (indices.indexOf(r) === -1) indices.push(r);
      }
      setVerificationIndices(indices.sort((a, b) => a - b));
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic.join(" "));
    toast.success(tToast("phrase_copied"));
  };

  const verifyWord = (index: number, word: string) => {
    const newConfirmed = [...confirmedMnemonic];
    newConfirmed[index] = word;
    setConfirmedMnemonic(newConfirmed);
  };

  const handleVerificationSubmit = () => {
    const isValid = verificationIndices.every(
      (idx) => confirmedMnemonic[idx] === mnemonic[idx],
    );

    if (isValid) {
      setStep("encrypt");
    } else {
      toast.error(tToast("incorrect_words"));
    }
  };

  const finalCreate = async () => {
    if (password.length < 8) {
      toast.error(tToast("password_min_length"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(tToast("passwords_mismatch"));
      return;
    }

    setIsProcessing(true);
    try {
      await importWallet(mnemonic.join(" "), password);
      toast.success(tToast("wallet_created"));
      onComplete();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : tToast("create_failed");
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "generate") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t("backup_title")}</h3>
          <p className="text-sm text-zinc-400">{t("backup_description")}</p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
          {mnemonic.map((word, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-zinc-800/50 p-2">
              <span className="w-4 text-xs text-zinc-500">{i + 1}.</span>
              <span className="text-sm font-medium text-white">{word}</span>
            </div>
          ))}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 hover:bg-white/10"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Alert variant="destructive" className="border-red-900/20 bg-red-900/10 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">{t("security_check_title")}</AlertTitle>
          <AlertDescription className="text-red-200/80">
            {t("security_check_description")}
          </AlertDescription>
        </Alert>

        <Button
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={() => setStep("verify")}
        >
          {t("saved_phrase")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t("verify_title")}</h3>
          <p className="text-sm text-zinc-400">{t("verify_description")}</p>
        </div>

        <div className="space-y-4">
          {verificationIndices.map((idx) => (
            <div key={idx} className="space-y-2">
              <Label className="text-zinc-300">{t("word_label", { number: idx + 1 })}</Label>
              <Input
                placeholder={t("word_placeholder", { number: idx + 1 })}
                className="border-zinc-700 bg-zinc-900/50 text-white"
                onChange={(e) => verifyWord(idx, e.target.value.trim().toLowerCase())}
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={handleVerificationSubmit}
          disabled={verificationIndices.some((idx) => !confirmedMnemonic[idx])}
        >
          {t("verify_continue")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{t("password_title")}</h3>
        <p className="text-sm text-zinc-400">{t("password_description")}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-300">{t("password_label")}</Label>
          <Input
            type="password"
            className="border-zinc-700 bg-zinc-900/50 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">{t("confirm_password_label")}</Label>
          <Input
            type="password"
            className="border-zinc-700 bg-zinc-900/50 text-white"
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
          t("processing")
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {t("create_wallet")}
          </>
        )}
      </Button>
    </div>
  );
}
