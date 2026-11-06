"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

const walletConnectOn =
  process.env.NEXT_PUBLIC_ENABLE_WALLET === "true" ||
  process.env.NEXT_PUBLIC_ENABLE_WALLET === "1";

let LnxPurchaseWidget: ComponentType | null = null;
if (walletConnectOn) {
  LnxPurchaseWidget = require("./lnx-purchase-widget").default;
}

export default function TokenSaleSection() {
  const t = useTranslations("Home.TokenSale");

  return (
    <section className="relative bg-black py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className={walletConnectOn ? "grid lg:grid-cols-2 gap-12 items-center" : "max-w-3xl"}>
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t("title1")}
              <span className="text-yellow-400">{t("title2")}</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-lg">{t("subtitle")}</p>
          </div>
          {walletConnectOn && LnxPurchaseWidget ? (
            <div className="flex justify-center lg:justify-end">
              <LnxPurchaseWidget />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
