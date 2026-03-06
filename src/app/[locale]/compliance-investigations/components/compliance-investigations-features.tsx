"use client";

import { Network, Zap, Search, Database, Bell } from "lucide-react";
import Image from "next/image";

const FEATURES = [
  {
    label: "HOLISTIC INVESTIGATION",
    title: "Follow the money across chains and assets at scale",
    body: "Trace funds across chains and assets seamlessly, uncovering the ultimate source or destination of illicit activity. Analyze connections to regulated exchanges and gather supporting information to strengthen your investigations and prepare detailed Suspicious Activity Reports (SARs).",
    Icon: Network,
    imageSrc: "/assets/img/investigate.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "45+", label: "blockchains supported with Holistic investigation" },
      { value: "100+", label: "bridges covered with enhanced tracing" },
    ],
  },
  {
    label: "SINGLE-CLICK INVESTIGATIONS",
    title: "Automatically visualize complex relationships",
    body: "Instantly generate network visualizations of wallets, transactions, and entities. With one-click exposure, risk, and behavior trails, efficiently auto-complete all pathways between entities across blockchains and assets, enabling your team to communicate findings without extensive manual graphing.",
    Icon: Zap,
    imageSrc: "/assets/img/security.webp",
    imagePosition: "left" as const,
    stats: [
      { value: "80%", label: "faster investigations with cross-chain auto-plotting" },
    ],
  },
  {
    label: "DEEP ANALYSIS",
    title: "Explore addresses and transactions with ease",
    body: "Drill down from high-level insights on entities, clusters, and single addresses into granular transaction data to support your enhanced due diligence processes. Identify direct and indirect links to hacks, ransomware, fraud, and more, with complete visibility of each hop taken between blockchains and cryptoassets.",
    Icon: Search,
    imageSrc: "/assets/img/enhance.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "100M+", label: "value transfer events processed per day" },
    ],
  },
  {
    label: "DATA & INTELLIGENCE",
    title: "Leverage data you can rely on",
    body: "Identify who controls wallet addresses using the industry's highest quality data, collected since 2009 and backed by extensive documented evidence. Support your compliance escalations with access to over 6.4 billion labeled addresses across 45+ crypto networks, regularly used in criminal prosecution support.",
    Icon: Database,
    imageSrc: "/assets/img/scale.webp",
    imagePosition: "left" as const,
    stats: [
      { value: "6.4B+", label: "addresses attributed and clustered to known actors" },
    ],
  },
  {
    label: "ADDRESS ACTIVITY ALERTING",
    title: "Continuously monitor suspicious wallets",
    body: "Set tailored alerts for suspicious addresses and receive instant notifications of new activity. Monitor and act on evolving risks in real-time, supporting ongoing compliance reviews and staying aligned with regulatory obligations.",
    Icon: Bell,
    imageSrc: "/assets/img/investigate.webp",
    imagePosition: "right" as const,
    stats: [],
  },
] as const;

export default function ComplianceInvestigationsFeatures() {
  return (
    <section id="features" className="py-0">
      {FEATURES.map(({ label, title, body, Icon, imageSrc, imagePosition, stats }, index) => (
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

                {/* Stats */}
                {stats.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {stats.map((stat, statIndex) => (
                      <div key={statIndex} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-zinc-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Column */}
              <div
                className={`${
                  imagePosition === "right" ? "md:order-2" : "md:order-1"
                }`}
              >
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group bg-black/20">
                  <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-yellow-400/30 transition-all duration-300 z-20 pointer-events-none" />
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
      ))}
    </section>
  );
}
