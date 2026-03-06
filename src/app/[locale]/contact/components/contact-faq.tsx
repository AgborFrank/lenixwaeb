"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I get started with Lenix Protocol?",
    answer:
      "Getting started with Lenix Protocol is simple! First, connect your crypto wallet. Then, you can begin making cross-border payments or exploring our other services. Our platform is designed to be user-friendly for both beginners and experienced crypto users.",
  },
  {
    question: "What cryptocurrencies does Lenix Protocol support?",
    answer:
      "Lenix Protocol currently supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), USDT, USDC, and our native Lenix Protocol token. We&apos;re constantly adding support for new tokens based on user demand and market requirements.",
  },
  {
    question: "How secure is the Lenix Protocol platform?",
    answer:
      "Security is our top priority. We use industry-standard encryption, multi-signature wallets, and regular security audits. Our smart contracts are audited by leading security firms, and we implement best practices for protecting user funds and data.",
  },
  {
    question: "What are the fees for using Lenix Protocol services?",
    answer:
      "Our fee structure is transparent and competitive. Cross-border payments typically incur a small percentage fee (0.5-2%) depending on the amount and destination. Crypto-to-crypto transfers have minimal network fees. Check our pricing page for detailed information.",
  },
  {
    question: "How long do cross-border payments take?",
    answer:
      "Cross-border payments through Lenix Protocol are typically processed within 1-3 business days, depending on the destination country and payment method. Crypto-to-crypto transfers are usually completed within minutes to hours, depending on network congestion.",
  },
  {
    question: "Can I recover lost crypto through Lenix Protocol?",
    answer:
      "Yes! Our crypto recovery service helps users recover lost or stolen cryptocurrency. We have a team of experts who specialize in blockchain forensics and recovery techniques. Contact our recovery team for a consultation.",
  },
  {
    question: "Is Lenix Protocol available in my country?",
    answer:
      "Lenix Protocol is available in most countries worldwide. However, some jurisdictions may have restrictions. Please check our terms of service or contact our support team to confirm availability in your specific location.",
  },
  {
    question: "How can I become a Lenix Protocol partner?",
    answer:
      "We&apos;re always looking for strategic partners! Whether you&apos;re a business looking to integrate crypto payments, a financial institution, or a technology provider, we&apos;d love to hear from you. Contact our business development team for partnership opportunities.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="bg-accept bg-black">
      <div className="max-w-screen-xl  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about Lenix Protocol services, crypto
            payments, and platform features.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white font-semibold text-lg">
                    {item.question}
                  </span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  )}
                </button>

                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Still have questions? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@Lenix Protocol.com"
                className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Email Support
              </a>
              <button className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
