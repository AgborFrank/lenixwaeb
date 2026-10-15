"use client";

import { useTranslations } from "next-intl";
import { ReceiveAddressCard } from "./_components/receive-address-card";

export default function ReceivePage() {
  const t = useTranslations("AccountLenixWallet.receive_page");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
      <header className="space-y-1 border-b border-white/[0.06] pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{t("title")}</h1>
        <p className="text-sm text-zinc-400">{t("subtitle")}</p>
      </header>

      <ReceiveAddressCard />

      <p className="text-xs leading-relaxed text-zinc-500">{t("security_notice")}</p>
    </div>
  );
}
