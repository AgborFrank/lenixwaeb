"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const FAQ_KEYS = ["yield", "lockup", "liquidation", "fees"] as const;

export default function FinanceFAQ() {
  const t = useTranslations("FinancePage.Faq");

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t("title")}</h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQ_KEYS.map((key, i) => (
            <AccordionItem
              key={key}
              value={`item-${i}`}
              className="border border-white/10 bg-white/5 rounded-xl px-6 data-[state=open]:bg-white/[0.07] transition-colors"
            >
              <AccordionTrigger className="text-white hover:text-yellow-400 text-lg font-medium py-6 hover:no-underline text-left">
                {t(`items.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                {t(`items.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
