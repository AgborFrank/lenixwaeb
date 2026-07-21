import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const PRACTICE_KEYS = ["data", "incident", "custody"] as const;

export default async function SecurityPractices() {
  const t = await getTranslations("Security");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("practices.eyebrow")}
          title={t("practices.title")}
          description={t("practices.description")}
        />

        <div className={`${home.card} relative aspect-[21/9] mb-10`}>
          <Image
            src="/assets/img/MonitorRisk.webp"
            alt={t("practices.image_alt")}
            fill
            className={home.mediaImage}
            sizes="100vw"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRACTICE_KEYS.map((id) => (
            <article key={id}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`practices.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`practices.${id}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
