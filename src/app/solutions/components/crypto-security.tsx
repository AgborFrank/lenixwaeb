import { ArrowRight, Lock, Shield, Eye, Key } from "lucide-react";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";

export default function CryptoSecurity() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          {/* Left side - Security Interface mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              {/* Header with Security logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                <span className="text-gray-400 text-sm font-onest">
                  Lenix Security
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm mb-2 font-onest">
                  Security Dashboard
                </h3>
                <h2 className="text-yellow-400 text-2xl font-bold font-onest">
                  Asset Protection
                </h2>
              </div>

              {/* Security Status */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium font-onest">
                      Security Status
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-onest">
                        Protected
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        Multi-sig wallet active
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        Cold storage enabled
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        24/7 monitoring active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Score */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-onest">
                    Security Score
                  </span>
                  <span className="text-yellow-400 text-sm font-onest">
                    98/100
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: "98%" }}
                  />
                </div>
              </div>

              {/* Protected Assets */}
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-onest">
                      Protected Assets
                    </span>
                    <span className="text-white font-bold font-onest">
                      $125,000
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-onest">BTC</span>
                      <span className="text-white font-onest">2.5 BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-onest">ETH</span>
                      <span className="text-white font-onest">15.2 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300 font-onest">USDC</span>
                      <span className="text-white font-onest">25,000 USDC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-lg hover:bg-yellow-300 transition-colors font-onest">
                  View Security Report
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors font-onest">
                  Configure Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-yellow-400 text-lg font-medium mb-4 font-onest">
                Crypto Security
              </h3>
              <h2 className={`${textStyles.hero} text-white max-w-[700px]`}>
                Multi-layered security protocols to protect your digital assets.
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className={textStyles.body}>
                Our comprehensive security suite combines advanced encryption,
                multi-signature technology, and real-time monitoring to keep
                your crypto assets safe.
              </p>
              <p className={textStyles.body}>
                With military-grade security protocols and insurance coverage,
                your digital wealth is protected against all threats.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Multi-signature wallets
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Cold storage integration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  24/7 threat monitoring
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Insurance coverage
                </span>
              </div>
            </div>

            <Link
              href="/security"
              className={`${textStyles.button} bg-yellow-400 w-fit text-black px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2`}
            >
              Secure Assets
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
