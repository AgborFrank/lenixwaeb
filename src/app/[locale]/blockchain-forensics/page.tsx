import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import { BlockchainForensicsContent } from "./components/blockchain-forensics-content";

export const metadata: Metadata = {
  title: "Blockchain Forensics & Asset Tracing Investigation | Lenix Protocol",
  description: "Advanced blockchain intelligence and forensic reports for law enforcement and legal recovery. Professional asset tracing and fraud analysis.",
  keywords: ["Blockchain Forensics", "Asset Tracing", "Crypto Investigation", "On-Chain Analytics", "Forensic Reports"],
};

export default function BlockchainForensicsPage() {
  return (
    <>
      <Header />
      <BlockchainForensicsContent />
      <Footer />
    </>
  );
}

