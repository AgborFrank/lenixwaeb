import { getTranslations } from "next-intl/server";
import Image from "next/image";

const PILLARS = [
  { id: "actors", imageSrc: "/assets/img/investigate.webp", imagePosition: "right" as const },
  { id: "geopolitical", imageSrc: "/assets/img/security.webp", imagePosition: "left" as const },
  { id: "enforcement", imageSrc: "/assets/img/enhance.webp", imagePosition: "right" as const },
  { id: "delivery", imageSrc: "/assets/img/scale.webp", imagePosition: "left" as const },
] as const;

export default async function ThreatIntelligenceCapabilities() {
  const t = await getTranslations("ThreatIntelligence.Capabilities");

  return (
    <section id="capabilities" className="py-0">
      {PILLARS.map(({ id, imageSrc, imagePosition }, index) => (
        <div
          key={id}
          className={`relative py-20 md:py-32 overflow-hidden ${
            index % 2 === 0 ? "bg-black" : "bg-zinc-900/20"
          }`}
        >
          <div className="absolute inset-0 z-0">
            <Image src="/assets/img/bg.jpg" alt="" fill className="object-cover opacity-15" />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
          {imagePosition === "right" ? (
            <>
              <div className="absolute top-0 left-0 -ml-40 -mt-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-40 z-0 pointer-events-none" />
              <div className="absolute bottom-0 right-0 -mr-40 -mb-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 z-0 pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-40 z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-30 z-0 pointer-events-none" />
            </>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className={imagePosition === "right" ? "md:order-1" : "md:order-2"}>
                <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-4">
                  {t(`pillars.${id}.label`)}
                </p>
                <h3 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight">
                  {t(`pillars.${id}.title`)}
                </h3>
                <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl">
                  {t(`pillars.${id}.body`)}
                </p>
              </div>

              <div className={imagePosition === "right" ? "md:order-2" : "md:order-1"}>
                <div className="relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-black/20 border border-white/10">
                  <Image
                    src={imageSrc}
                    alt={t(`pillars.${id}.title`)}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
