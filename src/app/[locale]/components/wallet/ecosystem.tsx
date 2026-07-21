"use client";

import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

const ECOSYSTEM_LINKS = {
  wallet: "/lenix-wallet",
  loan: "/crypto-loan",
  recovery: "/crypto-recovery",
  security: "/security",
} as const;

const LINK_KEYS = ["wallet", "loan", "recovery", "security"] as const;

export default function WalletEcosystem() {
  const t = useTranslations("WalletPage.Ecosystem");

  return (
    <section className="py-24 px-4">
      <div className={home.container}>
        <div className="lg:flex lg:gap-16 lg:items-start">
          <div className="max-w-md mb-10 lg:mb-0 lg:shrink-0">
            <p className={home.eyebrow}>{t("eyebrow")}</p>
            <h2 className={`${home.title} mt-3 mb-4`}>{t("title")}</h2>
            <p className={home.lead}>{t("description")}</p>
          </div>

          <nav className="flex-1 border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-16">
            <ul className="divide-y divide-white/10 list-none p-0 m-0">
              {LINK_KEYS.map((id) => (
                <li key={id}>
                  <Link
                    href={ECOSYSTEM_LINKS[id]}
                    className="group flex items-center justify-between gap-6 py-5 hover:bg-white/[0.02] -mx-2 px-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white mb-0.5">{t(`cards.${id}.title`)}</p>
                      <p className="text-sm text-neutral-500">{t(`cards.${id}.desc`)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 shrink-0 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
