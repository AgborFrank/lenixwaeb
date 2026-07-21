"use client";

import { Wallet, TrendingUp, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

const STEP_KEYS = ["wallet", "apply", "draw"] as const;
const STEP_ICONS = [Wallet, CheckCircle, TrendingUp] as const;

export default function FinanceSteps() {
  const t = useTranslations("FinancePage.Steps");

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t("title")}</h2>
          <p className="text-gray-400 max-w-xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

          {STEP_KEYS.map((key, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div key={key} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(250,204,21,0.1)] group-hover:shadow-[0_0_50px_rgba(250,204,21,0.2)]">
                  <div className="absolute inset-0 bg-yellow-400/5 rounded-2xl" />
                  <Icon className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t(`steps.${key}.title`)}</h3>
                <p className="text-gray-400 leading-relaxed max-w-xs">{t(`steps.${key}.description`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
