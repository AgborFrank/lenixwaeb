"use client";

import { Badge } from "@/components/ui/badge";

const ASSETS = [
   {
      name: "Bitcoin",
      symbol: "BTC",
      ltv: "85%",
      rate: "0.5%",
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20"
   },
   {
      name: "Ethereum",
      symbol: "ETH",
      ltv: "80%",
      rate: "0.8%",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
   },
   {
      name: "Solana",
      symbol: "SOL",
      ltv: "75%",
      rate: "1.2%",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
   },
    {
      name: "Ripple",
      symbol: "XRP",
      ltv: "60%",
      rate: "2.1%",
      color: "text-white bg-zinc-500/10 border-zinc-500/20"
   }
];

export function CollateralAssets() {
   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-semibold text-white">Supported Collateral</h3>
            <span className="text-xs text-zinc-500">Live Rates</span>
         </div>
         
         <div className="grid grid-cols-2 gap-3">
            {ASSETS.map((asset) => (
               <div key={asset.symbol} className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                     <span className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs border ${asset.color}`}>
                        {asset.symbol[0]}
                     </span>
                     <div>
                        <p className="text-sm font-medium text-white">{asset.name}</p>
                        <p className="text-[10px] text-zinc-500">Max LTV: {asset.ltv}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-bold text-zinc-300">{asset.rate}</p>
                     <p className="text-[10px] text-zinc-600">Fee</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
