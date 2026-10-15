import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  try {
    await requireAdmin();
    const { requestId } = await params;
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("refund_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      throw error;
    }

    const { data: events } = await supabase
      .from("refund_events")
      .select("id, event_type, actor, payload, created_at")
      .eq("refund_request_id", requestId)
      .order("created_at", { ascending: true });

    return NextResponse.json({ data, events: events ?? [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching refund request:", error);
    return NextResponse.json({ error: "Failed to fetch refund request" }, { status: 500 });
  }
}
