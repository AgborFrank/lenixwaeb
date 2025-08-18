import Header from "../components/header";
import Footer from "../components/footer";
import RecoveryHero from "./components/recovery-hero";
import RecoveryProcess from "./components/recovery-process";
import SuccessStories from "./components/success-stories";
import RecoveryFeatures from "./components/recovery-features";
import RecoveryStats from "./components/recovery-stats";
import RecoveryForm from "./components/recovery-form";
import RecoveryFAQ from "./components/recovery-faq";

export default function CryptoRecovery() {
  return (
    <>
      <Header />
      <RecoveryHero />
      <div className="bg-overview">
    <img className="top-left" src="/assets/img/header.svg" alt="header"/>
    <img className="bottom-left" src="/assets/img/bank-account.svg" alt="bank"/>
    <img className="bottom-right" src="/assets/img/cross-border.svg" alt="border"/>
   </div>
      <RecoveryProcess />
      <RecoveryStats />
      <RecoveryFeatures />
      <SuccessStories />
      <RecoveryForm />
      
      <RecoveryFAQ />
      <Footer />
    </>
  );
}
