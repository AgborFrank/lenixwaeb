"use client";

import { useState, useEffect } from "react";
import { Globe, Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getSettings,
  updatePreferences,
  type PreferredCurrency,
  type Language,
  type Theme,
} from "../actions";

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const dark =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.cookie = `lenix_theme=${theme}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

const CURRENCIES: { value: PreferredCurrency; label: string }[] = [
  { value: "usd", label: "USD ($)" },
  { value: "eur", label: "EUR (€)" },
  { value: "gbp", label: "GBP (£)" },
  { value: "jpy", label: "JPY (¥)" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

const THEMES: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

export function PreferencesSettings() {
  const [currency, setCurrency] = useState<PreferredCurrency>("usd");
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [transactionNotifs, setTransactionNotifs] = useState(true);
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
    toast.success("Preferences saved");
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
        </div>
        <Separator className="bg-white/5" />
        <div className="space-y-4">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="h-12 bg-zinc-800 rounded" />
          <div className="h-12 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Regional Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Globe className="h-4 w-4 text-zinc-400" />
          Regional
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-zinc-400">Language</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-yellow-500/20">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Currency</Label>
            <Select value={currency} onValueChange={(v) => setCurrency(v as PreferredCurrency)}>
              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-yellow-500/20">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-zinc-400">Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white focus:ring-yellow-500/20">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {THEMES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-zinc-400" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-xs text-zinc-500">Receive updates about your account activity.</p>
            </div>
            <Switch
              checked={emailNotifs}
              onCheckedChange={setEmailNotifs}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div>
              <p className="text-sm font-medium text-white">Transaction Alerts</p>
              <p className="text-xs text-zinc-500">Get notified about deposits and withdrawals.</p>
            </div>
            <Switch
              checked={transactionNotifs}
              onCheckedChange={setTransactionNotifs}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
        >
          {saving ? "Saving…" : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
