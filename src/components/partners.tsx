"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

export const MEDIA_PARTNERS = [
  { name: "Bloomberg", logo: "/assets/part/bloomberg.png", alt: "Bloomberg" },
  { name: "Yahoo Finance", logo: "/assets/part/yahoo.png", alt: "Yahoo Finance" },
  { name: "CoinTelegraph", logo: "/assets/part/cointelegraph.png", alt: "CoinTelegraph" },
  { name: "BeInCrypto", logo: "/assets/part/beincrypto.png", alt: "BeInCrypto" },
  { name: "Benzinga", logo: "/assets/part/benzinga.png", alt: "Benzinga" },
  { name: "MarketWatch", logo: "/assets/part/marketwatch.png", alt: "MarketWatch" },
  { name: "Morningstar", logo: "/assets/part/morningstar.png", alt: "Morningstar" },
  { name: "Bitcoin.com", logo: "/assets/part/bitcoin.png", alt: "Bitcoin.com" },
  { name: "DexTools", logo: "/assets/part/dextools.png", alt: "DexTools" },
  { name: "TON", logo: "/assets/part/ton.png", alt: "TON" },
] as const;

export type Partner = (typeof MEDIA_PARTNERS)[number];

interface PartnersProps {
  className?: string;
  partners?: readonly Partner[];
  showHeader?: boolean;
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <span className="text-neutral-600 text-xs font-medium whitespace-nowrap px-4">
        {partner.name}
      </span>
    );
  }

  return (
    <div className="flex h-14 sm:h-16 w-44 sm:w-52 shrink-0 items-center justify-center px-8 opacity-60">
      <Image
        src={partner.logo}
        alt={partner.alt}
        width={200}
        height={56}
        className="max-h-10 sm:max-h-12 w-auto object-contain"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  );
}

export default function Partners({
  className = "",
  partners = MEDIA_PARTNERS,
  showHeader = true,
}: PartnersProps) {
  const t = useTranslations("Home.Partners");

  return (
    <section className={`py-14 bg-neutral-950 ${className}`} aria-label={t("title")}>
      <div className={home.container}>
        {showHeader && (
          <header className="mb-8 max-w-2xl">
            <p className={`${home.eyebrow} mb-2`}>{t("eyebrow")}</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1">{t("title")}</h2>
            <p className="text-sm text-neutral-500">{t("subtitle")}</p>
          </header>
        )}

        <div className="partners-marquee-mask overflow-hidden">
          <div className="partners-marquee-track">
            <div className="flex items-center" role="list" aria-label={t("title")}>
              {partners.map((partner) => (
                <div key={partner.name} role="listitem">
                  <PartnerLogo partner={partner} />
                </div>
              ))}
            </div>
            <div className="flex items-center" aria-hidden="true">
              {partners.map((partner) => (
                <PartnerLogo key={`${partner.name}-duplicate`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
