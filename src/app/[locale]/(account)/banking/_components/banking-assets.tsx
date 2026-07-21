"use client";

import { ArrowRight, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AssetBalance, TransferDirection } from "@/lib/banking/types";

interface BankingAssetsProps {
  assets: AssetBalance[];
  onTransfer: (direction: TransferDirection) => void;
}

export function BankingAssets({ assets, onTransfer }: BankingAssetsProps) {
  const t = useTranslations("AccountBanking.assets");

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-white">{t("title")}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => onTransfer("spot_to_funding")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FCD535] hover:text-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
        >
          {t("move_funds")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
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
                <td className="px-5 py-4 text-right font-medium text-white">
                  {asset.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </td>
                <td className="px-5 py-4 text-right text-zinc-300">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(asset.usdValue)}
                </td>
                <td className={`px-5 py-4 text-right font-medium ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
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
