import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import ThreatIntelligenceHero from "./components/threat-intelligence-hero";
import ThreatIntelligenceMission from "./components/threat-intelligence-mission";
import ThreatIntelligenceCapabilities from "./components/threat-intelligence-capabilities";
import ThreatIntelligenceCta from "./components/threat-intelligence-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ThreatIntelligence.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ThreatIntelligencePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <ThreatIntelligenceHero />
        <ThreatIntelligenceMission />
        <ThreatIntelligenceCapabilities />
        <ThreatIntelligenceCta />
      </div>
      <Footer />
    </>
  );
}
