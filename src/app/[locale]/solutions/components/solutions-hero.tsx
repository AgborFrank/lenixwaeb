"use client";

import { Shield, Globe, CreditCard, Lock } from "lucide-react";

export default function SolutionsHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Complete
              <br />
              <span className="text-yellow-400">Crypto Solutions</span>
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              From recovery to security, lending to cross-border payments -
              Lenix Protocol provides comprehensive solutions for the modern
              crypto ecosystem.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Crypto Recovery */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Crypto Recovery
              </h3>
              <p className="text-gray-400 text-sm">
                Recover lost or stolen crypto assets with our advanced recovery
                protocols
              </p>
            </div>

            {/* Cross Border Payments */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <Globe className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Cross Border Payments
              </h3>
              <p className="text-gray-400 text-sm">
                Send payments globally using crypto with instant fiat conversion
              </p>
            </div>

            {/* Crypto Lending */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <CreditCard className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Crypto Lending
              </h3>
              <p className="text-gray-400 text-sm">
                Borrow against your crypto assets with competitive rates and
                flexible terms
              </p>
            </div>

            {/* Crypto Security */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <Lock className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Crypto Security
              </h3>
              <p className="text-gray-400 text-sm">
                Multi-layered security protocols to protect your digital assets
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
              Explore Solutions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
