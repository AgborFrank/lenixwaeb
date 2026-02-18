"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ComplianceInvestigationsCTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Are you ready to take a closer look?
        </h2>
        <p className="text-xl text-zinc-400 mb-10">
          Get started with blockchain intelligence for compliance investigations
          and enforcement. Get the latest insights in your inbox.
        </p>
        <div className="flex flex-row justify-center gap-4 flex-wrap">
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-14 px-12 rounded-full text-lg"
            >
              Get started
            </Button>
          </Link>
          <Link href="/newsletter">
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 h-14 px-12 rounded-full text-lg inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Latest insights
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
