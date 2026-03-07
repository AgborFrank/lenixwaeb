"use client";

import { Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CompanyOverview() {
  const t = useTranslations("About.Overview");
  const [activeTab, setActiveTab] = useState<"forensics" | "finance">("forensics");

  return (
    <section className="bg-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {t("badge")}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex border-b border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab("forensics")}
            className={`flex-1 md:flex-none px-8 py-4 font-semibold transition-colors ${
              activeTab === "forensics"
                ? "text-yellow-400 border-b-2 border-yellow-400 -mb-px"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
            
              {t("forensics.title")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("finance")}
            className={`flex-1 md:flex-none px-8 py-4 font-semibold transition-colors ${
              activeTab === "finance"
                ? "text-yellow-400 border-b-2 border-yellow-400 -mb-px"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              
              {t("finance.title")}
            </span>
          </button>
        </div>
      </div>

      {/* Content - Full width split */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-0 md:gap-16 items-center">
          {/* Image - shows for active tab */}
          <div className="relative aspect-video md:aspect-[4/5] rounded-2xl overflow-hidden mb-8 md:mb-0">
            <Image
              src="/assets/img/investigate.webp"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />
          </div>

          {/* Content panel */}
          <div className="space-y-8">
            {activeTab === "forensics" && (
              <div>
                <p className="text-yellow-400 font-semibold text-2xl md:text-6xl tracking-tighter mb-2">
                  {t("forensics.subtitle")}
                </p>
                <p className="text-white text-lg leading-relaxed mb-8">
                  {t("forensics.description")}
                </p>
                <ul className="space-y-4">
                  {[
                    t("forensics.points.recovery"),
                    t("forensics.points.threat"),
                    t("forensics.points.audits"),
                  ].map((point) => (
                    <li key={point} className="flex gap-4 text-gray-300">
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-yellow-400 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "finance" && (
              <div>
                <p className="text-yellow-400 font-semibold text-2xl md:text-6xl tracking-tighter mb-2">
                  {t("finance.subtitle")}
                </p>
                <p className="text-white text-lg leading-relaxed mb-8">
                  {t("finance.description")}
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    t("finance.points.approval"),
                    t("finance.points.credit"),
                    t("finance.points.vaults"),
                  ].map((point) => (
                    <li key={point} className="flex gap-4 text-gray-300">
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-yellow-400 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/crypto-loan"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg transition-colors"
                >
                  {t("finance.cta")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
