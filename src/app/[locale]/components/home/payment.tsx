"use client";

import { ArrowRightLeft, Shield, RefreshCcw, Landmark } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";



export default function Payment() {
  const t = useTranslations("Home.Payment");

  const OFFERS = [
    {
      id: "fiat",
      icon: ArrowRightLeft,
    },
    {
      id: "vault",
      icon: Shield,
    },
    {
      id: "recovery",
      icon: RefreshCcw,
    },
    {
      id: "lending",
      icon: Landmark,
    },
  ];
  return (
    <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-14">
          <p className="inline-block bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {t("badge")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-onest tracking-tight max-w-3xl mx-auto mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 mt-8">
          {OFFERS.map(({ id, icon: Icon }) => (
            <article
              key={id}
              className="group relative p-6 lg:p-7 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/25 hover:bg-white/10 transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-5 group-hover:bg-yellow-400/15 transition-colors"
                aria-hidden
              >
                <Icon className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold text-lg font-onest mb-2">
                {t(`cards.${id}.title`)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(`cards.${id}.desc`)}
              </p>
            </article>
          ))}
        </div>

        <p className="text-center mt-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-yellow-400 font-medium text-sm hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-black rounded-lg px-3 py-2 transition-colors"
          >
            {t("cta")}
            <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
