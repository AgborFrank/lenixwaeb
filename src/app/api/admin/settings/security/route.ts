import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import bcrypt from "bcryptjs";
import { createServiceRoleClient } from "@/utils/supabase/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-super-secret-jwt-key-min-32-chars"
);

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

export async function PUT(request: NextRequest) {
  const { valid, adminId } = await verifyAdmin();
  if (!valid || !adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { current_password: string; new_password: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { current_password, new_password } = body;

  if (!current_password || !new_password) {
    return NextResponse.json(
      { error: "Current and new password are required" },
      { status: 400 }
    );
  }

  if (new_password.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  try {
    // Get current password hash
    const { data: admin, error: fetchError } = await supabase
      .from("admin_users")
      .select("password_hash")
      .eq("id", adminId)
      .single();

    if (fetchError || !admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(current_password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const newHash = await bcrypt.hash(new_password, 12);

    // Update password
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password_hash: newHash,
        updated_at: new Date().toISOString(),
      })
      .eq("id", adminId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
