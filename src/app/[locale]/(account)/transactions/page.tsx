"use client";

import { useState, useEffect } from "react";
import { History, ArrowUpRight, ArrowDownLeft, Filter, ExternalLink, Loader2 } from "lucide-react";
import { useWallet } from "../lenix-wallet/_hooks/use-wallet";
import { getTransactionsForCurrentUser, type Transaction } from "../lenix-wallet/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const NETWORKS = [
  { id: "all", name: "All Networks" },
  { id: 1, name: "Ethereum" },
  { id: 56, name: "BNB Chain" },
  { id: 137, name: "Polygon" },
];

export default function TransactionsPage() {
  const { walletData, walletState, portfolio } = useWallet();
  const [filterType, setFilterType] = useState<"all" | "sent" | "received">("all");
  const [selectedChain, setSelectedChain] = useState<string | number>("all");
  const [lockedTxResult, setLockedTxResult] = useState<{ transactions: Transaction[]; walletAddress: string | null } | null>(null);
  const [isLoadingLocked, setIsLoadingLocked] = useState(false);

  // When wallet is locked (or no wallet yet), fetch transactions via server (no unlock needed)
  useEffect(() => {
    if (walletState === "unlocked" && portfolio?.transactions) return;
    let cancelled = false;
    setIsLoadingLocked(true);
    getTransactionsForCurrentUser(selectedChain === "all" ? undefined : selectedChain)
      .then((res) => { if (!cancelled) setLockedTxResult({ transactions: res.transactions, walletAddress: res.walletAddress }); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoadingLocked(false); });
    return () => { cancelled = true; };
  }, [walletState, selectedChain, portfolio?.transactions]);

  // Prefer portfolio when unlocked; otherwise use server-fetched (no unlock)
  const walletAddress = walletData?.address ?? lockedTxResult?.walletAddress ?? null;
  const rawTransactions = (walletState === "unlocked" && portfolio?.transactions
    ? (portfolio.transactions as Transaction[])
    : (lockedTxResult?.transactions ?? []));
  const isLoading = (walletState === "unlocked" && !portfolio) || (walletState !== "unlocked" && isLoadingLocked);

  // Filter by chain (client-side when using portfolio; server already filters when using lockedTxResult)
  const byChain = selectedChain === "all"
    ? rawTransactions
    : rawTransactions.filter(tx => tx.chainId === Number(selectedChain));

  // Filter by type (sent / received) using wallet address from either context or server
  const filteredTransactions = byChain.filter(tx => {
    if (filterType === "all") return true;
    if (!walletAddress) return true;
    const isSent = tx.from_address?.toLowerCase() === walletAddress.toLowerCase();
    return filterType === "sent" ? isSent : !isSent;
  });

  // Group by date
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
     const date = new Date(tx.block_timestamp);
     const key = format(date, "MMM d, yyyy");
     if (!groups[key]) groups[key] = [];
     groups[key].push(tx);
     return groups;
  }, {} as Record<string, Transaction[]>);

  const formatAmount = (value: string, decimals: number) => {
     const amount = Number(value) / Math.pow(10, decimals);
     return amount.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const currentNetworkName = NETWORKS.find(n => n.id === selectedChain)?.name || "All Networks";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Transactions
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            View your transaction history across all networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white min-w-[140px] justify-between">
                    {currentNetworkName}
                    <Filter className="ml-2 h-4 w-4 opacity-50" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                 {NETWORKS.map(net => (
                    <DropdownMenuItem 
                       key={net.id} 
                       onClick={() => setSelectedChain(net.id)}
                       className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer"
                    >
                       {net.name}
                    </DropdownMenuItem>
                 ))}
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-white/5 w-fit">
         {(["all", "sent", "received"] as const).map((type) => (
            <button
               key={type}
               onClick={() => setFilterType(type)}
               className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                  filterType === type 
                     ? "bg-zinc-800 text-white shadow-sm" 
                     : "text-zinc-400 hover:text-white hover:bg-white/5"
               )}
            >
               {type}
            </button>
         ))}
      </div>

      {/* List */}
      <div className="space-y-8">
         {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
                <p className="text-zinc-500 text-sm">Loading history...</p>
             </div>
         ) : filteredTransactions.length === 0 ? (
             <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <History className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">
                  {rawTransactions.length === 0 && walletState === "no_wallet"
                    ? "Create or import a Lenix Wallet to see transaction history."
                    : "No transactions found"}
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  {rawTransactions.length === 0 && walletState === "no_wallet"
                    ? "Go to Lenix Wallet to get started."
                    : "Try changing the filter or network."}
                </p>
             </div>
         ) : (
            Object.entries(groupedTransactions).map(([date, txs]) => (
               <div key={date} className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-500 pl-2 sticky top-0 bg-[#09090b] py-2 z-10">{date}</h3>
                  <div className="space-y-2">
                     {txs.map((tx) => {
                        const isSent = tx.from_address?.toLowerCase() === walletAddress?.toLowerCase();
                        const amount = formatAmount(tx.value, tx.decimals);
                        
                        return (
                           <div 
                              key={tx.hash}
                              className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-default"
                           >
                              <div className="flex items-center gap-4">
                                 <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center border",
                                    isSent 
                                       ? "bg-red-500/10 border-red-500/20 text-red-500" 
                                       : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                 )}>
                                    {isSent ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                                 </div>
                                 <div>
                                    <p className="font-medium text-white">
                                       {isSent ? "Sent" : "Received"} {tx.symbol}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                                       <span className="capitalize">{tx.type}</span>
                                       <span>•</span>
                                       <span>{format(new Date(tx.block_timestamp), "h:mm a")}</span>
                                       {/* Optional: Block explorer link */}
                                       <a 
                                          href={getExplorerLink(tx.chainId, tx.hash)} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 hover:text-yellow-400 transition-colors ml-1"
                                       >
                                          View <ExternalLink className="h-3 w-3" />
                                       </a>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="text-right">
                                 <p className={cn(
                                    "font-bold tabular-nums",
                                    isSent ? "text-zinc-200" : "text-emerald-400"
                                 )}>
                                    {isSent ? "-" : "+"}{amount} {tx.symbol}
                                 </p>
                                 <p className="text-xs text-emerald-500 font-medium">Confirmed</p>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}

function getExplorerLink(chainId: number, hash: string) {
    const bases: Record<number, string> = {
        1: "https://etherscan.io/tx/",
        56: "https://bscscan.com/tx/",
        137: "https://polygonscan.com/tx/"
    };
    return (bases[chainId] || "https://etherscan.io/tx/") + hash;
}
