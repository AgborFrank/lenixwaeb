"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

const PILLARS = [
  {
    label: "TACTICALLY RELEVANT DATA",
    title: "Uncover hidden threat actors",
    body: "Access blockchain intelligence curated to detect entities and wallets that evade traditional tracking, whether linked to cybercriminal groups, nation-state campaigns, or sanctioned networks.",
    imageSrc: "/assets/img/investigate.webp",
    imagePosition: "right" as const,
  },
  {
    label: "NATIONAL SECURITY SUPPORT",
    title: "Strengthen monitoring of geopolitical risk",
    body: "Track encrypted financial flows tied to sanctioned jurisdictions, hybrid threats, crypto-enabled terrorism financing, and cyber warfare operations.",
    imageSrc: "/assets/img/security.webp",
    imagePosition: "left" as const,
  },
  {
    label: "ENFORCEMENT ADVANTAGE",
    title: "Enhance seizure and prosecution outcomes",
    body: "Support legal action with real-time address attribution and source-of-funds tracing that meet standards for seizure warrants, evidentiary documentation, and cross-border collaboration.",
    imageSrc: "/assets/img/enhance.webp",
    imagePosition: "right" as const,
  },
  {
    label: "FLEXIBLE DELIVERY",
    title: "Scale your mission with structured data",
    body: "Receive custom datasets via feed, file, or API to match evolving intelligence priorities. Whether monitoring a known actor set or responding to emerging threats, Lenix Protocol delivers precision-guided crypto intelligence that adapts to your operational needs.",
    imageSrc: "/assets/img/scale.webp",
    imagePosition: "left" as const,
  },
] as const;

export default function ThreatIntelligenceCapabilities() {
  return (
    <section id="capabilities" className="py-0">
      {PILLARS.map(({ label, title, body, imageSrc, imagePosition }, index) => (
        <div
          key={label}
          className={`relative py-20 md:py-32 overflow-hidden border-b border-white/5 ${
            index % 2 === 0 ? "bg-black" : "bg-zinc-900/20"
          }`}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/assets/img/bg.jpg')",
                opacity: 0.15,
              }}
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          {imagePosition === "right" ? (
            <>
              <div className="absolute top-0 left-0 -ml-40 -mt-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-40 z-0" />
              <div className="absolute bottom-0 right-0 -mr-40 -mb-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 z-0" />
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-40 z-0" />
              <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 z-0" />
            </>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center ${
                imagePosition === "right" ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Content Column */}
              <div
                className={`${
                  imagePosition === "right" ? "md:order-1" : "md:order-2"
                }`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                    {label}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {title}
                </h3>

                <p className="text-lg text-zinc-300 leading-relaxed mb-8 max-w-2xl">
                  {body}
                </p>

                <div className="flex items-center gap-3 text-yellow-400 group cursor-pointer">
                  <span className="font-semibold">Learn more</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Image Column - Full Area */}
              <div
                className={`${
                  imagePosition === "right" ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="relative w-full h-[400px] md:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden group bg-black/20">
                 
                  {/* Image Container */}
                  <div className="relative w-full h-full">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-contain rounded-3xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      quality={100}
                      priority={index < 2}
                    />
                  </div>

                 
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
