import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import CryptoAssetIdentificationHero from "./components/crypto-asset-identification-hero";
import CryptoAssetIdentificationAudiences from "./components/crypto-asset-identification-audiences";
import CryptoAssetIdentificationMethods from "./components/crypto-asset-identification-methods";
import CryptoAssetIdentificationBoundaries from "./components/crypto-asset-identification-boundaries";
import CryptoAssetIdentificationProcess from "./components/crypto-asset-identification-process";
import CryptoAssetIdentificationDeliverables from "./components/crypto-asset-identification-deliverables";
import CryptoAssetIdentificationCta from "./components/crypto-asset-identification-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CryptoAssetIdentification.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CryptoAssetIdentificationPage() {
  return (
    <>
      <Header />
      <CryptoAssetIdentificationHero />
      <CryptoAssetIdentificationAudiences />
      <CryptoAssetIdentificationMethods />
      <CryptoAssetIdentificationBoundaries />
      <CryptoAssetIdentificationProcess />
      <CryptoAssetIdentificationDeliverables />
      <CryptoAssetIdentificationCta />
      <Footer />
    </>
  );
}
