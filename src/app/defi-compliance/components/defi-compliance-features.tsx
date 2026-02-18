"use client";

import { TrendingUp, DollarSign, Network, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Scale DeFi due diligence with ease",
    description:
      "Apply customizable risk scores to keep the focus on the highest risks and minimize resource-intensive investigations, so compliance does not interrupt growth opportunities.",
  },
  {
    icon: DollarSign,
    title: "Lower compliance costs",
    description:
      "Leverage the industry's most reliable and precise APIs to optimize and automate compliance, even as the volume of AML screening requests increases.",
  },
  {
    icon: Network,
    title: "Broaden cross-chain coverage",
    description:
      "Tap blockchain-native data in real-time, with intelligence across thousands of tokens across Layer 1s and Layer 2s to measure and mitigate risk.",
  },
  {
    icon: Shield,
    title: "Predict and neutralize threats",
    description:
      "Perform proactive due diligence across the ecosystem, ensuring regulatory compliance while protecting partners and securing end-user experiences.",
  },
] as const;

const STATS = [
  { value: "250+", label: "bridges covered with enhanced tracing" },
  { value: "1500", label: "analyses processed per second via asynchronous endpoints" },
  { value: "1B+", label: "addresses attributed and clustered to known actors" },
] as const;

export default function DeFiComplianceFeatures() {
  return (
    <section className="py-20 border-y border-white/5">
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

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="p-6 rounded-2xl text-center"
            >
              <div className="text-4xl font-bold text-yellow-400 mb-2">{value}</div>
              <div className="text-sm text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
