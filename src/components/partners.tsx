"use client";

import Image from "next/image";
import { useState } from "react";

const PARTNERS = [
  {
    name: "Coinbase",
    logo: "/assets/partners/coinbase_black.png",
    alt: "Coinbase",
  },
  {
    name: "Revolut",
    logo: "/assets/partners/Revolut_Logo.webp",
    alt: "Revolut",
  },
  {
    name: "Scam Tracker",
    logo: "/assets/partners/tracker.webp",
    alt: "Scam Tracker",
  },
  {
    name: "BitGo",
    logo: "/assets/partners/BitGo_black.avif",
    alt: "BitGo",
  },
  {
    name: "Binance",
    logo: "/assets/partners/binance_black-01.svg",
    alt: "Binance",
  },
  {
    name: "Chain",
    logo: "/assets/partners/chain.png",
    alt: "Chain",
  },
  {
    name: "Paysafe",
    logo: "/assets/partners/paysafe-Logo-Oct2023.webp",
    alt: "Paysafe",
  },
  {
    name: "Etherium",
    logo: "/assets/partners/etherium.png",
    alt: "Etherium",
  },
] as const;

interface PartnersProps {
  className?: string;
  partners?: typeof PARTNERS;
}

function PartnerLogo({ partner }: { partner: (typeof PARTNERS)[number] }) {
  const [imageError, setImageError] = useState(false);
  const isSvg = partner.logo.endsWith('.svg');

  if (imageError) {
    return (
      <div className="flex items-center justify-center w-full h-20 p-4">
        <span className="text-gray-400 text-sm font-medium">{partner.name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-20 p-4 transition-all duration-300 opacity-60 hover:opacity-100">
      <div className="relative w-full h-full flex items-center justify-center bg-transparent">
        {isSvg ? (
          <img
            src={partner.logo}
            alt={partner.alt}
            className="max-w-full max-h-full object-contain"
            style={{ 
              filter: 'brightness(0) invert(1)',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={partner.logo}
            alt={partner.alt}
            width={120}
            height={60}
            className="max-w-full max-h-full object-contain"
            style={{ 
              filter: 'brightness(0) invert(1)',
            }}
            onError={() => setImageError(true)}
            unoptimized
          />
        )}
      </div>
    </div>
  );
}

export default function Partners({
  className = "",
  partners = PARTNERS,
}: PartnersProps) {
  return (
    <section className={`py-8 md:py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <PartnerLogo key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
