"use client";

import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

interface PartnersProps {
  className?: string;
  showHeader?: boolean;
}

export default function Partners({ className = "", showHeader = true }: PartnersProps) {
  const t = useTranslations("Home.Partners");

  return (
    <section className={`py-14 bg-neutral-950 ${className}`} aria-label={t("title")}>
      <div className={home.container}>
        {showHeader && (
          <header className="max-w-2xl">
            <p className={`${home.eyebrow} mb-2`}>{t("eyebrow")}</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">{t("title")}</h2>
            <p className="text-sm text-neutral-500">{t("subtitle")}</p>
          </header>
        )}
      </div>
    </section>
  );
}
