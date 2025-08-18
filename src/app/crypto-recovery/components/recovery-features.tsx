import { Search, Shield, Zap, Globe, Lock, Users } from "lucide-react";

export default function RecoveryFeatures() {
  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Why Choose Our
            <span className="text-yellow-400"> Recovery Service</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            We combine cutting-edge technology with years of expertise to
            provide the most effective crypto recovery service in the industry.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-16">
          {/* Feature 1 - Left Image, Right Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Search className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">
                    Advanced Blockchain Forensics
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Search className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Advanced Technology
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Cutting-Edge Blockchain Forensics
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our proprietary blockchain analysis tools can trace transactions
                across multiple chains, identify patterns, and locate lost
                assets even when they've been moved through complex networks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Multi-chain transaction tracking
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Advanced pattern recognition
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Real-time blockchain monitoring
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 - Right Image, Left Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Shield className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Expert Team
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                World-Class Recovery Specialists
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our team consists of former law enforcement, cybersecurity
                experts, and blockchain analysts with decades of combined
                experience in digital asset recovery and investigation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Former law enforcement officers
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Certified cybersecurity experts
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Blockchain forensic specialists
                </li>
              </ul>
            </div>
            <div>
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">Expert Recovery Team</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Left Image, Right Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">Global Legal Network</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Global Reach
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Worldwide Legal Network
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                We have established partnerships with legal professionals and
                law enforcement agencies worldwide, enabling us to pursue
                recovery across international jurisdictions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  International legal partnerships
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Cross-border asset recovery
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Multi-jurisdiction expertise
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 4 - Right Image, Left Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-2 w-fit">
                <Lock className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">
                  Security First
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Military-Grade Security
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Your privacy and security are our top priorities. We use
                enterprise-grade encryption and secure communication channels to
                protect your sensitive information throughout the recovery
                process.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  End-to-end encryption
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Secure communication channels
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Confidentiality guaranteed
                </li>
              </ul>
            </div>
            <div>
              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                  <p className="text-gray-400 text-lg">
                    Secure Recovery Process
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
