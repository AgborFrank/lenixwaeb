"use client";

import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const FEATURE_KEYS = [
  "tracing",
  "investigators",
  "legal",
  "confidential",
  "documentation",
  "fees",
] as const;

export default function RecoveryFeatures() {
  const t = useTranslations("CryptoRecovery.Features");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4`}>{t("description")}</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURE_KEYS.map((key) => (
            <article key={key} className={`${glass.cardHover} ${glass.cardBody}`}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${key}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
