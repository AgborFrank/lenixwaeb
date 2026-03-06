"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DeFiComplianceHero() {
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/img/bg-3.png')",
              opacity: 0.35,
            }}
          />
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row justify-between">
          <div className="md:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                DeFi Compliance & AML
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500 mb-6 md:leading-16 leading-12">
              AML and Compliance for{" "}
              <span className="text-yellow-400">Decentralized Finance</span> (DeFi)
            </h1>
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl">
              Evaluate ecosystem partners, prevent illicit activity, and protect
              end users with continuous due diligence designed for decentralized
              finance service protocols and crypto market infrastructure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-14 px-8 rounded-full"
                >
                  Get started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#capabilities">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 h-14 px-8 rounded-full"
                >
                  Explore Capabilities
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <Image src="/assets/partners/defi.webp" alt="DeFi Compliance" width={500} height={500} />
          </div>
        </div>
      </section>

      
    </>
  );
}
