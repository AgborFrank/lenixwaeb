"use client";

import { Lock, Star } from "lucide-react";
import { useTranslations } from "next-intl";

const EVENT_KEYS = ["lnx", "nft", "partner"] as const;

const EVENT_ICONS = {
  lnx: Lock,
  nft: Star,
  partner: Lock,
} as const;

export default function AirdropUpcoming() {
  const t = useTranslations("Airdrop.Upcoming");

  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t("title1")} <span className="text-yellow-400">{t("title2")}</span>
          </h2>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {EVENT_KEYS.map((key) => {
            const Icon = EVENT_ICONS[key];
            return (
              <div
                key={key}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)",
                    backgroundPosition: "0 0, 10px 10px",
                    backgroundSize: "20px 20px",
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                      <Icon className="w-6 h-6 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {t(`events.${key}.status`)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                    {t(`events.${key}.title`)}
                  </h3>
                  <p className="text-gray-500 mb-6 flex-grow">{t(`events.${key}.description`)}</p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-gray-600 font-medium mb-1">{t("estDate")}</div>
                      <div className="text-white font-mono">{t(`events.${key}.date`)}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-600 font-medium mb-1">{t("reward")}</div>
                      <div className="text-yellow-400 font-bold">{t(`events.${key}.reward`)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
