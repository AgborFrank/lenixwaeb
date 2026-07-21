import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { home } from "@/lib/home-styles";

export default async function BlockchainForensicsCta() {
  const t = await getTranslations("BlockchainForensics.Cta");

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">{t("title")}</h2>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">{t("description")}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/contact" className={`${home.btnPrimary} h-12 px-10 text-base`}>
            {t("btn_primary")}
          </Link>
          <Link href="/crypto-recovery" className={`${home.btnSecondary} h-12 px-10 text-base`}>
            {t("btn_secondary")}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-yellow-400/10 blur-[100px] -z-0 rounded-full pointer-events-none" />
    </section>
  );
}
