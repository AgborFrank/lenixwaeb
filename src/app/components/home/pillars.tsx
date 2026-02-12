"use client";

import { Shield, Search, FileSearch, Landmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";

const PILLARS = [
  {
    title: "Blockchain Security",
    description: "Audited infrastructure and secure vault technology to protect your assets.",
    icon: Shield,
    href: "/solutions",
    cta: "Explore security",
  },
  {
    title: "Asset Recovery",
    description: "Specialized protocols and legal pathways to reclaim lost or stolen crypto.",
    icon: Search,
    href: "/crypto-recovery",
    cta: "Start recovery",
  },
  {
    title: "Blockchain Forensics",
    description: "Expert analysis to trace fraud, hacks, and unauthorized transfers.",
    icon: FileSearch,
    href: "/crypto-recovery",
    cta: "Learn more",
  },
  {
    title: "Financial Service Protocol",
    description: "Payments, lending, wallet, and vault for the modern crypto ecosystem.",
    icon: Landmark,
    href: "/solutions",
    cta: "View solutions",
  },
];

export default function Pillars() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`${textStyles.hero} text-white max-w-3xl mx-auto mb-4`}>
            Security, recovery, forensics, and finance{" "}
            <span className="text-yellow-400">in one place</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose what you need—each pillar links to dedicated solutions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ title, description, icon: Icon, href, cta }) => (
            <Link
              key={title}
              href={href}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
              <span className="inline-flex items-center gap-1 text-yellow-400 text-sm font-medium">
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
