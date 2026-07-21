"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, User, Mail, Wallet } from "lucide-react";

interface AdminProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  wallet_address: string | null;
  created_at: string;
  last_login: string | null;
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
        setUsername(result.data.username);
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
        toast.success("Profile updated successfully");
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
        <h2 className="text-xl font-semibold text-white">Account Settings</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your admin profile and preferences
        </p>
      </div>

      {/* Profile Info */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="font-medium text-white">Profile Information</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Your account details and display name
          </p>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/10 text-2xl font-bold text-yellow-400">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white">{profile?.role}</p>
              <p className="text-sm text-zinc-500">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-400">
                <User className="h-4 w-4" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-400">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-400">
              <Wallet className="h-4 w-4" />
              Wallet Address (Optional)
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-yellow-400/50 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Connect a wallet address for receiving payments or notifications
            </p>
          </div>
        </div>
      </section>

      {/* Session Info */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="font-medium text-white">Session Information</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Current login session details
          </p>
        </div>
        <div className="divide-y divide-zinc-800">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-zinc-400">Admin ID</span>
            <code className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
              {profile?.id}
            </code>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-zinc-400">Role</span>
            <span className="rounded bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
              {profile?.role}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-zinc-400">Last Login</span>
            <span className="text-sm text-zinc-300">
              {profile?.last_login
                ? new Date(profile.last_login).toLocaleString()
                : "N/A"}
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
