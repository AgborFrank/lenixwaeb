"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { adminGlass } from "@/lib/admin-glass";
import {
  SettingsField,
  SettingsNotice,
  SettingsPageHeader,
  SettingsRow,
  SettingsRowList,
  SettingsSection,
} from "../_components/settings-ui";

export default function SecuritySettingsPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/admin/settings/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const result = await res.json();
        toast.error(result.error || "Failed to change password");
      }
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  function passwordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const strength = passwordStrength(newPassword);
  const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

  const canSubmit =
    currentPassword &&
    newPassword &&
    newPassword === confirmPassword &&
    !isChangingPassword;

  return (
    <>
      <SettingsPageHeader
        title="Security"
        description="Password for this admin console. Two-factor authentication is not enabled yet."
      />

      <SettingsSection title="Password" description="Requires your current password to change.">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <SettingsField label="Current password">
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={`${adminGlass.input} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </SettingsField>

          <SettingsField label="New password">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={`${adminGlass.input} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {newPassword ? (
              <div className="mt-2 flex gap-1" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full ${
                      i < strength ? "bg-white/70" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            ) : null}
            {newPassword ? (
              <p className={adminGlass.fieldHint}>
                Strength: {strengthLabels[strength - 1] ?? strengthLabels[0]}
              </p>
            ) : null}
          </SettingsField>

          <SettingsField label="Confirm new password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`${adminGlass.input} ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-500/50 focus-visible:ring-red-500/20"
                  : ""
              }`}
            />
            {confirmPassword && confirmPassword !== newPassword ? (
              <p className="mt-1 text-xs text-red-400/90">Passwords do not match</p>
            ) : null}
          </SettingsField>

          <button type="submit" disabled={!canSubmit} className={adminGlass.buttonPrimary}>
            {isChangingPassword ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Key className="h-3.5 w-3.5" />
            )}
            Update password
          </button>
        </form>
      </SettingsSection>

      <SettingsSection title="Authentication" bodyClassName="p-0">
        <SettingsRowList>
          <SettingsRow
            label="Two-factor authentication"
            hint="TOTP via an authenticator app."
          >
            <span className={adminGlass.badgeMuted}>Not available</span>
          </SettingsRow>
        </SettingsRowList>
      </SettingsSection>

      <SettingsNotice title="Practice">
        Use a unique password for this console. Rotate it if you share access or suspect a leak.
        Session cookies expire after seven days of inactivity.
      </SettingsNotice>
    </>
  );
}
