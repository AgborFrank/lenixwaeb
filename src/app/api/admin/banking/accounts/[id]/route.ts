import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

const reviewSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  adminNotes: z.string().max(500).optional(),
});

/** Admin verifies or rejects a user's self-submitted bank account. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid request" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { data: updated, error } = await supabase
      .from("user_bank_accounts")
      .update({
        status: parsed.data.status,
        admin_notes: parsed.data.adminNotes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, user_id, bank_name, status")
      .maybeSingle();

    if (error) {
      console.error("Bank account review error:", error);
      return NextResponse.json({ error: "Failed to update bank account" }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: "Bank account not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin bank account PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
