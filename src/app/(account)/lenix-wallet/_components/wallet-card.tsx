"use client";

import { ShieldCheck, TrendingUp, MoreHorizontal, Eye, EyeOff, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function WalletCard() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="group relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all hover:scale-[1.01]">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black z-0" />
      <div className="absolute inset-0 bg-[url('/assets/img/grid-pattern.svg')] opacity-20 z-0 mix-blend-overlay" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-600/10 blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Wallet className="h-6 w-6 text-yellow-400" />
             </div>
             <div>
                <h3 className="text-zinc-400 text-sm font-medium tracking-wide">TOTAL WALLET BALANCE</h3>
                <div className="flex items-center gap-2 mt-1">
                   {showBalance ? (
                      <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">$4,820.50</span>
                   ) : (
                      <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">••••••••</span>
                   )}
                   <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                   >
                      {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                   </button>
                </div>
             </div>
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>

        {/* Footer / Status */}
        <div className="flex items-end justify-between">
           <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1 rounded-full w-fit border border-emerald-400/20">
                 <TrendingUp className="h-3 w-3" />
                 <span>+5.2% (24h)</span>
              </div>
              <p className="text-zinc-500 text-xs pl-1">Last synced: Just now</p>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Network Status</span>
              <div className="flex gap-1">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-2 w-8 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                 ))}
                 <div className="h-2 w-8 rounded-full bg-zinc-800" />
              </div>
              <span className="text-xs text-yellow-400 font-medium">Optimal</span>
           </div>
        </div>
      </div>
    </div>
  );
}
