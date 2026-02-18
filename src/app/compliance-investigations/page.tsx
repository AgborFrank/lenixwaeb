import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { ComplianceInvestigationsContent } from "./components/compliance-investigations-content";

export const metadata: Metadata = {
  title: "Crypto Compliance Investigations | Lenix Protocol",
  description:
    "Conduct investigations across blockchains and assets with a single click. Instantly visualize the flow of crypto funds through wallets, entities, and transactions to find meaningful evidence quickly and close cases faster.",
  keywords: [
    "Crypto Compliance",
    "Blockchain Investigations",
    "AML Compliance",
    "Crypto Forensics",
    "Transaction Tracing",
    "Compliance Reporting",
  ],
};

export default function ComplianceInvestigationsPage() {
  return (
    <>
      <Header />
      <ComplianceInvestigationsContent />
      <Footer />
    </>
  );
}
