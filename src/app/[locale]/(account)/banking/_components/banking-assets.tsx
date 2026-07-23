"use client";

import { ArrowRight, Landmark } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { AssetBalance, TransferDirection } from "@/lib/banking/types";

interface BankingAssetsProps {
  assets: AssetBalance[];
  onTransfer: (direction: TransferDirection) => void;
}

export function BankingAssets({ assets, onTransfer }: BankingAssetsProps) {
  const t = useTranslations("AccountBanking.assets");
  const locale = useLocale();

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3.5 sm:px-5 sm:py-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-white">{t("title")}</h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => onTransfer("spot_to_funding")}
          className="inline-flex h-10 items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FCD535] transition-colors hover:text-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
        >
          {t("move_funds")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="divide-y divide-zinc-800 xl:hidden">
        {assets.map((asset) => (
          <div key={`${asset.location}-${asset.symbol}`} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-bold text-white">
              {asset.symbol.slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{asset.symbol}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
                  <Landmark className="h-2.5 w-2.5" aria-hidden />
                  {t(`location.${asset.location}` as "location.spot" | "location.funding")}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{asset.name}</p>
              <p className="mt-1 text-xs text-zinc-400">
                {asset.amount.toLocaleString(locale, { maximumFractionDigits: 6 })} · {" "}
                {new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(asset.usdValue)}
              </p>
            </div>
            <span className={`shrink-0 text-sm font-medium tabular-nums ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
              {asset.change24h >= 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      <div className="hidden xl:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/70 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-5 py-3">{t("columns.asset")}</th>
              <th className="px-5 py-3">{t("columns.wallet")}</th>
              <th className="px-5 py-3 text-right">{t("columns.balance")}</th>
              <th className="px-5 py-3 text-right">{t("columns.value")}</th>
              <th className="px-5 py-3 text-right">{t("columns.change_24h")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {assets.map((asset) => (
              <tr key={`${asset.location}-${asset.symbol}`} className="hover:bg-zinc-900/60">
                <td className="px-5 py-4">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-xs font-bold text-white">
                      {asset.symbol.slice(0, 2)}
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{asset.symbol}</span>
                      <span className="mt-0.5 block text-xs text-zinc-500">{asset.name}</span>
                    </span>
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300">
                    <Landmark className="h-3 w-3" aria-hidden />
                    {t(`location.${asset.location}` as "location.spot" | "location.funding")}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-medium tabular-nums text-white">
                  {asset.amount.toLocaleString(locale, { maximumFractionDigits: 6 })}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-zinc-300">
                  {new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(asset.usdValue)}
                </td>
                <td className={`px-5 py-4 text-right font-medium tabular-nums ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {asset.change24h >= 0 ? "+" : ""}
                  {asset.change24h.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
