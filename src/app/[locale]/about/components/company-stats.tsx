"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Globe, Shield, Award, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CompanyStats() {
  const t = useTranslations("About.Stats");
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
            {t("title1")}
            <span className="text-yellow-400">{t("title2")}</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Active Users */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.cases.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.cases.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.users.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">{t("cards.cases.desc")}</p>
            </div>
          </div>

          {/* Countries Served */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.jurisdictions.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.jurisdictions.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.countries}+
              </div>
              <p className="text-gray-300 text-sm">{t("cards.jurisdictions.desc")}</p>
            </div>
          </div>

          {/* Transaction Volume */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.assets.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.assets.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                ${counts.volume}M+
              </div>
              <p className="text-gray-300 text-sm">{t("cards.assets.desc")}</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.loans.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.loans.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.transactions.toLocaleString()}+
              </div>
              <p className="text-gray-300 text-sm">{t("cards.loans.desc")}</p>
            </div>
          </div>

          {/* Platform Uptime */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.uptime.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.uptime.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.uptime}%
              </div>
              <p className="text-gray-300 text-sm">
                {t("cards.uptime.desc")}
              </p>
            </div>
          </div>

          {/* Team Size */}
          <div className="bg-black rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {t("cards.team.title")}
                </h3>
                <p className="text-gray-400 text-sm">{t("cards.team.subtitle")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                {counts.team}+
              </div>
              <p className="text-gray-300 text-sm">{t("cards.team.desc")}</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 lg:gap-16 pt-12 border-t border-black">
          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold no-wrap">
              {t("footer.support")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold no-wrap">
              {t("footer.experience")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold no-wrap">
              {t("footer.compliant")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-bold no-wrap">
              {t("footer.offices")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
