import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

const updateSchema = z.object({
  id: z.string().uuid("Invalid loan ID"),
  status: z.enum(["pending", "approved", "active", "completed", "rejected", "defaulted"]),
  adminNotes: z.string().max(1000).optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch loans" }, { status: 500 });
    }

    return NextResponse.json({ loans: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin loans GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, status, adminNotes } = parsed.data;

    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    const { error } = await supabase
      .from("loans")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Update loan status error:", error);
      return NextResponse.json({ error: "Failed to update loan" }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin loans PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
