"use client";

import { ArrowDownToLine, CreditCard, Repeat, Send } from "lucide-react";

interface ActionGridProps {
  onSend?: () => void;
  onReceive?: () => void;
  onBuy?: () => void;
  onSwap?: () => void;
}

export function ActionGrid({ onSend, onReceive, onBuy, onSwap }: ActionGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-6">
      <ActionButton icon={Send} label="Send" accent="text-yellow-400" onClick={onSend} />
      <ActionButton icon={ArrowDownToLine} label="Receive" accent="text-yellow-400" onClick={onReceive} />
      <ActionButton icon={CreditCard} label="Buy" accent="text-yellow-400" onClick={onBuy} />
      <ActionButton icon={Repeat} label="Swap" accent="text-yellow-400" onClick={onSwap} />
    </div>
  );
}

function ActionButton({ icon: Icon, label, accent, onClick }: any) {
   return (
      <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 min-w-[70px] group transition-transform active:scale-95"
      >
         <div className={`p-4 rounded-full bg-zinc-900 border border-white/10 group-hover:border-yellow-400/50 group-hover:bg-zinc-800 transition-all ${accent || "text-white"}`}>
            <Icon className="h-6 w-6" />
         </div>
         <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">{label}</span>
      </button>
   )
}
