"use client";

import { Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function RecoveryHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Recovery Experts
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                When Crypto
                <br />
                <span className="text-yellow-400">Goes Missing</span>
                <br />
                <span className="text-3xl lg:text-4xl text-gray-300">
                  We Bring It Back
                </span>
              </h1>

              <div className="space-y-4 text-gray-300 text-lg max-w-lg">
                <p>
                  Lost your crypto to hacks, scams, or simple mistakes? Our
                  advanced recovery protocols have helped thousands recover
                  their digital assets.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Don't give up hope. Let's get your crypto back.
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">85% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">
                  No Recovery, No Fee
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-2 text-lg">
                Start Recovery Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-transparent border border-gray-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors">
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Right Side - Recovery Dashboard Preview */}
          <div className="lg:justify-self-end z-20">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">
                  Recovery Active
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Recent Recovery
                  </h3>
                  <div className="bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">
                        BTC Recovery
                      </span>
                      <span className="text-yellow-400 font-bold">2.5 BTC</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="text-green-400 text-xs mt-2">75% Complete</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-xl p-4 text-center">
                    <div className="text-yellow-400 text-2xl font-bold">
                      $87,500
                    </div>
                    <div className="text-gray-400 text-xs">Value Recovered</div>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-4 text-center">
                    <div className="text-green-400 text-2xl font-bold">
                      3 Days
                    </div>
                    <div className="text-gray-400 text-xs">Time Remaining</div>
                  </div>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm font-medium">
                    "Recovery in progress. We'll notify you of any updates."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
