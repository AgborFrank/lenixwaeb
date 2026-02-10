"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import WalletHero from "@/app/components/wallet/hero";
import WalletFeatures from "@/app/components/wallet/features";
import WalletSecurity from "@/app/components/wallet/security";
import WalletCTA from "@/app/components/wallet/cta";

export default function LenixWalletPage() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <WalletHero />
      <WalletFeatures />
      <WalletSecurity />
      <WalletCTA />
      <Footer />
    </main>
  );
}
