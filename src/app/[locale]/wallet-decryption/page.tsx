import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import WalletDecryptionHero from "./components/wallet-decryption-hero";
import WalletDecryptionAudiences from "./components/wallet-decryption-audiences";
import WalletDecryptionBoundaries from "./components/wallet-decryption-boundaries";
import WalletDecryptionProcess from "./components/wallet-decryption-process";
import WalletDecryptionSupport from "./components/wallet-decryption-support";
import WalletDecryptionCta from "./components/wallet-decryption-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WalletDecryption.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function WalletDecryptionPage() {
  return (
    <>
      <Header />
      <WalletDecryptionHero />
      <WalletDecryptionAudiences />
      <WalletDecryptionBoundaries />
      <WalletDecryptionProcess />
      <WalletDecryptionSupport />
      <WalletDecryptionCta />
      <Footer />
    </>
  );
}
