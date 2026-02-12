"use client";

import Link from "next/link";
import {
  Search,
  ShieldCheck,
  FileSearch,
  Scale,
  Lock,
  AlertTriangle,
  Fingerprint,
  ArrowRight,
  Database,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/header";
import Footer from "../components/footer";
import Image from "next/image";

export default function BlockchainForensicsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/assets/img/bg.jpg')",
                opacity: 0.35,
              }}
            />
           
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-50 z-0" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl opacity-30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex">
            <div className="md:w-1/2 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Lenix Forensics Unit
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500 mb-6 md:leading-16 leading-12">
                Blockchain Forensic Service
                <span className="text-yellow-400">On-Chain</span>{" "}
                Investigations.
              </h1>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed max-w-2xl">
                Advanced blockchain analytics website and forensic
                investigations to trace assets, uncover fraud, and support legal
                recovery efforts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="http://t.me/verified_protocol">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-14 px-8 rounded-full"
                  >
                    Start Investigation <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 h-14 px-8 rounded-full"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-zinc-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive Forensic Services
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Our experts leverage cutting-edge technology to analyze
                blockchain data, clustering addresses and tracing transaction
                flows with precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard
                icon={<Search className="w-6 h-6 text-yellow-400" />}
                title="Transaction Tracing"
                description="We meticulously examine transaction paths to determine the origin and destination of funds, visualizing the flow across the blockchain."
              />
              <ServiceCard
                icon={<Database className="w-6 h-6 text-blue-400" />}
                title="Asset Recovery"
                description="Tracing stolen assets from hacks, scams, or theft. We identify current holdings to facilitate recovery actions."
              />
              <ServiceCard
                icon={<Scale className="w-6 h-6 text-emerald-400" />}
                title="Litigation Support"
                description="Providing admissible forensic reports and expert witness testimony to support legal proceedings and law enforcement."
              />
              <ServiceCard
                icon={<Network className="w-6 h-6 text-purple-400" />}
                title="Address Clustering"
                description="Grouping addresses linked to specific entities to de-anonymize actors and understand fund movements."
              />
              <ServiceCard
                icon={<ShieldCheck className="w-6 h-6 text-orange-400" />}
                title="Due Diligence"
                description="Risk assessment for entities and transactions to prevent money laundering and ensure compliance."
              />
              <ServiceCard
                icon={<Fingerprint className="w-6 h-6 text-pink-400" />}
                title="Identity Attribution"
                description="Linking on-chain addresses to real-world identities through exchange records and OSINT analysis."
              />
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  When is Forensic Analysis Required?
                </h2>
                <p className="text-zinc-400 mb-8">
                  Blockchain forensics is essential for resolving complex
                  disputes and recovering lost value in the digital asset space.
                </p>

                <div className="space-y-4">
                  <UseCaseItem
                    title="Theft & Hacking"
                    description="Tracing funds stolen from wallets or exchanges to actionable endpoints."
                  />
                  <UseCaseItem
                    title="Phishing & Scams"
                    description="Investigating social engineering attacks and investment fraud schemes."
                  />
                  <UseCaseItem
                    title="Ransom Payments"
                    description="Tracking payments made in extortion cases to aid law enforcement."
                  />
                  <UseCaseItem
                    title="Exchange Insolvency"
                    description="Verifying reserves and tracking customer funds in bankruptcy scenarios."
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/20 to-blue-500/20 rounded-2xl blur-2xl" />
                <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                  <Lock className="w-12 h-12 text-yellow-400 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">
                    Secure & Confidential
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    We adhere to strict data privacy standards. Your case
                    details are encrypted and shared only with authorized
                    investigators.
                  </p>
                  <ul className="space-y-3 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />{" "}
                      Non-Disclosure Agreements (NDA)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />{" "}
                      Encrypted Communication Channels
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />{" "}
                      Compliance with Global Privacy Laws
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology / How It Works */}
        <section
          id="how-it-works"
          className="py-20 bg-zinc-900/30 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Investigation Process
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ProcessStep
                number="01"
                title="Data Extraction"
                description="Leveraging proprietary nodes to extract raw transaction data, logs, and internal messages."
              />
              <ProcessStep
                number="02"
                title="Forensic Analysis"
                description="Applying heuristic clustering and behavioral analysis to map the flow of assets."
              />
              <ProcessStep
                number="03"
                title="Intelligence"
                description="Correlating on-chain data with off-chain intelligence to identify entities."
              />
              <ProcessStep
                number="04"
                title="Report & Action"
                description="Delivering written reports and actionable intelligence for recovery or legal filing."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to uncover the truth?
            </h2>
            <p className="text-xl text-zinc-400 mb-10">
              Get a free evaluation of your case. Our analysts are ready to
              assist you in tracing and recovering your digital assets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-14 px-12 rounded-full text-lg w-full sm:w-auto"
                >
                  Contact Forensics Team
                </Button>
              </Link>
              <Link href="/crypto-recovery">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 h-14 px-12 rounded-full text-lg w-full sm:w-auto"
                >
                  Crypto Recovery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center border border-white/10 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
      </div>
      <div>
        <h4 className="font-bold text-white shadow-sm">{title}</h4>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6 rounded-2xl bg-zinc-900 border border-white/5">
      <span className="text-5xl font-bold text-white/5 absolute top-4 right-4 select-none">
        {number}
      </span>
      <div className="w-2 h-2 rounded-full bg-yellow-400 mb-6" />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}
