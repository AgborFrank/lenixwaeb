"use client";

import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

const STATS = [
  { value: "$850M+", label: "traced" },
  { value: "15k+", label: "cases" },
  { value: "40+", label: "jurisdictions" },
  { value: "24/7", label: "intake" },
] as const;

export default function RecoveryStats() {
  const t = useTranslations("CryptoRecovery.Stats");

  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map(({ value, label }) => (
            <article key={label} className={`${glass.panel} rounded-xl p-6 text-center`}>
              <p className="text-2xl sm:text-3xl font-semibold text-white mb-2">{value}</p>
              <p className="text-xs sm:text-sm text-neutral-500 leading-snug">{t(label)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
