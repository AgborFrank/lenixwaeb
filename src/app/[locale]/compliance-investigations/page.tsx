import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import ComplianceInvestigationsHero from "./components/compliance-investigations-hero";
import ComplianceInvestigationsOverview from "./components/compliance-investigations-overview";
import ComplianceInvestigationsFeatures from "./components/compliance-investigations-features";
import ComplianceInvestigationsCta from "./components/compliance-investigations-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ComplianceInvestigations.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ComplianceInvestigationsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <ComplianceInvestigationsHero />
        <ComplianceInvestigationsOverview />
        <ComplianceInvestigationsFeatures />
        <ComplianceInvestigationsCta />
      </div>
      <Footer />
    </>
  );
}
