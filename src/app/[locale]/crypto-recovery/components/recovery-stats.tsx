"use client";

import { glass } from "@/lib/recovery-styles";

const stats = [
  { value: "$850M+", label: "Assets traced and monitored" },
  { value: "15k+", label: "Cases reviewed" },
  { value: "40+", label: "Jurisdictions covered" },
  { value: "24/7", label: "Incident intake" },
];

export default function RecoveryStats() {
  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ value, label }) => (
            <article key={label} className={`${glass.panel} rounded-xl p-6 text-center`}>
              <p className="text-2xl sm:text-3xl font-semibold text-white mb-2">{value}</p>
              <p className="text-xs sm:text-sm text-neutral-500 leading-snug">{label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
