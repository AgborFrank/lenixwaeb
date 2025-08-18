"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function RecoveryFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What types of crypto losses can you recover?",
      answer:
        "We can help recover crypto lost through hacks, phishing scams, lost private keys, exchange issues, and other types of theft or accidental loss. Our team specializes in blockchain forensics and has successfully recovered assets across multiple scenarios.",
    },
    {
      question: "How long does the recovery process take?",
      answer:
        "Recovery time varies depending on the complexity of the case. Simple cases may be resolved within 1-2 weeks, while more complex situations involving multiple jurisdictions or sophisticated attacks may take 1-3 months. We provide regular updates throughout the process.",
    },
    {
      question: "What is your success rate?",
      answer:
        "Our overall success rate is 85%, which is significantly higher than industry averages. Success depends on factors like the type of loss, how quickly you contact us, and the available evidence. We provide a free assessment to evaluate your case's potential.",
    },
    {
      question: "How much do your services cost?",
      answer:
        "We operate on a 'No Recovery, No Fee' basis. You only pay if we successfully recover your assets. Our fee is typically 15-25% of the recovered amount, depending on the case complexity. We provide transparent pricing upfront with no hidden fees.",
    },
    {
      question: "Is my information kept confidential?",
      answer:
        "Absolutely. We take client confidentiality very seriously. All communications are encrypted, and we never share your personal information or case details with third parties without your explicit consent. Our team is bound by strict confidentiality agreements.",
    },
    {
      question: "Do you work with law enforcement?",
      answer:
        "Yes, we have established relationships with law enforcement agencies worldwide. When necessary and with your consent, we can coordinate with authorities to enhance recovery efforts. Our team includes former law enforcement officers who understand the legal process.",
    },
    {
      question: "What information do I need to provide?",
      answer:
        "We'll need details about how you lost your crypto, transaction hashes, wallet addresses, and any relevant documentation. The more information you can provide, the better we can assess your case. Don't worry if you're missing some details - we can help gather additional information.",
    },
    {
      question: "Can you recover crypto from exchanges?",
      answer:
        "Yes, we can help with exchange-related issues including frozen accounts, withdrawal problems, and exchange hacks. We have experience working with major exchanges and can often expedite resolution through our established relationships.",
    },
    {
      question: "What if the recovery is unsuccessful?",
      answer:
        "If we're unable to recover your assets, you won't be charged any fees. We'll provide a detailed explanation of what we attempted and why recovery wasn't possible. We may also offer recommendations for preventing future losses.",
    },
    {
      question: "How do I get started with the recovery process?",
      answer:
        "Getting started is easy. Simply fill out our contact form with details about your situation, and we'll respond within 24 hours. We'll schedule a free consultation to assess your case and explain our approach. There's no obligation to proceed if you're not comfortable with our assessment.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked
            <span className="text-yellow-400"> Questions</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Get answers to the most common questions about our crypto recovery
            services. Can&apos;t find what you&apos;re looking for? Contact us
            directly.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-white font-semibold text-lg pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-700 pt-6">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6">
              Our recovery specialists are here to help. Get in touch for a
              free, confidential consultation about your specific situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors">
                Contact Us Now
              </button>
              <button className="bg-transparent border border-gray-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
