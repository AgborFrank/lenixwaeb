"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { X } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";

interface LanguagePickerProps {
  showFullName?: boolean;
  isDark?: boolean;
}

export function LanguagePicker({ showFullName = false, isDark = false }: LanguagePickerProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const pathname = usePathname();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
    setIsLangModalOpen(false);
  };

  const getFlagCode = (localeCode: string) => {
    switch (localeCode) {
      case "en": return "us";
      case "fr": return "fr";
      case "es": return "es";
      case "de": return "de";
      case "ar": return "ae";
      case "pt": return "pt";
      case "zh": return "cn";
      case "it": return "it";
      case "vi": return "vn";
      case "tl": return "ph";
      case "tr": return "tr";
      case "hi": return "in";
      case "id": return "id";
      default: return "us";
    }
  };

  const getCountryName = (localeCode: string) => {
    switch (localeCode) {
      case "en": return "United States";
      case "fr": return "France";
      case "es": return "Spain";
      case "de": return "Germany";
      case "ar": return "United Arab Emirates";
      case "pt": return "Portugal";
      case "zh": return "China";
      case "it": return "Italy";
      case "vi": return "Vietnam";
      case "tl": return "Philippines";
      case "tr": return "Turkey";
      case "hi": return "India";
      case "id": return "Indonesia";
      default: return "";
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsLangModalOpen(true)}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[14px] font-medium transition-colors ${!showFullName ? "uppercase" : ""} ${
          isDark 
            ? "border-white/20 text-gray-300 hover:bg-white/10 hover:text-white" 
            : "border-gray-200 text-white hover:bg-white/10"
        }`}
        aria-label="Change language"
      >
        <span 
          className={`fi fi-${getFlagCode(locale)} fis flex h-4 w-4 items-center justify-center overflow-hidden rounded-full shadow-sm`}
          style={{ fontSize: "16px" }} 
        />
        {showFullName ? t(`languages.${locale}`) : locale}
      </button>

      {/* Language Selection Modal */}
      {mounted && isLangModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsLangModalOpen(false)}
        >
          <div 
            className="w-full max-w-md overflow-hidden rounded-[24px] bg-[#111111] shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div>
                <h2 className="text-xl font-bold text-white">{t("languagePicker.title")}</h2>
                <p className="mt-1 text-sm text-gray-400">{t("languagePicker.description")}</p>
              </div>
              <button 
                onClick={() => setIsLangModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-3 grid grid-cols-1 gap-1 max-h-[360px] overflow-y-auto">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-medium transition-all ${
                    locale === loc 
                      ? "bg-yellow-400/10 text-yellow-400 " 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span 
                      className={`fi fi-${getFlagCode(loc)} fis flex h-6 w-6 items-center justify-center overflow-hidden rounded-full shadow-sm`}
                      style={{ fontSize: "24px" }} 
                    />
                    <span>{getCountryName(loc)} ({t(`languages.${loc}`)})</span>
                  </span>
                  {locale === loc && (
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="bg-[#0a0a0a] p-6 text-center border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Lenix Protocol</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
