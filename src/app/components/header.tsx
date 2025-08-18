"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full bg-black ">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 z-20">
            <h1 className="text-2xl font-bold text-white">Lenix</h1>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 z-20">
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
            <a href="#" className="text-white hover:text-gray-300">
              Blog
            </a>
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
