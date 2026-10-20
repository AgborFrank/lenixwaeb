"use client";

import { Loader2, Save } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  DEFAULT_PLATFORM_CONFIG,
  SYSTEM_CONFIG_KEYS,
  type PlatformConfig,
} from "@/lib/platform-settings";
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
import { useAdminSetting } from "../_components/use-admin-setting";

export default function PlatformSettingsPage() {
  const { data, setData, isLoading, isSaving, save } = useAdminSetting<PlatformConfig>(
    SYSTEM_CONFIG_KEYS.platform,
    DEFAULT_PLATFORM_CONFIG,
  );

  if (isLoading) return <SettingsLoading />;

  return (
    <>
      <SettingsPageHeader
        title="Site"
        description="Public-facing identity, maintenance window, and routing emails for support desks."
      />

      <SettingsSection title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Display name">
            <input
              type="text"
              value={data.site_name}
              onChange={(e) => setData({ ...data, site_name: e.target.value })}
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Default locale" hint="Used when no locale prefix is present.">
            <input
              type="text"
              value={data.default_locale}
              onChange={(e) => setData({ ...data, default_locale: e.target.value })}
              className={adminGlass.input}
            />
          </SettingsField>
        </div>
        <SettingsField
          label="Announcement banner"
          hint="Optional short message on account surfaces. Leave empty to hide."
        >
          <textarea
            value={data.announcement_banner ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                announcement_banner: e.target.value.trim() ? e.target.value : null,
              })
            }
            rows={2}
            className={`${adminGlass.input} min-h-[4.5rem] py-2`}
          />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Contact routing" description="Inbox targets for automated mail.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["support_email", "Support"],
              ["recovery_email", "Recovery desk"],
              ["loan_email", "Loan desk"],
              ["privacy_email", "Privacy / DSR"],
            ] as const
          ).map(([key, label]) => (
            <SettingsField key={key} label={label}>
              <input
                type="email"
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className={adminGlass.input}
              />
            </SettingsField>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Availability" bodyClassName="p-0">
        <SettingsRowList>
          <SettingsRow
            label="Maintenance mode"
            hint="Blocks the marketing and account app when enforced in middleware."
          >
            <SettingsToggle
              label="Maintenance mode"
              checked={data.maintenance_mode}
              onChange={(maintenance_mode) => setData({ ...data, maintenance_mode })}
            />
          </SettingsRow>
        </SettingsRowList>
        {data.maintenance_mode ? (
          <div className="border-t border-white/[0.06] p-4 sm:p-5">
            <SettingsField label="Maintenance message">
              <textarea
                value={data.maintenance_message}
                onChange={(e) => setData({ ...data, maintenance_message: e.target.value })}
                rows={3}
                className={`${adminGlass.input} min-h-[5rem] py-2`}
              />
            </SettingsField>
          </div>
        ) : null}
      </SettingsSection>

      <SettingsActions>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => save(data)}
          className={adminGlass.buttonPrimary}
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
      </SettingsActions>
    </>
  );
}
