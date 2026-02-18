"use client";

import ComplianceInvestigationsHero from "./compliance-investigations-hero";
import ComplianceInvestigationsOverview from "./compliance-investigations-overview";
import ComplianceInvestigationsFeatures from "./compliance-investigations-features";
import ComplianceInvestigationsTestimonials from "./compliance-investigations-testimonials";
import ComplianceInvestigationsCTA from "./compliance-investigations-cta";
import Partners from "@/components/partners";

export function ComplianceInvestigationsContent() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      <ComplianceInvestigationsHero />
      <Partners />
      <ComplianceInvestigationsOverview />
      <ComplianceInvestigationsFeatures />
     
      <ComplianceInvestigationsTestimonials />
      <ComplianceInvestigationsCTA />
    </div>
  );
}
