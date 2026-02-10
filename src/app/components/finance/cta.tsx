"use client";

import Link from "next/link";
import { Send } from "lucide-react";

export default function FinanceCTA() {
  return (
    <section className="py-24 px-4 text-center bg-black relative border-t border-white/5">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white">Join the Future of Decentralized Finance</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Connect with our community, get 24/7 support, and stay updated on the latest yield opportunities and protocol governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://t.me/lenixprotocol" target="_blank" className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-10 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Need Loan? Talk to us
              </Link>
          </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-yellow-400/10 blur-[100px] -z-0 rounded-full" />
    </section>
  );
}
