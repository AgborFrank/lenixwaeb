import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { firstZodMessage, refundAdminUpdateSchema } from "@/lib/refund/schema";

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("refund_requests")
      .select(
        "id, user_id, role, full_name, email, phone, counterparty_name, order_ref, payment_tx_hash, amount, asset, chain, status, lifecycle, refund_mode, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin refunds GET error:", error);
      return NextResponse.json({ error: "Failed to fetch refund requests" }, { status: 500 });
    }

    return NextResponse.json({ requests: data || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin refunds GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const supabase = createServiceRoleClient();
    const parsed = refundAdminUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: firstZodMessage(parsed.error) }, { status: 400 });
    }

    const { id, status, lifecycle, refund_mode, admin_notes } = parsed.data;
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (lifecycle !== undefined) updateData.lifecycle = lifecycle;
    if (refund_mode !== undefined) updateData.refund_mode = refund_mode;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;

    if (lifecycle === undefined && status !== undefined) {
      if (status === "pending") updateData.lifecycle = "intake";
      if (status === "in_progress") updateData.lifecycle = "underwriting";
      if (status === "completed") updateData.lifecycle = "settled";
      if (status === "rejected") updateData.lifecycle = "rejected";
    }

    const { data: updated, error } = await supabase
      .from("refund_requests")
      .update(updateData)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Admin refunds PATCH error:", error);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    await supabase.from("refund_events").insert({
      refund_request_id: id,
      event_type: "admin_update",
      actor: session.email,
      payload: { status, lifecycle, refund_mode },
    });

    return NextResponse.json({ success: true, status, lifecycle, refund_mode });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin refunds PATCH error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
