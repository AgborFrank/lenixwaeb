"use client";

import type { ReactNode } from "react";
import { adminGlass } from "@/lib/admin-glass";
import type { ServiceToggle } from "@/lib/platform-settings";
import { SettingsField, SettingsRow, SettingsToggle } from "./settings-ui";

interface ServiceFieldProps {
  label: string;
  hint: string;
  value: ServiceToggle & Record<string, unknown>;
  onChange: (next: ServiceToggle & Record<string, unknown>) => void;
  showEmail?: boolean;
  showPublicIntake?: boolean;
  extra?: ReactNode;
}

export function ServiceField({
  label,
  hint,
  value,
  onChange,
  showEmail,
  showPublicIntake,
  extra,
}: ServiceFieldProps) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <SettingsRow label={label} hint={hint}>
        <SettingsToggle
          label={`${label} enabled`}
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
        />
      </SettingsRow>
      {value.enabled && (showEmail || showPublicIntake || extra) ? (
        <div className="space-y-4 border-t border-white/[0.06] bg-white/[0.01] px-4 py-4 sm:px-5">
          {showPublicIntake && "public_intake" in value ? (
            <SettingsRow label="Public intake" hint="Allow logged-in users to open new cases.">
              <SettingsToggle
                label="Public intake"
                checked={Boolean(value.public_intake)}
                onChange={(public_intake) => onChange({ ...value, public_intake })}
              />
            </SettingsRow>
          ) : null}
          {showEmail ? (
            <SettingsField label="Desk email" hint="Intake notifications route here when mail is configured.">
              <input
                type="email"
                value={(value.desk_email as string) ?? ""}
                onChange={(e) => onChange({ ...value, desk_email: e.target.value })}
                className={adminGlass.input}
              />
            </SettingsField>
          ) : null}
          {extra}
        </div>
      ) : null}
    </div>
  );
}
