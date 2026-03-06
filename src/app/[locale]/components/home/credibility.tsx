import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Credibility() {
  const t = useTranslations("Home.Credibility");
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
            {t("title1")}{" "}
            <span className="bg-yellow-400 px-2 py-1 rounded-full">{t("title2")}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {t("subtitle1")}
          </p>
          <p className="text-lg text-gray-600">
            {t("subtitle2_1")}
            <span className="font-semibold text-black">{t("subtitle2_2")}</span>
            {t("subtitle2_3")}
          </p>
        </div>

        {/* Two Column Content */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left Column - CertiK Audit */}
          <div className="text-center">
            <Image
              src="/assets/img/certiklogo.png"
              alt="CertiK"
              className="w-1/2 mx-auto mb-4"
              width={100}
              height={100}
            />
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {t("col1_text")}
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <span>{t("col1_btn")}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column - Whitepaper */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {t("col2_text")}
            </p>
            <button className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto">
              <span>{t("col2_btn")}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
