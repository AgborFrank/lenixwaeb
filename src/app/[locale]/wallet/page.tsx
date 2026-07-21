import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WalletContent } from "./components/wallet-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("WalletPage.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
  };
}

export default function LenixWalletPage() {
  return <WalletContent />;
}
