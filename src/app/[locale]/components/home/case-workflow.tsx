"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HomeSectionHeader } from "./home-section-header";
import { home } from "@/lib/home-styles";

const STEPS = [
  { id: "submit", image: "/assets/img/staff.jpg" },
  { id: "trace", image: "/assets/img/trade-routes.jpg" },
  { id: "deliver", image: "/assets/img/investigate.webp" },
] as const;

const CASE_BLOCKS = ["situation", "action", "outcome"] as const;

export default function CaseWorkflow() {
  const t = useTranslations("Home.CaseWorkflow");
  const caseT = useTranslations("Home.CaseStudy");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          eyebrow={t("eyebrow")}
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle")}
        />

        <ol className="grid lg:grid-cols-3 gap-5 mb-10 list-none p-0 m-0">
          {STEPS.map(({ id, image }, index) => (
            <li key={id} className={`${home.card} flex flex-col`}>
              <div className={home.media}>
                <Image
                  src={image}
                  alt={t(`steps.${id}.title`)}
                  fill
                  className={home.mediaImage}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className={home.cardBody}>
                <p className="text-xs font-medium text-neutral-500 mb-2">
                  {t("step_label", { number: index + 1 })}
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">{t(`steps.${id}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{t(`steps.${id}.desc`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3 mb-20">
          <Link href="/crypto-recovery">
            <Button className={`${home.btnPrimary} h-11 shadow-none`}>{t("btn_primary")}</Button>
          </Link>
          <Link href="/contact">
            <Button className={`${home.btnSecondary} h-11 shadow-none`}>{t("btn_secondary")}</Button>
          </Link>
        </div>

        <div className="pt-16">
          <HomeSectionHeader
            eyebrow={caseT("eyebrow")}
            title={`${caseT("title1")}${caseT("title2")}`}
            description={caseT("subtitle")}
            className="mb-8"
          />

          <div className={`${home.card} relative w-full md:h-[250px] h-[150px] mb-6`}>
            <Image
              src="/assets/vectors/btc-banner.jpg"
              alt={caseT("image_alt")}
              fill
              className={home.mediaImage}
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>

          <div className="grid md:grid-cols-3 grid-cols-2 md:gap-5 gap-3 mb-4">
            {CASE_BLOCKS.map((id) => (
              <article key={id} className={`${home.card} ${home.cardBody}`}>
                <h3 className="text-sm font-semibold text-white mb-2">{caseT(`${id}.label`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{caseT(`${id}.text`)}</p>
              </article>
            ))}
          </div>

          <p className="text-sm text-neutral-500 max-w-3xl">{caseT("disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
