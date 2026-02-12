"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import AirdropHero from "@/app/components/airdrop/hero";
import AirdropOngoing from "@/app/components/airdrop/ongoing";
import AirdropUpcoming from "@/app/components/airdrop/upcoming";
import FinanceCTA from "@/app/components/finance/cta"; // Reuse Telegram CTA

export function AirdropContent() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <AirdropHero />
      <AirdropOngoing />
      <AirdropUpcoming />
      <FinanceCTA />
      <Footer />
    </main>
  );
}
