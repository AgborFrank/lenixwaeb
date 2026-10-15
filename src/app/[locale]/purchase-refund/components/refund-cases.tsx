import { getTranslations } from "next-intl/server";
import { glass } from "@/lib/recovery-styles";

const CASE_KEYS = ["lost", "damaged", "delayed", "short"] as const;

export default async function RefundCases() {
  const t = await getTranslations("PurchaseRefund.Cases");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.title}>{t("title")}</h2>
          <p className={`${glass.lead} mt-4 max-w-2xl`}>{t("description")}</p>
        </header>

        <div className="grid sm:grid-cols-2 gap-5">
          {CASE_KEYS.map((key) => (
            <article key={key} className={`${glass.cardHover} ${glass.cardBody}`}>
              <h3 className="text-base font-semibold text-white mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${key}.description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
