import { ArrowRight, Shield, Search, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";

export default function CryptoRecovery() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          {/* Left side - Recovery Interface mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              {/* Header with Recovery logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                <span className="text-gray-400 text-sm font-onest">
                  Bitnovatus Recovery
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm mb-2 font-onest">
                  Asset Recovery
                </h3>
                <h2 className="text-yellow-400 text-2xl font-bold font-onest">
                  Lost Crypto Recovery
                </h2>
              </div>

              {/* Recovery Status */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium font-onest">
                      Recovery Status
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-onest">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        Address verification complete
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        Blockchain analysis in progress
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm font-onest">
                        Recovery protocol initiated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm font-onest">
                    Recovery Progress
                  </span>
                  <span className="text-yellow-400 text-sm font-onest">
                    65%
                  </span>
                </div>
                <div className="bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              {/* Estimated Recovery */}
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-onest">
                      Estimated Recovery
                    </span>
                    <span className="text-white font-bold font-onest">
                      2.5 BTC
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-400 text-lg font-onest font-bold">
                      ~$87,500 USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-lg hover:bg-yellow-300 transition-colors font-onest">
                  Track Recovery
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors font-onest">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-yellow-400 text-lg font-medium mb-4 font-onest">
                Crypto Recovery
              </h3>
              <h2 className={`${textStyles.hero} text-white max-w-[700px]`}>
                Recover lost or stolen crypto assets with advanced blockchain
                forensics.
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className={textStyles.body}>
                Our advanced recovery protocols use cutting-edge blockchain
                analysis and forensic techniques to trace and recover lost
                digital assets.
              </p>
              <p className={textStyles.body}>
                With a success rate of over 85%, we&apos;ve helped thousands of
                users recover their crypto investments.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Advanced blockchain forensics
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Multi-chain recovery support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  24/7 recovery monitoring
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  85%+ success rate
                </span>
              </div>
            </div>

            <Link
              href="/recovery"
              className={`${textStyles.button} bg-yellow-400 w-fit text-black px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2`}
            >
              Start Recovery
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
