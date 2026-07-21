import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Header from "../components/header";
import Footer from "../components/footer";
import SecurityHero from "./components/security-hero";
import SecurityAssurance from "./components/security-assurance";
import SecurityAuditScope from "./components/security-audit-scope";
import SecurityPractices from "./components/security-practices";
import SecurityCta from "./components/security-cta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Security.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SecurityPage() {
  return (
    <>
      <Header />
      <SecurityHero />
      <SecurityAssurance />
      <SecurityAuditScope />
      <SecurityPractices />
      <SecurityCta />
      <Footer />
    </>
  );
}
