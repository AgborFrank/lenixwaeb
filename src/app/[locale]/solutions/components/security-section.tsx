import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const PILLAR_KEYS = ["monitoring", "access", "incident"] as const;

export default async function SecuritySection() {
  const t = await getTranslations("Solutions.Security");

  return (
    <section id="security" className={`${home.section} ${home.sectionMuted} scroll-mt-24`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className={`${home.card} relative aspect-[21/9] mb-10`}>
          <Image
            src="/assets/img/MonitorRisk.webp"
            alt={t("title")}
            fill
            className={home.mediaImage}
            sizes="100vw"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {PILLAR_KEYS.map((key) => (
            <div key={key}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`pillars.${key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`pillars.${key}.desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/security" className={home.btnPrimary}>
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
