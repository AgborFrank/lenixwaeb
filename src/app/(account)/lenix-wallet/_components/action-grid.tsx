"use client";

import { Send, ArrowDownToLine, CreditCard, Repeat } from "lucide-react";

export function ActionGrid() {
  return (
    <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-6">
      <ActionButton icon={Send} label="Send" accent="text-yellow-400" />
      <ActionButton icon={ArrowDownToLine} label="Receive" accent="text-yellow-400" />
      <ActionButton icon={CreditCard} label="Buy" accent="text-yellow-400" />
      <ActionButton icon={Repeat} label="Swap" accent="text-yellow-400" />
    </div>
  );
}

function ActionButton({ icon: Icon, label, accent }: any) {
   return (
      <button className="flex flex-col items-center justify-center gap-2 min-w-[70px] group">
         <div className={`p-4 rounded-full bg-zinc-900 border border-white/10 group-hover:border-yellow-400/50 group-hover:bg-zinc-800 transition-all ${accent || "text-white"}`}>
            <Icon className="h-6 w-6" />
         </div>
         <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">{label}</span>
      </button>
   )
}
