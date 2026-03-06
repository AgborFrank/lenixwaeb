"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Globe, Shield, Award, Zap } from "lucide-react";

export default function CompanyStats() {
  const [counts, setCounts] = useState({
    users: 0,
    countries: 0,
    volume: 0,
    transactions: 0,
    uptime: 0,
    team: 0,
  });

  useEffect(() => {
    const targetCounts = {
      users: 50000,
      countries: 200,
      volume: 1200,
      transactions: 2100000,
      uptime: 99.9,
      team: 50,
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
        volume: Math.floor(targetCounts.volume * progress),
        transactions: Math.floor(targetCounts.transactions * progress),
        uptime: Math.round(targetCounts.uptime * progress * 10) / 10,
        team: Math.floor(targetCounts.team * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepValue);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-r from-gray-900 to-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Our Impact
            <span className="text-yellow-400"> By The Numbers</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Real metrics that demonstrate our commitment to building the future
            of global finance and serving our community worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Active Users */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
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
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.users.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">Happy customers worldwide</p>
            </div>
          </div>

          {/* Countries Served */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
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
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.countries}+
              </div>
              <p className="text-gray-300 text-sm">International presence</p>
            </div>
          </div>

          {/* Transaction Volume */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Transaction Volume
                </h3>
                <p className="text-gray-400 text-sm">Total processed</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                ${counts.volume}M+
              </div>
              <p className="text-gray-300 text-sm">In transaction volume</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Total Transactions
                </h3>
                <p className="text-gray-400 text-sm">Successful operations</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.transactions.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">Processed securely</p>
            </div>
          </div>

          {/* Platform Uptime */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Platform Uptime
                </h3>
                <p className="text-gray-400 text-sm">Reliability guarantee</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.uptime}%
              </div>
              <p className="text-gray-300 text-sm">Consistent availability</p>
            </div>
          </div>

          {/* Team Size */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Expert Team
                </h3>
                <p className="text-gray-400 text-sm">Global professionals</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.team}+
              </div>
              <p className="text-gray-300 text-sm">Industry experts</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">15+</div>
            <div className="text-gray-400">Years Combined Experience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Regulatory Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">5</div>
            <div className="text-gray-400">Global Offices</div>
          </div>
        </div>
      </div>
    </section>
  );
}
