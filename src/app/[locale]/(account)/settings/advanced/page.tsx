"use client";

import { useState } from "react";
import { 
  Fingerprint, 
  Download, 
  RefreshCcw, 
  ShieldAlert, 
  Terminal,
  Cpu,
  History,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

export default function AdvancedSettingsPage() {
  const t = useTranslations("Settings.Advanced");
  const [devMode, setDevMode] = useState(false);
  const [gasAnalytics, setDevAnalytics] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
        <p className="text-zinc-500 text-sm mt-2">
          {t("subtitle")}
        </p>
      </section>

      {/* Group 1: Developer Tools */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("dev_tools_title")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("dev_mode")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("dev_mode_desc")}</p>
              </div>
            </div>
            <Switch
              checked={devMode}
              onCheckedChange={setDevMode}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("gas_analytics")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("gas_analytics_desc")}</p>
              </div>
            </div>
            <Switch
              checked={gasAnalytics}
              onCheckedChange={setDevAnalytics}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Group 2: Data Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("data_mgmt_title")}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <button className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-800/30 transition-all group">
              <div className="flex items-center gap-4 text-left">
                 <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                    <Download className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">{t("state_logs")}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{t("download")}</p>
                 </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
           </button>

           <button className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-800/30 transition-all group">
              <div className="flex items-center gap-4 text-left">
                 <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                    <RefreshCcw className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">{t("sync_data")}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{t("force_refresh")}</p>
                 </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
           </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-red-500">{t("danger_zone")}</h3>
        </div>

        <div className="bg-red-600/5 border border-red-600/20 rounded-lg overflow-hidden divide-y divide-red-600/10">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-bold text-white">{t("reset_account")}</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-md">
                 {t("reset_account_desc")}
              </p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-red-600/20 hover:bg-red-600 hover:text-white text-red-500 font-bold px-5 h-10 rounded-lg transition-all">
               {t("reset_state")}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-red-500">{t("delete_account")}</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-md">
                 {t("delete_account_desc")}
              </p>
            </div>
            <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-5 h-10 rounded-lg shadow-lg shadow-red-600/20 transition-all">
               {t("delete_forever")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pt-6 border-t border-white/5 flex justify-center">
         <p className="text-xs text-zinc-600 flex items-center gap-2">
            <Fingerprint className="h-3 w-3" />
            {t("footer_engine")}
         </p>
      </div>
    </div>
  );
}
