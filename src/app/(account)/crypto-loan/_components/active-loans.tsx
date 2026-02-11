"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assume Table component exists or use simple divs
import { AlertCircle, Plus, Minus, ExternalLink } from "lucide-react";

const LOANS = [
   {
      id: "L-1024",
      collateralAsset: "Bitcoin",
      collateralSymbol: "BTC",
      collateralAmount: "0.45",
      borrowAsset: "USDT",
      borrowAmount: "12,450.00",
      apy: "5.5%",
      healthFactor: 2.45,
      status: "Active",
      startDate: "Oct 24, 2025"
   },
   {
      id: "L-1108",
      collateralAsset: "Ethereum",
      collateralSymbol: "ETH",
      collateralAmount: "12.5",
      borrowAsset: "USDC",
      borrowAmount: "8,200.00",
      apy: "4.8%",
      healthFactor: 1.85, 
      status: "Warning", // Low health
      startDate: "Nov 02, 2025"
   }
];


export function ActiveLoans() {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
         <h3 className="text-lg font-semibold text-white">Active Loans</h3>
         <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">View History</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
           <thead className="bg-zinc-950/50 text-zinc-500 uppercase text-xs font-medium border-b border-white/5">
              <tr>
                 <th className="px-6 py-4">Collateral</th>
                 <th className="px-6 py-4">Borrowed Amount</th>
                 <th className="px-6 py-4">APY</th>
                 <th className="px-6 py-4">Health Factor</th>
                 <th className="px-6 py-4 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {LOANS.map((loan) => (
                 <tr key={loan.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border border-white/10 ${
                             loan.collateralSymbol === 'BTC' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                             {loan.collateralSymbol[0]}
                          </div>
                          <div>
                             <p className="font-medium text-white">{loan.collateralAsset}</p>
                             <p className="text-xs text-zinc-500">{loan.collateralAmount} {loan.collateralSymbol}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-semibold text-white">{loan.borrowAmount} <span className="text-zinc-500 text-xs font-normal">{loan.borrowAsset}</span></p>
                       <p className="text-xs text-zinc-500"> Started {loan.startDate}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-mono">{loan.apy}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                             loan.healthFactor < 1.5 ? "text-red-400" : 
                             loan.healthFactor < 2.0 ? "text-yellow-400" : "text-emerald-400"
                          }`}>
                             {loan.healthFactor}
                          </span>
                          {loan.healthFactor < 2.0 && (
                             <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500 text-[10px] h-5 px-1">
                                Risk
                             </Badge>
                          )}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-emerald-500/20 hover:text-emerald-400">
                             <Plus className="h-4 w-4" />
                             <span className="sr-only">Add Collateral</span>
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-yellow-500/20 hover:text-yellow-400">
                             <ExternalLink className="h-4 w-4" />
                             <span className="sr-only">Manage</span>
                          </Button>
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
