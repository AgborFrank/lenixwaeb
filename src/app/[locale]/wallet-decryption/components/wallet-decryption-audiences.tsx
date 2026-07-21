import { getTranslations } from "next-intl/server";
import { HomeSectionHeader } from "@/app/[locale]/components/home/home-section-header";
import { home } from "@/lib/home-styles";

const CARD_KEYS = ["password", "file", "estate", "treasury"] as const;

export default async function WalletDecryptionAudiences() {
  const t = await getTranslations("WalletDecryption.Audiences");

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
            <article key={id} className={`${home.card} ${home.cardBody} flex flex-col h-full`}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`cards.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed flex-1">{t(`cards.${id}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
