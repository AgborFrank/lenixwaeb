import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import Partners from "@/components/partners";
import DeFiComplianceHero from "./components/defi-compliance-hero";
import DeFiComplianceOverview from "./components/defi-compliance-overview";
import DeFiComplianceHighlights from "./components/defi-compliance-highlights";
import DeFiComplianceCapabilities from "./components/defi-compliance-capabilities";
import DeFiComplianceCta from "./components/defi-compliance-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DeFiCompliance.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function DeFiCompliancePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <DeFiComplianceHero />
        <DeFiComplianceOverview />
        <DeFiComplianceHighlights />
        <DeFiComplianceCapabilities />
        <Partners className="bg-zinc-900/30" />
        <DeFiComplianceCta />
      </div>
      <Footer />
    </>
  );
}
