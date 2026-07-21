"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Lock,
  History,
  Fingerprint,
  ShieldAlert,
  Key,
  Monitor,
  ChevronRight,
  ShieldCheck,
  SmartphoneNfc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getSettings, updateSecurity } from "../actions";

export function SecuritySettings() {
  const t = useTranslations("Settings.Security");
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSettings().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      if (data) setTwoFactor(data.two_factor_enabled);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handle2FAToggle = async (checked: boolean) => {
    setTwoFactor(checked);
    setSaving(true);
    const { error } = await updateSecurity({ two_factor_enabled: checked });
    setSaving(false);
    if (error) {
      toast.error(error);
      setTwoFactor(!checked);
      return;
    }
    toast.success(checked ? t("toast_2fa_enabled") : t("toast_2fa_disabled"));
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse max-w-3xl mx-auto">
        <div className="h-5 w-32 bg-zinc-800 rounded" />
        <div className="h-40 bg-zinc-800 rounded-lg" />
        <div className="h-5 w-32 bg-zinc-800 rounded" />
        <div className="h-48 bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Header */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
        <p className="text-zinc-500 text-sm mt-2">
          {t("subtitle")}
        </p>
      </section>

      {/* Group 1: Account Protection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("account_protection")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          {/* 2FA */}
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("two_factor")}</p>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-md">
                   {t("two_factor_desc")}
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={handle2FAToggle}
              disabled={saving}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          {/* Biometric */}
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("biometric_title")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("biometric_subtitle")}</p>
              </div>
            </div>
            <Switch
              checked={biometric}
              onCheckedChange={setBiometric}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          {/* Auto Lock */}
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("auto_lock_title")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("auto_lock_subtitle")}</p>
              </div>
            </div>
            <Switch
              checked={autoLock}
              onCheckedChange={setAutoLock}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Group 2: Advanced Privacy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("advanced_privacy")}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <button className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-800/30 transition-all group">
              <div className="flex items-center gap-4 text-left">
                 <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                    <History className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">{t("log_activity")}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{t("enabled")}</p>
                 </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
           </button>

           <button className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-800/30 transition-all group">
              <div className="flex items-center gap-4 text-left">
                 <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-white transition-colors">
                    <Monitor className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white">{t("connected_sites")}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-0.5">{t("sites_count", { count: 12 })}</p>
                 </div>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-white" />
           </button>
        </div>
      </section>

      {/* Group 3: Login History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SmartphoneNfc className="h-4 w-4 text-yellow-400" />
          <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("login_activity_title")}</h3>
        </div>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          {[
            { device: "Chrome on Windows", location: "New York, USA", time: "Just now", status: "Active", icon: Monitor },
            { device: "Safari on iPhone", location: "New York, USA", time: "2 hours ago", status: "Signed out", icon: Smartphone },
          ].map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                  <login.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{login.device}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {login.location} • {login.time}
                  </p>
                </div>
              </div>
              {login.status === "Active" ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                   <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">{t("current")}</span>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{login.status}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Risk Banner */}
      <section className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex flex-col sm:flex-row items-center gap-4">
          <div className="p-2 rounded-lg bg-yellow-500 text-zinc-950">
             <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center sm:text-left">
             <p className="text-sm font-bold text-white">{t("recovery_phrase_title")}</p>
             <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {t("recovery_phrase_desc")}
             </p>
          </div>
          <Button size="sm" className="bg-white text-black hover:bg-zinc-200 font-bold rounded-lg px-6">
             {t("back_up_now")}
          </Button>
      </section>

      {/* Footer */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-3 text-center">
         <p className="text-xs text-zinc-600 flex items-center gap-2">
            <Lock className="h-3 w-3" />
            {t("encrypted_notice")}
         </p>
      </div>
    </div>
  );
}
