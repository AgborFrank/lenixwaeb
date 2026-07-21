import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

const ITEM_KEYS = [
  "corridors",
  "kyc",
  "quotes",
  "liquidation_types",
  "timing",
  "regulatory",
] as const;

export default async function BankingFinanceBoundaries() {
  const t = await getTranslations("BankingFinance.Boundaries");

  return (
    <section className={`${home.section} bg-black`}>
      <div className={home.container}>
        <div className="max-w-3xl mb-12 lg:mb-14">
          <p className={`${home.eyebrow} mb-3 text-yellow-400 uppercase tracking-wider text-xs`}>
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-tight mb-4">
            {t("title1")}
            {t("title2")}
          </h2>
          <p className={home.lead}>{t("subtitle")}</p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
          {ITEM_KEYS.map((id) => (
            <li key={id} className="border-l-2 border-yellow-400/80 pl-4 py-2">
              <h3 className="text-base font-semibold text-white mb-1">{t(`items.${id}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${id}.desc`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
