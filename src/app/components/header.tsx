"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-black sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
          <div className="shrink-0 z-20">
            <Image src="/assets/img/logo.png" alt="logo" width={150} height={40} className="h-[30px] w-[145px]" />
          </div>
          </Link>
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 z-20 text-[14px]">
            <Link
              href="/giveaway"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>250K Giveaway</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>About</span>
            </Link>
            <Link
              href="/solutions"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>Solutions</span>
              <ChevronDown className="h-4 w-4" />
            </Link>
          
            <div className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer">
              <span>Learn</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <Link
              href="/crypto-recovery"
              className="flex items-center space-x-1 text-white hover:text-gray-300 cursor-pointer"
            >
              <span>Crypto Recovery</span>
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
            <a href="#" className="text-white hover:text-gray-300">
              Airdrop
            </a>
          </nav>

          {/* Desktop Connect Wallet Button */}
          <div className="hidden md:flex flex-shrink-0 z-20">
            <appkit-button />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4 z-20">
            <appkit-button size="sm" />
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
              <Link
                href="/giveaway"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>250K Giveaway</span>
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>About</span>
              </Link>
              <Link
                href="/solutions"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Solutions</span>
              </Link>
              <a
                href="#"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <div className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer">
                <span>Learn</span>
              </div>
              <Link
                href="/crypto-recovery"
                className="block px-3 py-2 text-white hover:text-gray-300 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Crypto Recovery</span>
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <a
                href="#"
                className="block px-3 py-2 text-white hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Airdrop
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
