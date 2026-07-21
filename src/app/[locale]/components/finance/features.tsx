"use client";

import { Landmark, Shield, Repeat } from "lucide-react";
import { useTranslations } from "next-intl";

const FEATURE_KEYS = ["collateral", "ltv", "liquidity"] as const;
const FEATURE_ICONS = [Landmark, Shield, Repeat] as const;
const FEATURE_STYLES = [
  { iconWrap: "bg-yellow-400/10 border-yellow-400/20 group-hover:bg-yellow-400/20", icon: "text-yellow-400", hover: "hover:border-yellow-400/50" },
  { iconWrap: "bg-white/10 border-white/20 group-hover:bg-white/20", icon: "text-white", hover: "hover:border-white/50" },
  { iconWrap: "bg-yellow-400/10 border-yellow-400/20 group-hover:bg-yellow-400/20", icon: "text-yellow-400", hover: "hover:border-yellow-400/50" },
] as const;

export default function FinanceFeatures() {
  const t = useTranslations("FinancePage.Features");

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURE_KEYS.map((key, i) => {
            const Icon = FEATURE_ICONS[i];
            const style = FEATURE_STYLES[i];
            return (
              <div
                key={key}
                className={`p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 ${style.hover} transition-all duration-300 group`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors border ${style.iconWrap}`}
                >
                  <Icon className={`w-7 h-7 ${style.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t(`cards.${key}.title`)}</h3>
                <p className="text-gray-400 leading-relaxed">{t(`cards.${key}.desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
