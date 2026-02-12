import Header from "./components/header";
import Footer from "./components/footer";
import HomeHero from "./components/home/hero";
import { GetTokens } from "@/components/GetTokens";
import { SendTokens } from "@/components/SendTokens";
import { TokenAggregator } from "@/components/TokenAggregator";
import { BitcoinAggregator } from "@/components/BitcoinAggregator";
import Pillars from "./components/home/pillars";
import Payment from "./components/home/payment";
import Comparison from "./components/home/comparison";
import Merchant from "./components/home/merchant";
import TokenDetails from "./components/home/token-details";
import Competition from "./components/home/competition";
import Credibility from "./components/home/credibility";

export default function Home() {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Lenix Protocol",
            "url": "https://lenixprotocol.com",
            "logo": "https://lenixprotocol.com/assets/img/logo.png",
            "service": [
              {
                "@type": "Service",
                "name": "Crypto Asset Recovery",
                "description": "Professional recovery of lost or stolen cryptocurrency using advanced blockchain forensics.",
                "provider": {
                  "@type": "Organization",
                  "name": "Lenix Protocol"
                }
              },
              {
                "@type": "Service",
                "name": "Blockchain Forensics",
                "description": "Expert blockchain investigation and asset tracing for legal and recovery purposes.",
                "provider": {
                  "@type": "Organization",
                  "name": "Lenix Protocol"
                }
              }
            ]
          })
        }}
      />
      <HomeHero />
      <div className="hidden w-full py-10 md:flex bg-black">
        <svg
          width="100%"
          height="3"
          viewBox="0 0 1270 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            y1="1.97125"
            x2="1270"
            y2="1.97125"
            stroke="url(#paint0_linear_1541_128)"
            strokeOpacity="0.24"
            strokeWidth="2.05751"
          />
          <line
            x1="131.233"
            y1="1.97125"
            x2="512.233"
            y2="1.97125"
            stroke="url(#paint1_linear_1541_128)"
            strokeOpacity="0.68"
            strokeWidth="2.05751"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1541_128"
              x1="0"
              y1="3.5"
              x2="1270"
              y2="3.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F9FF38" stopOpacity="0" />
              <stop offset="0.178272" stopColor="#F9FF38" />
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1541_128"
              x1="131.233"
              y1="3.5"
              x2="512.233"
              y2="3.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F9FF38" stopOpacity="0" />
              <stop offset="0.178272" stopColor="#F9FF38" />
              <stop offset="1" stopColor="#F9FF38" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Pillars />
      <div className="container mx-auto py-10 hidden">
        <GetTokens />
        <SendTokens />
        <TokenAggregator />
        <BitcoinAggregator />
      </div>
      <div className="bg-overview overflow-hidden">
        <img className="top-left" src="/assets/img/header.svg" alt="header" />
        <img
          className="bottom-left"
          src="/assets/img/bank-account.svg"
          alt="bank"
        />
        <img
          className="bottom-right"
          src="/assets/img/cross-border.svg"
          alt="border"
        />
      </div>
     
      <Comparison />
      <Merchant />
      <Payment />
      <TokenDetails />
      <Credibility />
      <Competition />
      <Footer />
    </>
  );
}
