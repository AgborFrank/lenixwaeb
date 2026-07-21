import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const ITEM_KEYS = ["timeline", "report", "testimony"] as const;

export default async function CryptoAssetIdentificationDeliverables() {
  const t = await getTranslations("CryptoAssetIdentification.Deliverables");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {ITEM_KEYS.map((id) => (
            <article key={id} className={`${home.card} ${home.cardBody} flex flex-col h-full`}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`items.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed flex-1">{t(`items.${id}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
