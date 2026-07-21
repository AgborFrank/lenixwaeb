import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { createServiceRoleClient } from "@/utils/supabase/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-super-secret-jwt-key-min-32-chars"
);

function getDisplayName(email: string | null | undefined, name?: string): string {
  if (name) return name;
  if (!email) return "Unknown User";
  const localPart = email.split("@")[0];
  return localPart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function verifyAdmin(): Promise<{ valid: boolean; adminId?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return { valid: false };

  try {
    const { payload } = await jose.jwtVerify(token, ADMIN_JWT_SECRET);
    return { valid: true, adminId: payload.adminId as string };
  } catch {
    return { valid: false };
  }
}

export async function GET(request: NextRequest) {
  const { valid } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    const { data: application, error } = await supabase
      .from("web_onboarding")
      .select("*")
      .eq("user_id", userId)
      .eq("service_type", "banking")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      throw error;
    }

    // Get user email
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find((u) => u.id === userId);
    const email = authUser?.email ?? null;

    const details = (application.details || {}) as Record<string, any>;

    const data = {
      ...application,
      email,
      display_name: getDisplayName(email, details.name),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching banking application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { valid, adminId } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { user_id: string; status?: string; admin_notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { user_id, status, admin_notes } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) {
      updateData.status = status;
      if (status === "approved" || status === "rejected") {
        updateData.reviewed_at = new Date().toISOString();
        updateData.reviewed_by = adminId;
      }
    }

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { error } = await supabase
      .from("web_onboarding")
      .update(updateData)
      .eq("user_id", user_id)
      .eq("service_type", "banking");

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating banking application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
