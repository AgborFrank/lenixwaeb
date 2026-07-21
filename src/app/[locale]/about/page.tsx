import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import AboutHero from "./components/about-hero";
import CompanyOverview from "./components/company-overview";
import LeadershipTeam from "./components/leadership-team";
import CompanyStats from "./components/company-stats";
import OurJourney from "./components/our-journey";
import ContactCTA from "./components/contact-cta";

export const metadata: Metadata = {
  title: "Blockchain Forensics & Crypto Loan Experts | Lenix Protocol",
  description:
    "Lenix Protocol provides institutional-grade blockchain forensics, stolen crypto asset recovery, AML compliance, and instant liquidity through secure crypto-backed loans without credit checks.",
};

export default function About() {
  return (
    <>
      <Header />
      <AboutHero />
      <CompanyOverview />
      <CompanyStats />
      <OurJourney />
      <LeadershipTeam />
      <ContactCTA />
      <Footer />
    </>
  );
}
