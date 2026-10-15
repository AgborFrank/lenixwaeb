import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { glass } from "@/lib/recovery-styles";

const TAKE_KEYS = ["a", "b", "c"] as const;
const SKIP_KEYS = ["a", "b", "c"] as const;

export default async function RefundBoundaries() {
  const t = await getTranslations("PurchaseRefund.Boundaries");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl">
          <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
          <h2 className={glass.title}>{t("title")}</h2>
          <p className={`${glass.lead} mt-4 max-w-2xl`}>{t("description")}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-5">
          <article className={`${glass.card} ${glass.cardBody}`}>
            <h3 className="text-base font-semibold text-white mb-5">{t("take.title")}</h3>
            <ul className="space-y-4 list-none p-0 m-0">
              {TAKE_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" aria-hidden />
                  <span>{t(`take.items.${key}`)}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className={`${glass.card} ${glass.cardBody}`}>
            <h3 className="text-base font-semibold text-white mb-5">{t("skip.title")}</h3>
            <ul className="space-y-4 list-none p-0 m-0">
              {SKIP_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" aria-hidden />
                  <span>{t(`skip.items.${key}`)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link href="/crypto-recovery" className={glass.textLink}>
                {t("recoveryLink")}
              </Link>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
