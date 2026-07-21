"use client";

import {
  Lock,
  Globe,
  ArrowRightLeft,
  Smartphone,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { home } from "@/lib/home-styles";

const WALLET_FEATURES = [
  { id: "encryption", icon: Lock },
  { id: "multichain", icon: Globe },
  { id: "transfers", icon: ArrowRightLeft },
  { id: "access", icon: Smartphone },
] as const;

const PLATFORM_FEATURES = [
  { id: "loans", icon: Landmark, href: "/crypto-loan" as const },
  { id: "recovery", icon: ShieldCheck, href: "/crypto-recovery" as const },
] as const;

export default function WalletFeatures() {
  const t = useTranslations("WalletPage.Features");

  return (
    <section id="features" className="py-24 px-4 bg-white/5 scroll-mt-24">
      <div className={home.container}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 items-start">
          <div className="lg:col-span-2 max-w-2xl">
            <p className={home.eyebrow}>{t("eyebrow")}</p>
            <h2 className={`${home.title} mt-3 mb-3`}>{t("title")}</h2>
            <p className="text-sm text-neutral-500">{t("networks_line")}</p>
          </div>

          <div className="mt-10 lg:mt-0">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-6">
              {t("groups.wallet.title")}
            </p>
            <ul className="space-y-6 list-none p-0 m-0">
              {WALLET_FEATURES.map(({ id, icon: Icon }) => (
                <li key={id} className="flex gap-4">
                  <div className="p-3 bg-black/40 rounded-lg h-fit border border-white/10 shrink-0">
                    <Icon className="w-5 h-5 text-neutral-400" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-semibold text-white mb-1">{t(`cards.${id}.title`)}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{t(`cards.${id}.desc`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="mt-12 lg:mt-0 p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-6">
              {t("groups.platform.title")}
            </p>
            <ul className="space-y-8 list-none p-0 m-0">
              {PLATFORM_FEATURES.map(({ id, icon: Icon, href }) => (
                <li key={id}>
                  <div className="flex gap-4 mb-3">
                    <div className="p-3 bg-white/5 rounded-lg h-fit border border-white/10 shrink-0">
                      <Icon className="w-5 h-5 text-neutral-400" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-base font-semibold text-white mb-1">{t(`cards.${id}.title`)}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{t(`cards.${id}.desc`)}</p>
                    </div>
                  </div>
                  <Link href={href} className={home.textLink}>
                    {t(`cards.${id}.link`)}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
