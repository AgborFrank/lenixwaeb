"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import type { WalletState } from "@/app/[locale]/(account)/lenix-wallet/_hooks/use-wallet";

interface SecurityStatusProps {
  walletState: WalletState;
  walletAddress?: string;
  transactions?: any[];
}

export function SecurityStatus({ walletState, walletAddress, transactions = [] }: SecurityStatusProps) {
  const t = useTranslations("AccountVault.security");
  const tTime = useTranslations("AccountVault.time");
  const hasWallet = walletState === "locked" || walletState === "unlocked";

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return tTime("min_ago", { count: diffMins });
    if (diffHours < 24) return tTime("hours_ago", { count: diffHours });
    if (diffDays < 7) return tTime("days_ago", { count: diffDays });
    return date.toLocaleDateString();
  };

  const recentActivity = transactions.slice(0, 5).map((tx, index) => {
    const symbol = tx.symbol || tx.token_symbol || "Token";
    const amount = tx.value ? (Number(tx.value) / Math.pow(10, tx.decimals || 18)).toFixed(4) : null;
    return {
      key: `${tx.hash || tx.transaction_hash || "tx"}-${tx.type || ""}-${index}`,
      title: t("transfer", { symbol }),
      time: tx.block_timestamp ? formatTimeAgo(new Date(tx.block_timestamp)) : tTime("recently"),
      amount: amount ? `${amount} ${symbol}` : null,
    };
  });

  const rows = [
    {
      label: t("items.wallet"),
      value: hasWallet ? t("status.connected") : t("status.not_connected"),
      tone: hasWallet ? "text-emerald-300" : "text-zinc-500",
    },
    {
      label: t("items.cold_storage"),
      value: t("status.active"),
      tone: "text-emerald-300",
    },
    {
      label: t("items.encrypted_vault"),
      value: t("status.active"),
      tone: "text-emerald-300",
    },
    {
      label: t("items.session"),
      value:
        walletState === "unlocked"
          ? t("status.unlocked")
          : walletState === "locked"
            ? t("status.locked")
            : t("status.no_wallet"),
      tone: walletState === "unlocked" ? "text-emerald-300" : "text-yellow-300",
      action: walletState === "locked" ? t("unlock") : undefined,
    },
  ];

  return (
    <div className="space-y-4">
      <section className={`${adminGlass.surface} overflow-hidden`}>
        <div className="border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-sm font-medium text-white">{t("title")}</h2>
        </div>
        <ul className="divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-sm text-zinc-400">{row.label}</span>
              <span className="flex items-center gap-2">
                <span className={`text-xs font-medium ${row.tone}`}>{row.value}</span>
                {row.action ? (
                  <Link href="/lenix-wallet" className="text-xs font-medium text-white underline-offset-4 hover:underline">
                    {row.action}
                  </Link>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
        {walletAddress ? (
          <p className="border-t border-white/[0.06] px-4 py-2 font-mono text-[11px] text-zinc-500">
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          </p>
        ) : null}
      </section>

      <section className={`${adminGlass.surface} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-sm font-medium text-white">{t("recent_activity")}</h2>
          <Link href="/lenix-wallet" className="text-xs text-zinc-400 hover:text-white">
            {t("view_all")}
          </Link>
        </div>
        {recentActivity.length === 0 ? (
          <p className="px-4 py-6 text-sm text-zinc-500">{t("no_activity")}</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {recentActivity.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">{item.title}</p>
                  <p className="text-xs text-zinc-500">{item.time}</p>
                </div>
                {item.amount ? <p className="shrink-0 text-xs tabular-nums text-zinc-300">{item.amount}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
