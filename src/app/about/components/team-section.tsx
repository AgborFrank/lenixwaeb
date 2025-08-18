import { Linkedin, Twitter, Mail, Globe } from "lucide-react";

export default function TeamSection() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Meet the Team
            <span className="text-yellow-400"> Behind the Vision</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Our diverse team of experts brings together decades of experience in
            blockchain, finance, security, and user experience design.
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Leadership Team
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CEO */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="text-center">
                {/* Image placeholder */}
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">S</span>
                    </div>
                    <p className="text-gray-400 text-xs">CEO Photo</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Sarah Chen
                </h4>
                <p className="text-yellow-400 font-medium mb-3">
                  Chief Executive Officer
                </p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Former VP at Coinbase with 15+ years in fintech. Led the
                  development of multiple successful crypto platforms and has
                  been featured in Forbes.
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* CTO */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="text-center">
                {/* Image placeholder */}
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">M</span>
                    </div>
                    <p className="text-gray-400 text-xs">CTO Photo</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Michael Rodriguez
                </h4>
                <p className="text-yellow-400 font-medium mb-3">
                  Chief Technology Officer
                </p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Blockchain architect with experience at Ethereum Foundation.
                  Expert in smart contracts, DeFi protocols, and scalable
                  blockchain solutions.
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* CCO */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="text-center">
                {/* Image placeholder */}
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">L</span>
                    </div>
                    <p className="text-gray-400 text-xs">CCO Photo</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Lisa Thompson
                </h4>
                <p className="text-yellow-400 font-medium mb-3">
                  Chief Compliance Officer
                </p>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  Former SEC attorney with deep expertise in crypto regulations.
                  Ensures our platform meets global compliance standards.
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Heads */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Department Heads
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Engineering */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">D</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">David Kim</h4>
                <p className="text-yellow-400 text-sm mb-2">
                  Head of Engineering
                </p>
                <p className="text-gray-400 text-xs">
                  Former Google, 10+ years experience
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">A</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Alex Morgan
                </h4>
                <p className="text-yellow-400 text-sm mb-2">Head of Security</p>
                <p className="text-gray-400 text-xs">Ex-FBI Cyber Division</p>
              </div>
            </div>

            {/* Product */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">R</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Rachel Park
                </h4>
                <p className="text-yellow-400 text-sm mb-2">Head of Product</p>
                <p className="text-gray-400 text-xs">
                  Former Stripe, UX expert
                </p>
              </div>
            </div>

            {/* Operations */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">J</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">
                  James Wilson
                </h4>
                <p className="text-yellow-400 text-sm mb-2">
                  Head of Operations
                </p>
                <p className="text-gray-400 text-xs">
                  Former Amazon, scale expert
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">15+</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                200+
              </div>
              <div className="text-gray-400">Years Combined Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Global Support</div>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Team
            </h3>
            <p className="text-gray-300 mb-6">
              We're always looking for talented individuals who share our
              passion for revolutionizing finance through blockchain technology.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              View Open Positions
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
