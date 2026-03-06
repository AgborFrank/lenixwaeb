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
  title: "About Lenix Protocol | Leaders in Blockchain Security & Recovery",
  description: "Learn about Lenix Protocol's mission to secure the digital future through professional forensics, advanced security protocols, and expert asset recovery.",
};

export default function About() {
  return (
    <>
      <Header />
      <AboutHero />
      <div className="bg-overview">
    <img className="top-left" src="/assets/img/header.svg" alt="header"/>
    <img className="bottom-left" src="/assets/img/bank-account.svg" alt="bank"/>
    <img className="bottom-right" src="/assets/img/cross-border.svg" alt="border"/>
   </div>
      <CompanyOverview />
      <CompanyStats />
      <OurJourney />
      <LeadershipTeam />
      <ContactCTA />
      <Footer />
    </>
  );
}
