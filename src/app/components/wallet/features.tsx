"use client";

import { ShieldCheck, Landmark, Lock } from "lucide-react";

export default function WalletFeatures() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16 space-y-4">
              <span className="text-yellow-400 font-mono tracking-wider text-sm">POWERFUL FEATURES</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white">More Than Just a Wallet</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Layer 2 Security */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-colors" />
                  <div className="w-14 h-14 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                      <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Layer 2 Security</h3>
                  <p className="text-gray-400 leading-relaxed">
                      Built on advanced Layer 2 rollup technology, ensuring your transactions are processed off-chain for speed while maintaining mainnet-level security finality.
                  </p>
              </div>

              {/* Feature 2: Crypto Loans */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-colors" />
                  <div className="w-14 h-14 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                      <Landmark className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Crypto Loans</h3>
                  <p className="text-gray-400 leading-relaxed">
                      Access instant liquidity without selling your crypto. Use your Lenix Wallet assets as collateral for low-interest stablecoin loans through our decentralized protocol.
                  </p>
              </div>

              {/* Feature 3: Asset Recovery */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/20 transition-colors" />
                  <div className="w-14 h-14 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-green-400">
                      <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Smart Asset Recovery</h3>
                  <p className="text-gray-400 leading-relaxed">
                      Lost access to a wallet? Our unique social recovery and encrypted backup solutions provide a safety net to recover your funds securely, even in worst-case scenarios.
                  </p>
              </div>
          </div>
      </div>
    </section>
  );
}
