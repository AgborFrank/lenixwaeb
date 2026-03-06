"use client";

import { ArrowUpRight, ArrowDownLeft, RefreshCcw, Activity } from "lucide-react";
import { format } from "date-fns";
import { ethers } from "ethers";

interface TransactionHistoryProps {
  transactions: any[];
  isLoading?: boolean;
}

export function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  if (isLoading) {
     return <div className="space-y-4 animate-pulse">
        <div className="h-6 w-24 bg-zinc-800 rounded"></div>
        {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-zinc-900 rounded-xl"></div>)}
     </div>;
  }

  if (!transactions || transactions.length === 0) {
     return (
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-white px-1">Recent Activity</h3>
           <div className="p-6 text-center text-zinc-500 bg-zinc-900/40 rounded-xl border border-white/5">
              No recent activity
           </div>
        </div>
     );
  }

  return (
      <div className="space-y-4">
         <h3 className="text-lg font-semibold text-white px-1">Recent Activity</h3>
         <div className="space-y-4 relative">
            <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-zinc-800/50 z-0" />
            
            {transactions.map((tx) => {
               // Determine direction & format
               // Note: 'address' isn't available in this scope to know for sure if it's send/receive
               // But usually the API caller passes address. 
               // For now, we'll assume we can't perfectly tell 'send' vs 'receive' without user address.
               // We will pass user address to this component? 
               // Or just show generic icon.
               
               // Let's assume generic for now or heuristics if we pass address.
               // But waiting... we are just displaying what we have.
               
               const isReceive = true; // Placeholder until we pass wallet address props
               const amount = ethers.formatEther(tx.value || "0");
               const date = new Date(tx.block_timestamp);
               const formattedDate = format(date, "MMM dd, h:mm a");
               const chainName = tx.chainId === 1 ? "ETH" : tx.chainId === 56 ? "BNB" : "MATIC"; // Simplified

               return (
               <div key={tx.hash} className="relative z-10 flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors -mx-2">
                  <div className="flex items-center gap-4">
                     <div className={`h-10 w-10 flex items-center justify-center rounded-full border border-black/50 shadow-sm text-zinc-400 bg-zinc-900`}>
                        <Activity className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{tx.hash.substring(0, 10)}...</p>
                        <p className="text-xs text-zinc-500">{formattedDate}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-sm font-bold tabular-nums text-white`}>{parseFloat(amount).toFixed(4)} {chainName}</p>
                     <span className={`text-[10px] px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/50 text-zinc-400`}>
                        {tx.receipt_status === "1" ? "Completed" : "Pending"}
                     </span>
                  </div>
               </div>
            )})}
         </div>
      </div>
   );
}
