"use client";

import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ContactForm from "../../contact/components/contact-form";

export default function ContactCTA() {
  const t = useTranslations("About.Contact");
  return (
    <section className="bg-black py-20 px-4 z-20">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("title")}
            </h2>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-40 items-center">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {t("get_in_touch")}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {t("desc")}
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{t("methods.email")}</h4>
                    <p className="text-gray-400">recovery@lenixprotocol.com</p>
                    <p className="text-gray-400">loan@lenixprotocol.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{t("methods.call")}</h4>
                    <p className="text-gray-400">+447887052128</p>
                    <p className="text-gray-400">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{t("methods.visit")}</h4>
                    <p className="text-gray-400">123 Blockchain Street</p>
                    <p className="text-gray-400">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

               <div className="flex gap-8">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  {t("actions.demo")}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full bg-transparent border border-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors">
                  {t("actions.whitepaper")}
                </button>
              </div>
            </div>

            {/* Contact Form - same as contact page */}
            <ContactForm />
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">{t("footer.support")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">2hrs</div>
              <div className="text-gray-400">{t("footer.response")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">{t("footer.confidential")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
