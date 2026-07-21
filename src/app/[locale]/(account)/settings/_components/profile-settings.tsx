"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Check, Copy, ShieldCheck, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { getSettingsAndUser, updateProfile } from "../actions";
import { createClient } from "@/utils/supabase/client";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

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
  const t = useTranslations("Settings.Profile");
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    getSettingsAndUser().then(({ user, settings, error }) => {
      if (!mounted) return;
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
      setUserId(user?.id ?? null);
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
    toast.success(t("toast_success"));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error(t("toast_invalid_image"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t("toast_image_size"));
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop() || "png";
      const path = `${userId}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const newAvatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await updateProfile({ avatar_url: newAvatarUrl });
      if (updateError) throw new Error(updateError);

      setAvatar(newAvatarUrl);
      toast.success(t("toast_avatar_success"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("toast_avatar_failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar(null);
    const { error } = await updateProfile({ avatar_url: null });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(t("toast_avatar_removed"));
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success(t("toast_copy_email"));
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-40 bg-zinc-800 rounded" />
            <div className="h-3 w-28 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="h-11 bg-zinc-800 rounded-lg" />
          <div className="h-11 bg-zinc-800 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Profile Header */}
      <section className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16 border border-zinc-700">
            <AvatarImage src={avatar ?? undefined} className="object-cover" />
            <AvatarFallback className="bg-yellow-500 text-zinc-950 text-xl font-semibold">
              {initials(name, email)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label={t("title")}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-zinc-950 border-2 border-zinc-950 hover:bg-yellow-400 transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_AVATAR_TYPES.join(",")}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-white">{t("title")}</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            {t("subtitle")}
          </p>
          {avatar && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-1.5 h-auto p-0 text-xs text-zinc-500 hover:bg-transparent hover:text-yellow-400"
              onClick={handleRemoveAvatar}
            >
              {t("remove_photo")}
            </Button>
          )}
        </div>
      </section>

      {/* Form Section */}
      <div className="grid gap-4">
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">{t("account_identity")}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="display_name" className="text-sm font-medium text-zinc-400">{t("display_name")}</Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-yellow-400 transition-colors" />
                <Input
                  id="display_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 bg-zinc-900/50 border-white/5 focus:border-yellow-500/50 focus:ring-yellow-500/20 rounded-lg text-sm transition-colors"
                  placeholder={t("display_name_placeholder")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-400">{t("email_address")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="pl-10 pr-10 h-11 bg-zinc-950/30 border-white/5 text-zinc-500 cursor-not-allowed rounded-lg text-sm opacity-70"
                />
                <button
                  onClick={copyEmail}
                  aria-label={t("toast_copy_email")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-zinc-600">{t("email_hint")}</p>
            </div>
          </div>
        </section>

        {/* Verification Status */}
        <section className="px-4 py-3 rounded-lg bg-zinc-900/30 border border-white/5 flex items-center justify-between gap-3">
           <div className="min-w-0">
              <p className="text-sm font-medium text-white">{t("identity_verified")}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{t("verified_desc")}</p>
           </div>
           <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" aria-label={t("identity_verified")} />
        </section>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white"
              onClick={() => window.location.reload()}
            >
              {t("reset")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-semibold h-10 px-5 rounded-lg transition-colors"
            >
              {saving ? t("updating") : t("save_changes")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
