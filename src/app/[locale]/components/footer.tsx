"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { 
  FaXTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaDiscord, 
  FaMedium, 
  FaLinkedin, 
  FaYoutube 
} from "react-icons/fa6"
import { LanguagePicker } from "./language-picker"
import { useTranslations } from "next-intl"

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="relative bg-black border-t border-white/5 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1 - Logo and Description */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-thin mb-6">
              <Image src="/assets/img/logo.png" alt="logo" width={150} height={40} className="h-10 w-auto" />
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed text-sm">
              {t("Footer.company_desc")}
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="Discord"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="Medium"
              >
                <FaMedium className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 border border-white/10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all backdrop-blur-sm"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>

            <div className="mt-8">
              <LanguagePicker showFullName isDark />
            </div>
          </div>

          {/* Column 2 - About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">{t("Footer.headings.about")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  {t("Footer.links.about_us")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Header.nav.solutions")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.ecosystem")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.tokenomics")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white flex items-center">
                  {t("Footer.links.whitepaper")}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.roadmap")}
                </a>
              </li>
              <li>
                <Link href="/wallet-decryption" className="text-gray-300 hover:text-white">
                  {t("Footer.links.wallet_decryption")}
                </Link>
              </li>
              <li>
                <Link href="/crypto-asset-identification" className="text-gray-300 hover:text-white line-clamp-1">
                  {t("Footer.links.crypto_asset_identification")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">{t("Footer.headings.solutions")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/wallet" className="text-gray-300 hover:text-white">
                  {t("Header.solutions.wallet.title")}
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-gray-300 hover:text-white">
                  {t("Header.solutions.finance.title")}
                </Link>
              </li>
              <li>
                <Link href="/crypto-recovery" className="text-gray-300 hover:text-white">
                  {t("Header.solutions.recovery.title")}
                </Link>
              </li>
              <li>
                <Link href="/blockchain-forensics" className="text-gray-300 hover:text-white">
                  {t("Header.nav.blockchain_forensics")}
                </Link>
              </li>
              <li>
                <Link href="/threat-intelligence" className="text-gray-300 hover:text-white">
                  {t("Footer.links.threat_intelligence")}
                </Link>
              </li>
              <li>
                <Link href="/compliance-investigations" className="text-gray-300 hover:text-white">
                  {t("Header.solutions.compliance.title")}
                </Link>
              </li>
              <li>
                <Link href="/defi-compliance" className="text-gray-300 hover:text-white">
                  {t("Footer.links.defi_compliance")}
                </Link>
              </li>
              <li>
                <Link href="/law-enforcement" className="text-gray-300 hover:text-white">
                  {t("Header.solutions.enforcement.title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">{t("Footer.headings.resources")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/airdrop" className="text-gray-300 hover:text-white">
                  {t("Header.nav.airdrop")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.blog")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.documentation")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.api_docs")}
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  {t("Header.nav.contact")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.support")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Legal & CTAs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">{t("Footer.headings.legal")}</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.cookie")}
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white">
                  {t("Footer.links.privacy")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  {t("Footer.links.disclaimer")}
                </a>
              </li>
            </ul>

            {/* CTAs */}
            <div className="flex flex-col space-y-2">
              <Link href="/crypto-recovery" className="bg-yellow-400 font-bold hover:bg-yellow-300 text-black px-6 py-3 rounded-full flex items-center space-x-2 w-fit text-sm">
                <span>{t("Footer.buttons.recover_assets")}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="desc pt-8 border-t flex flex-col sm:flex-row  items-center gap-4 border-gray-800 mt-6 "
        >
          <div className="mde">
            <Image src="/assets/img/certy.webp" alt="ISO27001" width={100} height={100} />
          </div>
          <p className="text-gray-400 text-xs">
          {t("Footer.certification_desc")}
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">{t("Footer.copyright")}</p>
          <div className="playstore flex items-center gap-2">
            <Link href="https://shorturl.at/FVVpk" target="_blank"> 
              <Image src="/assets/img/google-2.webp" alt="Playstore" className="bg-white rounded-lg" width={100} height={100} />
            </Link>
            <Link href="https://shorturl.at/FVVpk" target="_blank"> 
              <Image src="/assets/img/appstore.png" className="bg-white rounded-lg" alt="Appstore" width={100} height={100} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
