"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const STAT_KEYS = ["cases", "jurisdictions", "assets", "loans", "uptime", "team"] as const;

export default function CompanyStats() {
  const t = useTranslations("About.Stats");
  const [counts, setCounts] = useState({
    users: 0,
    countries: 0,
    volume: 0,
    transactions: 0,
    uptime: 0,
    team: 0,
  });

  useEffect(() => {
    const targetCounts = {
      users: 50000,
      countries: 200,
      volume: 1200,
      transactions: 2100000,
      uptime: 99.9,
      team: 50,
    };

    const duration = 2000;
    const steps = 60;
    const stepValue = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        users: Math.floor(targetCounts.users * progress),
        countries: Math.floor(targetCounts.countries * progress),
        volume: Math.floor(targetCounts.volume * progress),
        transactions: Math.floor(targetCounts.transactions * progress),
        uptime: Math.round(targetCounts.uptime * progress * 10) / 10,
        team: Math.floor(targetCounts.team * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepValue);

    return () => clearInterval(timer);
  }, []);

  const values: Record<(typeof STAT_KEYS)[number], string> = {
    cases: `${counts.users.toLocaleString()}+`,
    jurisdictions: `${counts.countries}+`,
    assets: `$${counts.volume}M+`,
    loans: `${counts.transactions.toLocaleString()}+`,
    uptime: `${counts.uptime}%`,
    team: `${counts.team}+`,
  };

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAT_KEYS.map((id) => (
            <article key={id} className={`${home.card} ${home.cardBody}`}>
              <p className="text-3xl font-semibold text-white mb-2">{values[id]}</p>
              <h3 className="text-sm font-semibold text-white mb-1">{t(`cards.${id}.title`)}</h3>
              <p className="text-xs text-neutral-500 mb-2">{t(`cards.${id}.subtitle`)}</p>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`cards.${id}.desc`)}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-neutral-500">
          <span>{t("footer.support")}</span>
          <span>{t("footer.experience")}</span>
          <span>{t("footer.compliant")}</span>
          <span>{t("footer.offices")}</span>
        </div>
      </div>
    </section>
  );
}
