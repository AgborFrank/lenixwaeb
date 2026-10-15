import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import RefundHero from "./components/refund-hero";
import RefundSystem from "./components/refund-system";
import RefundSplit from "./components/refund-split";
import RefundCases from "./components/refund-cases";
import RefundProcess from "./components/refund-process";
import RefundBoundaries from "./components/refund-boundaries";
import RefundFees from "./components/refund-fees";
import RefundFAQ from "./components/refund-faq";
import RefundRequestForm from "./components/refund-request-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PurchaseRefund.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
  };
}

export default function PurchaseRefundPage() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <RefundHero />
      <RefundSystem />
      <RefundSplit />
      <RefundCases />
      <RefundProcess />
      <RefundBoundaries />
      <RefundFees />
      <RefundFAQ />
      <RefundRequestForm />
      <Footer />
    </main>
  );
}
