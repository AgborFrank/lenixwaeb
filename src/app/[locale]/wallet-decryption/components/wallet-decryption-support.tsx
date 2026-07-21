import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const COLUMN_KEYS = ["software", "hardware", "formats"] as const;

export default async function WalletDecryptionSupport() {
  const t = await getTranslations("WalletDecryption.Support");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <HomeSectionHeader
          align="center"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {COLUMN_KEYS.map((id) => (
            <article key={id}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`columns.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`columns.${id}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
