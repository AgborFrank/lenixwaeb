import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AirdropContent } from "./components/airdrop-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Airdrop.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
  };
}

export default function AirdropPage() {
  return <AirdropContent />;
}
