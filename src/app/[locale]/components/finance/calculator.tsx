"use client";

import { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { home } from "@/lib/home-styles";
import { TokenIcon } from "@/components/token-icon";

const assets = [
  { name: "USDC", apy: 0.124 },
  { name: "WBTC", apy: 0.042 },
  { name: "ETH", apy: 0.038 },
  { name: "LNX", apy: 0.185 },
] as const;

export default function FinanceCalculator() {
  const t = useTranslations("FinancePage.Calculator");
  const [amount, setAmount] = useState<number>(10000);
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [months, setMonths] = useState<number>(12);

  const estimatedEarnings = amount * selectedAsset.apy * (months / 12);
  const totalBalance = amount + estimatedEarnings;

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{t("title")}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{t("description")}</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-gray-400 mb-2">{t("stats.max_apy_label")}</p>
                <p className="text-3xl font-bold text-yellow-400">{t("stats.max_apy_value")}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-gray-400 mb-2">{t("stats.payout_label")}</p>
                <p className="text-3xl font-bold text-white">{t("stats.payout_value")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

            <div className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  {t("form.amount_label")}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                    {assets.map((asset) => (
                      <button
                        key={asset.name}
                        type="button"
                        onClick={() => setSelectedAsset(asset)}
                        aria-label={asset.name}
                        title={asset.name}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          selectedAsset.name === asset.name
                            ? "bg-yellow-400 text-black"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <TokenIcon symbol={asset.name} size={18} />
                        <span className="hidden sm:inline">{asset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    {t("form.duration_label")}
                  </label>
                  <span className="font-mono text-yellow-400">{t("form.months", { count: months })}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>{t("form.month_min")}</span>
                  <span>{t("form.month_max")}</span>
                </div>
              </div>

              <div className="bg-black/50 rounded-xl p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t("form.earnings_label")}</span>
                  <span className="text-xl font-bold text-green-400">
                    +${estimatedEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{t("form.total_label")}</span>
                  <span className="text-3xl font-bold text-white">
                    ${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{t("form.disclaimer")}</p>
              </div>

              <Link href="/crypto-loan" className={`${home.btnPrimary} w-full py-4 text-base`}>
                {t("form.btn")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
