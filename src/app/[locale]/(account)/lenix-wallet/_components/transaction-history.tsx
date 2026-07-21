"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { wallet } from "@/lib/wallet-styles";

interface TransactionHistoryProps {
  transactions: any[];
  isLoading?: boolean;
}

export function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  const t = useTranslations("AccountLenixWallet.activity");

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-5 w-24 rounded bg-zinc-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 w-full rounded-lg bg-zinc-800/50" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-white sm:text-base">{t("title")}</h3>

      {!transactions || transactions.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
          <Clock className="h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">{t("no_activity")}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-1">
          {transactions.slice(0, 5).map((tx) => {
            const decimals = tx.decimals ?? 18;
            const amount =
              decimals > 0
                ? Number(tx.value || 0) / Math.pow(10, decimals)
                : Number(tx.value || 0);
            const date = new Date(tx.block_timestamp);
            const formattedDate = format(date, "MMM d, h:mm a");
            const chainSymbol =
              tx.symbol ||
              (tx.chainId === 1
                ? "ETH"
                : tx.chainId === 56
                  ? "BNB"
                  : tx.chainId === 137
                    ? "MATIC"
                    : "BTC");
            const isComplete = tx.receipt_status === "1" || tx.status === "confirmed";

            return (
              <div key={tx.hash} className={wallet.listItem}>
                <div className="flex items-center gap-3">
                  <div className={wallet.listIcon}>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                    </p>
                    <p className="text-xs text-zinc-500">{formattedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums text-white">
                    {amount.toFixed(chainSymbol === "BTC" ? 8 : 4)} {chainSymbol}
                  </p>
                  <span
                    className={`${wallet.badge} ${isComplete ? wallet.badgeSuccess : wallet.badgeWarning}`}
                  >
                    {isComplete ? t("done") : t("pending")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
