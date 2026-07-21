"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { glass } from "@/lib/recovery-styles";

const faqs = [
  {
    question: "What types of crypto losses can you recover?",
    answer:
      "We handle hacks, phishing, unauthorized transfers, and select wallet-access scenarios. Coverage depends on chain, timing, and where funds moved — we confirm after reviewing your transaction details.",
  },
  {
    question: "How long does the recovery process take?",
    answer:
      "Straightforward exchange-facing cases may resolve in weeks. Cross-border or multi-hop tracing can take one to three months. You receive a timeline estimate after the initial assessment.",
  },
  {
    question: "How are fees structured?",
    answer:
      "Fees are agreed in writing before investigative work begins. Many engagements use outcome-aligned terms tied to successful recovery rather than large upfront retainers.",
  },
  {
    question: "Is my information confidential?",
    answer:
      "Yes. Case materials are encrypted, access-controlled, and shared only with parties required to pursue recovery — exchanges, counsel, or authorities — with your approval.",
  },
  {
    question: "Do you guarantee recovery?",
    answer:
      "No responsible firm can guarantee recovery. Outcomes depend on where funds moved, how quickly the case is reported, and whether custodians or exchanges can act. We provide an honest recoverability assessment before you commit.",
  },
  {
    question: "What should I include when submitting a case?",
    answer:
      "Transaction hashes, wallet addresses involved, approximate amount and asset, date of the incident, and any exchange or platform accounts linked to the loss. Screenshots, emails, or police reports strengthen the file.",
  },
  {
    question: "Can you trace funds through mixers or privacy tools?",
    answer:
      "Some flows can still be analyzed using clustering, timing, and off-ramp patterns, but privacy protocols and advanced obfuscation reduce recoverability. We tell you upfront if tracing is likely to hit a dead end.",
  },
  {
    question: "Do you work with law enforcement and exchanges?",
    answer:
      "Yes. We prepare trace packages for law enforcement and submit freeze or information requests to exchanges and custodians when jurisdiction and evidence support it.",
  },
  {
    question: "Will you ever ask for my private keys or seed phrase?",
    answer:
      "Never. Legitimate recovery work does not require your seed phrase or private keys. If anyone claiming to help asks for them, treat it as a scam and disengage immediately.",
  },
  {
    question: "What happens after I submit the intake form?",
    answer:
      "Our team reviews your materials within one business day, confirms whether forensic tracing is viable, and outlines next steps, documentation needs, and fee terms if you choose to proceed.",
  },
];

export default function RecoveryFAQ() {
  return (
    <section className={`${glass.section} bg-black`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <p className={`${glass.eyebrow} mb-3`}>FAQ</p>
          <h2 className={glass.titleCenter}>Common questions</h2>
          <p className={`${glass.leadCenter} mt-4`}>What to expect before you submit a case.</p>
        </header>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className={`${glass.card} px-6 border-none data-[state=open]:bg-white/[0.07]`}
            >
              <AccordionTrigger className="text-white hover:text-neutral-200 text-sm font-semibold py-5 hover:no-underline text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 text-sm pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-10">
          <p className="text-sm text-neutral-500 mb-4">Need to discuss a specific incident?</p>
          <Link href="#start-recovery" className={glass.textLink}>
            Submit a recovery request →
          </Link>
        </div>
      </div>
    </section>
  );
}
