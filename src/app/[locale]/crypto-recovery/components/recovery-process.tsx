"use client";

import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const STEP_KEYS = ["assessment", "strategy", "coordination", "return"] as const;

export default function RecoveryProcess() {
  const t = useTranslations("CryptoRecovery.Process");

  return (
    <section id="how-it-works" className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4`}>{t("description")}</p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEP_KEYS.map((key, index) => (
            <article key={key} className={`${glass.card} ${glass.cardBody} flex flex-col`}>
              <p className="text-xs font-medium text-neutral-500 mb-3">
                {t("phase", { number: index + 1 })}
              </p>
              <h3 className="text-base font-semibold text-white mb-2">{t(`steps.${key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
                {t(`steps.${key}.description`)}
              </p>
              <div className="flex flex-wrap gap-2">
                {(["tag1", "tag2"] as const).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-1 rounded-md"
                  >
                    {t(`steps.${key}.${tag}`)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
