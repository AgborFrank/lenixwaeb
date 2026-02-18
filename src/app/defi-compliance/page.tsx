import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { DeFiComplianceContent } from "./components/defi-compliance-content";

export const metadata: Metadata = {
  title: "DeFi Compliance & AML Solutions | Lenix Protocol",
  description:
    "Evaluate ecosystem partners, prevent illicit activity, and protect end users with continuous due diligence designed for decentralized finance service protocols and crypto market infrastructure.",
  keywords: [
    "DeFi Compliance",
    "AML DeFi",
    "Decentralized Finance",
    "DeFi Risk Management",
    "Crypto Compliance",
    "DeFi Due Diligence",
  ],
};

export default function DeFiCompliancePage() {
  return (
    <>
      <Header />
      <DeFiComplianceContent />
      <Footer />
    </>
  );
}
