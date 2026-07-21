"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { home } from "@/lib/home-styles";

export default function FinanceCTA() {
  const t = useTranslations("FinancePage.Cta");

  return (
    <section className="py-24 px-4 text-center bg-black relative">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white">{t("title")}</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t("description")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/crypto-loan" className={`${home.btnPrimary} text-lg px-10 py-4`}>
            {t("btn_primary")}
          </Link>
          <Link href="/contact" className={`${home.btnSecondary} text-lg px-10 py-4`}>
            {t("btn_secondary")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-yellow-400/10 blur-[100px] -z-0 rounded-full" />
    </section>
  );
}
