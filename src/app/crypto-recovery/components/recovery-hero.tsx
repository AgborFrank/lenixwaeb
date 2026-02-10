"use client";

import { Shield, ArrowRight, CheckCircle, Search, Activity, Lock, AlertTriangle, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RecoveryHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
       {/* Background Image with Glassmorphism */}
       <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/img/trade-routes.jpg" 
            alt="Background" 
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

       {/* Background Gradients */}
       <div className="absolute top-0 right-0 z-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-400/10 blur-[100px] opacity-20 animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-400/5 blur-[100px] opacity-20 animate-pulse delay-1000" />
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span className="text-yellow-400 text-sm font-medium tracking-wide">
                  ELITE RECOVERY TASK FORCE
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Recover Your
                <br />
                <span className="text-yellow-400">Lost Assets</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                  Specialized blockchain forensics and legal intervention to reclaim funds lost to scams, hacks, and unauthorized transfers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#start-recovery" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2">
                  Start Investigation <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center">
                  How It Works
                </Link>
              </div>

               {/* Trust Indicators */}
               <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm font-medium">94% Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm font-medium">No Recovery, No Fee</span>
                  </div>
                   <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400 text-sm font-medium">Global Jurisdiction</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Right Side - Realistic Recovery Intelligence Interface */}
          <div className="lg:justify-self-end w-full max-w-lg perspective-1000">
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
               {/* Glossy Overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40 rounded-3xl pointer-events-none" />

               {/* Header Bar */}
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                   <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-red-500" />
                       <div className="w-3 h-3 rounded-full bg-yellow-500" />
                       <div className="w-3 h-3 rounded-full bg-green-500" />
                   </div>
                   <div className="text-xs font-mono text-gray-500">LENIX RECOVERY INTEL V4.2</div>
               </div>

               {/* Content */}
               <div className="space-y-6">
                   {/* Warning / Status */}
                   <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                           <AlertTriangle className="w-5 h-5 text-red-500" />
                       </div>
                       <div>
                           <div className="text-red-400 font-bold text-sm">UNAUTHORIZED TRANSFER DETECTED</div>
                           <div className="text-gray-500 text-xs font-mono">TxHash: 0x71...9A2F</div>
                       </div>
                   </div>

                   {/* Scanning Progress */}
                   <div className="space-y-3">
                       <div className="flex justify-between text-xs text-gray-400 font-mono">
                           <span>BLOCKCHAIN ANALYSIS</span>
                           <span className="text-yellow-400 animate-pulse">SCANNING...</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-yellow-400 w-[78%] relative">
                               <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]" />
                           </div>
                       </div>
                       <div className="grid grid-cols-3 gap-2 mt-2">
                           <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                               <div className="text-xs text-gray-500">HOPS</div>
                               <div className="text-white font-mono">12</div>
                           </div>
                           <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                               <div className="text-xs text-gray-500">VOLUME</div>
                               <div className="text-white font-mono">$1.2M</div>
                           </div>
                            <div className="bg-white/5 rounded p-2 text-center border border-white/5">
                               <div className="text-xs text-gray-500">RISK</div>
                               <div className="text-red-400 font-mono">CRITICAL</div>
                           </div>
                       </div>
                   </div>

                   {/* Intelligence Map Mockup */}
                   <div className="relative h-32 bg-zinc-900/50 rounded-xl border border-white/5 p-4 overflow-hidden">
                       <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                       <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-red-500 rounded-full blur-[2px] animate-ping" />
                        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full" />
                       
                       <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-500 rounded-full" />
                       
                       {/* SVG Line connecting */}
                       <svg className="absolute inset-0 w-full h-full pointer-events-none">
                           <path d="M 120 64 Q 200 20 280 44" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" />
                       </svg>

                       <div className="absolute bottom-2 left-2 text-[10px] text-gray-600 font-mono">GEOLOCATION: TRIANGULATING</div>
                   </div>

                   {/* Found Logic */}
                   <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-bold"> Destination Identified</span>
                       </div>
                       <div className="text-white text-sm font-mono px-2 py-0.5 bg-green-500/20 rounded">EXCHANGE_WALLET_4</div>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
