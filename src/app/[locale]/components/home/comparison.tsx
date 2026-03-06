import { useTranslations } from "next-intl";

export default function Comparison() {
  const t = useTranslations("Home.Comparison");
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 md:gap-32 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-5xl font-bold text-gray-900 font-onest leading-tight">
              {t("title1")}{" "}
              <span className="bg-yellow-300 px-2 py-1 rounded">
                {t("title2")}
              </span>
            </h2>
            <p className="text-md text-gray-600 leading-relaxed font-onest">
              {t("subtitle")}
            </p>
          </div>

          {/* Right - Comparison Cards */}
          <div className="space-y-4 max-w-[400px] right-0 ">
            {/* Stripe Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">stripe</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">{t("card1")}</div>
              </div>
            </div>

            {/* Wise Card */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">wise</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">{t("card2")}</div>
              </div>
            </div>

            {/* Lenix Protocol Card - Highlighted */}
            <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-6 text-black flex items-center justify-between border-4 border-yellow-500 shadow-lg transform scale-105">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold flex items-center">
                  <span className="mr-2">⚡</span>
                  Lenix Protocol
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {t("card3")}
                </div>
              </div>
            </div>

            {/* Coinbase Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">coinbase</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">
                  {t("card4")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
