"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const MOCK_ASSETS = [
  { symbol: "BTC", nameKey: "BTC" as const, price: "$64,230.15", change: "+1.2%" },
  { symbol: "ETH", nameKey: "ETH" as const, price: "$3,450.80", change: "+0.8%" },
  { symbol: "SOL", nameKey: "SOL" as const, price: "$145.20", change: "+4.5%" },
];

export function MarketRates({ loanTypes }: { loanTypes: any[] }) {
  const t = useTranslations("AccountCryptoLoan.market_rates");
  const tAssets = useTranslations("AccountCryptoLoan.collateral_assets");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-400">
          <TrendingUp className="h-4 w-4 text-emerald-400" /> {t("live_rates")}
        </h3>
        <div className="space-y-4">
          {MOCK_ASSETS.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white">
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{asset.symbol}</p>
                  <p className="text-[10px] text-zinc-500">{tAssets(asset.nameKey)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{asset.price}</p>
                <p className="text-[10px] text-emerald-400">{asset.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-medium text-zinc-400">{t("available_plans")}</h3>
        <div className="space-y-3">
          {loanTypes.map((type) => (
            <div
              key={type.id}
              className="rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:border-white/10"
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="text-sm font-bold text-white">{type.name}</span>
                <Badge variant="outline" className="border-yellow-400/20 text-[10px] text-yellow-400">
                  {t("ltv", { ltv: type.ltv })}
                </Badge>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500">{t("interest_rate")}</p>
                  <p className="text-lg font-bold text-emerald-400">{type.interest_rate}%</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
