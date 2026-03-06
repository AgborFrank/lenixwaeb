"use client";

import { Database, Code, Search, Bell, Users, ShieldCheck } from "lucide-react";
import Image from "next/image";

const CAPABILITIES = [
  {
    label: "ASSET COVERAGE",
    title: "Monitor potential risk on any crypto asset with tradeable value",
    body: "Lenix Protocol's broad asset and network coverage enables comprehensive activity evaluations. Our digital asset coverage includes mainstream networks like Bitcoin and Ethereum, stablecoins, ERC-20 tokens and memecoins.",
    Icon: Database,
    imageSrc: "/assets/img/MonitorRisk.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "45+", label: "blockchains covered within Lenix Protocol's Holistic network" },
      { value: "250+", label: "bridges covered with enhanced tracing" },
    ],
  },
  {
    label: "API INTEGRATION",
    title: "Bring DeFi intelligence into compliance workflows",
    body: "Enable audit-ready, scalable compliance across the decentralized finance system with our robust, reliable API.",
    Icon: Code,
    imageSrc: "/assets/img/BringDeFiIntelligence.webp",
    imagePosition: "left" as const,
    stats: [
      { value: "1500", label: "analyses processed per second via asynchronous endpoints" },
      { value: "99.9%", label: "uptime for unmatched reliability" },
    ],
  },
  {
    label: "REAL-TIME TRANSACTION SCREENING",
    title: "Uncover illicit connections before they pose a threat",
    body: "Assess crypto wallets and transactions for connections to criminal money laundering, terrorist financing, and sanctioned entities and get the clear insights that drive fast, decisive action to protect assets.",
    Icon: Search,
    imageSrc: "/assets/img/UncoverIllicitConnections.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "1B+", label: "addresses attributed and clustered to known actors" },
      { value: "1B+", label: "transactions comprising Lenix Protocol's raw blockchain data" },
    ],
  },
  {
    label: "AUTOMATE MONITORING AT SCALE",
    title: "Detect financial crime automatically",
    body: "Monitor crypto and decentralized financial transactions across the ecosystem, tracing activity across all tradable chains and assets for a holistic assessment of your risk exposure. Lenix Protocol's solutions adapt to innovations in DeFi, monitoring activity governed by smart contracts and ensuring compliance as protocols evolve.",
    Icon: Bell,
    imageSrc: "/assets/img/DetectFinancialCrime.webp",
    imagePosition: "left" as const,
    stats: [],
  },
  {
    label: "EASE ONBOARDING WITH FULL VASP SCREENING",
    title: "Identify risk with new customers and counterparties",
    body: "Manage risk and ensure compliance during the onboarding process with integrated tools that provide a comprehensive view of an entity's activity across all major blockchains and assets. Identify exposure across liquidity providers, liquidity pools, and decentralized exchanges to surface hidden risks.",
    Icon: Users,
    imageSrc: "/assets/img/investigate.webp",
    imagePosition: "right" as const,
    stats: [
      { value: "1T$+", label: "worth of flow analyzed in 2024" },
    ],
  },
  {
    label: "POWER INFORMED DECISIONS",
    title: "Protect assets and users with DeFi due diligence",
    body: "Streamline compliance and reduce risk with in-depth analysis of token usage and asset behavior. Map DeFi protocols' connections across the crypto ecosystem to identify counterparties, liquidity pool exposure, and links to mixers or high-risk exchanges.",
    Icon: ShieldCheck,
    imageSrc: "/assets/img/security.webp",
    imagePosition: "left" as const,
    stats: [],
  },
] as const;

export default function DeFiComplianceCapabilities() {
  return (
    <section id="capabilities" className="py-0">
      {CAPABILITIES.map(
        ({ label, title, body, Icon, imageSrc, imagePosition, stats },
          index
        ) => (
          <div
            key={label}
            className={`relative py-20 md:py-32 overflow-hidden  ${
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
                        <div
                          key={statIndex}
                          className="p-4 rounded-xl "
                        >
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
                    <div className="absolute inset-0 rounded-3xl  group-hover:border-yellow-400/30 transition-all duration-300 z-20 pointer-events-none" />
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
