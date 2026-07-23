"use client";

import { AlertCircle, ArrowDownToLine, Landmark, RefreshCw, WalletCards } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyTransferToOverview } from "@/lib/banking/transfer";
import type { BankingOverview, TransferDirection, TransferRecord } from "@/lib/banking/types";
import { BankingAccounts } from "./banking-accounts";
import { BankingActivity } from "./banking-activity";
import { BankingAssets } from "./banking-assets";
import { BankingSkeleton } from "./banking-skeleton";
import { BankingSummary } from "./banking-summary";
import { BankingTransferDialog } from "./banking-transfer-dialog";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import Image from "next/image";

export function BankingDashboard() {
  const t = useTranslations("AccountBanking");
  const locale = useLocale();
  const [overview, setOverview] = useState<BankingOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<TransferDirection>("spot_to_funding");
  const [selectedTransaction, setSelectedTransaction] = useState<TransferRecord | null>(null);

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/banking/overview", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("error.load_failed"));
      setOverview(result.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t("error.load_failed"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const openTransfer = (direction: TransferDirection) => {
    setTransferDirection(direction);
    setTransferOpen(true);
  };

  const handleTransferCreated = (transfer: TransferRecord) => {
    setOverview((current) => (current ? applyTransferToOverview(current, transfer) : current));
  };

  if (isLoading) return <BankingSkeleton />;

  if (error || !overview) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center" role="alert">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10 text-red-400">
            <AlertCircle className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-white">{t("error.unavailable_title")}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            {error ?? t("error.unavailable_description")}
          </p>
          <button
            type="button"
            onClick={loadOverview}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FCD535] px-4 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            {t("error.try_again")}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6 px-2 sm:px-0 pb-20">
      <BankingSummary overview={overview} onTransfer={openTransfer} />

      <Tabs defaultValue="overview" className="gap-4 sm:gap-5">
        <TabsList variant="line" className="w-full justify-start gap-4 sm:gap-5 overflow-x-auto border-b border-zinc-800 p-0">
          <TabsTrigger value="overview" className="flex-none px-0 pb-2.5 sm:pb-3 text-sm sm:text-base text-zinc-500 after:bg-[#FCD535] data-[state=active]:text-white">
            {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex-none px-0 pb-2.5 sm:pb-3 text-sm sm:text-base text-zinc-500 after:bg-[#FCD535] data-[state=active]:text-white">
            {t("tabs.accounts")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-none px-0 pb-2.5 sm:pb-3 text-sm sm:text-base text-zinc-500 after:bg-[#FCD535] data-[state=active]:text-white">
            {t("tabs.activity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {overview.assets.length > 0 ? (
            <BankingAssets assets={overview.assets} onTransfer={openTransfer} />
          ) : (
            <EmptyAssets onTransfer={openTransfer} />
          )}
          <BankingAccounts accounts={overview.bankAccounts} limits={overview.limits} onAccountAdded={loadOverview} />
          <BankingActivity transactions={overview.transactions.slice(0, 4)} onSelect={setSelectedTransaction} />
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 sm:space-y-6">
          {overview.fiatBalances.length > 0 && (
            <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="flex flex-col divide-y divide-zinc-800 sm:flex-row sm:divide-x sm:divide-y-0">
                {overview.fiatBalances.map((balance) => (
                  <div key={balance.currency} className="flex-1 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                        {t("fiat_balance.funding", { currency: balance.currency })}
                      </span>
                      <WalletCards className="h-4 w-4 text-zinc-600" aria-hidden />
                    </div>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-white sm:text-2xl">
                      {new Intl.NumberFormat(locale, { style: "currency", currency: balance.currency }).format(balance.amount)}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {t("fiat_balance.available", {
                        amount: new Intl.NumberFormat(locale, { style: "currency", currency: balance.currency }).format(balance.available),
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <BankingAccounts accounts={overview.bankAccounts} limits={overview.limits} onAccountAdded={loadOverview} />
        </TabsContent>

        <TabsContent value="activity">
          <BankingActivity transactions={overview.transactions} onSelect={setSelectedTransaction} />
        </TabsContent>
      </Tabs>

      <BankingTransferDialog
        key={`${transferDirection}-${transferOpen}`}
        open={transferOpen}
        onOpenChange={setTransferOpen}
        overview={overview}
        initialDirection={transferDirection}
        onTransferCreated={handleTransferCreated}
      />
      <TransactionDetailDialog
        transaction={selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
      />
    </div>
  );
}

function EmptyAssets({ onTransfer }: { onTransfer: (direction: TransferDirection) => void }) {
  const t = useTranslations("AccountBanking.empty_assets");

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-8 sm:px-5 sm:py-10 text-center">
      <span className="mx-auto flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-400">
           <Image src="/assets/vectors/coin.svg" width={48} height={48} alt="web" />
      </span>
      <h2 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-white">{t("title")}</h2>
      <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed">{t("description")}</p>
      <button
        type="button"
        onClick={() => onTransfer("spot_to_funding")}
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FCD535] px-4 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#F0B90B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/50"
      >
        <ArrowDownToLine className="h-4 w-4" aria-hidden />
        {t("cta")}
      </button>
    </section>
  );
}
