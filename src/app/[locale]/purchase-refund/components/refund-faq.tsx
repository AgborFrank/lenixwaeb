"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { glass } from "@/lib/recovery-styles";

const FAQ_KEYS = [
  "types",
  "monitor",
  "instant",
  "fees",
  "chargebacks",
  "timeline",
  "evidence",
  "guarantee",
] as const;

export default function RefundFAQ() {
  const t = useTranslations("PurchaseRefund.Faq");

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

        <div className="text-center mt-10 space-y-3">
          <p className="text-sm text-neutral-500">{t("discuss")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#start-refund" className={glass.textLink}>
              {t("submit")}
            </a>
            <Link href="/crypto-recovery" className={glass.textLink}>
              {t("recovery")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
