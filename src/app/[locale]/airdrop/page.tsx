import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const robots: Metadata["robots"] = { index: false, follow: false };

function airdropEnabled() {
  return (
    process.env.NEXT_PUBLIC_ENABLE_AIRDROP === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_AIRDROP === "1"
  );
}

export async function generateMetadata(): Promise<Metadata> {
  if (!airdropEnabled()) {
    return { robots };
  }
  const t = await getTranslations("Airdrop.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").split(", "),
    robots,
  };
}

export default async function AirdropPage() {
  // Keep the import inside the flag check so the Reown-backed airdrop UI
  // is not part of the public bundle while the flag is off.
  if (airdropEnabled()) {
    const { AirdropContent } = await import("./components/airdrop-content");
    return <AirdropContent />;
  }
  notFound();
}
