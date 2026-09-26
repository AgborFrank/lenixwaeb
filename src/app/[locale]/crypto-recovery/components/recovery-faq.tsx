"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const FAQ_KEYS = [
  "types",
  "duration",
  "fees",
  "confidential",
  "guarantee",
  "include",
  "mixers",
  "enforcement",
  "keys",
  "after",
] as const;

export default function RecoveryFAQ() {
  const t = useTranslations("CryptoRecovery.Faq");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4`}>{t("subtitle")}</p>
        </header>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQ_KEYS.map((key, index) => (
            <AccordionItem
              key={key}
              value={`item-${index}`}
              className={`${glass.card} px-6 border-none data-[state=open]:bg-white/[0.07]`}
            >
              <AccordionTrigger className="text-white hover:text-neutral-200 text-sm font-semibold py-5 hover:no-underline text-left">
                {t(`items.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-sm pb-5 leading-relaxed">
                {t(`items.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-10">
          <p className="text-sm text-neutral-500 mb-4">{t("discuss")}</p>
          <Link href="#start-recovery" className={glass.textLink}>
            {t("submit")}
          </Link>
        </div>
      </div>
    </section>
  );
}
