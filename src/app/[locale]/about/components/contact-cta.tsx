"use client";

import { useTranslations } from "next-intl";
import ContactForm from "../../contact/components/contact-form";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

export default function ContactCTA() {
  const t = useTranslations("About.Contact");

  const methods = [
    {
      title: t("methods.email"),
      lines: ["recovery@lenixprotocol.com", "loan@lenixprotocol.com"],
    },
    {
      title: t("methods.call"),
      lines: ["+447887052128", "Mon–Fri, 9AM–6PM EST"],
    },
    {
      title: t("methods.visit"),
      lines: ["123 Blockchain Street", "San Francisco, CA 94105"],
    },
  ];

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader align="center" title={t("title")} description={t("subtitle")} />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">{t("get_in_touch")}</h3>
            <p className={`${home.lead} mb-8`}>{t("desc")}</p>

            <div className="space-y-6 mb-8">
              {methods.map(({ title, lines }) => (
                <div key={title} className="border-l-2 border-yellow-400/80 pl-4">
                  <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
                  {lines.map((line) => (
                    <p key={line} className="text-sm text-neutral-400">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className={home.btnPrimary}>
                {t("actions.demo")}
              </button>
              <button type="button" className={home.btnSecondary}>
                {t("actions.whitepaper")}
              </button>
            </div>
          </div>

          <ContactForm compact />
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-semibold text-white mb-1">24/7</p>
            <p className="text-sm text-neutral-500">{t("footer.support")}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white mb-1">2hrs</p>
            <p className="text-sm text-neutral-500">{t("footer.response")}</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-white mb-1">100%</p>
            <p className="text-sm text-neutral-500">{t("footer.confidential")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
