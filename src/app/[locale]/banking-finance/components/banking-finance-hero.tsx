import { getTranslations } from "next-intl/server";
import Image from "next/image";
import BankingFinanceRowActions from "./banking-finance-row-actions";

export default async function BankingFinanceHero() {
  const t = await getTranslations("BankingFinance.Hero");

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/bg-3.png"
          alt=""
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between gap-12 items-center">
        <div className="md:w-1/2 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-6xl font-semibold text-white tracking-tight leading-tight mb-6">
            {t("title1")}
            {t("title2")}
          </h1>
          <p className="text-lg text-zinc-400 mb-2 leading-relaxed max-w-2xl">{t("subtitle")}</p>
          <BankingFinanceRowActions />
        </div>
        <div className="md:w-1/2 w-full flex justify-center md:justify-end">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="/assets/part/trading-platform.png"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl bg-black/80 border border-white/10 p-4 backdrop-blur-sm">
              <Image
                src="/assets/img/bank-account.svg"
                alt=""
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-28 h-28 rounded-xl bg-black/80 border border-white/10 p-3 backdrop-blur-sm">
              <Image
                src="/assets/img/cross-border.svg"
                alt=""
                width={88}
                height={88}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
