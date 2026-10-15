import { getTranslations } from "next-intl/server";
import { glass } from "@/lib/recovery-styles";

const POINT_KEYS = ["intake", "share", "terms"] as const;

export default async function RefundFees() {
  const t = await getTranslations("PurchaseRefund.Fees");

  return (
    <section className={`${glass.section} bg-neutral-950`}>
      <div className={glass.container}>
        <div className={`${glass.panel} rounded-xl px-6 py-10 sm:px-10 lg:px-14 lg:py-12`}>
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={`${glass.title} mb-4 max-w-3xl`}>{t("title")}</h2>
          <p className={`${glass.lead} max-w-2xl mb-10`}>{t("description")}</p>

          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            {POINT_KEYS.map((key) => (
              <p key={key} className="text-sm text-neutral-300 leading-relaxed border-l-2 border-yellow-400/80 pl-4">
                {t(`points.${key}`)}
              </p>
            ))}
          </div>

          <a href="#start-refund" className={glass.btnPrimary}>
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
