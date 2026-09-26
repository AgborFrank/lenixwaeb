import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import RecoveryHero from "./components/recovery-hero";
import RecoveryProcess from "./components/recovery-process";
import SuccessStories from "./components/success-stories";
import RecoveryFeatures from "./components/recovery-features";
import RecoveryStats from "./components/recovery-stats";
import RecoveryForm from "./components/recovery-form";
import RecoveryFAQ from "./components/recovery-faq";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CryptoRecovery.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
  };
}

export default function CryptoRecovery() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <RecoveryHero />
      <RecoveryProcess />
      <RecoveryStats />
      <RecoveryFeatures />
      <SuccessStories />
      <RecoveryFAQ />
      <RecoveryForm />
      <Footer />
    </main>
  );
}
