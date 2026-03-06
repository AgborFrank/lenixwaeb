"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_ASSETS = [
   { symbol: "BTC", name: "Bitcoin", price: "$64,230.15", change: "+1.2%" },
   { symbol: "ETH", name: "Ethereum", price: "$3,450.80", change: "+0.8%" },
   { symbol: "SOL", name: "Solana", price: "$145.20", change: "+4.5%" },
];

export function MarketRates({ loanTypes }: { loanTypes: any[] }) {
   return (
      <div className="space-y-6">
         {/* Live Rates */}
         <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-emerald-400" /> Live Rates
            </h3>
            <div className="space-y-4">
               {MOCK_ASSETS.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white">
                           {asset.symbol[0]}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white">{asset.symbol}</p>
                           <p className="text-[10px] text-zinc-500">{asset.name}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-white">{asset.price}</p>
                        <p className="text-[10px] text-emerald-400">{asset.change}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Loan Offers */}
         <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Available Plans</h3>
            <div className="space-y-3">
               {loanTypes.map((type) => (
                  <div key={type.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-white">{type.name}</span>
                        <Badge variant="outline" className="text-[10px] border-yellow-400/20 text-yellow-400">
                           {type.ltv}% LTV
                        </Badge>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] text-zinc-500">Interest Rate</p>
                           <p className="text-lg font-bold text-emerald-400">{type.interest_rate}%</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
