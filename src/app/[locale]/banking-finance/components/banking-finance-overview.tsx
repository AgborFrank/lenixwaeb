import { getTranslations } from "next-intl/server";

export default async function BankingFinanceOverview() {
  const t = await getTranslations("BankingFinance.Overview");

  return (
    <section className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">{t("title")}</h2>
          <p className="text-zinc-400 leading-relaxed">{t("description")}</p>
        </div>
      </div>
    </section>
  );
}
