"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { HomeSectionHeader } from "./home-section-header";
import { home } from "@/lib/home-styles";

export default function Credibility() {
  const t = useTranslations("Home.Credibility");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle1")}
        />

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <article className={`${home.card} ${home.cardBody} flex flex-col items-start`}>
            <Image
              src="/assets/img/certiklogo.png"
              alt="CertiK"
              className="h-8 w-auto mb-6 brightness-0 invert opacity-90"
              width={128}
              height={32}
            />
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 flex-1">{t("col1_text")}</p>
            <Link href="/security" className={home.textLink}>
              {t("col1_btn")} →
            </Link>
          </article>

          <article className={`${home.card} ${home.cardBody} flex flex-col items-start`}>
            <Image
              src="/assets/img/certy.webp"
              alt="ISO 27001"
              className="h-12 w-auto mb-6 opacity-90"
              width={96}
              height={48}
            />
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 flex-1">{t("col2_text")}</p>
            <Link href="/about" className={home.textLink}>
              {t("col2_btn")} →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
