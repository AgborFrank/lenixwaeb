import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import Partners from "@/components/partners";
import LawEnforcementHero from "./components/law-enforcement-hero";
import LawEnforcementOverview from "./components/law-enforcement-overview";
import LawEnforcementHighlights from "./components/law-enforcement-highlights";
import LawEnforcementCapabilities from "./components/law-enforcement-capabilities";
import LawEnforcementCta from "./components/law-enforcement-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LawEnforcement.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function LawEnforcementPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <LawEnforcementHero />
        <LawEnforcementOverview />
        <LawEnforcementHighlights />
        <LawEnforcementCapabilities />
        <Partners className="bg-zinc-900/30" />
        <LawEnforcementCta />
      </div>
      <Footer />
    </>
  );
}
