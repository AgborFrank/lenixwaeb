import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

export default async function CryptoAssetIdentificationCta() {
  const t = await getTranslations("CryptoAssetIdentification.Cta");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={`${home.container} max-w-2xl text-center`}>
        <h2 className={`${home.title} mb-4`}>{t("title")}</h2>
        <p className={`${home.lead} mb-8`}>{t("subtitle")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className={home.btnPrimary}>
            {t("btn_primary")}
          </Link>
          <Link href="/contact" className={home.btnSecondary}>
            {t("btn_secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
