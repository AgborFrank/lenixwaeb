"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Bell, Mail, MessageSquare, AlertCircle } from "lucide-react";

interface NotificationSettings {
  email_new_user: boolean;
  email_new_loan: boolean;
  email_loan_status: boolean;
  email_recovery_request: boolean;
  email_large_withdrawal: boolean;
  email_daily_summary: boolean;
  push_enabled: boolean;
  telegram_enabled: boolean;
  telegram_chat_id: string;
}

const defaultSettings: NotificationSettings = {
  email_new_user: true,
  email_new_loan: true,
  email_loan_status: true,
  email_recovery_request: true,
  email_large_withdrawal: true,
  email_daily_summary: false,
  push_enabled: false,
  telegram_enabled: false,
  telegram_chat_id: "",
};

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings?key=notification_settings");
      const result = await res.json();
      if (res.ok && result.data) {
        setSettings({ ...defaultSettings, ...result.data });
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "notification_settings", value: settings }),
      });
      if (res.ok) {
        toast.success("Notification settings saved");
      } else {
        const result = await res.json();
        toast.error(result.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  function Toggle({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-yellow-400" : "bg-zinc-600"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Configure how you receive alerts and updates
        </p>
      </div>

      {/* Email Notifications */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <Mail className="h-4 w-4 text-yellow-400" />
            Email Notifications
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Receive email alerts for important events
          </p>
        </div>
        <div className="divide-y divide-zinc-800">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">New User Registrations</p>
              <p className="text-xs text-zinc-500">
                Get notified when a new user signs up
              </p>
            </div>
            <Toggle
              checked={settings.email_new_user}
              onChange={(checked) =>
                setSettings({ ...settings, email_new_user: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">New Loan Applications</p>
              <p className="text-xs text-zinc-500">
                Alert when someone applies for a loan
              </p>
            </div>
            <Toggle
              checked={settings.email_new_loan}
              onChange={(checked) =>
                setSettings({ ...settings, email_new_loan: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">Loan Status Changes</p>
              <p className="text-xs text-zinc-500">
                Notify on loan approvals, rejections, or completions
              </p>
            </div>
            <Toggle
              checked={settings.email_loan_status}
              onChange={(checked) =>
                setSettings({ ...settings, email_loan_status: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">Recovery Requests</p>
              <p className="text-xs text-zinc-500">
                Alert when new recovery assistance is requested
              </p>
            </div>
            <Toggle
              checked={settings.email_recovery_request}
              onChange={(checked) =>
                setSettings({ ...settings, email_recovery_request: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">Large Withdrawals</p>
              <p className="text-xs text-zinc-500">
                Get alerted for withdrawals above threshold
              </p>
            </div>
            <Toggle
              checked={settings.email_large_withdrawal}
              onChange={(checked) =>
                setSettings({ ...settings, email_large_withdrawal: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-white">Daily Summary</p>
              <p className="text-xs text-zinc-500">
                Receive a daily digest of platform activity
              </p>
            </div>
            <Toggle
              checked={settings.email_daily_summary}
              onChange={(checked) =>
                setSettings({ ...settings, email_daily_summary: checked })
              }
            />
          </div>
        </div>
      </section>

      {/* Telegram Notifications */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <MessageSquare className="h-4 w-4 text-yellow-400" />
            Telegram Notifications
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Receive instant alerts via Telegram
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Enable Telegram</p>
              <p className="text-xs text-zinc-500">
                Send notifications to your Telegram
              </p>
            </div>
            <Toggle
              checked={settings.telegram_enabled}
              onChange={(checked) =>
                setSettings({ ...settings, telegram_enabled: checked })
              }
            />
          </div>
          {settings.telegram_enabled && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">
                Telegram Chat ID
              </label>
              <input
                type="text"
                value={settings.telegram_chat_id}
                onChange={(e) =>
                  setSettings({ ...settings, telegram_chat_id: e.target.value })
                }
                placeholder="Enter your Telegram chat ID"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                Get your chat ID by messaging @userinfobot on Telegram
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Push Notifications */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <Bell className="h-4 w-4 text-yellow-400" />
            Browser Notifications
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Receive push notifications in your browser
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Push Notifications</p>
              <p className="text-xs text-zinc-500">
                Enable browser push notifications
              </p>
            </div>
            <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400">
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-yellow-300 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
