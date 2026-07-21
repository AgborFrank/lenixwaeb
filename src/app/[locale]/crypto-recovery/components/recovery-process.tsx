"use client";

import { glass } from "@/lib/recovery-styles";

const steps = [
  {
    title: "Initial assessment",
    description:
      "We review transaction hashes, timelines, and loss type to determine traceability and legal options.",
    tags: ["Trace review", "Risk scoring"],
  },
  {
    title: "Recovery strategy",
    description:
      "Investigators build a case file with on-chain evidence, counterparties, and jurisdiction-specific next steps.",
    tags: ["Evidence pack", "Legal routing"],
  },
  {
    title: "Active coordination",
    description:
      "We engage exchanges, custodians, and authorities to freeze funds and pursue lawful return pathways.",
    tags: ["Freeze requests", "Negotiation"],
  },
  {
    title: "Asset return",
    description:
      "Recovered assets are returned to verified wallets with guidance on securing accounts going forward.",
    tags: ["Verified payout", "Case closure"],
  },
];

export default function RecoveryProcess() {
  return (
    <section id="how-it-works" className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>Methodology</p>
          <h2 className={glass.titleCenter}>How recovery works</h2>
          <p className={`${glass.leadCenter} mt-4`}>
            A structured four-phase process used across exchange hacks, phishing incidents, and
            unauthorized transfers.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <article key={step.title} className={`${glass.card} ${glass.cardBody} flex flex-col`}>
              <p className="text-xs font-medium text-neutral-500 mb-3">Phase {index + 1}</p>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4 flex-1">
                {step.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
