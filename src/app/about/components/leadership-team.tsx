import { Linkedin, Twitter, Mail, Users, Award, Globe } from "lucide-react";

export default function LeadershipTeam() {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Meet Our
            <span className="text-yellow-400"> Leadership Team</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Our executive team brings together decades of experience in
            blockchain, finance, and technology to drive innovation and growth.
          </p>
        </div>

        {/* Leadership Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* CEO */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-black font-bold text-xl">S</span>
                  </div>
                  <p className="text-gray-400 text-xs">CEO Photo</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Sarah Chen</h4>
              <p className="text-yellow-400 font-medium mb-3">
                Chief Executive Officer
              </p>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Former VP at Coinbase with 15+ years in fintech. Led the
                development of multiple successful crypto platforms and has been
                featured in Forbes.
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

        {/* Join Us CTA */}
        <div className="text-center mt-16">
          <div className="bg rounded-2xl p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join Our Team
            </h3>
            <p className="text-gray-300 mb-6">
              We&apos;re always looking for talented individuals who share our
              passion for revolutionizing finance through blockchain technology.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto">
              View Open Positions
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
