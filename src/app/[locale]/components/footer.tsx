"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaMedium,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import { LanguagePicker } from "./language-picker";
import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

const SOCIAL_LINKS = [
  { href: "#", label: "X (Twitter)", Icon: FaXTwitter },
  { href: "#", label: "Facebook", Icon: FaFacebook },
  { href: "#", label: "Instagram", Icon: FaInstagram },
  { href: "#", label: "Discord", Icon: FaDiscord },
  { href: "#", label: "Medium", Icon: FaMedium },
  { href: "#", label: "LinkedIn", Icon: FaLinkedin },
  { href: "#", label: "YouTube", Icon: FaYoutube },
] as const;

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "text-sm text-neutral-400 hover:text-white transition-colors";

  if (external) {
    return (
      <Link href={href} className={`${className} inline-flex items-center gap-1`}>
        {children}
        <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
      </Link>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className={`${home.eyebrow} mb-4`}>{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-neutral-950 text-white">
      <div className={`${home.container} py-16 lg:py-20`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/assets/img/logo.png"
                alt="Lenix Protocol"
                width={140}
                height={36}
                className="md:h-9 h-6 w-auto"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-xs">
              {t("Footer.company_desc")}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <LanguagePicker showFullName isDark menuSide="top" />
          </div>

          <FooterColumn title={t("Footer.headings.about")}>
            <li>
              <FooterLink href="/about">{t("Footer.links.about_us")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">{t("Header.nav.contact")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/solutions">{t("Header.nav.solutions")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.ecosystem")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/token">{t("Footer.links.tokenomics")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/security">{t("Footer.links.security")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/about" external>
                {t("Footer.links.whitepaper")}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.roadmap")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/wallet-decryption">{t("Footer.links.wallet_decryption")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/crypto-asset-identification">
                {t("Footer.links.crypto_asset_identification")}
              </FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title={t("Footer.headings.solutions")}>
            <li>
              <FooterLink href="/wallet">{t("Header.solutions.wallet.title")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/finance">{t("Header.solutions.finance.title")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/banking-finance">{t("Footer.links.banking_finance")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/crypto-recovery">{t("Header.solutions.recovery.title")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/blockchain-forensics">{t("Header.nav.blockchain_forensics")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/threat-intelligence">{t("Footer.links.threat_intelligence")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/compliance-investigations">
                {t("Header.solutions.compliance.title")}
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/defi-compliance">{t("Footer.links.defi_compliance")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/law-enforcement">{t("Header.solutions.enforcement.title")}</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title={t("Footer.headings.resources")}>
            <li>
              <FooterLink href="/airdrop">{t("Header.nav.airdrop")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.blog")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.documentation")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.api_docs")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">{t("Header.nav.contact")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.support")}</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title={t("Footer.headings.legal")}>
            <li>
              <FooterLink href="#">{t("Footer.links.terms")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.cookie")}</FooterLink>
            </li>
            <li>
              <FooterLink href="/privacy-policy">{t("Footer.links.privacy")}</FooterLink>
            </li>
            <li>
              <FooterLink href="#">{t("Footer.links.disclaimer")}</FooterLink>
            </li>
            <li className="pt-2">
              <Link href="/crypto-recovery" className={`${home.btnPrimary} gap-2`}>
                <span>{t("Footer.buttons.recover_assets")}</span>
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-2xl mx-start">
            <Image
              src="/assets/img/certy.webp"
              alt="ISO 27001"
              width={172}
              height={172}
              className="md:h-14 h-8 w-auto shrink-0 object-contain grayscale invert-100 mx-start"
            />
            <p className="text-xs text-neutral-500 leading-relaxed">{t("Footer.certification_desc")}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://shorturl.at/FVVpk" target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/img/google-2.webp"
                alt="Google Play"
                className="md:h-10 h-6 w-auto  bg-gray-300 md:rounded-xl rounded-md"
                width={120}
                height={40}
              />
            </Link>
            <Link href="https://shorturl.at/FVVpk" target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/img/appstore.png"
                alt="App Store"
                className="md:h-10 h-6 w-auto  bg-gray-300 md:rounded-xl rounded-md"
                width={120}
                height={40}
              />
            </Link>
          </div>
        </div>

        <p className="mt-10 text-sm text-neutral-500">{t("Footer.copyright")}</p>
      </div>
    </footer>
  );
}
