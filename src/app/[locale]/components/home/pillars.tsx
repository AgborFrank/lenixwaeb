"use client";

import { Shield, Search, FileSearch, Landmark, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { textStyles } from "@/lib/fonts";



export default function Pillars() {
  const t = useTranslations("Home.Pillars");

  const PILLARS = [
    {
      id: "security",
      icon: Shield,
      href: "/solutions",
    },
    {
      id: "recovery",
      icon: Search,
      href: "/crypto-recovery",
    },
    {
      id: "forensics",
      icon: FileSearch,
      href: "/crypto-recovery",
    },
    {
      id: "finance",
      icon: Landmark,
      href: "/solutions",
    },
  ];
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`${textStyles.hero} text-white max-w-3xl mx-auto mb-4`}>
            {t("title1")}{" "}
            <span className="text-yellow-400">{t("title2")}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ id, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                {t(`cards.${id}.title`)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {t(`cards.${id}.desc`)}
              </p>
              <span className="inline-flex items-center gap-1 text-yellow-400 text-sm font-medium">
                {t(`cards.${id}.cta`)}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
