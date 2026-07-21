"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { home } from "@/lib/home-styles";

export default function Merchant() {
  const t = useTranslations("Home.Merchant");

  return (
    <section className={`${home.section} ${home.sectionMuted}`}>
      <div className={home.container}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`${home.card} relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]`}>
            <Image
              src="/assets/vectors/pay.svg"
              alt={t("image_alt")}
              fill
              className={home.mediaImage}
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          <div>
            <h2 className={`${home.title} mb-6`}>
              {t("title1")}
              {t("title2")}
              {t("title3")}
            </h2>

            <ul className="space-y-4 mb-8 list-none p-0 m-0">
              {[t("point1"), t("point2"), t("point3")].map((point) => (
                <li key={point} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-neutral-400 leading-relaxed">
              <Link href="/solutions" className={home.textLink}>
                {t("point4_1")}
              </Link>
              {t("point4_2")}
              <Link href="/crypto-recovery" className={home.textLink}>
                {t("point4_3")}
              </Link>
              {t("point4_4")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
