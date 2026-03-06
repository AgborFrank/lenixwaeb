"use client";

import { Search, Shield, Globe, Lock, Users, FileSearch } from "lucide-react";

const features = [
    {
        icon: Search,
        title: "Forensic Tracing",
        description: "Advanced blockchain analysis to trace funds through mixers, tumblers, and cross-chain bridges."
    },
    {
        icon: Users,
        title: "Expert Investigators",
        description: "A team comprising former intelligence officers, cybersecurity experts, and legal specialists."
    },
    {
        icon: Globe,
        title: "Global Legal Network",
        description: "Partnerships with law enforcement and legal entities across 40+ jurisdictions."
    },
    {
        icon: Lock,
        title: "Military-Grade Security",
        description: "Your data and case details are protected by end-to-end encryption and strict confidentiality protocols."
    },
    {
        icon: FileSearch,
        title: "Case Documentation",
        description: "We provide comprehensive evidence reports usable in court proceedings and police investigations."
    },
    {
        icon: Shield,
        title: "No Win, No Fee",
        description: "We are committed to your success. If we can't recover your funds, you don't pay for the recovery service."
    }
];

export default function RecoveryFeatures() {
  return (
    <section className="bg-black py-24 px-4 relative">
       {/* Decorative gradient */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Why Choose Lenix <span className="text-yellow-400">Recovery</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We combine cutting-edge technology with years of expertise to provide the most effective crypto recovery service in the industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
                <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/50 rounded-3xl p-8 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_-5px_rgba(250,204,21,0.3)]">
                        <feature.icon className="w-7 h-7 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
