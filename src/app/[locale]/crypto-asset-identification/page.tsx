import { getTranslations } from "next-intl/server";
import { CryptoAssetIdentificationContent } from "./components/crypto-asset-identification-content";
import Header from "../components/header";
import Footer from "../components/footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: `Crypto Asset Identification | ${t("title")}`,
    description: "Identify hidden crypto assets with forensic precision. Our Crypto Asset Identification services trace wallets, NFTs, and blockchains for investigations.",
  };
}

export default function CryptoAssetIdentificationPage() {
  return (
    <>
      <Header />
      <main>
        <CryptoAssetIdentificationContent />
      </main>
      <Footer />
    </>
  );
}
