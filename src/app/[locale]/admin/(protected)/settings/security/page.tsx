"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Key, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";

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
        toast.success("Password changed successfully");
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

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Security Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your password and authentication options
        </p>
      </div>

      {/* Password Change */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <Key className="h-4 w-4 text-yellow-400" />
            Change Password
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Update your admin account password
          </p>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 pr-10 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 pr-10 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < strength ? strengthColors[strength - 1] : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Strength: {strengthLabels[strength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-400">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full rounded-lg border bg-zinc-800 px-3 py-2.5 text-sm text-white focus:outline-none ${
                confirmPassword && confirmPassword !== newPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700 focus:border-yellow-400/50"
              }`}
            />
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChangingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-yellow-300 disabled:opacity-50"
          >
            {isChangingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Key className="h-4 w-4" />
            )}
            Change Password
          </button>
        </form>
      </section>

      {/* Two-Factor Authentication */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <Shield className="h-4 w-4 text-yellow-400" />
            Two-Factor Authentication
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Add an extra layer of security to your account
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">2FA Status</p>
              <p className="text-xs text-zinc-500">
                Protect your account with TOTP authentication
              </p>
            </div>
            <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400">
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* Active Sessions */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 font-medium text-white">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            Security Recommendations
          </h3>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Use a strong password</p>
              <p className="text-xs text-zinc-500">
                Include uppercase, lowercase, numbers, and special characters
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-400" />
            <div>
              <p className="text-sm font-medium text-white">Enable two-factor authentication</p>
              <p className="text-xs text-zinc-500">
                Add an authenticator app for extra security
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Review login activity</p>
              <p className="text-xs text-zinc-500">
                Regularly check the login history for suspicious activity
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
