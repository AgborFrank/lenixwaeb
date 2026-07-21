import Header from "./components/header";
import Footer from "./components/footer";
import HomeHero from "./components/home/hero";
import Pillars from "./components/home/pillars";
import CaseWorkflow from "./components/home/case-workflow";
import TrustSignals from "./components/home/trust-signals";
import Merchant from "./components/home/merchant";
import Credibility from "./components/home/credibility";
import HomeCta from "./components/home/home-cta";
import Partners from "@/components/partners";

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
            name: "Lenix Protocol",
            url: "https://lenixprotocol.com",
            logo: "https://lenixprotocol.com/assets/img/logo.png",
            service: [
              {
                "@type": "Service",
                name: "Crypto Asset Recovery",
                description:
                  "On-chain tracing and evidence preparation for exchanges, regulators, and legal counsel.",
                provider: {
                  "@type": "Organization",
                  name: "Lenix Protocol",
                },
              },
              {
                "@type": "Service",
                name: "Blockchain Forensics",
                description:
                  "Blockchain investigation and asset tracing for compliance and recovery workflows.",
                provider: {
                  "@type": "Organization",
                  name: "Lenix Protocol",
                },
              },
            ],
          }),
        }}
      />
      <HomeHero />
      <Partners />
      <Pillars />
      <CaseWorkflow />
      <TrustSignals />
      <Merchant />
      <Credibility />
      <HomeCta />
      <Footer />
    </>
  );
}
