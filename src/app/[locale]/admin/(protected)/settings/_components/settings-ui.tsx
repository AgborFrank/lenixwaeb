"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";

export function SettingsLoading() {
  return (
    <div className="flex min-h-[32vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-zinc-500" aria-label="Loading" />
    </div>
  );
}

export function SettingsPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="space-y-1.5">
      <h2 className={adminGlass.settingsPageTitle}>{title}</h2>
      <p className={adminGlass.settingsPageDesc}>{description}</p>
    </header>
  );
}

export function SettingsSection({
  title,
  description,
  action,
  children,
  bodyClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className={`${adminGlass.surface} overflow-hidden`}>
      <div className={adminGlass.settingsSectionHeader}>
        <div className="min-w-0">
          <h3 className={adminGlass.settingsSectionTitle}>{title}</h3>
          {description ? (
            <p className={adminGlass.settingsSectionDesc}>{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={bodyClassName ?? adminGlass.settingsSectionBody}>{children}</div>
    </section>
  );
}

export function SettingsRowList({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-white/[0.06]">{children}</div>;
}

export function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={adminGlass.settingsRow}>
      <div className="min-w-0 sm:max-w-[55%]">
        <p className="text-[13px] font-medium text-white">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      </div>
      <div className="shrink-0 sm:text-right">{children}</div>
    </div>
  );
}

export function SettingsDlRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={adminGlass.settingsDlRow}>
      <span className="text-[13px] text-zinc-500">{label}</span>
      <div className="text-[13px] text-zinc-300">{children}</div>
    </div>
  );
}

export function SettingsField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={adminGlass.fieldLabel}>{label}</label>
      {children}
      {hint ? <p className={adminGlass.fieldHint}>{hint}</p> : null}
    </div>
  );
}

export function SettingsToggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors disabled:opacity-50 ${
        checked
          ? "border-white/20 bg-white"
          : "border-white/10 bg-white/[0.08]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-black transition-transform ${
          checked ? "translate-x-4 bg-black" : "translate-x-0 bg-zinc-400"
        }`}
      />
    </button>
  );
}

export function SettingsActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.06] pt-5 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function SettingsNotice({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${adminGlass.surface} border-white/[0.1] px-4 py-3.5 sm:px-5`}
    >
      <p className="text-[13px] font-medium text-white">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{children}</p>
    </div>
  );
}
