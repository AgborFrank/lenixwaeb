"use client";

import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

export default function ContactHero() {
  const t = useTranslations("Contact.Hero");

  return (
    <section className="bg-neutral-950 pt-28 pb-12 lg:pt-32 lg:pb-16">
      <div className={home.container}>
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight mb-5">
            {t("title")}
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed">{t("description")}</p>
        </div>
      </div>
    </section>
  );
}
