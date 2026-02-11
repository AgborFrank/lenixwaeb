"use client";

import { ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";

// Mock Data
const TRANSACTIONS = [
   {
      id: "1",
      type: "receive",
      title: "Received USDT",
      date: "Today, 10:45 AM",
      amount: "+500.00 USDT",
      status: "Completed",
      icon: ArrowDownLeft,
      color: "text-emerald-400 bg-emerald-400/10",
      amountColor: "text-emerald-400"
   },
   {
      id: "2",
      type: "send",
      title: "Sent ETH",
      date: "Yesterday, 4:20 PM",
      amount: "-0.45 ETH",
      status: "Completed",
      icon: ArrowUpRight,
      color: "text-zinc-400 bg-zinc-400/10",
      amountColor: "text-white"
   },
   {
      id: "3",
      type: "swap",
      title: "Swapped MATIC -> USDT",
      date: "Feb 10, 2026",
      amount: "450 MATIC",
      status: "Pending",
      icon: RefreshCcw,
      color: "text-blue-400 bg-blue-400/10",
      amountColor: "text-blue-400"
   },
];

export function TransactionHistory() {
   return (
      <div className="space-y-4">
         <h3 className="text-lg font-semibold text-white px-1">Recent Activity</h3>
         <div className="space-y-4 relative">
            <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-zinc-800/50 z-0" />
            
            {TRANSACTIONS.map((tx) => (
               <div key={tx.id} className="relative z-10 flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors -mx-2">
                  <div className="flex items-center gap-4">
                     <div className={`h-10 w-10 flex items-center justify-center rounded-full border border-black/50 shadow-sm ${tx.color}`}>
                        <tx.icon className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white">{tx.title}</p>
                        <p className="text-xs text-zinc-500">{tx.date}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-sm font-bold tabular-nums ${tx.amountColor}`}>{tx.amount}</p>
                     <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        tx.status === "Completed" 
                           ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500" 
                           : "border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
                     }`}>
                        {tx.status}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
