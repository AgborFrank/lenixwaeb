"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Payment() {
  const t = useTranslations("Home.Payment");

  const OFFERS = [
    {
      id: "fiat",
      image: "/assets/img/global-payment-editable-illustration-design_203633-11686.avif",
    },
    {
      id: "vault",
      image: "/assets/img/scale.webp",
    },
    {
      id: "recovery",
      image: "/assets/img/enhance.webp",
    },
    {
      id: "lending",
      image: "/assets/img/tokenomic.png",
    },
  ] as const;

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
          {OFFERS.map(({ id, image }) => (
            <article
              key={id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-400/25 hover:bg-white/10 transition-all duration-200"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={image}
                  alt={t(`cards.${id}.title`)}
                  fill
                  className="object-cover opacity-65 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              <div className="p-6 lg:p-7 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-lg font-onest mb-2">
                  {t(`cards.${id}.title`)}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(`cards.${id}.desc`)}
                </p>
              </div>
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
