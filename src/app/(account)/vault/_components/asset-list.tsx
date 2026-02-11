"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Data
const ASSETS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    amount: "1.245",
    value: "$48,291.50",
    change: "+1.2%",
    icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    amount: "14.82",
    value: "$38,421.10",
    change: "-0.5%",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    amount: "25,480.00",
    value: "$25,482.50",
    change: "+0.01%",
    icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    address: "TGen92j4f939f3j493f394j3039",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    amount: "145.20",
    value: "$12,397.70",
    change: "+5.4%",
    icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    address: "HuGwUe43...9f3j",
    color: "bg-purple-500/10 text-purple-500",
  },
];

export function AssetList() {
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-white">Vault Assets</h3>
         <Badge variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 backdrop-blur">
          {ASSETS.length} Assets
        </Badge>
      </div>
      
      <div className="space-y-3">
        {ASSETS.map((asset) => (
          <div 
            key={asset.id} 
            className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800/60 hover:border-white/10 transition-all cursor-pointer overflow-hidden"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center gap-4 z-10">
              <Avatar className="h-10 w-10 border border-white/10 bg-zinc-900">
                <AvatarImage src={asset.icon} alt={asset.name} />
                <AvatarFallback className={asset.color}>{asset.symbol[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                   <p className="font-semibold text-white">{asset.name}</p>
                   <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:border-zinc-700 transition-colors">
                      {asset.symbol}
                   </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-xs text-zinc-500 font-mono tracking-wide truncate max-w-[100px] sm:max-w-none">
                      {asset.address.slice(0, 6)}...{asset.address.slice(-4)}
                   </p>
                   <button 
                      onClick={(e) => {
                         e.stopPropagation();
                         copyAddress(asset.address);
                      }}
                      className="text-zinc-600 hover:text-white transition-colors p-1 -m-1 rounded hover:bg-white/5"
                   >
                      <Copy className="h-3 w-3" />
                   </button>
                </div>
              </div>
            </div>

            <div className="text-right z-10">
              <p className="font-bold text-white tabular-nums tracking-tight">{asset.value}</p>
              <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
                 <p className="text-sm text-zinc-400 tabular-nums">{asset.amount} {asset.symbol}</p>
                 <span className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded-sm bg-opacity-10",
                    asset.change.startsWith("+") 
                      ? "text-emerald-400 bg-emerald-400/10" 
                      : "text-red-400 bg-red-400/10"
                 )}>
                    {asset.change}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
