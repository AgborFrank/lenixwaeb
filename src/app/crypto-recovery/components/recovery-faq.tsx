"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RecoveryFAQ() {
  const faqs = [
    {
      question: "What types of crypto losses can you recover?",
      answer: "We maximize recovery attempts for hacks, phishing scams, unauthorized transfers, and lost private keys (in specific hardware scenarios). We specialize in Bitcoin, Ethereum, and major stablecoins.",
    },
    {
      question: "How long does the recovery process take?",
      answer: "Simple cases can be resolved in 2-4 weeks. Complex cross-chain tracing or cases requiring international legal coordination may take 1-3 months. We provide a timeline estimate after the initial assessment.",
    },
    {
      question: "What is your 'No Win, No Fee' policy?",
      answer: "We do not charge upfront fees for the recovery attempt. We only take a percentage (typically 15-20%) of the successfully recovered assets. If we don't recover anything, you don't pay.",
    },
    {
      question: "Is my information confidential?",
      answer: "Yes, strictly. We operate under attorney-client privilege standards and use military-grade encryption for all communications. Your data is never shared with third parties without your explicit consent.",
    }
  ];

  return (
    <section className="bg-black py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Common <span className="text-yellow-400">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about our recovery process.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
           {faqs.map((faq, i) => (
               <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/5 rounded-xl px-6 data-[state=open]:bg-white/[0.07] transition-colors">
                   <AccordionTrigger className="text-white hover:text-yellow-400 text-lg font-medium py-6 hover:no-underline text-left">
                       {faq.question}
                   </AccordionTrigger>
                   <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                       {faq.answer}
                   </AccordionContent>
               </AccordionItem>
           ))}
       </Accordion>

        <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">Still have questions?</p>
            <Link href="#start-recovery" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
                Contact our specialized support team <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </section>
  );
}
