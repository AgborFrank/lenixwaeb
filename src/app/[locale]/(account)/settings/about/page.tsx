"use client";

import { 
  ChevronRight, 
  ExternalLink, 
  Github, 
  Twitter, 
  Globe, 
  FileText, 
  Scale,
  Heart,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSettingsPage() {
  const t = useTranslations("Settings.About");
  const version = "2.4.0-stable";
  const buildDate = "July 2026";

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 pb-10">
      {/* Brand Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">{t("title")}</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          {t("version_build", { version, date: buildDate })}
        </p>
      </section>

      {/* Group 1: Links */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("connect_support")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Globe className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("visit_website")}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("follow_x")}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Zap className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("contact_support")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>
        </div>
      </section>

      {/* Group 2: Legal */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("legal_privacy")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("privacy_policy")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Scale className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("terms_of_use")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">{t("attributions")}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <section className="text-center pt-6 border-t border-white/5 space-y-4">
         <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mx-auto">
            {t("disclaimer")}
         </p>
         <div className="pt-3 flex justify-center gap-4 text-zinc-600">
            <Github className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
            <Globe className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
         </div>
         <p className="text-[10px] text-zinc-700 uppercase font-black tracking-widest mt-8">
            {t("copyright")}
         </p>
      </section>
    </div>
  );
}
