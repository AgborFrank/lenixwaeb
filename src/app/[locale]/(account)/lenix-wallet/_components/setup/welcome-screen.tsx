"use client";

import { Wallet, Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onCreate: () => void;
  onImport: () => void;
}

export function WelcomeScreen({ onCreate, onImport }: WelcomeScreenProps) {
  const t = useTranslations("AccountLenixWallet.setup");

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-zinc-900 p-6 rounded-full border border-yellow-400/30">
          <Wallet className="h-12 w-12 text-yellow-400" />
        </div>
      </div>

      <div className="space-y-2 max-w-xl">
        <h2 className="text-3xl font-bold text-white">{t("welcome_title")}</h2>
        <p className="text-zinc-400">{t("welcome_description")}</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <Button
          size="lg"
          onClick={onCreate}
          className="h-14 text-base font-medium bg-yellow-400 text-black hover:bg-yellow-500 transition-all hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("create_new")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onImport}
          className="h-14 text-base font-medium border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all hover:scale-[1.02]"
        >
          <Download className="mr-2 h-5 w-5" />
          {t("import_existing")}
        </Button>
      </div>

      <p className="text-xs text-zinc-500 max-w-xs">{t("terms_notice")}</p>
    </div>
  );
}
