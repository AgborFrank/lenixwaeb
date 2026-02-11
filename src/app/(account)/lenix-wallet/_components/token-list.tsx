"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data
const TOKENS = [
   {
      id: "usdt",
      name: "Tether USD",
      symbol: "USDT",
      amount: "1,240.50",
      value: "$1,241.00",
      change: "+0.01%",
      chain: "ETH",
      icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      color: "bg-emerald-500/10 text-emerald-500",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
   },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    amount: "0.85",
    value: "$2,205.10",
    change: "-1.2%",
    chain: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "bg-blue-500/10 text-blue-500",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  },
  {
     id: "matic",
     name: "Polygon",
     symbol: "MATIC",
     amount: "450.00",
     value: "$380.20",
     change: "+5.4%",
     chain: "POLY",
     icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
     color: "bg-purple-500/10 text-purple-500",
     address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
  },
  {
     id: "bnb",
     name: "BNB",
     symbol: "BNB",
     amount: "2.50",
     value: "$994.20",
     change: "+0.8%",
     chain: "BSC",
     icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
     color: "bg-yellow-500/10 text-yellow-500",
     address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
  }
];

export function TokenList() {
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-white">Wallet Assets</h3>
         <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 backdrop-blur">
          {TOKENS.length} Assets
        </Badge>
      </div>
      
      <div className="space-y-3">
        {TOKENS.map((token) => (
          <div 
            key={token.id} 
            className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center gap-4 z-10">
              <Avatar className="h-10 w-10 border border-white/10 bg-zinc-900">
                <AvatarImage src={token.icon} alt={token.name} />
                <AvatarFallback className={token.color}>{token.symbol[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                   <p className="font-semibold text-white">{token.name}</p>
                   <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:border-zinc-700 transition-colors">
                      {token.chain}
                   </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-xs text-zinc-500 font-mono tracking-wide truncate max-w-[100px] sm:max-w-none">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                   </p>
                   <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         copyAddress(token.address);
                      }}
                      className="text-zinc-600 hover:text-white transition-colors p-1 -m-1 rounded hover:bg-white/5"
                   >
                      <Copy className="h-3 w-3" />
                   </button>
                </div>
              </div>
            </div>

            <div className="text-right z-10">
              <p className="font-bold text-white tabular-nums tracking-tight">{token.value}</p>
              <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
                 <p className="text-sm text-zinc-400 tabular-nums">{token.amount} {token.symbol}</p>
                 <span className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded-sm bg-opacity-10",
                    token.change.startsWith("+") 
                      ? "text-emerald-400 bg-emerald-400/10" 
                      : "text-red-400 bg-red-400/10"
                 )}>
                    {token.change}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
