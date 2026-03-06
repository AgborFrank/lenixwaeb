"use client";

import { Layers, Network, Filter, FileSearch, GraduationCap } from "lucide-react";
import Image from "next/image";

const CAPABILITIES = [
  {
    label: "THREAT INTELLIGENCE",
    title: "Target intelligence gaps and improve operational effectiveness",
    body: "Integrate Holistic blockchain data into your intelligence suite with custom datasets covering illicit activity and actors, wallet ownership, on-chain fund flow analysis, off-chain evidence, behavioral typologies, geolocational signals, and more. Work with our team of data science experts to ingest data your way through CSV intelligence packages or custom APIs.",
    Icon: Layers,
    imageSrc: "/assets/img/investigate.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "1B+", label: "transactions comprising Lenix Protocol's raw blockchain data" },
      { value: "1B+", label: "addresses attributed and clustered to known actors" },
    ],
  },
  {
    label: "HOLISTIC BLOCKCHAIN DATA",
    title: "See the entire battlefield",
    body: "Programmatically trace cross-chain and cross-asset activity with the only unified crypto financial network, enabling comprehensive tracking of fund movements and wallet behaviors. Gain visibility across blockchains, assets, and obfuscation services—including bridges, DEXs, and coinswaps—even when address changes occur during bridge events.",
    Icon: Network,
    imageSrc: "/assets/img/MonitorRisk.webp",
    imagePosition: "left" as const,
    stats: [
      { value: "50+", label: "networks covered within Lenix Protocol's Holistic network" },
      { value: "1B+", label: "relationships tracked in the Holistic graph" },
    ],
  },
  {
    label: "TRIAGE",
    title: "Conduct more targeted investigations",
    body: "Quickly screen high volumes of wallets and transactions to pinpoint illicit activity. Leverage Lenix Protocol's battle-tested \"screen first, investigate when necessary\" approach to immediately identify connections to illicit actors, categories, behaviors or regions of interest to better prioritize investigation efforts.",
    Icon: Filter,
    imageSrc: "/assets/img/UncoverIllicitConnections.webp",
    imagePosition: "right" as const,
    stats: [{ value: "100K+", label: "wallets or transactions uploadable at once for triage" }],
  },
  {
    label: "INVESTIGATION",
    title: "Close more cases faster",
    body: "Win the arms race and stay ahead of savvy criminals with easy-to-use investigative solutions. Follow dirty money wherever it hides with a fully automated forensics tool that visualizes cross-chain and cross-asset fund swaps in a single, seamless graph. Trace actors or wallets of interest, drill-down into transactional data, and identify cash-out points at regulated exchanges to request KYC information and achieve swifter case resolution.",
    Icon: FileSearch,
    imageSrc: "/assets/img/security.webp",
    imagePosition: "left" as const,
    stats: [
      { value: "30%", label: "faster investigations with cross-chain auto-plotting" },
      { value: "100+", label: "illicit typologies tracked with behavioral detection" },
    ],
  },
  {
    label: "EDUCATION & TRAINING",
    title: "Learn how to catch a crypto thief",
    body: "Upskill your agents with practical, on-demand training and certifications covering crypto fundamentals, blockchain forensics, and how to make the most of Lenix Protocol's data and tools to conduct more efficient and effective criminal investigations.",
    Icon: GraduationCap,
    imageSrc: "/assets/img/BringDeFiIntelligence.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "100+", label: "pages of digital content" },
      { value: "20+", label: "hours of product and investigation-focused content" },
    ],
  },
] as const;

export default function LawEnforcementCapabilities() {
  return (
    <section id="capabilities" className="py-0">
      {CAPABILITIES.map(
        ({ label, title, body, Icon, imageSrc, imagePosition, stats }, index) => (
          <div
            key={label}
            className={`relative py-20 md:py-32 overflow-hidden ${
              index % 2 === 0 ? "bg-black" : "bg-zinc-900/20"
            }`}
          >
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/assets/img/bg.jpg')",
                  opacity: 0.15,
                }}
              />
            </div>
            <div className="absolute inset-0 z-0 bg-linear-to-b from-black/40 via-transparent to-black/40" />
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
                <div
                  className={
                    imagePosition === "right" ? "md:order-1" : "md:order-2"
                  }
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

                  {stats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      {stats.map((stat, statIndex) => (
                        <div key={statIndex} className="p-4 rounded-xl">
                          <div className="text-3xl font-bold text-yellow-400 mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-zinc-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={
                    imagePosition === "right" ? "md:order-2" : "md:order-1"
                  }
                >
                  <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group bg-black/20">
                    <div className="absolute inset-0 rounded-3xl group-hover:border-yellow-400/30 transition-all duration-300 z-20 pointer-events-none" />
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
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 z-20 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 z-20 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
}
