"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, Activity, Wallet, PieChart, ArrowDownLeft, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function FinanceHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center bg-black">
      
      {/* Background Image with Glassmorphism */}
      <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/img/trade-routes.jpg" 
            alt="Background" 
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black" />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 z-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-400/10 blur-[120px] opacity-30 animate-pulse lg:w-[1000px] lg:h-[1000px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] opacity-20 animate-pulse lg:w-[800px] lg:h-[800px]" />
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-yellow-400 font-mono mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                V2 PROTOCOL LIVE
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              DeFi Lending <span className="text-yellow-400">Flash Loans</span> -No Collateral needed
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Supply liquidity to earn yield, borrow against your assets instantly, and access institutional-grade financial tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://t.me/lenixprotocol" target="_blank" className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
                Launch App <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link href="/docs" className="border border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full font-bold transition-all">
                Read Documentation
              </Link>
            </div>
        </div>

        {/* Realistic DeFi Dashboard Mockup */}
        <div className="relative w-full max-w-6xl mx-auto perspective-1000 mt-12">
            <div className="relative bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden transform rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                
                {/* Dashboard Header */}
                <div className="h-16 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-yellow-400" />
                            <span className="font-bold text-white">Lenix Finance</span>
                        </div>
                        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                            <span className="text-white">Dashboard</span>
                            <span className="hover:text-white cursor-pointer">Markets</span>
                            <span className="hover:text-white cursor-pointer">Staking</span>
                            <span className="hover:text-white cursor-pointer">Governance</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 text-xs text-gray-300">
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                             Ethereum Mainnet
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 text-sm font-medium">
                            <Wallet className="w-4 h-4" />
                            <span>0x71...3A92</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Net Value Card */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                <p className="text-gray-400 text-xs font-mono mb-1">NET WORTH</p>
                                <h3 className="text-2xl font-bold text-white">$142,894.52</h3>
                                <div className="flex items-center gap-1 text-green-400 text-xs mt-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+$1,240.50 (24h)</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                <p className="text-gray-400 text-xs font-mono mb-1">NET APY</p>
                                <h3 className="text-2xl font-bold text-white">8.45%</h3>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                     <div className="h-full w-[70%] bg-gradient-to-r from-yellow-400 to-yellow-600" />
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                                <p className="text-gray-400 text-xs font-mono mb-1">HEALTH FACTOR</p>
                                <h3 className="text-2xl font-bold text-green-400">1.85</h3>
                                <p className="text-xs text-gray-500 mt-1">Liquidation at &lt; 1.00</p>
                            </div>
                        </div>

                        {/* Supply/Borrow Section */}
                        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                            <div className="flex border-b border-white/5">
                                <button className="px-6 py-4 text-white font-medium border-b-2 border-yellow-400 bg-white/5">Supplied</button>
                                <button className="px-6 py-4 text-gray-500 font-medium hover:text-white">Borrowed</button>
                            </div>
                            <div className="p-4">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs text-gray-500 font-mono border-b border-white/5">
                                            <th className="pb-3 pl-2">ASSET</th>
                                            <th className="pb-3">BALANCE</th>
                                            <th className="pb-3">APY</th>
                                            <th className="pb-3">COLLATERAL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        <tr className="border-b border-white/5 last:border-0 group hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-2 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[10px]">₿</div>
                                                <span className="text-white font-medium">WBTC</span>
                                            </td>
                                            <td className="py-4 text-white">1.2500 <span className="text-gray-500 text-xs block">$54,200.00</span></td>
                                            <td className="py-4 text-green-400">4.2%</td>
                                            <td className="py-4 text-green-400">Enabled</td>
                                        </tr>
                                         <tr className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-2 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">Ξ</div>
                                                <span className="text-white font-medium">ETH</span>
                                            </td>
                                            <td className="py-4 text-white">15.000 <span className="text-gray-500 text-xs block">$34,500.00</span></td>
                                            <td className="py-4 text-green-400">3.8%</td>
                                            <td className="py-4 text-green-400">Enabled</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Interactions */}
                    <div className="bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col h-full">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-yellow-400" />
                            Quick Actions
                        </h4>
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-black/40 rounded-lg p-3 border border-white/5 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 mb-1">Supply Asset</span>
                                    <div className="flex items-center gap-2 text-white font-medium cursor-pointer hover:bg-white/5 px-2 py-1 rounded">
                                        <div className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center text-[8px]">U</div>
                                        USDC <ChevronDown className="w-3 h-3" />
                                    </div>
                                </div>
                                <input type="text" className="bg-transparent text-right text-white font-mono outline-none w-24" placeholder="0.00" />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 px-1">
                                <span>Wallet Balance:</span>
                                <span>25,400.00 USDC</span>
                            </div>
                             <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                                 <div className="flex justify-between text-sm mb-1">
                                     <span className="text-gray-400">Supply APY</span>
                                     <span className="text-green-400">12.4%</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="text-gray-400">Collateral Factor</span>
                                     <span className="text-white">82.5%</span>
                                 </div>
                             </div>
                        </div>

                        <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-lg transition-colors mt-auto shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            Supply USDC
                        </button>
                    </div>
                </div>
            </div>
            {/* Glow under dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400/5 blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  );
}
