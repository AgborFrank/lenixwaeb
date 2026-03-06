"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const markets = [
    { asset: "Bitcoin", symbol: "WBTC", icon: "bg-orange-500", liquidity: "$842.5M", supplyApy: "4.25%", borrowApy: "6.12%" },
    { asset: "Ethereum", symbol: "ETH", icon: "bg-blue-600", liquidity: "$2.1B", supplyApy: "3.85%", borrowApy: "5.45%" },
    { asset: "Lenix", symbol: "LNX", icon: "bg-yellow-400", liquidity: "$154.2M", supplyApy: "12.40%", borrowApy: "8.20%" },
    { asset: "USDC", symbol: "USDC", icon: "bg-blue-400", liquidity: "$1.8B", supplyApy: "5.10%", borrowApy: "7.50%" },
    { asset: "Tether", symbol: "USDT", icon: "bg-green-500", liquidity: "$1.2B", supplyApy: "4.95%", borrowApy: "7.85%" },
];

export default function FinanceMarkets() {
  return (
    <section className="py-24 bg-black relative border-t border-white/5">
       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
               <div>
                   <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Market <span className="text-yellow-400">Overview</span></h2>
                    <p className="text-gray-400">Live rates and liquidity across the Lenix Protocol.</p>
               </div>
               <Link href="/markets" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-medium">
                   View All Markets <ArrowUpRight className="w-4 h-4" />
               </Link>
           </div>

           <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-gray-400 font-mono uppercase tracking-wider">
                                <th className="p-6 font-medium">Asset</th>
                                <th className="p-6 font-medium">Total Liquidity</th>
                                <th className="p-6 font-medium">Supply APY</th>
                                <th className="p-6 font-medium">Borrow APY</th>
                                <th className="p-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {markets.map((market, i) => (
                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full ${market.icon} flex items-center justify-center text-white font-bold shadow-lg`}>
                                            {market.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{market.asset}</div>
                                            <div className="text-xs text-gray-500">{market.symbol}</div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-white font-mono">{market.liquidity}</td>
                                    <td className="p-6 text-green-400 font-bold">{market.supplyApy}</td>
                                    <td className="p-6 text-white font-bold">{market.borrowApy}</td>
                                    <td className="p-6">
                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">Supply</button>
                                            <button className="px-4 py-2 border border-white/10 text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">Borrow</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
       </div>
    </section>
  );
}
