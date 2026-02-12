import type { Metadata } from "next";
import Header from "../components/header";
import Footer from "../components/footer";
import SolutionsHero from "./components/solutions-hero";
import CryptoRecovery from "./components/crypto-recovery";
import CrossBorderPayments from "./components/cross-border-payments";
import CryptoLending from "./components/crypto-lending";
import CryptoSecurity from "./components/crypto-security";

export const metadata: Metadata = {
  title: "Blockchain Security & Recovery Solutions | Lenix Protocol",
  description: "Explore Lenix Protocol's suites of solutions ranging from asset recovery and blockchain forensics to secure payments and lending infrastructure.",
};

export default function Solutions() {
  return (
    <>
      <Header />
      <SolutionsHero />
      <div className="hidden w-full py-10 md:flex bg-black">
        <svg width="100%" height="3" viewBox="0 0 1270 3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line y1="1.97125" x2="1270" y2="1.97125" stroke="url(#paint0_linear_1541_128)" strokeOpacity="0.24" strokeWidth="2.05751"></line>
          <line x1="131.233" y1="1.97125" x2="512.233" y2="1.97125" stroke="url(#paint1_linear_1541_128)" strokeOpacity="0.68" strokeWidth="2.05751"></line>
          <defs>
            <linearGradient id="paint0_linear_1541_128" x1="0" y1="3.5" x2="1270" y2="3.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9FF38" stopOpacity="0"></stop>
              <stop offset="0.178272" stopColor="#F9FF38"></stop>
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient id="paint1_linear_1541_128" x1="131.233" y1="3.5" x2="512.233" y2="3.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9FF38" stopOpacity="0"></stop>
              <stop offset="0.178272" stopColor="#F9FF38"></stop>
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <CryptoRecovery />
      <CrossBorderPayments />
      <CryptoLending />
      <CryptoSecurity />
      <Footer />
    </>
  );
} 