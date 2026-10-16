"use client";

import { Copy } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminGlass } from "@/lib/admin-glass";
import { cn, formatCurrency } from "@/lib/utils";

interface AssetListProps {
  tokens: any[];
  isLoading?: boolean;
}

export function AssetList({ tokens, isLoading }: AssetListProps) {
  const t = useTranslations("AccountVault.assets");

  const copyAddress = (address: string) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success(t("address_copied"));
  };

  const chainLabel = (chainId: number) => {
    if (chainId === 1) return t("chains.ethereum");
    if (chainId === 56) return t("chains.bsc");
    if (chainId === 137) return t("chains.polygon");
    return t("chains.evm");
  };

  return (
    <section className={`${adminGlass.surface} overflow-hidden`} aria-label={t("title")}>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <h2 className="text-sm font-medium text-white">{t("title")}</h2>
        <p className="text-xs tabular-nums text-zinc-500">
          {isLoading ? "—" : tokens.length === 0 ? t("count_zero") : t("count", { count: tokens.length })}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2 p-4" aria-busy="true">
          {[1, 2, 3].map((row) => (
            <div key={row} className="h-10 animate-pulse rounded-md bg-white/[0.04]" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
          <Image src="/assets/vectors/coin.svg" alt="" width={48} height={56} className="opacity-80" />
          <p className="max-w-sm text-sm text-zinc-500">{t("empty")}</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-white/[0.06] sm:hidden">
            {tokens.map((token, idx) => {
              const change = changePercent(token);
              return (
                <li key={`${token.contract_address || token.contract_ticker_symbol}-${idx}`} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {token.contract_ticker_symbol || token.contract_name}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{chainLabel(token.chainId)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums text-white">{formatCurrency(token.quote || 0)}</p>
                      <p className={cn("text-xs tabular-nums", change >= 0 ? "text-emerald-300" : "text-red-300")}>
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className={adminGlass.tableHead}>{t("title")}</th>
                  <th className={`${adminGlass.tableHead} text-right`}>Balance</th>
                  <th className={`${adminGlass.tableHead} text-right`}>Value</th>
                  <th className={`${adminGlass.tableHead} text-right`}>24h</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, idx) => {
                  const change = changePercent(token);
                  const address = token.contract_address as string | undefined;
                  const balance = (
                    Number(token.balance) / Math.pow(10, token.contract_decimals ?? 18)
                  ).toFixed(4);
                  return (
                    <tr
                      key={`${token.contract_address || token.contract_ticker_symbol}-${idx}`}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                    >
                      <td className={adminGlass.tableCell}>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7 border border-white/10 bg-zinc-900">
                            <AvatarImage src={token.logo_url} alt="" />
                            <AvatarFallback>{token.contract_ticker_symbol?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-white">{token.contract_ticker_symbol}</p>
                            <p className="text-xs text-zinc-500">{chainLabel(token.chainId)}</p>
                          </div>
                          {address ? (
                            <button
                              type="button"
                              onClick={() => copyAddress(address)}
                              className="ml-1 rounded p-1 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
                              aria-label={t("address_copied")}
                            >
                              <Copy className="size-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                      <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>
                        {balance} {token.contract_ticker_symbol}
                      </td>
                      <td className={`${adminGlass.tableCell} text-right tabular-nums text-white`}>
                        {formatCurrency(token.quote || 0)}
                      </td>
                      <td
                        className={`${adminGlass.tableCell} text-right tabular-nums ${
                          change >= 0 ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function changePercent(token: any) {
  if (token.change) return parseFloat(token.change);
  if (token.quote_rate_24h) {
    return ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) * 100;
  }
  return 0;
}
