"use client";

import { useState, useEffect } from "react";
import { Smartphone, Lock, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getSettings, updateSecurity } from "../actions";

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
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
      if (data) setTwoFactor(data.two_factor_enabled);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handle2FAToggle = async (checked: boolean) => {
    setTwoFactor(checked);
    setSaving(true);
    const { error } = await updateSecurity({ two_factor_enabled: checked });
    setSaving(false);
    if (error) {
      toast.error(error);
      setTwoFactor(!checked);
      return;
    }
    toast.success(checked ? "2FA preference saved" : "2FA disabled");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Password change is handled by your auth provider. Use the link sent to your email or contact support.");
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-zinc-800 rounded-xl" />
        <div className="grid gap-4 max-w-md">
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 2FA Section */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-zinc-500">Preference saved. Enable 2FA via your auth provider when available.</p>
          </div>
        </div>
        <Switch
          checked={twoFactor}
          onCheckedChange={handle2FAToggle}
          disabled={saving}
          className="data-[state=checked]:bg-yellow-500"
        />
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Lock className="h-4 w-4 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordUpdate} className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label className="text-zinc-400">Current Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">New Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Confirm Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20"
              disabled
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="w-full mt-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            Update Password (use auth provider)
          </Button>
        </form>
      </div>

      {/* Login History (Mock) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <History className="h-4 w-4 text-zinc-400" />
          <h3 className="text-lg font-medium text-white">Recent Logins</h3>
        </div>
        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "New York, USA", time: "Just now", status: "Active" },
            { device: "Safari on iPhone", location: "New York, USA", time: "2 hours ago", status: "Signed out" },
          ].map((login, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="font-medium text-white">{login.device}</p>
                <p className="text-xs text-zinc-500">
                  {login.location} • {login.time}
                </p>
              </div>
              {login.status === "Active" ? (
                <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full font-medium">
                  Current
                </span>
              ) : (
                <span className="text-xs text-zinc-500">{login.status}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
