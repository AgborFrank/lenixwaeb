import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Merchant() {
  const t = useTranslations("Home.Merchant");
  return (
    <section className="bg-accept bg-black py-20 px-6" >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Interface mockup */}
          <div className="relative">
            <div className="bg-black rounded-2xl p-6 border border-gray-800 max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-yellow-400 font-semibold">
                  {t("widget_alert")}
                </h3>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">
                  {t("widget_req")}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t("widget_verified")}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <div className="text-green-400 text-4xl font-bold mb-1">
                  $84.99
                </div>
                <div className="text-gray-300 text-lg">85 USDT</div>
              </div>

              {/* Transaction details */}
              <div className="mb-6">
                <div className="text-xs text-gray-400 mb-2">
                  {t("widget_receipt")}{" "}
                  <span className="text-yellow-400">brad@alphacorp.com</span>
                </div>
                <div className="text-sm text-gray-400 mb-2">{t("widget_wallet")}</div>
                <div className="bg-gray-800 rounded-lg p-3 text-gray-300 font-mono text-sm">
                  0xC7f5***95dD1727b54E
                </div>
              </div>

              {/* Order breakdown */}
              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-3">{t("widget_order")}</div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-yellow-400 font-bold text-lg">
                      $84.99
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-2 flex items-center justify-center">
                    <div className="text-yellow-400 text-sm font-bold">+</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-green-400 font-bold">$0.18</div>
                    <div className="text-xs text-gray-400">{t("widget_gas")}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 flex-1 text-center">
                    <div className="text-white font-bold">$85.17</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button className="bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg flex-1 hover:bg-yellow-300 transition-colors">
                  {t("btn_complete")}
                </button>
                <button className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg flex-1 hover:bg-gray-700 transition-colors">
                  {t("btn_manual")}
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-8 leading-tight font-onest">
              {t("title1")}<span className="text-yellow-400">{t("title2")}</span>{t("title3")}
            </h2>

            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
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
                <p>
                  {t("point3")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-3 flex-shrink-0"></div>
                <p>
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
