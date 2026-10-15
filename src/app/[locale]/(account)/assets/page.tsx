"use client";

import { Wallet, Loader2 } from "lucide-react";
import { Overview } from "./_components/overview";
import { AllocationChart } from "./_components/allocation-chart";
import { AssetTable } from "./_components/asset-table";
import { useWallet } from "../lenix-wallet/_hooks/use-wallet";
import { getHoldingsFromDb, type DbHoldingsResult } from "./actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AssetsPage() {
  const { walletData, walletState, portfolio } = useWallet();
  const [dbHoldings, setDbHoldings] = useState<DbHoldingsResult | null>(null);
  
  // Loading state checks:
  // 1. If wallet is loading -> true
  // 2. If unlocked but no portfolio yet -> true
  // 3. If locked/no_wallet -> false (we show DB data or empty)
  const isGlobalLoading = walletState === "loading" || (walletState === "unlocked" && !portfolio);

  // Always load Lenix wallet holdings from DB (user_balances) so we show something even when wallet is locked
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getHoldingsFromDb();
        if (!cancelled) setDbHoldings(data);
      } catch (e) {
        console.error("Failed to fetch holdings from DB", e);
        if (!cancelled) toast.error("Failed to load holdings");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Prefer on-chain (Moralis) data when we have tokens; otherwise show DB holdings (Lenix wallet backend)
  // If portfolio is present (even if empty tokens array, it's valid data), use it.
  // But wait, if portfolio is present, it means we fetched it.
  const hasMoralisTokens = !!portfolio;
  
  const displayTokens = hasMoralisTokens ? (portfolio.tokens) : (dbHoldings?.tokens ?? []);
  const totalBalance = hasMoralisTokens ? (portfolio.totalBalanceUsd) : (dbHoldings?.totalBalanceUsd ?? 0);

  // We don't have historical data in portfolio context yet to calculate 24h change perfectly,
  // but let's see if we can approximate or just leave it for now.
  // The previous code had:
  // const totalBalance24hAgo = hasMoralisTokens 
  //   ? (portfolio!.tokens.reduce((acc, token) => acc + (token.quote_24h || 0), 0) || 0) 
  //   : 0;
  // Let's keep this logic if 'quote_24h' exists on tokens. 
  // 'quote_24h' isn't on standard Moralis/actions.ts return type explicitly but dynamic JS objects might have it if upstream provides.
  // For safety, safely access it.
  
  const totalBalance24hAgo = hasMoralisTokens
    ? (portfolio.tokens.reduce((acc: any, token: any) => acc + (token.quote_24h || 0), 0) || 0)
    : 0;
    
  const changeValue = totalBalance - totalBalance24hAgo;
  const changePercent = totalBalance24hAgo !== 0 ? (changeValue / totalBalance24hAgo) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-4 pb-8">
      <div>
         <h1 className="flex items-center gap-2 text-xl font-semibold text-white">
            My Assets
         </h1>
         <p className="mt-0.5 text-sm text-zinc-400">
            Manage your crypto balances across all supported networks.
         </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
         <div className="lg:col-span-2">
            <Overview 
                totalBalance={totalBalance}
                change24h={changePercent}
                change24hValue={changeValue}
                isLoading={isGlobalLoading}
            />
         </div>
         <div>
            <AllocationChart tokens={displayTokens} />
         </div>
      </div>

      {/* Asset List Section */}
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white">Your Holdings</h2>
            {/* Filter/Search could go here */}
         </div>
         <AssetTable tokens={displayTokens} isLoading={isGlobalLoading} />
      </div>
    </div>
  );
}
