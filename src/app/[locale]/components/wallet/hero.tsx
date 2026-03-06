"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Wallet, ChevronRight, RefreshCw, ArrowUpRight, ArrowDownLeft, Repeat, Landmark, Globe, ArrowRightLeft, Clock, Settings } from "lucide-react";
import Image from "next/image";

export default function WalletHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      
      {/* Background Image with Glassmorphism */}
      <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/img/competition.png" 
            alt="Background" 
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 right-0 -z-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-400/10 blur-[100px] opacity-20 animate-pulse lg:w-[800px] lg:h-[800px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] opacity-20 animate-pulse lg:w-[600px] lg:h-[600px]" />
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h4 className="text-md lg:text-lg font-bold text-white leading-tight">
              Secure Layer 2 <span className="text-yellow-400">Wallet</span> for the Future
            </h4>
             <h1 className="text-5xl lg:text-6xl font-bold text-white md:leading-14 leading-12">
              Recover Lost <span className="text-yellow-400">Crypto Assets</span> Access Free Cypto <span className="text-yellow-400">Loans</span> 
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Experience lightning-fast transactions, low fees, and advanced security with Lenix Wallet. 
              Unlock crypto loans and recover lost assets with our proprietary protocol.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-8 py-6 rounded-full font-bold">
                Download App
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Hero Visual - Realistic Phone Mockup */}
          <div className="relative mx-auto lg:mr-0 z-10 perspective-1000">
             {/* Phone Frame */}
             <div className="relative w-[320px] h-[650px] bg-black rounded-[50px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 ease-out">
                {/* Dynamic Island / Notch Area */}
                <div className="absolute top-0 inset-x-0 h-8 bg-black z-50 rounded-b-3xl" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex justify-end items-center pr-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
                
                {/* Screen Content */}
                <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden flex flex-col pt-12">
                    
                    {/* Status Bar Mock */}
                    <div className="absolute top-3 left-6 text-[10px] font-medium text-white">9:41</div>
                    <div className="absolute top-3 right-6 flex items-center gap-1">
                         <div className="h-2.5 w-4 border border-white/30 rounded-sm relative">
                            <div className="absolute inset-0.5 bg-white/90 rounded-[1px] w-[70%]" />
                         </div>
                    </div>

                    {/* App Header */}
                    <div className="px-6 flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black text-xs shadow-lg shadow-yellow-500/20">L</div>
                             <span className="font-semibold text-sm">Account 1</span>
                             <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Total Balance */}
                    <div className="px-6 text-center mb-8">
                        <p className="text-gray-400 text-xs mb-1">Total Balance</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-4">$24,592.54</h2>
                        <div className="inline-flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                            <RefreshCw className="w-3 h-3 text-green-400" />
                            <span className="text-xs font-medium text-green-400">+2.4% (24h)</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 grid grid-cols-4 gap-2 mb-8">
                        {[
                            { icon: <ArrowUpRight className="w-5 h-5" />, label: "Send" },
                            { icon: <ArrowDownLeft className="w-5 h-5" />, label: "Receive" },
                            { icon: <Repeat className="w-5 h-5" />, label: "Swap" },
                            { icon: <Landmark className="w-5 h-5" />, label: "Loan" },
                        ].map((action, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors border border-white/5">
                                    {action.icon}
                                </button>
                                <span className="text-[10px] text-gray-400">{action.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="px-6 flex gap-6 border-b border-white/5 mb-4">
                        <button className="pb-3 border-b-2 border-yellow-400 text-sm font-medium text-white">Assets</button>
                        <button className="pb-3 border-b-2 border-transparent text-sm font-medium text-gray-500">History</button>
                    </div>

                    {/* Asset List */}
                    <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-20 no-scrollbar">
                        {[
                            { name: "Bitcoin", ticker: "BTC", amount: "0.45", value: "$19,250.00", icon: "bg-orange-500" },
                            { name: "Ethereum", ticker: "ETH", amount: "2.14", value: "$4,820.00", icon: "bg-blue-600" },
                            { name: "Lenix", ticker: "LNX", amount: "5,000", value: "$1,250.00", icon: "bg-yellow-400" },
                            { name: "USDC", ticker: "USDC", amount: "842.54", value: "$842.54", icon: "bg-blue-400" },
                        ].map((asset, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${asset.icon} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
                                        {asset.ticker[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-white">{asset.name}</p>
                                        <p className="text-xs text-gray-500">{asset.amount} {asset.ticker}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm text-white">{asset.value}</p>
                                    <p className="text-xs text-green-400">+1.2%</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Utility Bar (Glass) */}
                    <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex justify-around items-center px-2 shadow-2xl z-20">
                         <Wallet className="w-6 h-6 text-yellow-400" />
                         <Globe className="w-6 h-6 text-gray-500" />
                         <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center -mt-8 border-4 border-black shadow-lg shadow-yellow-400/20">
                             <ArrowRightLeft className="w-6 h-6 text-black" />
                         </div>
                         <Clock className="w-6 h-6 text-gray-500" />
                         <Settings className="w-6 h-6 text-gray-500" />
                    </div>

                </div>
             </div>
             
             {/* Decorative Elements around phone */}
             <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-24 h-24 bg-blue-500/30 rounded-full blur-2xl -z-10 animate-pulse" />
             <div className="absolute bottom-0 -left-4 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
