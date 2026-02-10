"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How does Lenix Finance generate yield?",
        answer: "Lenix Finance generates yield through over-collateralized lending. Borrowers pay interest on loans, which is distributed to liquidity providers (you) after a small protocol fee. We also employ safe flash loan strategies to optimize returns."
    },
    {
        question: "Is there a lock-up period for my assets?",
        answer: "No. Lenix Finance acts as an on-demand liquidity pool. You can withdraw your supplied assets at any time, provided there is sufficient liquidity in the pool (which is typically high due to our dynamic interest rate model)."
    },
    {
        question: "What happens if a borrower defaults?",
        answer: "Our protocol uses a robust liquidation engine. If a borrower's health factor drops below 1.0, their collateral is automatically liquidated by third-party keepers to repay the debt, ensuring the protocol remains solvent and lenders are protected."
    },
    {
        question: "Are there any fees?",
        answer: "There are no fees to deposit assets. When you withdraw, you only pay the standard blockchain network gas fees. The interest earned is already net of the protocol's small reserve factor."
    }
];

export default function FinanceFAQ() {
  return (
    <section className="py-24 bg-black relative">
       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked <span className="text-yellow-400">Questions</span></h2>
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
       </div>
    </section>
  );
}
