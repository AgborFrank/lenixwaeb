"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { home } from "@/lib/home-styles";

const SIGNALS = ["no_fees", "no_seed", "no_custody", "honest", "audited", "chains"] as const;

export default function TrustSignals() {
  const t = useTranslations("Home.TrustSignals");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className={`${home.eyebrow} mb-3`}>{t("eyebrow")}</p>
            <h2 className={`${home.title} mb-4`}>
              {t("title1")}
              {t("title2")}
            </h2>
            <p className={`${home.lead} mb-8`}>{t("subtitle")}</p>

            <div className={`${home.card} relative aspect-[4/3]`}>
              <Image
                src="/assets/img/investigate.webp"
                alt={t("image_alt")}
                fill
                className={home.mediaImage}
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
            {SIGNALS.map((id) => (
              <li
                key={id}
                className="border-l-2 border-yellow-400/80 pl-4 py-3 pr-2"
              >
                <h3 className="text-sm font-semibold text-white mb-1">{t(`items.${id}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${id}.desc`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
