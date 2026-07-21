import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const AUDIT_ITEMS = [
  { id: "contracts", image: "/assets/img/staff.jpg" },
  { id: "access", image: "/assets/img/investigate.webp" },
  { id: "monitoring", image: "/assets/img/DetectFinancialCrime.webp" },
] as const;

export default async function SecurityAuditScope() {
  const t = await getTranslations("Security.audit");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <HomeSectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("desc")}
        />

        <ol className="grid md:grid-cols-3 gap-5 list-none p-0 m-0">
          {AUDIT_ITEMS.map(({ id, image }) => (
            <li key={id} className={`${home.card} flex flex-col`}>
              <div className={home.media}>
                <Image
                  src={image}
                  alt={t(`items.${id}.title`)}
                  fill
                  className={home.mediaImage}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className={home.cardBody}>
                <h3 className="text-base font-semibold text-white mb-2">{t(`items.${id}.title`)}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${id}.desc`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
