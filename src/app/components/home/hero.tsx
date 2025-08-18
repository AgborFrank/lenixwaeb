"use client";

import { X, Send, FileText, Star } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight z-20">
                Cross-border
                <br />
                Payments
                <br />
                <span className="text-yellow-400">Reinvented</span>
              </h1>

              <div className="space-y-2 text-gray-300 text-lg max-w-lg">
                <p>
                  Lenix Protocol enables users to pay fiat into any bank account
                  around the world using crypto, by just simply connecting your
                  wallet.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Welcome to the PayFi revolution!
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Star className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Right Widget */}
          <div className="lg:justify-self-end z-20">
            <div className="bg-black/30 border-2 border-yellow-400 rounded-2xl p-6 max-w-md w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-1">Buy Now</h3>
                <p className="text-yellow-400 text-lg font-semibold">
                  Before Price Rises
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: "71%" }}
                  />
                </div>
                <p className="text-yellow-400 text-sm font-semibold">$1,424k</p>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">USD RAISED SO FAR :</span>
                  <span className="text-white font-semibold">
                    $20,082,383.56
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tokens Sold :</span>
                  <span className="text-white font-semibold">
                    606,708,741.52
                  </span>
                </div>
              </div>

              {/* Price Info */}
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-white">1 $LNX = $0.0944</span>
                <span className="text-green-400">Next Price: $0.0969</span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  <div className="w-4 h-4 bg-blue-400 rounded-full" />
                  ETH
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  <div className="w-4 h-4 bg-green-400 rounded-full" />
                  USDT
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  <div className="w-4 h-4 bg-blue-300 rounded-sm" />
                  CARD
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">ETH you pay</span>
                  <span className="text-yellow-400 text-sm">
                    $LNX you receive
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <div className="w-6 h-6 bg-blue-400 rounded-full mr-2" />
                    <input
                      type="text"
                      placeholder="0"
                      className="bg-transparent text-white outline-none flex-1"
                    />
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full mr-2" />
                    <input
                      type="text"
                      placeholder="0"
                      className="bg-transparent text-white outline-none flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors mb-4">
                Connect wallet & Pay
              </button>

              {/* Giveaway */}
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <span className="text-white font-semibold">
                  $250,000 Giveaway
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
