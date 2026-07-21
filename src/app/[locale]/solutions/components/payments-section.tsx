import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const CAPABILITY_KEYS = ["corridors", "visibility", "compliance"] as const;

const CAPABILITY_IMAGES = {
  corridors: "/assets/img/trade-routes.jpg",
  visibility: "/assets/img/DetectFinancialCrime.webp",
  compliance: "/assets/img/UncoverIllicitConnections.webp",
} as const;

export default async function PaymentsSection() {
  const t = await getTranslations("Solutions.Payments");

  return (
    <section id="payments" className={`${home.section} bg-black scroll-mt-24`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ol className="grid md:grid-cols-3 gap-5 mb-10 list-none p-0 m-0">
          {CAPABILITY_KEYS.map((key) => (
            <li key={key} className={`${home.card} flex flex-col`}>
              <div className={home.media}>
                <Image
                  src={CAPABILITY_IMAGES[key]}
                  alt={t(`capabilities.${key}.title`)}
                  fill
                  className={home.mediaImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className={home.cardBody}>
                <h3 className="text-base font-semibold text-white mb-2">
                  {t(`capabilities.${key}.title`)}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {t(`capabilities.${key}.desc`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center">
          <Link href="/finance" className={home.btnPrimary}>
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
