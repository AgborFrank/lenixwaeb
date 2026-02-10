"use client";

import { Zap, Shield, Repeat } from "lucide-react";

export default function FinanceFeatures() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid md:grid-cols-3 gap-8">
               {/* Feature 1 */}
               <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group">
                   <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 transition-colors border border-yellow-400/20">
                       <Zap className="w-7 h-7 text-yellow-400" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Flash Loans</h3>
                   <p className="text-gray-400 leading-relaxed">
                       Execute uncollateralized loans for arbitrage, collateral swapping, and self-liquidation. Instant access to liquidity within a single transaction block.
                   </p>
               </div>

               {/* Feature 2 */}
               <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/50 transition-all duration-300 group">
                   <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors border border-white/20">
                       <Shield className="w-7 h-7 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Liquidation Protection</h3>
                   <p className="text-gray-400 leading-relaxed">
                       Our AI-driven protocol monitors your health factor in real-time and provides smart notifications or auto-repayment options to prevent liquidation events.
                   </p>
               </div>

               {/* Feature 3 */}
               <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group">
                   <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 transition-colors border border-yellow-400/20">
                       <Repeat className="w-7 h-7 text-yellow-400" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">Collateral Swap</h3>
                   <p className="text-gray-400 leading-relaxed">
                       Seamlessly swap your collateral assets without repaying your debt. Rebalance your portfolio instantly to manage risk or capture market opportunities.
                   </p>
               </div>
           </div>
       </div>
    </section>
  );
}
