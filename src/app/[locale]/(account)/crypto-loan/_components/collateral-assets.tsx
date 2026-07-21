"use client";

import { useTranslations } from "next-intl";

const ASSET_KEYS = ["BTC", "ETH", "SOL", "XRP"] as const;

const ASSET_META: Record<(typeof ASSET_KEYS)[number], { ltv: string; rate: string; color: string }> = {
  BTC: { ltv: "85%", rate: "0.5%", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  ETH: { ltv: "80%", rate: "0.8%", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  SOL: { ltv: "75%", rate: "1.2%", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  XRP: { ltv: "60%", rate: "2.1%", color: "text-white bg-zinc-500/10 border-zinc-500/20" },
};

export function CollateralAssets() {
  const t = useTranslations("AccountCryptoLoan.collateral");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-white">{t("title")}</h3>
        <span className="text-xs text-zinc-500">{t("live_rates")}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ASSET_KEYS.map((symbol) => {
          const asset = ASSET_META[symbol];
          return (
            <div
              key={symbol}
              className="group flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 p-3 transition-colors hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold ${asset.color}`}>
                  {symbol[0]}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{t(`assets.${symbol}`)}</p>
                  <p className="text-[10px] text-zinc-500">{t("max_ltv", { ltv: asset.ltv })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-300">{asset.rate}</p>
                <p className="text-[10px] text-zinc-600">{t("fee")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
