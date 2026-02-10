"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import FinanceHero from "@/app/components/finance/hero";
import FinanceMarkets from "@/app/components/finance/markets";
import FinanceFeatures from "@/app/components/finance/features";
import FinanceCTA from "@/app/components/finance/cta";
import FinanceSteps from "@/app/components/finance/steps";
import FinanceCalculator from "@/app/components/finance/calculator";
import FinanceFAQ from "@/app/components/finance/faq";

export default function LenixFinancePage() {
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
