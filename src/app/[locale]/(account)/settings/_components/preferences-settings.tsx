"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Moon, Laptop, Sun, Layers, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  getSettings,
  updatePreferences,
  type PreferredCurrency,
  type Language,
  type Theme,
} from "../actions";
import { cn } from "@/lib/utils";

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const dark =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.cookie = `lenix_theme=${theme}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

export function PreferencesSettings() {
  const t = useTranslations("Settings.Preferences");
  const [currency, setCurrency] = useState<PreferredCurrency>("usd");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [transactionNotifs, setTransactionNotifs] = useState(true);
  const [hideDust, setHideDust] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const CURRENCIES: { value: PreferredCurrency; label: string; symbol: string }[] = [
    { value: "usd", label: t("currency_options.usd.label"), symbol: "$" },
    { value: "eur", label: t("currency_options.eur.label"), symbol: "€" },
    { value: "gbp", label: t("currency_options.gbp.label"), symbol: "£" },
    { value: "jpy", label: t("currency_options.jpy.label"), symbol: "¥" },
  ];

  const LANGUAGES: { value: Language; label: string; flag: string }[] = [
    { value: "en", label: "English (US)", flag: "🇺🇸" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  const THEMES = [
    { value: "dark", label: t("themes.dark"), icon: Moon, description: t("themes.dark_desc") },
    { value: "light", label: t("themes.light"), icon: Sun, description: t("themes.light_desc") },
    { value: "system", label: t("themes.system"), icon: Laptop, description: t("themes.system_desc") },
  ];

  useEffect(() => {
    let mounted = true;
    getSettings().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      if (data) {
        setCurrency(data.preferred_currency);
        setLanguage(data.language);
        setTheme(data.theme);
        setEmailNotifs(data.notifications_email);
        setTransactionNotifs(data.notifications_transactions);
      }
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updatePreferences({
      preferred_currency: currency,
      language,
      theme,
      notifications_email: emailNotifs,
      notifications_transactions: transactionNotifs,
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    applyThemeToDocument(theme);
    toast.success(t("toast_success"));
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-3xl mx-auto">
        <div className="h-6 w-32 bg-zinc-800 rounded" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 bg-zinc-800 rounded-lg" />
          <div className="h-24 bg-zinc-800 rounded-lg" />
        </div>
        <div className="h-40 bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Visual Header */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{t("title")}</h2>
        <p className="text-zinc-500 text-sm mt-2">
          {t("subtitle")}
        </p>
      </section>

      {/* Group 1: Appearance */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("app_theme")}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value as Theme)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors group",
                theme === t.value
                  ? "bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5"
                  : "bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-800/50"
              )}
            >
              <div className={cn(
                "p-2 rounded transition-colors",
                theme === t.value ? "bg-yellow-500 text-zinc-950" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
              )}>
                <t.icon className="h-4 w-4" />
              </div>
              <div className="text-center">
                <p className={cn("text-sm font-bold", theme === t.value ? "text-white" : "text-zinc-400")}>{t.label}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{t.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Group 2: Regional & Localization */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("currency_language")}</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-zinc-400 ml-1">{t("display_language")}</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="h-11 bg-zinc-900/50 border-white/5 text-white focus:ring-yellow-500/20 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value} className="focus:bg-yellow-500 focus:text-zinc-950">
                    <span className="mr-2">{l.flag}</span> {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-zinc-400 ml-1">{t("local_currency")}</Label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as PreferredCurrency)}>
              <SelectTrigger className="h-11 bg-zinc-900/50 border-white/5 text-white focus:ring-yellow-500/20 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="focus:bg-yellow-500 focus:text-zinc-950">
                    <span className="mr-2 font-mono text-xs opacity-50">{c.symbol}</span> {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Group 3: Privacy & Display */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Privacy & Display</h3>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Hide Small Balances</p>
                <p className="text-xs text-zinc-500 mt-0.5">Hide assets with value less than 1 USD.</p>
              </div>
            </div>
            <Switch
              checked={hideDust}
              onCheckedChange={setHideDust}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                {showValues ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-bold text-white">Privacy Mode</p>
                <p className="text-xs text-zinc-500 mt-0.5">Mask your balances from the dashboard.</p>
              </div>
            </div>
            <Switch
              checked={!showValues}
              onCheckedChange={(v) => setShowValues(!v)}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Group 4: Notifications */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">{t("notifications")}</h3>

        <div className="bg-zinc-900/30 border border-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex flex-1 gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("security_alerts")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("payouts_activity")}</p>
              </div>
            </div>
            <Switch
              checked={transactionNotifs}
              onCheckedChange={setTransactionNotifs}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group">
            <div className="flex flex-1 gap-4">
              <div className="mt-1 p-2 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t("email_notifications")}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{t("real_time_updates")}</p>
              </div>
            </div>
            <Switch
              checked={emailNotifs}
              onCheckedChange={setEmailNotifs}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-600 text-center sm:text-left">
           {t("subtitle")}
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            className="flex-1 sm:flex-none text-zinc-500 hover:text-white"
            onClick={() => window.location.reload()}
          >
            {t("reset")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-semibold h-10 px-5 rounded-lg shadow-lg shadow-yellow-500/10 transition-all active:scale-95"
          >
            {saving ? t("updating") : t("save_changes")}
          </Button>
        </div>
      </div>
    </div>
  );
}
