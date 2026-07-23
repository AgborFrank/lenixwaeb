"use client";

import { Wallet, Download, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
       
           <Image src="/assets/vectors/convert-campaign.png" width={64} height={64} alt="we" className="h-24 w-24 text-white mx-auto mb-3" />
       
      </div>

      <div className="space-y-2 max-w-xl">
        <h2 className="md:text-3xl text-xl font-bold text-white">{t("welcome_title")}</h2>
        <p className="text-zinc-500 text-sm md:text-base">{t("welcome_description")}</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <Button
          size="lg"
          onClick={onCreate}
          className="md:h-14 h-12 md:text-base text-sm font-medium bg-yellow-400 text-black hover:bg-yellow-500 transition-all hover:scale-[1.02]"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("create_new")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onImport}
          className="md:h-14 h-12 md:text-base text-sm  font-medium border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all hover:scale-[1.02]"
        >
          <Download className="mr-2 h-5 w-5" />
          {t("import_existing")}
        </Button>
      </div>

      <p className="text-xs text-zinc-500 max-w-xs">{t("terms_notice")}</p>
    </div>
  );
}
