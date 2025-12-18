import { ArrowRight, Shield, Globe, Users, Zap } from "lucide-react";
import { textStyles } from "@/lib/fonts";

export default function CompanyOverview() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          {/* Left side - Company Interface mockup */}
          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              {/* Header with Bitnovatus logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-6 bg-yellow-400 rounded"></div>
                <span className="text-gray-400 text-sm font-onest">
                  Bitnovatus
                </span>
              </div>

              {/* Title */}
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm mb-2 font-onest">
                  Company Dashboard
                </h3>
                <h2 className="text-yellow-400 text-2xl font-bold font-onest">
                  Global Operations
                </h2>
              </div>

              {/* Global Stats */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium font-onest">
                      Active Users
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-onest">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-onest">
                        North America
                      </span>
                      <span className="text-white font-semibold font-onest">
                        15,234
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-onest">
                        Europe
                      </span>
                      <span className="text-white font-semibold font-onest">
                        18,567
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-onest">
                        Asia Pacific
                      </span>
                      <span className="text-white font-semibold font-onest">
                        12,891
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-onest">
                        Other Regions
                      </span>
                      <span className="text-white font-semibold font-onest">
                        3,308
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mb-8">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-onest">
                      Platform Uptime
                    </span>
                    <span className="text-yellow-400 text-sm font-onest">
                      99.9%
                    </span>
                  </div>
                  <div className="bg-gray-600 rounded-full h-3 mb-4">
                    <div
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: "99.9%" }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold font-onest">
                        $1.2B
                      </div>
                      <div className="text-gray-400 font-onest">
                        Total Volume
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-bold font-onest">
                        2.1M
                      </div>
                      <div className="text-gray-400 font-onest">
                        Transactions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-yellow-400 text-black font-semibold py-4 rounded-lg hover:bg-yellow-300 transition-colors font-onest">
                  View Live Dashboard
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors font-onest">
                  Download Report
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-yellow-400 text-lg font-medium mb-4 font-onest">
                About Bitnovatus
              </h3>
              <h2 className={`${textStyles.hero} text-white `}>
                Revolutionizing global finance through innovative blockchain
                technology.
              </h2>
            </div>

            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p className={textStyles.body}>
                Founded in 2023, Bitnovatus is growing from a small startup
                to a global leader in crypto-to-fiat payment solutions. Our
                mission is to bridge the gap between traditional banking and the
                decentralized future.
              </p>
              <p className={textStyles.body}>
                We&apos;ve built a comprehensive platform that serves users in
                over 200 countries, processing billions in transactions while
                maintaining the highest security standards in the industry.
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Military-grade security protocols
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Global regulatory compliance
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  24/7 customer support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300 font-onest">
                  Instant transaction processing
                </span>
              </div>
            </div>

            <button
              className={`${textStyles.button} bg-yellow-400 w-fit text-black px-8 py-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center gap-2`}
            >
              Explore Our Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
