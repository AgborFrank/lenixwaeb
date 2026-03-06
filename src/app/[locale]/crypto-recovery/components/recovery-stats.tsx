"use client";

import { TrendingUp, Users, DollarSign, Shield } from "lucide-react";

export default function RecoveryStats() {
  return (
    <section className="py-20 px-4 bg-yellow-400 text-black relative overflow-hidden">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
                <div className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">$850M+</div>
                <div className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80">Value Recovered</div>
            </div>
            <div className="text-center">
                 <div className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">94%</div>
                 <div className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80">Success Rate</div>
            </div>
            <div className="text-center">
                 <div className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">15k+</div>
                 <div className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80">Cases Resolved</div>
            </div>
             <div className="text-center">
                 <div className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">24/7</div>
                 <div className="text-sm md:text-base font-bold uppercase tracking-widest opacity-80">Support Team</div>
            </div>
        </div>
      </div>
    </section>
  );
}
