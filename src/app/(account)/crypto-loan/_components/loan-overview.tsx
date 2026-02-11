"use client";

import { Info, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LoanOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Borrowed Card */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 group hover:border-white/10 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
           <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-400 flex items-center gap-1">
                 Total Borrowed
                 <InfoIcon tooltip="Total amount borrowed across all active loans" />
              </span>
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                 <TrendingUp className="h-4 w-4" />
              </div>
           </div>
           <div className="space-y-1">
              <h3 className="text-3xl font-bold text-white">$12,450.00</h3>
              <p className="text-xs text-zinc-500">Current Interest: <span className="text-red-400">+ $42.15</span></p>
           </div>
        </div>
      </div>

      {/* Collateral Card */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 group hover:border-white/10 transition-all">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-medium text-zinc-400 flex items-center gap-1">
                  Collateral Value
                  <InfoIcon tooltip="Total value of assets locked as collateral" />
               </span>
               <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
               </div>
            </div>
            <div className="space-y-1">
               <h3 className="text-3xl font-bold text-white">$45,200.00</h3>
               <p className="text-xs text-zinc-500">LTV: <span className="text-emerald-400">27.5%</span> (Low Risk)</p>
            </div>
         </div>
      </div>

      {/* Health Factor Card */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 p-6 group hover:border-white/10 transition-all">
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-medium text-zinc-400 flex items-center gap-1">
                  Health Factor
                  <InfoIcon tooltip="Liquidation risk indicator. Keep above 1.5 to avoid liquidation." />
               </span>
               <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <AlertTriangle className="h-4 w-4" />
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-emerald-400">2.45</h3>
                  <span className="text-sm text-zinc-500 font-medium">Safe</span>
               </div>
               <div className="space-y-1">
                  <Progress value={75} className="h-1.5 bg-zinc-800" indicatorColor="bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                     <span>1.0 (Liquidated)</span>
                     <span>3.0 (Safe)</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function InfoIcon({ tooltip }: { tooltip: string }) {
   return (
      <TooltipProvider delayDuration={300}>
         <Tooltip>
            <TooltipTrigger asChild>
               <Info className="h-3.5 w-3.5 text-zinc-600 cursor-help hover:text-zinc-400 transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 border-zinc-800 text-zinc-400 text-xs">
               <p>{tooltip}</p>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   )
}
