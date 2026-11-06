"use client";

import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const STATS = [
  { id: "traced", valueKey: "traced_value" },
  { id: "cases", valueKey: "cases_value" },
  { id: "jurisdictions", value: "40+" },
  { id: "intake", value: "24/7" },
] as const;

export default function RecoveryStats() {
  const t = useTranslations("CryptoRecovery.Stats");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat) => (
            <article key={stat.id} className={`${glass.panel} rounded-xl p-6 text-center`}>
              <p className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                {"value" in stat ? stat.value : t(stat.valueKey)}
              </p>
              <p className="text-xs sm:text-sm text-neutral-500 leading-snug">{t(stat.id)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
