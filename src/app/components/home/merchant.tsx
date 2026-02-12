import { Check } from "lucide-react";
import Link from "next/link";

export default function Merchant() {
  return (
    <section className="bg-accept bg-black py-20 px-6" >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interface mockup */}
          <div className="relative">
            <div className="bg-black rounded-2xl p-6 border border-gray-800 max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-yellow-400 font-semibold">
                  Invoice Payment Alert From B Shaw
                </h3>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">
                  PAYMENT REQUEST
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    VERIFIED PAYMENT LINK
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <div className="text-green-400 text-4xl font-bold mb-1">
                  $84.99
                </div>
                <div className="text-gray-300 text-lg">85 USDT</div>
              </div>

              {/* Transaction details */}
              <div className="mb-6">
                <div className="text-xs text-gray-400 mb-2">
                  TRANSACTION RECEIPT WILL BE SENT TO{" "}
                  <span className="text-yellow-400">brad@alphacorp.com</span>
                </div>
                <div className="text-sm text-gray-400 mb-2">Wallet address</div>
                <div className="bg-gray-800 rounded-lg p-3 text-gray-300 font-mono text-sm">
                  0xC7f5***95dD1727b54E
                </div>
              </div>

              {/* Order breakdown */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-3">ORDER</div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-yellow-400 font-bold text-lg">
                      $84.99
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center justify-center">
                    <div className="text-yellow-400 text-sm font-bold">+</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-green-400 font-bold">$0.18</div>
                    <div className="text-xs text-gray-400">GAS FEE</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-white font-bold">$85.17</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button className="bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg flex-1 hover:bg-yellow-300 transition-colors">
                  Complete payment
                </button>
                <button className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg flex-1 hover:bg-gray-700 transition-colors">
                  Pay Manually
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-8 leading-tight font-onest">
              For businesses: accept crypto, <span className="text-yellow-400">protect</span> in vault, recover if needed.
            </h2>

            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
                  Accept crypto and settle in fiat. Straightforward checkout and API for merchants.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
                  Hold proceeds in our secure vault with multi-sig and custody—audited infrastructure.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
                  If funds are lost or stolen, our team can help trace and reclaim through recovery and legal channels.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
                  <Link href="/solutions" className="text-yellow-400 hover:underline">Explore solutions</Link> or <Link href="/crypto-recovery" className="text-yellow-400 hover:underline">start a recovery case</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
