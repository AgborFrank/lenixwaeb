"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Save, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useWallet } from "../../_hooks/use-wallet";
import { toast } from "sonner";

function KeyboardAwareScroll({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const sync = () => {
      const overlap = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(overlap > 80 ? Math.round(overlap) : 0);
    };

    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  useEffect(() => {
    if (keyboardInset === 0) return;
    const scroller = scrollerRef.current;
    const active = document.activeElement;
    if (!scroller || !(active instanceof HTMLElement) || !scroller.contains(active)) return;

    const reveal = () => {
      active.scrollIntoView({ block: "center", inline: "nearest" });
    };
    const first = window.setTimeout(reveal, 50);
    const later = window.setTimeout(reveal, 320);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(later);
    };
  }, [keyboardInset]);

  const keyboardOpen = keyboardInset > 0;
  const visibleHeight = keyboardOpen
    ? (window.visualViewport?.height ?? window.innerHeight)
    : 0;

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "space-y-6",
        keyboardOpen && "overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]",
      )}
      style={
        keyboardOpen
          ? { maxHeight: Math.max(220, visibleHeight - 72), paddingBottom: 16 }
          : undefined
      }
    >
      {children}
    </div>
  );
}

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
      <KeyboardAwareScroll>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t("import_title")}</h3>
          <p className="text-sm text-zinc-400">{t("import_description")}</p>
        </div>

        <Textarea
          placeholder={t("import_placeholder")}
          className="min-h-[150px] resize-none border-zinc-700 bg-zinc-900/50 text-white"
          value={mnemonicInput}
          onChange={(e) => setMnemonicInput(e.target.value)}
          onFocus={(event) => {
            const field = event.currentTarget;
            window.setTimeout(() => {
              field.scrollIntoView({ block: "center", inline: "nearest" });
            }, 300);
          }}
        />

        <Button
          className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
          onClick={handleInputSubmit}
          disabled={!mnemonicInput.trim()}
        >
          {t("continue")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </KeyboardAwareScroll>
    );
  }

  return (
    <KeyboardAwareScroll>
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
    </KeyboardAwareScroll>
  );
}
