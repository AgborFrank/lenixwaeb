"use client";

import { Wallet, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Wallet,
        title: "Download Lenix Wallet",
        description: "Download the highly secured Lenix wallet to start interacting with the Lenix Protocol securely."
    },
    {
        icon: CheckCircle,
        title: "Signup for free",
        description: "Sign up for a free account to start using the Lenix crypto lending Protocol."
    },
    {
        icon: TrendingUp,
        title: "Get your Loan",
        description: "Get your crypto loan instantly with our fast and secure lending process."
    }
];

export default function FinanceSteps() {
  return (
    <section className="py-24 bg-black relative border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It <span className="text-yellow-400">Works</span></h2>
                <p className="text-gray-400 max-w-xl mx-auto">Start earning passive income on your crypto assets in three simple steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

                {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.2)]">
                            <div className="absolute inset-0 bg-yellow-400/5 rounded-2xl" />
                            <step.icon className="w-10 h-10 text-yellow-400" />
                            
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
}
