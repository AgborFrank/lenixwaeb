"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, Shield } from "lucide-react";

export default function RecoveryStats() {
  const [counts, setCounts] = useState({
    recovered: 0,
    clients: 0,
    value: 0,
    success: 0,
  });

  useEffect(() => {
    const targetCounts = {
      recovered: 2500000,
      clients: 15000,
      value: 850,
      success: 85,
    };

    const duration = 2000;
    const steps = 60;
    const stepValue = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        recovered: Math.floor(targetCounts.recovered * progress),
        clients: Math.floor(targetCounts.clients * progress),
        value: Math.floor(targetCounts.value * progress),
        success: Math.floor(targetCounts.success * progress),
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Recovery
            <span className="text-yellow-400"> By The Numbers</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto">
            Our track record speaks for itself. We've helped thousands of people
            recover their lost crypto assets with industry-leading success
            rates.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Recovered Assets */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Assets Recovered
                </h3>
                <p className="text-gray-400 text-sm">Total crypto recovered</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.recovered.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">BTC, ETH, USDT & more</p>
            </div>
          </div>

          {/* Happy Clients */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Happy Clients
                </h3>
                <p className="text-gray-400 text-sm">Successful recoveries</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.clients.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">Worldwide customers</p>
            </div>
          </div>

          {/* Value Recovered */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Value Recovered
                </h3>
                <p className="text-gray-400 text-sm">Total USD value</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                ${counts.value}M+
              </div>
              <p className="text-gray-300 text-sm">In recovered assets</p>
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Success Rate
                </h3>
                <p className="text-gray-400 text-sm">Recovery success</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.success}%
              </div>
              <p className="text-gray-300 text-sm">Industry leading</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">24/7</div>
            <div className="text-gray-400">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">48hrs</div>
            <div className="text-gray-400">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Confidential</div>
          </div>
        </div>
      </div>
    </section>
  );
}
