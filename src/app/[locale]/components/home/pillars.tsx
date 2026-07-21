"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { HomeSectionHeader } from "./home-section-header";
import { home } from "@/lib/home-styles";

export default function Pillars() {
  const t = useTranslations("Home.Pillars");

  const PILLARS = [
    { id: "security", href: "/solutions", image: "/assets/img/MonitorRisk.webp" },
    { id: "recovery", href: "/crypto-recovery", image: "/assets/img/trade-routes.jpg" },
    { id: "forensics", href: "/blockchain-forensics", image: "/assets/img/investigate.webp" },
    { id: "finance", href: "/solutions", image: "/assets/vectors/pay.jpg" },
  ] as const;

  return (
    <section className={`${home.section} bg-neutral-950`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          title={`${t("title1")}${t("title2")}`}
          description={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map(({ id, href, image }) => (
            <Link key={id} href={href} className={`${home.cardInteractive} flex flex-col h-full`}>
              <div className={home.media}>
                <Image
                  src={image}
                  alt={t(`cards.${id}.title`)}
                  fill
                  className={home.mediaImage}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className={`${home.cardBody} flex flex-col flex-1`}>
                <h3 className="text-base font-semibold text-white mb-2">{t(`cards.${id}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
                  {t(`cards.${id}.desc`)}
                </p>
                <span className={home.textLink}>{t(`cards.${id}.cta`)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
