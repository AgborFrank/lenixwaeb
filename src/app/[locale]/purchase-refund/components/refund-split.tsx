import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { glass } from "@/lib/recovery-styles";

const POINT_KEYS = ["lost", "damaged", "late", "manual"] as const;

export default async function RefundSplit() {
  const t = await getTranslations("PurchaseRefund.Split");

  return (
    <section className={`${glass.section} bg-neutral-950`}>
      <div className={glass.container}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`${glass.media} aspect-[4/3] lg:aspect-auto lg:min-h-[420px]`}>
            <Image
              src="/assets/img/scale.webp"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          <div>
            <p className={`${glass.eyebrow} mb-3`}>{t("eyebrow")}</p>
            <h2 className={`${glass.title} mb-4`}>{t("title")}</h2>
            <p className={`${glass.lead} mb-8 text-neutral-300`}>{t("description")}</p>
            <ul className="space-y-4 mb-8 list-none p-0 m-0">
              {POINT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" aria-hidden />
                  <span>{t(`points.${key}`)}</span>
                </li>
              ))}
            </ul>
            <a href="#start-refund" className={glass.btnPrimary}>
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
