"use client";

import ThreatIntelligenceHero from "./threat-intelligence-hero";
import ThreatIntelligenceMission from "./threat-intelligence-mission";
import ThreatIntelligenceCapabilities from "./threat-intelligence-capabilities";
import ThreatIntelligenceTestimonials from "./threat-intelligence-testimonials";
import ThreatIntelligenceCTA from "./threat-intelligence-cta";

export function ThreatIntelligenceContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      <ThreatIntelligenceHero />
      <ThreatIntelligenceMission />
      <ThreatIntelligenceCapabilities />
      <ThreatIntelligenceTestimonials />
      <ThreatIntelligenceCTA />
    </div>
  );
}
