import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

const updateSchema = z.object({
  id: z.string().uuid("Invalid request ID"),
  status: z.enum(["pending", "in_progress", "completed", "rejected"]),
  admin_notes: z.string().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("recovery_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch recovery requests" }, { status: 500 });
    }

    return NextResponse.json({ requests: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin recovery GET error:", error);
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

    const { id, status, admin_notes } = parsed.data;

    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { error } = await supabase
      .from("recovery_requests")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Update recovery status error:", error);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin recovery PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
