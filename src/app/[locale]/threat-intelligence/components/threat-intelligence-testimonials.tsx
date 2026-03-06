"use client";

import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Lenix Protocol's asset-agnostic scoring capabilities, configurable risk rules, as well as the extensive selection of cryptocurrencies supported are crucial for Revolut's compliance operations and broadened cryptocurrency offering.",
    author: "Ed Cooper",
    role: "Head of Crypto",
    company: "Revolut",
  },
  {
    quote:
      "Lenix Protocol has been our trusted partner since 2015, helping strengthen our AML program and create a new standard for compliance in the crypto industry. We value their emphasis on data precision, as well as their commitment to building a more transparent and safer crypto economy.",
    author: "Coinbase",
    role: null,
    company: null,
  },
  {
    quote:
      "For crypto exchanges, regulatory compliance and confidence are paramount. Lenix Protocol's best-in-class blockchain analytics solutions enable us to enhance risk management, protect our users, and mitigate risks from financial crime.",
    author: "Mike Williams",
    role: "Chief Communication Officer",
    company: "Toobit",
  },
  {
    quote:
      "When it comes to transaction monitoring, wallet surveillance and investigations, Lenix Protocol are leading industry players. Their capabilities and blockchain analytics are essential for MANTRA, as we compliantly work to bring the world's financial ecosystem onchain by being the preferred ledger of record for real-world assets.",
    author: "Sebastian Heine",
    role: "Chief Compliance Officer",
    company: "MANTRA",
  },
] as const;

export default function ThreatIntelligenceTestimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.3; // pixels per frame

    const scroll = () => {
      if (isPaused) return;

      scrollPosition += scrollSpeed;
      const maxScroll = container.scrollWidth / 2; // Half because we duplicated

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0; // Reset to start for seamless loop
      }

      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth / 4; // 4 columns visible
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-20 overflow-hidden border-y border-white/5">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/img/bg.jpg')",
            opacity: 0.25,
          }}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-60 z-0" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl opacity-50 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Hear from our customers
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Trusted by leading exchanges and institutions worldwide.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons with Glass Effect */}
          <button
            onClick={() => scroll("left")}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:border-yellow-400/60 hover:bg-black/60 flex items-center justify-center transition-all duration-300 group shadow-xl"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors" />
          </button>

          <button
            onClick={() => scroll("right")}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:border-yellow-400/60 hover:bg-black/60 flex items-center justify-center transition-all duration-300 group shadow-xl"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-yellow-400 transition-colors" />
          </button>

          {/* Carousel Track - Shows 4 columns, infinite scroll */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-hidden scrollbar-hide"
          >
            {duplicatedTestimonials.map(({ quote, author, role, company }, index) => (
              <div
                key={`${author}-${index}`}
                className="shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                {/* Glass Card with Gradient Border */}
                <div className="group relative rounded-2xl h-full flex flex-col overflow-hidden">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  
                  {/* Glass Background */}
                  <div className="relative z-10 h-full flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-yellow-400/30 group-hover:bg-white/10 transition-all duration-300 p-6">
                    <Quote className="w-8 h-8 text-yellow-400/80 mb-4 shrink-0 drop-shadow-lg" />
                    <blockquote className="text-zinc-200 text-sm leading-relaxed mb-6 grow">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                    <footer className="mt-auto">
                      <cite className="not-italic text-white font-bold block">
                        {author}
                      </cite>
                      {(role || company) && (
                        <p className="text-zinc-400 text-sm mt-0.5">
                          {[role, company].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </footer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
