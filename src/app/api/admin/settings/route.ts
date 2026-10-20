import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";
import {
  ALLOWED_CONFIG_KEYS,
  parseConfigValue,
  SYSTEM_CONFIG_KEYS,
  type SystemConfigKey,
} from "@/lib/platform-settings";
import { getConfigByKey } from "@/lib/platform-settings/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key parameter required" }, { status: 400 });
  }

  if (!ALLOWED_CONFIG_KEYS.includes(key)) {
    return NextResponse.json({ error: "Unknown config key" }, { status: 400 });
  }

  try {
    const data = await getConfigByKey(key as SystemConfigKey);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { key: string; value: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { key, value } = body;

  if (!key || !ALLOWED_CONFIG_KEYS.includes(key)) {
    return NextResponse.json({ error: "Invalid or unknown key" }, { status: 400 });
  }

  const parsed = parseConfigValue(key, value);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    const { error } = await supabase.from("system_configs").upsert(
      {
        key,
        value: parsed.data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

    if (error) throw error;

    if (key === SYSTEM_CONFIG_KEYS.legacy) {
      return NextResponse.json({
        success: true,
        notice: "Legacy system_config saved. Prefer platform_config and financial_config.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
