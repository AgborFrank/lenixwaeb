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

export default function Footer() {
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
              Lenix Protocol is an L1 blockchain protocol for crypto to bank payments, crypto asset recovery that also leverages artificial intelligence (AI) to optimize scalability,
              security, and interoperability.
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
          </div>

          {/* Column 2 - About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">ABOUT</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Ecosystem
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Tokenomics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white flex items-center">
                  Whitepaper
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white flex items-center">
                  Litepaper
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">SOLUTIONS</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/wallet" className="text-gray-300 hover:text-white">
                  Lenix Wallet
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-gray-300 hover:text-white">
                  Lenix Finance
                </Link>
              </li>
              <li>
                <Link href="/crypto-recovery" className="text-gray-300 hover:text-white">
                  Crypto Recovery
                </Link>
              </li>
              <li>
                <Link href="/blockchain-forensics" className="text-gray-300 hover:text-white">
                  Blockchain Forensics
                </Link>
              </li>
              <li>
                <Link href="/threat-intelligence" className="text-gray-300 hover:text-white">
                  Threat Intelligence
                </Link>
              </li>
              <li>
                <Link href="/compliance-investigations" className="text-gray-300 hover:text-white">
                  Compliance Investigations
                </Link>
              </li>
              <li>
                <Link href="/defi-compliance" className="text-gray-300 hover:text-white">
                  DeFi Compliance
                </Link>
              </li>
              <li>
                <Link href="/law-enforcement" className="text-gray-300 hover:text-white">
                  Law Enforcement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">RESOURCES</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/airdrop" className="text-gray-300 hover:text-white">
                  Airdrop
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  API Docs
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Legal & CTAs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">LEGAL</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>

            {/* CTAs */}
            <div className="flex flex-col space-y-2">
              <Link href="/crypto-recovery" className="bg-yellow-400 font-bold hover:bg-yellow-300 text-black px-6 py-3 rounded-full flex items-center space-x-2 w-fit text-sm">
                <span>Recover Assets</span>
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
          Lenix Protocol is <span  className="text-yellow-400">ISO27001 certified</span>. This demonstrates how, as a business, we securely manage information assets and data to an internationally recognised standard. Additionally, it shows our robust approach for managing assets such as client data and employee details, intellectual property, financial information and third-party data.
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 Lenix Protocol, All Rights Reserved</p>
          <div className="playstore flex items-center gap-2">
            <Link href="https://mega.nz/file/8WwTgA6K#lduUV39_7fss5K3uOaUlLGRiMqkTuBlfWU3OLxAxJ7U" target="_blank"> 
              <Image src="/assets/img/google-2.webp" alt="Playstore" className="bg-white rounded-lg" width={100} height={100} />
            </Link>
            <Link href="https://mega.nz/file/8WwTgA6K#lduUV39_7fss5K3uOaUlLGRiMqkTuBlfWU3OLxAxJ7U" target="_blank"> 
              <Image src="/assets/img/appstore.png" className="bg-white rounded-lg" alt="Appstore" width={100} height={100} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
