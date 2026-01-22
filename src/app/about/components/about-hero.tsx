"use client";

import { Users, Globe, Shield, ArrowRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hero-grid-pattern" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 z-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight z-20">
                Building the Future of
                <br />
                <span className="text-yellow-400">Global Finance</span>
              </h1>

              <div className="space-y-2 text-gray-300 text-lg max-w-lg">
                <p>
                  We&apos;re not just another crypto company. We&apos;re a team
                  of innovators, builders, and visionaries creating the
                  infrastructure that will power the next generation of
                  financial services.
                </p>
                <p className="text-yellow-400 font-semibold">
                  Join us in revolutionizing how the world moves money.
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">50K+</div>
                <div className="text-gray-400 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">200+</div>
                <div className="text-gray-400 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">$1B+</div>
                <div className="text-gray-400 text-sm">Processed</div>
              </div>
            </div>
          </div>

          {/* Right Widget - Company Dashboard */}
          <div className="lg:justify-self-end z-20">
            <div className="bg-black/30 border-2 border-yellow-400 rounded-2xl p-6 max-w-md w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-bold mb-1">
                  Lenix Protocol
                </h3>
                <p className="text-yellow-400 text-lg font-semibold">
                  Company Overview
                </p>
              </div>

              {/* Company Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Founded:</span>
                  <span className="text-white font-semibold">2019</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Team Size:</span>
                  <span className="text-white font-semibold">50+ Experts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Headquarters:</span>
                  <span className="text-white font-semibold">
                    San Francisco
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Global Offices:</span>
                  <span className="text-white font-semibold">5 Locations</span>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">Our Mission</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  To democratize access to financial services through innovative
                  blockchain technology, making crypto practical, secure, and
                  accessible for everyone.
                </p>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-white text-xs font-semibold">
                    Security
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-white text-xs font-semibold">Global</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-white text-xs font-semibold">
                    Community
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ArrowRight className="w-4 h-4 text-black" />
                  </div>
                  <div className="text-white text-xs font-semibold">
                    Innovation
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-colors">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
