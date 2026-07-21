"use client";

import { useState } from "react";
import { 
  Bell, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Layout,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

export default function NotificationsSettingsPage() {
  const t = useTranslations("Settings.Notifications");
  const [pushNotifs, setPushNotifs] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-7 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 pb-10">
      {/* Header */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
        <p className="text-zinc-500 text-sm mt-2">
          {t("subtitle")}
        </p>
      </section>

      {/* Group 1: General Notifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("push_notifs")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("allow_push")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("allow_push_desc")}</p>
              </div>
            </div>
            <Switch
              checked={pushNotifs}
              onCheckedChange={setPushNotifs}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("price_alerts")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("price_alerts_desc")}</p>
              </div>
            </div>
            <Switch
              checked={priceAlerts}
              onCheckedChange={setPriceAlerts}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("security_wallet")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("security_wallet_desc")}</p>
              </div>
            </div>
            <Switch
              checked={securityAlerts}
              onCheckedChange={setSecurityAlerts}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Group 2: Email Notifications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("email_comms")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Layout className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("product_updates")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("product_updates_desc")}</p>
              </div>
            </div>
            <Switch
              checked={true}
              disabled
              className="data-[state=checked]:bg-yellow-500 opacity-50"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("marketing_news")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("marketing_news_desc")}</p>
              </div>
            </div>
            <Switch
              checked={marketingEmail}
              onCheckedChange={setMarketingEmail}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-600">
           <AlertCircle className="h-3 w-3" />
           <p className="text-xs">{t("realtime_notice")}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            className="flex-1 sm:flex-none text-zinc-500 hover:text-white"
            onClick={() => window.location.reload()}
          >
            {t("reset_default")}
          </Button>
          <Button
            className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-semibold h-10 px-5 rounded-lg shadow-lg shadow-yellow-500/10 transition-colors"
          >
            {t("save_prefs")}
          </Button>
        </div>
      </div>
    </div>
  );
}
