import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import BankingFinanceHero from "./components/banking-finance-hero";
import BankingFinanceOverview from "./components/banking-finance-overview";
import BankingFinanceServices from "./components/banking-finance-services";
import BankingFinanceCapabilities from "./components/banking-finance-capabilities";
import BankingFinanceProcess from "./components/banking-finance-process";
import BankingFinanceBoundaries from "./components/banking-finance-boundaries";
import BankingFinanceCta from "./components/banking-finance-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BankingFinance.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function BankingFinancePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <BankingFinanceHero />
        <BankingFinanceOverview />
        <BankingFinanceServices />
        <BankingFinanceCapabilities />
        <BankingFinanceProcess />
        <BankingFinanceBoundaries />
        <BankingFinanceCta />
      </div>
      <Footer />
    </>
  );
}
