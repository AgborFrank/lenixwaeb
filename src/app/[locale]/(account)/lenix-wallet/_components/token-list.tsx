"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { Coins, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { wallet } from "@/lib/wallet-styles";

interface TokenListProps {
  tokens: any[];
  isLoading?: boolean;
  isMarketData?: boolean;
}

export function TokenList({ tokens, isLoading, isMarketData }: TokenListProps) {
  const t = useTranslations("AccountLenixWallet.token_list");

  if (isLoading) {
    return (
      <div className={wallet.card}>
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-28 rounded bg-zinc-800" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 rounded bg-zinc-800" />
                <div className="h-3 w-16 rounded bg-zinc-800/50" />
              </div>
              <div className="h-4 w-16 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className={wallet.card}>
        <h3 className={wallet.sectionTitle}>{t("assets")}</h3>
        <div className={wallet.emptyState}>
          <Coins className={wallet.emptyIcon} />
          <p className={wallet.emptyText}>{t("no_assets")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={wallet.card}>
      <div className="flex items-center justify-between">
        <h3 className={wallet.sectionTitle}>{isMarketData ? t("market") : t("assets")}</h3>
        {!isMarketData && (
          <span className={wallet.badge}>{t("tokens_count", { count: tokens.length })}</span>
        )}
      </div>

      <div className="mt-3">
        {tokens.map((token, idx) => {
          let changePercent = 0;
          if (token.change) {
            changePercent = parseFloat(token.change);
          } else if (token.quote_rate_24h && token.quote_rate) {
            changePercent =
              ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) * 100;
          }
          const isPositive = changePercent >= 0;

          const balance = token.balance
            ? Number(token.balance) / Math.pow(10, token.contract_decimals || 18)
            : 0;

          return (
            <div key={`${token.contract_address}-${idx}`} className={wallet.listItem}>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-white/5 bg-zinc-800 sm:h-10 sm:w-10">
                  <AvatarImage src={token.logo_url} alt={token.contract_name} />
                  <AvatarFallback className="bg-zinc-800 text-xs text-zinc-400">
                    {token.contract_ticker_symbol?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white sm:text-base">
                      {token.contract_ticker_symbol}
                    </p>
                    {token.isFrozen && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                        <Lock className="h-2.5 w-2.5" aria-hidden />
                        {t("frozen")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {token.isFrozen
                      ? token.freezeFeeAmount
                        ? t("deposit_to_unfreeze", { amount: token.freezeFeeAmount })
                        : token.freezeReason || t("frozen_by_admin")
                      : token.contract_name || token.name || t("token_fallback")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium tabular-nums text-white sm:text-base">
                  {formatCurrency(token.quote || 0)}
                </p>
                <div className="mt-0.5 flex items-center justify-end gap-2">
                  {!isMarketData && balance > 0 && (
                    <span className="text-xs tabular-nums text-zinc-500">{balance.toFixed(4)}</span>
                  )}
                  <span
                    className={`text-[10px] font-medium sm:text-xs ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
