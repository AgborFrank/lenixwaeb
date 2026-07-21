"use client";

import Image from "next/image";
import Link from "next/link";
import { glass } from "@/lib/recovery-styles";

export default function RecoveryHero() {
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
              <p className={glass.eyebrow}>Certified asset recovery</p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.1]">
                Forensic-led recovery for stolen and misdirected crypto
              </h1>
              <p className={`${glass.lead} max-w-xl text-neutral-300`}>
                Lenix investigators trace on-chain movement, prepare exchange and law-enforcement
                packages, and coordinate asset freezes when recovery remains viable.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="#start-recovery" className={glass.btnPrimary}>
                Submit a case
              </Link>
              <Link href="#how-it-works" className={glass.btnGlass}>
                View process
              </Link>
            </div>
          </div>

          <div className={`${glass.media} aspect-[4/3]`}>
            <Image
              src="/assets/img/investigate.webp"
              alt="Blockchain forensic investigation workspace"
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
