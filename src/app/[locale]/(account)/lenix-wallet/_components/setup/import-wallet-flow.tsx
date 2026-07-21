"use client";

import { useState } from "react";
import { Save, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("AccountLenixWallet.setup");
  const tToast = useTranslations("AccountLenixWallet.toast");
  const { importWallet } = useWallet();
  const [step, setStep] = useState<"input" | "encrypt">("input");
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputSubmit = () => {
    const words = mnemonicInput.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      toast.error(tToast("invalid_phrase", { count: words.length }));
      return;
    }
    setStep("encrypt");
  };

  const handleImport = async () => {
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
      await importWallet(mnemonicInput.trim(), password);
      toast.success(tToast("wallet_imported"));
      onComplete();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : tToast("import_failed");
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "input") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t("import_title")}</h3>
          <p className="text-sm text-zinc-400">{t("import_description")}</p>
        </div>

        <Textarea
          placeholder={t("import_placeholder")}
          className="min-h-[150px] resize-none border-zinc-700 bg-zinc-900/50 text-white"
          value={mnemonicInput}
          onChange={(e) => setMnemonicInput(e.target.value)}
        />

        <Button
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={handleInputSubmit}
          disabled={!mnemonicInput.trim()}
        >
          {t("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
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
        onClick={handleImport}
        disabled={isProcessing}
      >
        {isProcessing ? (
          t("processing")
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {t("import_wallet")}
          </>
        )}
      </Button>
    </div>
  );
}
