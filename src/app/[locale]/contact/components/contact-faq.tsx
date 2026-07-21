"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const FAQ_KEYS = ["start", "assets", "security", "fees", "timeline", "availability"] as const;

export default function FAQ() {
  const t = useTranslations("Contact.FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HomeSectionHeader align="center" title={t("title")} description={t("subtitle")} />

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_KEYS.map((key, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={key} className={`${home.card} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left hover:bg-neutral-900/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white leading-snug">
                    {t(`items.${key}.question`)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform mt-0.5 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-5 border-t border-neutral-800">
                    <p className="pt-4 text-sm text-neutral-400 leading-relaxed">
                      {t(`items.${key}.answer`)}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-400 mb-5">{t("cta_text")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:support@lenixprotocol.com" className={home.btnPrimary}>
              {t("email_cta")}
            </a>
            <button type="button" className={home.btnSecondary}>
              {t("chat_cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
