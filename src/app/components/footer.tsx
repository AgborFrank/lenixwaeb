"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Left Column - Logo and Description */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-thin mb-6">
            <Image src="/assets/img/logo.png" alt="logo" width={150} height={40} className="h-10 w-auto" />
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
                Lenix Protocol is an L1 blockchain protocol for crypto to bank payments, crypto asset recovery that also leverages artificial intelligence (AI) to optimize scalability,
                security, and interoperability.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">𝕏</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">📧</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">📷</span>
              </div>
            </div>

            {/* Second row of social icons */}
            <div className="flex space-x-4 mt-4">
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">●</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">@</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">in</span>
              </div>
              <div className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center hover:border-gray-400 cursor-pointer">
                <span className="text-sm">📺</span>
              </div>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">ABOUT</h3>
            <ul className="space-y-4">
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

          {/* Learn Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">LEARN</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  How to buy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Referrals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Brand Kit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">LEGAL</h3>
            <ul className="space-y-4">
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
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>

            {/* Join Presale Button */}
            <div className="mt-8 flex flex-col space-y-2">
              <Link href="/crypto-recovery"  className="bg-yellow-400 font-bold hover:bg-yellow-300 text-black px-6 py-3 rounded-full flex items-center space-x-2 w-fit">
                <span>Recover Assets</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="https://t.me/Verified_protocol" target="_blank"  className="bg-yellow-400 font-bold hover:bg-yellow-200 text-black px-6 py-3 rounded-full flex items-center space-x-2 w-fit">
                <span>Connect on Telegram</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex justify-between items-center">
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
