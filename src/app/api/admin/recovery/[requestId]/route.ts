import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { valid } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId } = await params;
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from("recovery_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching recovery request:", error);
    return NextResponse.json(
      { error: "Failed to fetch recovery request" },
      { status: 500 }
    );
  }
}
