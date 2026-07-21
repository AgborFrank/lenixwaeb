"use client";

import Header from "@/app/[locale]/components/header";
import Footer from "@/app/[locale]/components/footer";
import WalletHero from "@/app/[locale]/components/wallet/hero";
import WalletFeatures from "@/app/[locale]/components/wallet/features";
import WalletGettingStarted from "@/app/[locale]/components/wallet/getting-started";
import WalletEcosystem from "@/app/[locale]/components/wallet/ecosystem";
import WalletSecurity from "@/app/[locale]/components/wallet/security";
import WalletCTA from "@/app/[locale]/components/wallet/cta";

export function WalletContent() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <WalletHero />
      <WalletFeatures />
      <WalletGettingStarted />
      <WalletEcosystem />
      <WalletSecurity />
      <WalletCTA />
      <Footer />
    </main>
  );
}
