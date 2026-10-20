"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  SettingsActions,
  SettingsField,
  SettingsLoading,
  SettingsPageHeader,
  SettingsRow,
  SettingsRowList,
  SettingsSection,
  SettingsToggle,
} from "../_components/settings-ui";

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  SYSTEM_CONFIG_KEYS,
  type NotificationSettings,
} from "@/lib/platform-settings";

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/settings?key=${encodeURIComponent(SYSTEM_CONFIG_KEYS.notifications)}`,
      );
      const result = await res.json();
      if (res.ok && result.data) {
        setSettings({ ...DEFAULT_NOTIFICATION_SETTINGS, ...result.data });
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
        body: JSON.stringify({ key: SYSTEM_CONFIG_KEYS.notifications, value: settings }),
      });
      if (res.ok) {
        toast.success("Notification preferences saved");
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

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="Notifications"
        description="Email and Telegram routing for admin alerts. Delivery depends on server mail and bot configuration."
      />

      <SettingsSection title="Email" description="Messages to your admin inbox." bodyClassName="p-0">
        <SettingsRowList>
          <SettingsRow label="New signups" hint="When a user completes registration.">
            <SettingsToggle
              label="New signups"
              checked={settings.email_new_user}
              onChange={(checked) => setSettings({ ...settings, email_new_user: checked })}
            />
          </SettingsRow>
          <SettingsRow label="New loan applications" hint="Loan intake submitted.">
            <SettingsToggle
              label="New loan applications"
              checked={settings.email_new_loan}
              onChange={(checked) => setSettings({ ...settings, email_new_loan: checked })}
            />
          </SettingsRow>
          <SettingsRow label="Loan status changes" hint="Approval, rejection, or closure.">
            <SettingsToggle
              label="Loan status changes"
              checked={settings.email_loan_status}
              onChange={(checked) => setSettings({ ...settings, email_loan_status: checked })}
            />
          </SettingsRow>
          <SettingsRow label="Recovery requests" hint="New recovery desk intake.">
            <SettingsToggle
              label="Recovery requests"
              checked={settings.email_recovery_request}
              onChange={(checked) =>
                setSettings({ ...settings, email_recovery_request: checked })
              }
            />
          </SettingsRow>
          <SettingsRow label="Refund requests" hint="Purchase refund intake.">
            <SettingsToggle
              label="Refund requests"
              checked={settings.email_refund_request}
              onChange={(checked) =>
                setSettings({ ...settings, email_refund_request: checked })
              }
            />
          </SettingsRow>
          <SettingsRow label="Large withdrawals" hint="Above your configured threshold.">
            <SettingsToggle
              label="Large withdrawals"
              checked={settings.email_large_withdrawal}
              onChange={(checked) =>
                setSettings({ ...settings, email_large_withdrawal: checked })
              }
            />
          </SettingsRow>
          <SettingsRow label="Daily summary" hint="Digest of platform activity.">
            <SettingsToggle
              label="Daily summary"
              checked={settings.email_daily_summary}
              onChange={(checked) =>
                setSettings({ ...settings, email_daily_summary: checked })
              }
            />
          </SettingsRow>
        </SettingsRowList>
      </SettingsSection>

      <SettingsSection title="Telegram" description="Optional instant alerts.">
        <SettingsRowList>
          <SettingsRow label="Enable Telegram" hint="Send copies of selected alerts to a chat.">
            <SettingsToggle
              label="Enable Telegram"
              checked={settings.telegram_enabled}
              onChange={(checked) => setSettings({ ...settings, telegram_enabled: checked })}
            />
          </SettingsRow>
        </SettingsRowList>
        {settings.telegram_enabled ? (
          <div className="border-t border-white/[0.06] p-4 sm:p-5">
            <SettingsField
              label="Chat ID"
              hint="Message @userinfobot on Telegram to obtain your numeric chat ID."
            >
              <input
                type="text"
                value={settings.telegram_chat_id}
                onChange={(e) =>
                  setSettings({ ...settings, telegram_chat_id: e.target.value })
                }
                placeholder="e.g. 123456789"
                className={adminGlass.input}
              />
            </SettingsField>
          </div>
        ) : null}
      </SettingsSection>

      <SettingsSection title="Browser" bodyClassName="p-0">
        <SettingsRowList>
          <SettingsRow label="Push notifications" hint="Web push is not wired up yet.">
            <span className={adminGlass.badgeMuted}>Not available</span>
          </SettingsRow>
        </SettingsRowList>
      </SettingsSection>

      <SettingsActions>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={adminGlass.buttonPrimary}
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          Save
        </button>
      </SettingsActions>
    </>
  );
}
