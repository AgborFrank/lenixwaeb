import { getTranslations } from "next-intl/server";
import { glass } from "@/lib/recovery-styles";

const ITEM_KEYS = ["review", "file", "track", "fee"] as const;

export default async function RefundSystem() {
  const t = await getTranslations("PurchaseRefund.System");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.titleCenter}>{t("title")}</h2>
          <p className={`${glass.leadCenter} mt-4`}>{t("description")}</p>
        </header>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
          {ITEM_KEYS.map((key, index) => (
            <li key={key} className={`${glass.card} ${glass.cardBody} flex flex-col`}>
              <p className="text-xs font-medium text-neutral-500 mb-3">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-base font-semibold text-white mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{t(`items.${key}.description`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
