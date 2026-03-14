import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Merchant() {
  const t = useTranslations("Home.Merchant");
  return (
    <section className="bg-accept bg-black py-20 px-6" >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interface mockup */}
          <div className="relative">
            <Image src="/assets/img/social.png" alt="Merchant" width={500} height={500} className="relative md:-bottom-20" />
          </div>

          {/* Right side - Content */}
          <div className="text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 md:leading-14 font-onest">
              {t("title1")}<span className="text-yellow-400">{t("title2")}</span>{t("title3")}
            </h2>

            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="md:text-base text-sm">
                  {t("point1")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
                  {t("point2")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="md:text-base text-sm">
                  {t("point3")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p className="md:text-base text-sm">
                  <Link href="/solutions" className="text-yellow-400 hover:underline">{t("point4_1")}</Link>
                  {t("point4_2")}
                  <Link href="/crypto-recovery" className="text-yellow-400 hover:underline">{t("point4_3")}</Link>
                  {t("point4_4")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
