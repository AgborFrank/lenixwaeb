"use client";

import { glass } from "@/lib/recovery-styles";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Software engineer",
    quote:
      "After a wallet compromise, Lenix traced the flow and helped coordinate an exchange freeze. Communication was clear at every stage.",
  },
  {
    name: "Sarah Johnson",
    role: "Marketing director",
    quote:
      "A phishing incident drained my ETH holdings. The team documented the trail and recovered the majority within three weeks.",
  },
  {
    name: "David Rodriguez",
    role: "Business owner",
    quote:
      "I assumed a six-figure USDT loss was permanent. Lenix treated it as an investigation, not a sales pitch — and delivered results.",
  },
];

export default function SuccessStories() {
  return (
    <section className={`${glass.section} bg-black`}>
      <div className={glass.container}>
        <header className="mb-12 lg:mb-14 max-w-3xl mx-auto text-center">
          <p className={`${glass.eyebrow} mb-3`}>Client outcomes</p>
          <h2 className={glass.titleCenter}>Representative recoveries</h2>
          <p className={`${glass.leadCenter} mt-4`}>
            Anonymized summaries from recent engagements. Individual results depend on case facts and
            third-party cooperation.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((item) => (
            <article key={item.name} className={`${glass.card} ${glass.cardBody}`}>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">&ldquo;{item.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-neutral-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
