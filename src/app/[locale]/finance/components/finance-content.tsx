"use client";

import Header from "@/app/[locale]/components/header";
import Footer from "@/app/[locale]/components/footer";
import FinanceHero from "@/app/[locale]/components/finance/hero";
import FinanceMarkets from "@/app/[locale]/components/finance/markets";
import FinanceFeatures from "@/app/[locale]/components/finance/features";
import FinanceCTA from "@/app/[locale]/components/finance/cta";
import FinanceSteps from "@/app/[locale]/components/finance/steps";
import FinanceCalculator from "@/app/[locale]/components/finance/calculator";
import FinanceFAQ from "@/app/[locale]/components/finance/faq";

export function FinanceContent() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <FinanceHero />
      <FinanceSteps />
      <FinanceMarkets />
      <FinanceFeatures />
      <FinanceCalculator />
      <FinanceFAQ />
      <FinanceCTA />
      <Footer />
    </main>
  );
}
