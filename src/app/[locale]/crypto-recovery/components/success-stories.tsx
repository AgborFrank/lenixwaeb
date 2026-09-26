"use client";

import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const STORY_KEYS = ["michael", "sarah", "david"] as const;

export default function SuccessStories() {
  const t = useTranslations("CryptoRecovery.Stories");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4`}>{t("description")}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {STORY_KEYS.map((key) => (
            <article key={key} className={`${glass.card} ${glass.cardBody}`}>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                &ldquo;{t(`items.${key}.quote`)}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">{t(`items.${key}.name`)}</p>
                <p className="text-xs text-neutral-500">{t(`items.${key}.role`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
