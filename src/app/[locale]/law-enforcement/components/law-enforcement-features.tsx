"use client";

import { Target, Database, Zap, FileSearch } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Follow the money and catch crypto criminals wherever they hide",
    description:
      "Track the flow of illicit funds seamlessly as they swap across blockchains, DEXs, and mixers. Pinpoint cash-out points at regulated exchanges for timely intervention and evidence collection.",
  },
  {
    icon: Database,
    title: "The industry's broadest, most accurate blockchain intelligence",
    description:
      "Tap into the world's most extensive crypto identity dataset, covering 99% of trading volume across 60+ blockchains. Gain unparalleled visibility into wallet ownership and behavioral patterns.",
  },
  {
    icon: Zap,
    title: "Achieve faster time-to-target with efficient, automated solutions",
    description:
      "Streamline investigation timelines with automated cross-chain and cross-asset tracing and visualization. Reduce complexity and gain actionable insights instantly with intelligent analytics.",
  },
  {
    icon: FileSearch,
    title: "Gather evidence and build cases with confidence",
    description:
      "Conduct single-click investigations across blockchains and assets. Instantly visualize the flow of funds through entities, clusters, addresses, and transactions to quickly find meaningful evidence.",
  },
] as const;

const STATS = [
  { value: "30%", label: "faster investigations with cross-chain auto-plotting" },
  { value: "50+", label: "blockchains supported in the Holistic network" },
  { value: "250+", label: "bridges supported for enhanced trace-throughs" },
] as const;

export default function LawEnforcementFeatures() {
  return (
    <section id="features" className="py-20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{value}</div>
              <div className="text-sm text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
