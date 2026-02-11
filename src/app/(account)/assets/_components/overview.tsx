"use client";

import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Wallet className="h-48 w-48 text-white rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
           <div>
              <p className="text-zinc-400 font-medium mb-1">Total Asset Value</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                 $124,592.80
                 <span className="text-lg text-emerald-400 ml-4 font-medium bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    +2.4%
                 </span>
              </h2>
           </div>

           <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-black hover:bg-zinc-200">
                 <ArrowDownLeft className="mr-2 h-4 w-4" />
                 Deposit
              </Button>
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                 <ArrowUpRight className="mr-2 h-4 w-4" />
                 Withdraw
              </Button>
           </div>
        </div>
      </div>

      {/* PnL Card */}
      <div className="rounded-3xl bg-zinc-900/50 p-6 border border-white/5 flex flex-col justify-center space-y-6">
         <div>
            <p className="text-zinc-400 text-sm font-medium mb-2">24h Profit/Loss</p>
            <div className="flex items-center gap-3">
               <TrendingUp className="h-8 w-8 text-emerald-400" />
               <div>
                  <p className="text-2xl font-bold text-white">+$1,294.50</p>
                  <p className="text-xs text-zinc-500">vs yesterday</p>
               </div>
            </div>
         </div>
         
         <div className="h-px bg-white/5" />

         <div>
            <p className="text-zinc-400 text-sm font-medium mb-2">30d Profit/Loss</p>
            <div className="flex items-center gap-3">
               <TrendingDown className="h-8 w-8 text-red-400" />
               <div>
                  <p className="text-2xl font-bold text-white">-$420.10</p>
                  <p className="text-xs text-zinc-500">vs last month</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
