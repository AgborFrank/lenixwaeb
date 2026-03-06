"use client";

import { Search, Shield, Zap, CheckCircle, ArrowRight, FileText, Lock } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Initial Assessment",
        description: "We analyze the blockchain trail, assess the loss type, and determine the recoverability of your assets.",
        tags: ["Trace Analysis", "Risk Score"]
    },
    {
        icon: Shield,
        title: "Strategy Formulation",
        description: "Our team develops a tailored recovery plan, leveraging legal frameworks and forensic evidence.",
        tags: ["Legal Strategy", "Forensics"]
    },
    {
        icon: Zap,
        title: "Active Recovery",
        description: "We execute the strategy, engaging with exchanges, authorities, and entities to freeze and retrieve funds.",
        tags: ["Negotiation", "Asset Seizure"]
    },
    {
        icon: CheckCircle,
        title: "Asset Return",
        description: "Recovered funds are securely transferred back to your verified wallet with potential future protection guides.",
        tags: ["Secure Transfer", "Closure"]
    }
];

export default function RecoveryProcess() {
  return (
    <section className="bg-black py-24 px-4 relative border-t border-white/5">
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Recovery <span className="text-yellow-400">Process</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our proven 4-step methodology maximizes the chances of a successful reclamation.
          </p>
        </div>

        <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent -z-10" />

            <div className="grid lg:grid-cols-4 gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center group">
                        <div className="w-32 h-32 rounded-full bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-400/50 transition-colors duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                             <div className="absolute inset-2 rounded-full bg-white/5 backdrop-blur-sm" />
                             <step.icon className="w-10 h-10 text-yellow-400 relative z-20" />
                             <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center border-4 border-black z-30">
                                 {i + 1}
                             </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 min-h-[80px]">{step.description}</p>
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            {step.tags.map((tag, j) => (
                                <span key={j} className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
