import Header from "../components/header";
import Footer from "../components/footer";
import AboutHero from "./components/about-hero";
import CompanyOverview from "./components/company-overview";
import LeadershipTeam from "./components/leadership-team";
import CompanyStats from "./components/company-stats";
import OurJourney from "./components/our-journey";
import ContactCTA from "./components/contact-cta";

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
