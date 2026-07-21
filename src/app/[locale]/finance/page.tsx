import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FinanceContent } from "./components/finance-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FinancePage.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
  };
}

export default function LenixFinancePage() {
  return <FinanceContent />;
}
