"use client";

import { Gift, Sparkles, ArrowDown } from "lucide-react";
import Image from "next/image";

export default function AirdropHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[70vh] flex items-center bg-black">
      {/* Background with Glassmorphism */}
       <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/img/competition.png" 
            alt="Background" 
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

       {/* Animated Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-yellow-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-sm mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm tracking-wide uppercase">Community Rewards Program</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight mb-8 drop-shadow-2xl">
          CLAIM YOUR <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 animate-gradient">
            AIRDROP
          </span>
        </h1>

        <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the Lenix revolution. We are distributing <span className="text-white font-bold">$10,000,000</span> in rewards to our early supporters and active community members.
        </p>

        <div className="flex justify-center">
             <a href="#claim-section" className="animate-bounce">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400 transition-colors cursor-pointer">
                    <ArrowDown className="w-6 h-6" />
                </div>
             </a>
        </div>
      </div>
    </section>
  );
}
