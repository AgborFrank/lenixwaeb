"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WalletCTA() {
  return (
    <section className="py-24 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">Download the Lenix Wallet to Secure Your Crypto Assets</h2>
          <p className="text-gray-400 text-lg">
              Join thousands of users who trust Lenix Wallet for their asset management, loans, and recovery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download" className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-10 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(249,255,56,0.3)] hover:shadow-[0_0_30px_rgba(249,255,56,0.5)] transition-shadow">
                Download Wallet
              </Link>
          </div>
      </div>
    </section>
  );
}
