import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { WalletDecryptionContent } from "./components/wallet-decryption-content";
import Header from "../components/header";
import Footer from "../components/footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: "Crypto Wallet Decryption Services | Lenix Protocol",
    description: "Digital Currency Wallet Decryption Services. We recover and decrypt your digital currency safely and securely.",
  };
}

export default function WalletDecryptionPage() {
  return (
    <>
      <Header />
      <WalletDecryptionContent />
      <Footer />
    </>
  );
}
