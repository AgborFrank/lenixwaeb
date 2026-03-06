import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import RecoveryHero from "./components/recovery-hero";
import RecoveryProcess from "./components/recovery-process";
import SuccessStories from "./components/success-stories";
import RecoveryFeatures from "./components/recovery-features";
import RecoveryStats from "./components/recovery-stats";
import RecoveryForm from "./components/recovery-form";
import RecoveryFAQ from "./components/recovery-faq";

export const metadata: Metadata = {
  title: "Certified Crypto Asset Recovery Services | Lenix Protocol",
  description: "Professional recovery of lost or stolen cryptocurrency with 94% success rate. Specialized in wallet password recovery and forensic-led fraud investigation.",
  keywords: ["Crypto Recovery", "Stolen Bitcoin Recovery", "Recover Lost Wallet", "Crypto Fraud Investigation", "Blockchain Forensics"],
};

export default function CryptoRecovery() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <RecoveryHero />
      <RecoveryProcess />
      <RecoveryStats />
      <RecoveryFeatures />
      <SuccessStories />
      <RecoveryFAQ />
      <RecoveryForm />
      <Footer />
    </main>
  );
}
