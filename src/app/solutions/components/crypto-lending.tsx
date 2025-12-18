import {
  ArrowRight,
  CreditCard,
  Percent,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";

export default function CryptoLending() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          {/* Left side - Lending Interface mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              {/* Header with Lending logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                <span className="text-gray-400 text-sm font-onest">
                  Bitnovatus Lend
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm mb-2 font-onest">
                  Crypto Lending
                </h3>
                <h2 className="text-yellow-400 text-2xl font-bold font-onest">
                  Borrow Against Crypto
                </h2>
              </div>

              {/* Collateral Selection */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm block mb-2 font-onest">
                  Collateral Asset
                </label>
                <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ₿
                    </div>
                    <div>
                      <span className="text-white font-medium font-onest">
                        Bitcoin (BTC)
                      </span>
                      <p className="text-gray-400 text-xs">
                        Available: 2.5 BTC
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-400 text-sm font-onest">
                      $87,500
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Amount */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm block mb-2 font-onest">
                  Loan Amount
                </label>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium font-onest">
                      USDC
                    </span>
                    <span className="text-gray-400 font-onest">
                      Max: $43,750
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="0"
                      className="bg-transparent text-white text-lg font-bold outline-none flex-1"
                    />
                    <span className="text-yellow-400 text-sm font-onest">
                      USDC
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Terms */}
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-onest">
                      Interest Rate
                    </span>
                    <span className="text-green-400 font-onest">5.2% APY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-onest">
                      Liquidation Threshold
                    </span>
                    <span className="text-yellow-400 font-onest">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-onest">
                      Collateral Ratio
                    </span>
                    <span className="text-white font-onest">200%</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-lg hover:bg-yellow-300 transition-colors font-onest">
                  Connect wallet & Borrow
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors font-onest">
                  View Terms
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-yellow-400 text-lg font-medium mb-4 font-onest">
                Crypto Lending
              </h3>
              <h2 className={`${textStyles.hero} text-white max-w-[700px]`}>
                Borrow against your crypto assets with competitive rates and
                flexible terms.
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className={textStyles.body}>
                Unlock the value of your crypto holdings without selling. Borrow
                USDC or other stablecoins against your digital assets with
                transparent terms.
              </p>
              <p className={textStyles.body}>
                Enjoy competitive interest rates starting from 3.5% APY with no
                credit checks or lengthy approval processes.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  No credit checks required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Percent className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Rates from 3.5% APY
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Over-collateralized loans
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Keep your crypto upside
                </span>
              </div>
            </div>

            <Link
              href="/lending"
              className={`${textStyles.button} bg-yellow-400 w-fit text-black px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2`}
            >
              Start Lending
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
