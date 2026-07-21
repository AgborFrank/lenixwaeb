"use client";

import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

const STEP_KEYS = ["create", "secure", "use"] as const;

export default function WalletGettingStarted() {
  const t = useTranslations("WalletPage.GettingStarted");

  return (
    <section className="py-20 px-4 bg-white/5">
      <div className={home.container}>
        <div className="max-w-3xl mb-10">
          <p className={home.eyebrow}>{t("eyebrow")}</p>
          <h2 className={`${home.title} mt-3`}>{t("title")}</h2>
        </div>

        <ol className="flex flex-col md:flex-row list-none p-0 m-0 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STEP_KEYS.map((id, index) => (
            <li key={id} className="flex-1 px-6 py-8 md:py-10 md:px-8">
              <span className="block text-xs font-medium text-neutral-500 mb-3 tabular-nums">
                {t("step_label", { number: index + 1 })}
              </span>
              <h3 className="text-base font-semibold text-white mb-2">{t(`steps.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`steps.${id}.desc`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
