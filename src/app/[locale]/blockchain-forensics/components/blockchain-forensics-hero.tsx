import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { home } from "@/lib/home-styles";

export default async function BlockchainForensicsHero() {
  const t = await getTranslations("BlockchainForensics.Hero");

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/bg.jpg"
          alt=""
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black" />
      </div>

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:w-1/2 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-tight mb-6">
            {t("title1")}
            {t("title2")}
          </h1>
          <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl">{t("subtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className={`${home.btnPrimary} h-12 px-8 gap-2`}>
              {t("btn_primary")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className={`${home.btnSecondary} h-12 px-8`}>
              {t("btn_secondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
