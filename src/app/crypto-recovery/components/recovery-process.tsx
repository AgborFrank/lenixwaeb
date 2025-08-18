import { Search, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";

export default function RecoveryProcess() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Road to
            <span className="text-yellow-400"> Recovery</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Our proven 4-step process has helped thousands recover their lost
            crypto assets. We're with you every step of the way.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-700 h-full hidden lg:block"></div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4 lg:justify-end">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Initial Assessment
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    We begin with a comprehensive analysis of your situation.
                    Our experts evaluate the type of loss, blockchain traces,
                    and recovery possibilities. This critical first step
                    determines our approach and success probability.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Blockchain Analysis
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Risk Assessment
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">1</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Recovery Assessment Interface
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 lg:pr-12 order-2 lg:order-1">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Security Protocol Setup</p>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">2</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-2">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Security Protocol
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    We establish secure communication channels and implement
                    advanced security measures. Your case is assigned to a
                    dedicated recovery specialist with access to cutting-edge
                    forensic tools.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Encrypted Channels
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Dedicated Specialist
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4 lg:justify-end">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Active Recovery
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Our team works around the clock using advanced blockchain
                    forensics, legal channels, and recovery techniques. We
                    track, trace, and negotiate to recover your assets while
                    keeping you updated.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 lg:justify-end">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      24/7 Monitoring
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Legal Support
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">3</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Recovery Operations Dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2 lg:pr-12 order-2 lg:order-1">
                {/* Image placeholder */}
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Asset Recovery Complete</p>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-black hidden lg:flex items-center justify-center">
                <span className="text-black font-bold text-sm">4</span>
              </div>

              <div className="lg:w-1/2 lg:pl-12 order-1 lg:order-2">
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Asset Return
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Once recovered, your assets are securely transferred back to
                    your wallet. We provide detailed documentation and ongoing
                    security recommendations to prevent future losses.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Secure Transfer
                    </span>
                    <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      Documentation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-2 mx-auto text-lg">
            Start Your Recovery Journey
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
