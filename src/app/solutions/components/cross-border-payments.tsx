import { ArrowRight, Globe, Zap, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";

export default function CrossBorderPayments() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          {/* Left side - Payment Interface mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              {/* Header with Payment logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                <span className="text-gray-400 text-sm font-onest">
                  BitnovatusPay
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm mb-2 font-onest">
                  Cross-Border Payment
                </h3>
                <h2 className="text-yellow-400 text-2xl font-bold font-onest">
                  Send to Bank Account
                </h2>
              </div>

              {/* Recipient Details */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm block mb-2 font-onest">
                  Recipient Bank Details
                </label>
                <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-white font-roboto-mono">
                      GB29 NWBK 6016 1331 9268 19
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      Barclays Bank, London
                    </p>
                  </div>
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Amount section */}
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ₿
                      </div>
                      <span className="text-white font-medium font-onest">
                        BTC
                      </span>
                    </div>
                    <span className="text-gray-400 font-onest">GBP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white text-lg font-onest font-bold">
                      ~£2,500
                    </span>
                  </div>
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-onest">
                      Exchange Rate
                    </span>
                    <span className="text-yellow-400 font-onest">
                      1 BTC = £35,000
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-400 font-onest">Fee</span>
                    <span className="text-green-400 font-onest">£0.99</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-lg hover:bg-yellow-300 transition-colors font-onest">
                  Connect wallet & Pay
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors font-onest">
                  Save for Later
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-yellow-400 text-lg font-medium mb-4 font-onest">
                Cross-Border Payments
              </h3>
              <h2 className={`${textStyles.hero} text-white max-w-[700px]`}>
                Send payments globally using crypto with instant fiat
                conversion.
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className={textStyles.body}>
                BitnovatusPay enables seamless cross-border payments by converting
                crypto to fiat and delivering directly to any bank account
                worldwide.
              </p>
              <p className={textStyles.body}>
                Skip traditional banking delays and high fees. Send money
                globally in minutes, not days.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  200+ countries supported
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Instant fiat conversion
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Lowest fees in the industry
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Minutes, not days
                </span>
              </div>
            </div>

            <Link
              href="/payments"
              className={`${textStyles.button} bg-yellow-400 w-fit text-black px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2`}
            >
              Start Payment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
