import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import SolutionsHero from "./components/solutions-hero";
import SolutionsOverview from "./components/solutions-overview";
import SolutionsSections from "./components/solutions-sections";
import SolutionsCta from "./components/solutions-cta";

export const metadata: Metadata = {
  title: "Blockchain Security & Recovery Solutions | Lenix Protocol",
  description:
    "Recovery, settlement, lending, and security infrastructure. Tracing, fiat payout, collateralized credit, and ops controls—each with separate intake.",
};

export default function Solutions() {
  return (
    <>
      <Header />
      <SolutionsHero />
      <SolutionsOverview />
      <SolutionsSections />
      <SolutionsCta />
      <Footer />
    </>
  );
}
