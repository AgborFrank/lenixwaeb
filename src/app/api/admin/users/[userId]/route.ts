import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteUserPlatformData } from "@/lib/admin-delete-user";
import { createServiceRoleClient } from "@/utils/supabase/server";

const userIdSchema = z.string().uuid("Invalid user ID");

const deleteSchema = z.object({
  confirmEmail: z.string().trim().min(1).max(320),
});

function unauthorized(error: unknown) {
  return error instanceof Error && error.message === "Unauthorized";
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { userId: rawUserId } = await params;
    const parsedId = userIdSchema.safeParse(rawUserId);
    if (!parsedId.success) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userId = parsedId.data;
    const supabase = createServiceRoleClient();
    const { data: existing, error: lookupError } = await supabase.auth.admin.getUserById(userId);
    if (lookupError || !existing.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existing.user.email_confirmed_at || existing.user.confirmed_at) {
      return NextResponse.json({ verified: true, alreadyVerified: true });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });

    if (error || !data.user) {
      console.error("Admin verify user failed", { adminId: admin.id, userId, message: error?.message });
      return NextResponse.json({ error: "Could not verify this user. Try again." }, { status: 500 });
    }

    console.info("Admin verified user", { adminId: admin.id, userId });
    return NextResponse.json({ verified: true });
  } catch (error) {
    if (unauthorized(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin verify user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { userId: rawUserId } = await params;
    const parsedId = userIdSchema.safeParse(rawUserId);
    if (!parsedId.success) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => null);
    const parsedBody = deleteSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Type the user's email to confirm" }, { status: 400 });
    }

    const userId = parsedId.data;
    const supabase = createServiceRoleClient();
    const { data: existing, error: lookupError } = await supabase.auth.admin.getUserById(userId);
    if (lookupError || !existing.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = existing.user.email?.trim().toLowerCase() ?? "";
    const confirmation = parsedBody.data.confirmEmail.trim().toLowerCase();
    const expected = email || userId;
    if (confirmation !== expected) {
      return NextResponse.json(
        { error: email ? "Email does not match this user" : "Confirmation does not match this user" },
        { status: 400 },
      );
    }

    try {
      await deleteUserPlatformData(supabase, userId);
    } catch (error) {
      console.error("Admin delete user data failed", {
        adminId: admin.id,
        userId,
        message: error instanceof Error ? error.message : "unknown",
      });
      return NextResponse.json({ error: "Could not delete this user's data. Try again." }, { status: 500 });
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("Admin delete auth user failed", {
        adminId: admin.id,
        userId,
        message: authError.message,
      });
      return NextResponse.json(
        { error: "Account data was removed, but the login could not be deleted. Try again." },
        { status: 500 },
      );
    }

    console.info("Admin deleted user", { adminId: admin.id, userId });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (unauthorized(error)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin delete user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
