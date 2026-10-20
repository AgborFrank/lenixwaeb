"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  SettingsActions,
  SettingsDlRow,
  SettingsField,
  SettingsLoading,
  SettingsPageHeader,
  SettingsSection,
} from "../_components/settings-ui";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  wallet_address: string | null;
  created_at: string;
  last_login: string | null;
}

function displayInitials(username: string, email: string) {
  const source = username?.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function formatRole(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings/account");
      const result = await res.json();
      if (res.ok && result.data) {
        setProfile(result.data);
        setUsername(result.data.username ?? "");
        setEmail(result.data.email);
        setWalletAddress(result.data.wallet_address || "");
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          wallet_address: walletAddress || null,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated");
        fetchProfile();
      } else {
        const result = await res.json();
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <SettingsLoading />;

  const initials = displayInitials(username, email);

  return (
    <>
      <SettingsPageHeader
        title="Account"
        description="Display name, email, and optional wallet used for admin notifications."
      />

      <SettingsSection title="Profile" description="How you appear in the admin console.">
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-xs font-semibold text-zinc-300"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{formatRole(profile?.role ?? "admin")}</p>
            <p className="text-xs text-zinc-500">
              Member since{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <SettingsField label="Username">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={adminGlass.input}
            />
          </SettingsField>
          <SettingsField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminGlass.input}
            />
          </SettingsField>
        </div>

        <SettingsField
          label="Wallet address"
          hint="Optional. Used for on-chain admin payouts or alerts if configured."
        >
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x…"
            className={adminGlass.input}
          />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Session" description="Current admin record." bodyClassName="p-0">
        <SettingsDlRow label="Admin ID">
          <code className="rounded border border-white/[0.08] bg-black/40 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
            {profile?.id}
          </code>
        </SettingsDlRow>
        <SettingsDlRow label="Role">
          <span className={adminGlass.badgeMuted}>{formatRole(profile?.role ?? "")}</span>
        </SettingsDlRow>
        <SettingsDlRow label="Last sign-in">
          {profile?.last_login
            ? new Date(profile.last_login).toLocaleString()
            : "—"}
        </SettingsDlRow>
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
