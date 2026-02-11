"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpRight, ArrowDownLeft, Repeat } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ASSETS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$42,150.20",
    balance: "1.24500000",
    value: "$52,476.99",
    change: "+4.2%",
    icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: "$2,240.50",
    balance: "14.82000000",
    value: "$33,204.21",
    change: "-1.5%",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "usdt",
    name: "Tether USD",
    symbol: "USDT",
    price: "$1.00",
    balance: "25,480.50",
    value: "$25,480.50",
    change: "+0.01%",
    icon: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    price: "$98.40",
    balance: "145.20000000",
    value: "$14,287.68",
    change: "+8.4%",
    icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "xrp",
    name: "Ripple",
    symbol: "XRP",
    price: "$0.54",
    balance: "4,500.0000",
    value: "$2,430.00",
    change: "-0.8%",
    icon: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    color: "bg-white/10 text-white",
  }
];

export function AssetTable() {
  return (
    <div className="rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase">
             <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">24h Change</th>
                <th className="px-6 py-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {ASSETS.map((asset) => (
                <tr key={asset.id} className="group hover:bg-white/5 transition-colors">
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10 bg-zinc-900 border border-white/10">
                            <AvatarImage src={asset.icon} />
                            <AvatarFallback className={asset.color}>{asset.symbol[0]}</AvatarFallback>
                         </Avatar>
                         <div>
                            <p className="font-medium text-white">{asset.name}</p>
                            <p className="text-xs text-zinc-500">{asset.symbol}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <p className="text-sm text-zinc-300 font-medium tabular-nums">{asset.price}</p>
                   </td>
                   <td className="px-6 py-4">
                      <p className="text-sm text-white font-medium tabular-nums">{asset.balance}</p>
                   </td>
                   <td className="px-6 py-4">
                      <p className="text-sm text-white font-bold tabular-nums">{asset.value}</p>
                   </td>
                   <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                         asset.change.startsWith("+") 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-red-500/10 text-red-400"
                      }`}>
                         {asset.change}
                      </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                            <ArrowDownLeft className="h-4 w-4" />
                            <span className="sr-only">Deposit</span>
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">Withdraw</span>
                         </Button>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                                 <MoreHorizontal className="h-4 w-4" />
                                 <span className="sr-only">More</span>
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="hover:bg-white/5 hover:text-white cursor-pointer group">
                                 <Repeat className="mr-2 h-4 w-4 group-hover:text-white" /> Swap
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-white/5 hover:text-white cursor-pointer">
                                 View History
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
