"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { home } from "@/lib/home-styles";

const SLIDE_KEYS = ["recovery", "forensics", "banking", "settlement"] as const;

const SLIDE_LINKS: Record<
  (typeof SLIDE_KEYS)[number],
  { primary: string; secondary: string }
> = {
  recovery: { primary: "/crypto-recovery", secondary: "/contact" },
  forensics: { primary: "/blockchain-forensics", secondary: "/contact" },
  banking: { primary: "/signup", secondary: "/banking-finance" },
  settlement: { primary: "/banking-finance", secondary: "/contact" },
};

const AUTOPLAY_MS = 7000;

export default function HomeHero() {
  const t = useTranslations("Home.Hero");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + SLIDE_KEYS.length) % SLIDE_KEYS.length);
  }, []);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDE_KEYS.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/img/bg.webp"
          className="h-full w-full object-cover"
        >
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 bg-linear-to-b from-neutral-950/90 via-neutral-950/50 to-neutral-950" />
      </div>

      <div
        className={`relative z-10 ${home.container} py-24 lg:py-28 w-full`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="max-w-2xl">
          <div className="relative min-h-[22rem] sm:min-h-[20rem] lg:min-h-[18rem]">
            {SLIDE_KEYS.map((key, index) => {
              const isActive = index === activeIndex;
              const links = SLIDE_LINKS[key];

              return (
                <div
                  key={key}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${SLIDE_KEYS.length}`}
                  aria-hidden={!isActive}
                  className={`space-y-8 transition-all duration-500 ease-out ${
                    isActive
                      ? "relative opacity-100 translate-y-0"
                      : "pointer-events-none absolute inset-0 opacity-0 translate-y-3"
                  }`}
                >
                  <div className="space-y-5">
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-white tracking-tight leading-[1.1]">
                      {t(`slides.${key}.title1`)}
                      {t(`slides.${key}.title2`)}
                      {t(`slides.${key}.title3`)}
                    </h1>

                    <div className="space-y-4 max-w-2xl">
                      <p className="text-lg text-neutral-300 leading-relaxed">
                        {t(`slides.${key}.subtitle1`)}
                      </p>
                      <p className="text-base text-neutral-400 leading-relaxed">
                        {t(`slides.${key}.subtitle2`)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={links.primary}>
                      <Button className={`${home.btnPrimary} h-11 shadow-none`}>
                        {t(`slides.${key}.btn_primary`)}
                      </Button>
                    </Link>
                    <Link href={links.secondary}>
                      <Button className={`${home.btnSecondary} h-11 shadow-none`}>
                        {t(`slides.${key}.btn_secondary`)}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 flex items-center gap-4"
            aria-label="Hero slides"
            role="tablist"
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-600 text-white hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              {SLIDE_KEYS.map((key, index) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-yellow-400"
                      : "w-2 bg-neutral-600 hover:bg-neutral-500"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-600 text-white hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
