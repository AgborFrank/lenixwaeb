import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import BlockchainForensicsHero from "./components/blockchain-forensics-hero";
import BlockchainForensicsCapabilities from "./components/blockchain-forensics-capabilities";
import BlockchainForensicsUseCases from "./components/blockchain-forensics-use-cases";
import BlockchainForensicsProcess from "./components/blockchain-forensics-process";
import BlockchainForensicsCta from "./components/blockchain-forensics-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("BlockchainForensics.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function BlockchainForensicsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        <BlockchainForensicsHero />
        <BlockchainForensicsCapabilities />
        <BlockchainForensicsUseCases />
        <BlockchainForensicsProcess />
        <BlockchainForensicsCta />
      </div>
      <Footer />
    </>
  );
}
