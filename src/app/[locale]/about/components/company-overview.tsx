"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

export default function CompanyOverview() {
  const t = useTranslations("About.Overview");
  const [activeTab, setActiveTab] = useState<"forensics" | "finance">("forensics");

  const tabContent =
    activeTab === "forensics"
      ? {
          image: "/assets/img/investigate.webp",
          imageAlt: t("forensics.title"),
          subtitle: t("forensics.subtitle"),
          description: t("forensics.description"),
          points: [
            t("forensics.points.recovery"),
            t("forensics.points.threat"),
            t("forensics.points.audits"),
          ],
        }
      : {
          image: "/assets/img/scale.webp",
          imageAlt: t("finance.title"),
          subtitle: t("finance.subtitle"),
          description: t("finance.description"),
          points: [
            t("finance.points.approval"),
            t("finance.points.credit"),
            t("finance.points.vaults"),
          ],
          cta: { href: "/crypto-loan" as const, label: t("finance.cta") },
        };

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("badge")}
          title={t("title")}
        />

        <div className="flex gap-2 mb-10">
          {(["forensics", "finance"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {t(`${tab}.title`)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={`${home.card} relative aspect-[4/3]`}>
            <Image
              src={tabContent.image}
              alt={tabContent.imageAlt}
              fill
              className={home.mediaImage}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 leading-snug">
              {tabContent.subtitle}
            </h3>
            <p className={`${home.lead} mb-8`}>{tabContent.description}</p>
            <ul className="space-y-3 mb-8">
              {tabContent.points.map((point) => (
                <li
                  key={point}
                  className="border-l-2 border-yellow-400/80 pl-4 text-sm text-neutral-300 leading-relaxed"
                >
                  {point}
                </li>
              ))}
            </ul>
            {"cta" in tabContent && tabContent.cta ? (
              <Link href={tabContent.cta.href} className={home.btnPrimary}>
                {tabContent.cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
