import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const STEPS = [
  { id: "intake", image: "/assets/img/investigate.webp" },
  { id: "trace", image: "/assets/img/MonitorRisk.webp" },
  { id: "report", image: "/assets/img/DetectFinancialCrime.webp" },
] as const;

export default async function CryptoAssetIdentificationProcess() {
  const t = await getTranslations("CryptoAssetIdentification.Process");

  return (
    <section id="case-review" className={`${home.section} ${home.sectionMuted} scroll-mt-24`}>
      <div className={home.container}>
        <HomeSectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
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

        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className={home.btnPrimary}>
            {t("btn_primary")}
          </Link>
          <Link href="/contact" className={home.btnSecondary}>
            {t("btn_secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
