import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BankingDashboard } from "./_components/banking-dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountBanking.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function BankingPage() {
  return <BankingDashboard />;
}
