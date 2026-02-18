import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { ThreatIntelligenceContent } from "./components/threat-intelligence-content";

export const metadata: Metadata = {
  title: "Threat Intelligence & Blockchain Intelligence | Lenix Protocol",
  description:
    "Blockchain intelligence for national security and law enforcement. Close critical gaps, power investigations, and strengthen mission outcomes with high-fidelity blockchain data.",
  keywords: [
    "Threat Intelligence",
    "Blockchain Intelligence",
    "Law Enforcement",
    "National Security",
    "Crypto Investigations",
    "Asset Tracing",
  ],
};

export default function ThreatIntelligencePage() {
  return (
    <>
      <Header />
      <ThreatIntelligenceContent />
      <Footer />
    </>
  );
}
