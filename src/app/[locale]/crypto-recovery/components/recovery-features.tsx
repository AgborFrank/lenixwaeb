"use client";

import { glass } from "@/lib/recovery-styles";

const features = [
  {
    title: "Forensic tracing",
    description:
      "On-chain analysis across mixers, bridges, and nested wallet structures to follow fund movement.",
  },
  {
    title: "Investigator-led cases",
    description:
      "Former intelligence, cybersecurity, and compliance specialists assigned to each engagement.",
  },
  {
    title: "Global legal network",
    description:
      "Coordination with law enforcement and counsel across major jurisdictions and exchange partners.",
  },
  {
    title: "Confidential handling",
    description:
      "Encrypted intake, segregated case files, and strict access controls for sensitive materials.",
  },
  {
    title: "Court-ready documentation",
    description:
      "Evidence packages formatted for regulatory submissions, civil proceedings, and police reports.",
  },
  {
    title: "Outcome-aligned fees",
    description:
      "Recovery fees tied to successful returns — terms are confirmed before investigative work begins.",
  },
];

export default function RecoveryFeatures() {
  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>Capabilities</p>
          <h2 className={glass.titleCenter}>Why clients choose Lenix recovery</h2>
          <p className={`${glass.leadCenter} mt-4`}>
            Technology and investigator experience combined for cases where time and evidence quality
            matter.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <article key={feature.title} className={`${glass.cardHover} ${glass.cardBody}`}>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
