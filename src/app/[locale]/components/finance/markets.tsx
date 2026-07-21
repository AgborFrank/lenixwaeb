"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { home } from "@/lib/home-styles";
import { TokenIcon } from "@/components/token-icon";

const MARKET_KEYS = ["wbtc", "eth", "lnx", "usdc", "usdt"] as const;

const MARKET_STATS: Record<
  (typeof MARKET_KEYS)[number],
  { liquidity: string; supplyApy: string; borrowApy: string }
> = {
  wbtc: { liquidity: "$842.5M", supplyApy: "4.25%", borrowApy: "6.12%" },
  eth: { liquidity: "$2.1B", supplyApy: "3.85%", borrowApy: "5.45%" },
  lnx: { liquidity: "$154.2M", supplyApy: "12.40%", borrowApy: "8.20%" },
  usdc: { liquidity: "$1.8B", supplyApy: "5.10%", borrowApy: "7.50%" },
  usdt: { liquidity: "$1.2B", supplyApy: "4.95%", borrowApy: "7.85%" },
};

export default function FinanceMarkets() {
  const t = useTranslations("FinancePage.Markets");

  return (
    <section id="markets" className="py-24 bg-black relative">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{t("title")}</h2>
            <p className="text-gray-400">{t("description")}</p>
          </div>
          <Link href="/crypto-loan" className={`${home.textLink} flex items-center gap-1 text-sm`}>
            {t("view_all")}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  <th className="p-6 font-medium">{t("columns.asset")}</th>
                  <th className="p-6 font-medium">{t("columns.liquidity")}</th>
                  <th className="p-6 font-medium">{t("columns.supply_apy")}</th>
                  <th className="p-6 font-medium">{t("columns.borrow_apy")}</th>
                  <th className="p-6 font-medium text-right">{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MARKET_KEYS.map((key) => {
                  const stats = MARKET_STATS[key];
                  const symbol = t(`assets.${key}.symbol`);
                  return (
                    <tr key={key} className="group hover:bg-white/5 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <TokenIcon symbol={symbol} size={40} className="shadow-lg" />
                        <div>
                          <div className="font-bold text-white">{t(`assets.${key}.name`)}</div>
                          <div className="text-xs text-gray-500">{symbol}</div>
                        </div>
                      </td>
                      <td className="p-6 text-white font-mono">{stats.liquidity}</td>
                      <td className="p-6 text-green-400 font-bold">{stats.supplyApy}</td>
                      <td className="p-6 text-white font-bold">{stats.borrowApy}</td>
                      <td className="p-6">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            {t("supply")}
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 border border-white/10 text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors"
                          >
                            {t("borrow")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
