"use client";

import { Shield, Zap, ArrowRight, LineChart, Lock, Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("About.Hero");
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
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-14 mb-8">
              {t("title")}
              <span className="block text-yellow-400">
                {t("span1")}
              </span>
              & <span className="text-yellow-400">{t("span2")}</span>
            </h1>
            <p className="text-gray-300 text-base lg:text-xl mb-10 leading-relaxed max-w-xl">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-bold">{t("stats.assets_count")}</div>
                  <div className="text-gray-400 text-sm">{t("stats.assets_traced")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-bold">{t("stats.credit_count")}</div>
                  <div className="text-gray-400 text-sm">{t("stats.credit_checks")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-bold">{t("stats.jurisdictions_count")}</div>
                  <div className="text-gray-400 text-sm">{t("stats.jurisdictions")}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Image */}
          <div className="lg:justify-self-end z-20 w-full max-w-md lg:max-w-full hidden md:block">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative aspect-[4/3]">
              <Image
                src="/assets/img/BringDeFiIntelligence.webp"
                alt="Blockchain Intelligence and Forensics"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
