"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Globe, Shield, Award, Zap } from "lucide-react";

export default function MilestonesSection() {
  const [counts, setCounts] = useState({
    users: 0,
    countries: 0,
    transactions: 0,
    recovered: 0,
    awards: 0,
    uptime: 0,
  });

  useEffect(() => {
    const targetCounts = {
      users: 50000,
      countries: 200,
      transactions: 1000000,
      recovered: 850,
      awards: 15,
      uptime: 99.9,
    };

    const duration = 2000;
    const steps = 60;
    const stepValue = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        users: Math.floor(targetCounts.users * progress),
        countries: Math.floor(targetCounts.countries * progress),
        transactions: Math.floor(targetCounts.transactions * progress),
        recovered: Math.floor(targetCounts.recovered * progress),
        awards: Math.floor(targetCounts.awards * progress),
        uptime: Math.round(targetCounts.uptime * progress * 10) / 10,
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepValue);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Achievements
            <span className="text-yellow-400"> Speak for Themselves</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            From humble beginnings to industry leadership, these milestones
            represent our commitment to excellence and innovation.
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Users */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Active Users
                </h3>
                <p className="text-gray-400 text-sm">Global community</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                {counts.users.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">Happy customers worldwide</p>
            </div>
          </div>

          {/* Countries */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Countries Served
                </h3>
                <p className="text-gray-400 text-sm">Global reach</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                {counts.countries}+
              </div>
              <p className="text-gray-300 text-sm">International presence</p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Transactions
                </h3>
                <p className="text-gray-400 text-sm">Processed securely</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                {counts.transactions.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">Successful operations</p>
            </div>
          </div>

          {/* Assets Recovered */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Assets Recovered
                </h3>
                <p className="text-gray-400 text-sm">Millions in value</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                ${counts.recovered}M+
              </div>
              <p className="text-gray-300 text-sm">Recovered for users</p>
            </div>
          </div>

          {/* Awards */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Industry Awards
                </h3>
                <p className="text-gray-400 text-sm">Recognition earned</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                {counts.awards}+
              </div>
              <p className="text-gray-300 text-sm">Awards and recognition</p>
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Platform Uptime
                </h3>
                <p className="text-gray-400 text-sm">Reliability guarantee</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400">
                {counts.uptime}%
              </div>
              <p className="text-gray-300 text-sm">Consistent availability</p>
            </div>
          </div>
        </div>

        {/* Key Achievements Timeline */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Key Achievements Timeline
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2019</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Company Founded</h4>
              <p className="text-gray-400 text-sm">
                Started with a vision to democratize finance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2020</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                First Product Launch
              </h4>
              <p className="text-gray-400 text-sm">
                Cross-border payments platform launched
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2022</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Series A Funding
              </h4>
              <p className="text-gray-400 text-sm">
                $50M raised to scale operations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-xl">2024</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Industry Leader</h4>
              <p className="text-gray-400 text-sm">
                Recognized as top crypto platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
