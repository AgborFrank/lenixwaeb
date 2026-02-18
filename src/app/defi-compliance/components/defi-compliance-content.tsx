"use client";

import DeFiComplianceHero from "./defi-compliance-hero";
import DeFiComplianceOverview from "./defi-compliance-overview";
import DeFiComplianceFeatures from "./defi-compliance-features";
import DeFiComplianceCapabilities from "./defi-compliance-capabilities";
import Partners from "@/components/partners";
import DeFiComplianceCTA from "./defi-compliance-cta";

export function DeFiComplianceContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      <DeFiComplianceHero />
      <DeFiComplianceOverview />
      <DeFiComplianceFeatures />
      <DeFiComplianceCapabilities />
      <Partners className="bg-zinc-900/30 border-y border-white/5" />
      <DeFiComplianceCTA />
    </div>
  );
}
