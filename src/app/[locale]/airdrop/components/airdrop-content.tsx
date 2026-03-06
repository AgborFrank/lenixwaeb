"use client";

import Header from "@/app/[locale]/components/header";
import Footer from "@/app/[locale]/components/footer";
import AirdropHero from "@/app/[locale]/components/airdrop/hero";
import AirdropOngoing from "@/app/[locale]/components/airdrop/ongoing";
import AirdropUpcoming from "@/app/[locale]/components/airdrop/upcoming";
import FinanceCTA from "@/app/[locale]/components/finance/cta"; // Reuse Telegram CTA

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
