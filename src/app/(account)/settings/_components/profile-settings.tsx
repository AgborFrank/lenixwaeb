"use client";

import { useState, useEffect } from "react";
import { User, Mail, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getSettingsAndUser, updateProfile } from "../actions";

function initials(name: string | null, email: string | undefined): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function ProfileSettings() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSettingsAndUser().then(({ user, settings, error }) => {
      if (!mounted) return;
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      setEmail(user?.email ?? "");
      setName(settings?.display_name ?? "");
      setAvatar(settings?.avatar_url ?? null);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({ display_name: name || null, avatar_url: avatar });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Profile updated successfully");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-zinc-800 rounded" />
            <div className="h-3 w-32 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-zinc-800">
            <AvatarImage src={avatar ?? undefined} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-2xl">
              {initials(name, email)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Profile Picture</h3>
          <p className="text-sm text-zinc-500 mb-3">PNG, JPG up to 5MB</p>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
              disabled
            >
              Upload New (coming soon)
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => setAvatar(null)}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-400">Display Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 bg-zinc-950/50 border-zinc-800 focus-visible:ring-yellow-500/20"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              value={email}
              disabled
              className="pl-10 bg-zinc-950/30 border-zinc-800 text-zinc-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-zinc-500">Email cannot be changed directly. Contact support.</p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium"
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
