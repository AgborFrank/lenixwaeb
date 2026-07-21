import { getTranslations } from "next-intl/server";

const SERVICE_KEYS = ["transfer", "liquidation", "lending", "custody"] as const;

export default async function BankingFinanceServices() {
  const t = await getTranslations("BankingFinance.Services");

  return (
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">{t("title")}</h2>
          <p className="text-zinc-400 leading-relaxed">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_KEYS.map((key) => (
            <article
              key={key}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{t(`items.${key}.title`)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{t(`items.${key}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
