"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { glass } from "@/lib/recovery-styles";

export default function RecoveryHero() {
  const t = useTranslations("CryptoRecovery.Hero");
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/trade-routes.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
      </div>

      <div className={`relative z-10 ${glass.container}`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className={glass.eyebrow}>{t("eyebrow")}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.1]">
                {t("title")}
              </h1>
              <p className={`${glass.lead} max-w-xl text-neutral-300`}>
                {t("description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="#start-recovery" className={glass.btnPrimary}>
                {t("submit")}
              </Link>
              <Link href="#how-it-works" className={glass.btnGlass}>
                {t("process")}
              </Link>
            </div>
          </div>

          <div className={`${glass.media} aspect-[4/3]`}>
            <Image
              src="/assets/img/investigate.webp"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
