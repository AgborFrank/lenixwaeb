"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { home } from "@/lib/home-styles";

export default function HomeCta() {
  const t = useTranslations("Home.Cta");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={`${home.container} max-w-2xl text-center`}>
        <h2 className={`${home.title} mb-4`}>{t("title")}</h2>
        <p className={`${home.lead} mb-8`}>{t("subtitle")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/crypto-recovery">
            <Button className={`${home.btnPrimary} h-11 shadow-none`}>{t("btn_primary")}</Button>
          </Link>
          <Link href="/contact">
            <Button className={`${home.btnSecondary} h-11 shadow-none`}>{t("btn_secondary")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
