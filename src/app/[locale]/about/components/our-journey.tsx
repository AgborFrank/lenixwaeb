"use client";

import { useTranslations } from "next-intl";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const JOURNEY_STEPS = ["step1", "step2", "step3", "step4", "step5", "step6", "step7"] as const;

export default function OurJourney() {
  const t = useTranslations("About.Journey");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle")}
        />

        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {JOURNEY_STEPS.map((id) => (
            <article
              key={id}
              className={`${home.card} ${home.cardBody} min-w-[280px] max-w-[320px] shrink-0 snap-start`}
            >
              <h3 className="text-base font-semibold text-white mb-3">{t(`${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">{t(`${id}.desc`)}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md">
                  {t(`${id}.tag1`)}
                </span>
                <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md">
                  {t(`${id}.tag2`)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
