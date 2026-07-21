import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const CARD_KEYS = ["recovery", "payments", "lending", "security"] as const;

const CARD_IMAGES = {
  recovery: "/assets/img/investigate.webp",
  payments: "/assets/img/scale.webp",
  lending: "/assets/img/BringDeFiIntelligence.webp",
  security: "/assets/img/MonitorRisk.webp",
} as const;

export default async function SolutionsOverview() {
  const t = await getTranslations("Solutions.Overview");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARD_KEYS.map((id) => (
            <Link key={id} href={`#${id}`} className={`${home.cardInteractive} flex flex-col h-full`}>
              <div className={home.media}>
                <Image
                  src={CARD_IMAGES[id]}
                  alt={t(`cards.${id}.title`)}
                  fill
                  className={home.mediaImage}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className={`${home.cardBody} flex flex-col flex-1`}>
                <h3 className="text-base font-semibold text-white mb-2">{t(`cards.${id}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
                  {t(`cards.${id}.desc`)}
                </p>
                <span className={home.textLink}>{t("learn_more")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
