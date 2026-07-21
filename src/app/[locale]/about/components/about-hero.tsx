"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

export default function AboutHero() {
  const t = useTranslations("About.Hero");

  const highlights = [
    { value: t("stats.assets_count"), label: t("stats.assets_traced") },
    { value: t("stats.credit_count"), label: t("stats.credit_checks") },
    { value: t("stats.jurisdictions_count"), label: t("stats.jurisdictions") },
  ];

  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className={`${home.container}`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.1]">
                {t("title")} {t("span1")} & {t("span2")}
              </h1>
              <p className="text-lg text-neutral-300 leading-relaxed max-w-xl">{t("description")}</p>
            </div>

            <dl className="grid sm:grid-cols-3 gap-6">
              {highlights.map(({ value, label }) => (
                <div key={label}>
                  <dt className="text-sm text-neutral-500 mb-1">{label}</dt>
                  <dd className="text-xl font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={`${home.card} relative aspect-[4/3] hidden md:block`}>
            <Image
              src="/assets/img/BringDeFiIntelligence.webp"
              alt="Blockchain intelligence and forensics platform"
              fill
              className={home.mediaImage}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
