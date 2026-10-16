"use client";

import { ArrowDownLeft, ArrowUpRight, History, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { adminGlass } from "@/lib/admin-glass";
import { Button } from "@/components/ui/button";
import { useWallet } from "../lenix-wallet/_hooks/use-wallet";
import { getVaultPortfolio } from "./actions";
import { ConnectWalletDrawer } from "./_components/connect-wallet-drawer";
import { VaultCard } from "./_components/vault-card";
import { AssetList } from "./_components/asset-list";
import { SecurityStatus } from "./_components/security-status";

export default function VaultPage() {
  const t = useTranslations("AccountVault");
  const { walletState, walletData } = useWallet();
  const [portfolio, setPortfolio] = useState<{
    tokens: any[];
    transactions: any[];
    totalBalanceUsd: number;
  } | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);

  const isGlobalLoading =
    walletState === "loading" || (walletState !== "no_wallet" && portfolioLoading);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPortfolioLoading(true);
      try {
        const data = await getVaultPortfolio();
        if (!cancelled) setPortfolio(data);
      } catch (e) {
        console.error("Failed to fetch vault portfolio", e);
        if (!cancelled) toast.error(t("page.load_error"));
      } finally {
        if (!cancelled) setPortfolioLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [walletState, t]);

  const displayTokens = portfolio?.tokens ?? [];
  const totalBalance = portfolio?.totalBalanceUsd ?? 0;
  const totalBalance24hAgo =
    portfolio?.tokens?.reduce((acc: number, token: any) => acc + (token.quote_24h || 0), 0) ?? 0;
  const changeValue = totalBalance - totalBalance24hAgo;
  const changePercent = totalBalance24hAgo !== 0 ? (changeValue / totalBalance24hAgo) * 100 : 0;

  const statusLabel =
    walletState === "unlocked"
      ? t("page.status_active")
      : walletState === "locked"
        ? t("page.status_locked")
        : t("page.status_no_wallet");
  const statusClass =
    walletState === "unlocked"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : walletState === "locked"
        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
        : "border-white/10 bg-white/[0.04] text-zinc-400";

  const actions = [
    { href: "/receive", icon: Plus, label: t("actions.deposit") },
    { href: "/send", icon: ArrowUpRight, label: t("actions.withdraw") },
    { href: "/lenix-wallet", icon: ArrowDownLeft, label: t("actions.swap") },
    { href: "/lenix-wallet", icon: ShieldCheck, label: t("actions.audit") },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{t("page.title")}</h1>
            <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-zinc-400">{t("page.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" className={`h-9 ${adminGlass.field}`} asChild>
            <Link href="/lenix-wallet">
              <History className="size-4" />
              {t("page.history")}
            </Link>
          </Button>
          <ConnectWalletDrawer />
        </div>
      </header>

      <VaultCard totalBalance={totalBalance} change24h={changePercent} isLoading={isGlobalLoading} />

      <nav className={`${adminGlass.surface} grid grid-cols-4 divide-x divide-white/[0.06]`} aria-label={t("actions.deposit")}>
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex h-14 flex-col items-center justify-center gap-1 text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <action.icon className="size-4" />
            <span className="text-[11px] font-medium">{action.label}</span>
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssetList tokens={displayTokens} isLoading={isGlobalLoading} />
        </div>
        <div className="space-y-4">
          <SecurityStatus
            walletState={walletState}
            walletAddress={walletData?.address}
            transactions={portfolio?.transactions ?? []}
          />
          <section className={`${adminGlass.surface} p-4`}>
            <h2 className="text-sm font-medium text-white">{t("premium.title")}</h2>
            <p className="mt-1 text-sm text-zinc-500">{t("premium.description")}</p>
            <Button type="button" size="sm" className="mt-4 h-9 bg-white text-black hover:bg-zinc-200" asChild>
              <Link href="/lenix-wallet">{t("premium.cta")}</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
