"use client";

import LawEnforcementHero from "./law-enforcement-hero";
import LawEnforcementOverview from "./law-enforcement-overview";
import LawEnforcementFeatures from "./law-enforcement-features";
import LawEnforcementCapabilities from "./law-enforcement-capabilities";
import Partners from "@/components/partners";
import LawEnforcementCTA from "./law-enforcement-cta";

export function LawEnforcementContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      <LawEnforcementHero />
      <LawEnforcementOverview />
      <LawEnforcementFeatures />
      <LawEnforcementCapabilities />
      <Partners className="bg-zinc-900/30 border-y border-white/5" />
      <LawEnforcementCTA />
    </div>
  );
}
