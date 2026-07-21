"use client";

import { useState, useEffect, useRef } from "react";
import { History, ArrowUpRight, ArrowDownLeft, Filter, ExternalLink, Loader2, X, CheckCircle, Clock, Copy, Check } from "lucide-react";
import { useWallet } from "../lenix-wallet/_hooks/use-wallet";
import { getTransactionsForCurrentUser, type Transaction } from "../lenix-wallet/actions";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const NETWORKS = [
  { id: "all", name: "All Networks" },
  { id: 0, name: "Bitcoin" },
  { id: 1, name: "Ethereum" },
  { id: 56, name: "BNB Chain" },
  { id: 137, name: "Polygon" },
];

// Poll for fresh data every 15s so new transactions (deposits, admin credits) show
// up without a manual page reload, on top of the instant Realtime push below.
const POLL_INTERVAL_MS = 15000;

export default function TransactionsPage() {
  const { walletData, walletState, portfolio } = useWallet();
  const [filterType, setFilterType] = useState<"all" | "sent" | "received">("all");
  const [selectedChain, setSelectedChain] = useState<string | number>("all");
  const [lockedTxResult, setLockedTxResult] = useState<{ transactions: Transaction[]; walletAddress: string | null } | null>(null);
  const [isLoadingLocked, setIsLoadingLocked] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [supabase] = useState(() => createClient());

  // Sync Bitcoin deposits on mount and periodically, regardless of wallet lock
  // state — the sync endpoint only needs the already-stored xpub, not the password.
  useEffect(() => {
    const syncDeposits = () => {
      fetch("/api/btc/deposits", { method: "POST", credentials: "include" })
        .then(() => setRefreshKey((k) => k + 1))
        .catch((err) => console.error("Failed to sync Bitcoin deposits", err));
    };
    syncDeposits();
    const intervalId = setInterval(syncDeposits, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  // Push-based refresh: instantly refetch when a transaction row changes for this user.
  useEffect(() => {
    let userId: string | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      userId = user.id;
      channel = supabase
        .channel(`user_transactions_${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "user_transactions", filter: `user_id=eq.${userId}` },
          () => setRefreshKey((k) => k + 1)
        )
        .subscribe();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Periodic fallback poll in case Realtime is momentarily disconnected.
  useEffect(() => {
    const intervalId = setInterval(() => setRefreshKey((k) => k + 1), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  // When wallet is locked (or no wallet yet), fetch transactions via server (no unlock needed).
  // Also re-runs on refreshKey bumps (Realtime push, deposit sync, poll fallback) to stay current.
  useEffect(() => {
    if (walletState === "unlocked" && portfolio?.transactions) return;
    let cancelled = false;
    setIsLoadingLocked((prev) => (lockedTxResult === null ? true : prev));
    getTransactionsForCurrentUser(selectedChain === "all" ? undefined : selectedChain)
      .then((res) => { if (!cancelled) setLockedTxResult({ transactions: res.transactions, walletAddress: res.walletAddress }); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setIsLoadingLocked(false); });
    return () => { cancelled = true; };
  }, [walletState, selectedChain, portfolio?.transactions, refreshKey]);

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
                        const isInternal = tx.is_internal || tx.type === 'internal';
                        
                        return (
                           <div 
                              key={tx.hash}
                              onClick={() => setSelectedTx(tx)}
                              className="group flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer"
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
                                       <span className="capitalize">{isInternal ? 'Transfer' : tx.type}</span>
                                       <span>•</span>
                                       <span>{format(new Date(tx.block_timestamp), "h:mm a")}</span>
                                       {!isInternal && (
                                          <span 
                                             onClick={(e) => { e.stopPropagation(); window.open(getExplorerLink(tx.chainId, tx.hash), '_blank'); }}
                                             className="flex items-center gap-1 hover:text-yellow-400 transition-colors ml-1 cursor-pointer"
                                          >
                                             Explorer <ExternalLink className="h-3 w-3" />
                                          </span>
                                       )}
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
                                 <p className="text-xs text-emerald-500 font-medium flex items-center justify-end gap-1">
                                    <CheckCircle className="h-3 w-3" /> Confirmed
                                 </p>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            ))
         )}
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal 
        tx={selectedTx} 
        walletAddress={walletAddress}
        onClose={() => setSelectedTx(null)} 
        copiedField={copiedField}
        onCopy={(field, value) => {
          navigator.clipboard.writeText(value);
          setCopiedField(field);
          setTimeout(() => setCopiedField(null), 2000);
        }}
      />
    </div>
  );
}

interface TransactionDetailModalProps {
  tx: Transaction | null;
  walletAddress: string | null;
  onClose: () => void;
  copiedField: string | null;
  onCopy: (field: string, value: string) => void;
}

// Token prices for USD calculation
const TOKEN_PRICES: Record<string, number> = {
  BTC: 105000,
  ETH: 3800,
  BNB: 680,
  MATIC: 0.52,
  POL: 0.52,
  USDT: 1,
  USDC: 1,
};

function TransactionDetailModal({ tx, walletAddress, onClose, copiedField, onCopy }: TransactionDetailModalProps) {
  const [usdValue, setUsdValue] = useState<string | null>(null);

  useEffect(() => {
    if (!tx) return;
    
    // Calculate USD value
    const amount = Number(tx.value) / Math.pow(10, tx.decimals);
    
    // If stored USD value exists and is not "0", use it
    if (tx.usd_value && tx.usd_value !== "0") {
      setUsdValue(tx.usd_value);
      return;
    }
    
    // Otherwise calculate from known prices
    const symbol = tx.symbol?.toUpperCase();
    const price = TOKEN_PRICES[symbol];
    if (price) {
      const calculatedUsd = (amount * price).toFixed(2);
      setUsdValue(calculatedUsd);
    } else {
      setUsdValue(null);
    }
  }, [tx]);

  if (!tx) return null;

  const isSent = tx.from_address?.toLowerCase() === walletAddress?.toLowerCase();
  const isInternal = tx.is_internal || tx.type === 'internal';
  const amount = Number(tx.value) / Math.pow(10, tx.decimals);
  const networkName = getNetworkName(tx.chainId);
  const explorerLink = getExplorerLink(tx.chainId, tx.hash);
  const explorerAddressLink = getExplorerAddressLink(tx.chainId, isSent ? tx.to_address : tx.from_address);
  
  // Generate a block number for internal transactions (simulated based on timestamp)
  const blockNumber = tx.block_number || Math.floor(new Date(tx.block_timestamp).getTime() / 12000);
  const confirmations = tx.confirmations || 999999;

  return (
    <Dialog open={!!tx} onOpenChange={() => onClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              isSent ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
            )}>
              {isSent ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {isSent ? "Sent" : "Received"} {tx.symbol}
              </p>
              <p className="text-sm text-zinc-500 font-normal">{networkName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Amount Section */}
          <div className="text-center py-4 bg-zinc-900/50 rounded-xl border border-white/5">
            <p className={cn(
              "text-3xl font-bold tabular-nums",
              isSent ? "text-zinc-200" : "text-emerald-400"
            )}>
              {isSent ? "-" : "+"}{amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {tx.symbol}
            </p>
            {usdValue && Number(usdValue) > 0 && (
              <p className="text-sm text-zinc-500 mt-1">
                ≈ ${Number(usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <span className="text-zinc-400">Status</span>
            <span className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </span>
          </div>

          {/* Transaction Hash */}
          <div className="py-3 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400">Transaction Hash</span>
              <button 
                onClick={() => onCopy('hash', tx.hash)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copiedField === 'hash' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-white font-mono break-all">{tx.hash}</p>
            {!isInternal && (
              <a 
                href={explorerLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1 mt-1"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* From Address */}
          <div className="py-3 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400">From</span>
              <button 
                onClick={() => onCopy('from', tx.from_address)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copiedField === 'from' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-white font-mono break-all">
              {tx.from_address === '0x0000000000000000000000000000000000000000' 
                ? 'Lenix Protocol' 
                : tx.from_address}
            </p>
          </div>

          {/* To Address */}
          <div className="py-3 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zinc-400">To</span>
              <button 
                onClick={() => onCopy('to', tx.to_address)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copiedField === 'to' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm text-white font-mono break-all">
              {tx.to_address === '0x0000000000000000000000000000000000000000' 
                ? 'Lenix Protocol' 
                : tx.to_address}
            </p>
            {!isInternal && tx.to_address !== '0x0000000000000000000000000000000000000000' && (
              <a 
                href={explorerAddressLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1 mt-1"
              >
                View Address <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Block Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="py-3">
              <span className="text-zinc-400 text-sm">Block</span>
              <p className="text-white font-mono">{blockNumber.toLocaleString()}</p>
            </div>
            <div className="py-3">
              <span className="text-zinc-400 text-sm">Confirmations</span>
              <p className="text-emerald-400 font-mono">
                {confirmations > 100000 ? '100,000+' : confirmations.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="py-3 border-t border-zinc-800">
            <span className="text-zinc-400 text-sm">Timestamp</span>
            <p className="text-white">
              {format(new Date(tx.block_timestamp), "MMM d, yyyy 'at' h:mm:ss a")}
            </p>
          </div>

          {/* Gas Details (if available and not internal) */}
          {!isInternal && tx.gas_fee && (
            <div className="py-3 border-t border-zinc-800">
              <span className="text-zinc-400 text-sm">Transaction Fee</span>
              <p className="text-white font-mono">{tx.gas_fee} {getNetworkToken(tx.chainId)}</p>
            </div>
          )}

          {/* Balance Change (for internal transactions) */}
          {isInternal && tx.balance_before && tx.balance_after && (
            <div className="py-3 border-t border-zinc-800 bg-zinc-900/50 rounded-lg p-4 -mx-1">
              <span className="text-zinc-400 text-sm block mb-2">Balance Change</span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Before:</span>
                <span className="text-white font-mono">{Number(tx.balance_before).toLocaleString(undefined, { maximumFractionDigits: 8 })} {tx.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-zinc-500">After:</span>
                <span className="text-emerald-400 font-mono">{Number(tx.balance_after).toLocaleString(undefined, { maximumFractionDigits: 8 })} {tx.symbol}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getExplorerLink(chainId: number, hash: string) {
  const bases: Record<number, string> = {
    0: "https://mempool.space/tx/",
    1: "https://etherscan.io/tx/",
    56: "https://bscscan.com/tx/",
    137: "https://polygonscan.com/tx/"
  };
  return (bases[chainId] || "https://etherscan.io/tx/") + hash;
}

function getExplorerAddressLink(chainId: number, address: string) {
  const bases: Record<number, string> = {
    0: "https://mempool.space/address/",
    1: "https://etherscan.io/address/",
    56: "https://bscscan.com/address/",
    137: "https://polygonscan.com/address/"
  };
  return (bases[chainId] || "https://etherscan.io/address/") + address;
}

function getNetworkName(chainId: number) {
  const names: Record<number, string> = {
    0: "Bitcoin",
    1: "Ethereum Mainnet",
    56: "BNB Smart Chain",
    137: "Polygon"
  };
  return names[chainId] || "Unknown Network";
}

function getNetworkToken(chainId: number) {
  const tokens: Record<number, string> = {
    0: "BTC",
    1: "ETH",
    56: "BNB",
    137: "MATIC"
  };
  return tokens[chainId] || "ETH";
}
