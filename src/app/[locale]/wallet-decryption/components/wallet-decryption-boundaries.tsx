import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

const ITEM_KEYS = ["ownership", "assessment", "no_custody", "no_scam", "decline", "confidential"] as const;

export default async function WalletDecryptionBoundaries() {
  const t = await getTranslations("WalletDecryption.Boundaries");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <div className="max-w-3xl mb-12 lg:mb-14">
          <p className={`${home.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={`${home.title} mb-4`}>
            {t("title1")}
            {t("title2")}
          </h2>
          <p className={home.lead}>{t("subtitle")}</p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
          {ITEM_KEYS.map((id) => (
            <li key={id} className="border-l-2 border-yellow-400/80 pl-4 py-2">
              <h3 className="text-sm font-semibold text-white mb-1">{t(`items.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${id}.desc`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
