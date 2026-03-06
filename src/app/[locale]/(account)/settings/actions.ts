"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type PreferredCurrency = "usd" | "eur" | "gbp" | "jpy";
export type Language = "en" | "es" | "fr" | "de";
export type Theme = "dark" | "light" | "system";

export interface UserSettingsRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_currency: PreferredCurrency;
  language: Language;
  theme: Theme;
  notifications_email: boolean;
  notifications_transactions: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULTS: Omit<UserSettingsRow, "user_id" | "created_at" | "updated_at"> = {
  display_name: null,
  avatar_url: null,
  preferred_currency: "usd",
  language: "en",
  theme: "dark",
  notifications_email: true,
  notifications_transactions: true,
  two_factor_enabled: false,
};

/** Get current user (id, email) and settings. For use in client components. */
export async function getSettingsAndUser(): Promise<{
  user: { id: string; email: string | undefined } | null;
  settings: UserSettingsRow | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, settings: null, error: "Not authenticated" };
  const out = await getSettings();
  return {
    user: { id: user.id, email: user.email },
    settings: out.data,
    error: out.error,
  };
}

/** Get current user's settings. Inserts a row with defaults if none exists. */
export async function getSettings(): Promise<{ data: UserSettingsRow | null; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      const { data: inserted, error: insertErr } = await supabase
        .from("user_settings")
        .insert({ user_id: user.id, ...DEFAULTS })
        .select()
        .single();
      if (insertErr) return { data: null, error: insertErr.message };
      return { data: inserted as UserSettingsRow, error: null };
    }
    return { data: null, error: error.message };
  }
  return { data: data as UserSettingsRow, error: null };
}

/** Update profile fields (display_name, avatar_url). */
export async function updateProfile(updates: {
  display_name?: string | null;
  avatar_url?: string | null;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const existing = await getSettings();
  const display_name = updates.display_name !== undefined ? updates.display_name : existing.data?.display_name ?? null;
  const avatar_url = updates.avatar_url !== undefined ? updates.avatar_url : existing.data?.avatar_url ?? null;

  if (existing.data) {
    const { error } = await supabase
      .from("user_settings")
      .update({ display_name, avatar_url })
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("user_settings").insert({
      user_id: user.id,
      ...DEFAULTS,
      display_name,
      avatar_url,
    });
    if (error) return { error: error.message };
  }
  revalidatePath("/settings");
  revalidatePath("/settings/security");
  revalidatePath("/settings/preferences");
  return { error: null };
}

/** Update preferences (currency, language, theme, notifications). */
export async function updatePreferences(updates: {
  preferred_currency?: PreferredCurrency;
  language?: Language;
  theme?: Theme;
  notifications_email?: boolean;
  notifications_transactions?: boolean;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const existing = await getSettings();
  const current = existing.data ?? { user_id: user.id, ...DEFAULTS } as UserSettingsRow;

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        display_name: current.display_name,
        avatar_url: current.avatar_url,
        preferred_currency: updates.preferred_currency ?? current.preferred_currency,
        language: updates.language ?? current.language,
        theme: updates.theme ?? current.theme,
        notifications_email: updates.notifications_email ?? current.notifications_email,
        notifications_transactions:
          updates.notifications_transactions ?? current.notifications_transactions,
        two_factor_enabled: current.two_factor_enabled,
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };
  revalidatePath("/settings");
  revalidatePath("/settings/preferences");
  revalidatePath("/settings/security");
  return { error: null };
}

/** Update security (2FA preference only). Password change is via Supabase Auth. */
export async function updateSecurity(updates: {
  two_factor_enabled?: boolean;
}): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const existing = await getSettings();
  const current = existing.data ?? { user_id: user.id, ...DEFAULTS } as UserSettingsRow;

  const { error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        display_name: current.display_name,
        avatar_url: current.avatar_url,
        preferred_currency: current.preferred_currency,
        language: current.language,
        theme: current.theme,
        notifications_email: current.notifications_email,
        notifications_transactions: current.notifications_transactions,
        two_factor_enabled: updates.two_factor_enabled ?? current.two_factor_enabled,
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };
  revalidatePath("/settings/security");
  revalidatePath("/settings");
  return { error: null };
}
