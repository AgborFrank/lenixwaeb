import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { createServiceRoleClient } from "@/utils/supabase/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "your-super-secret-jwt-key-min-32-chars"
);

function getDisplayName(email: string | null | undefined): string {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ loanId: string }> }
) {
  const { valid } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { loanId } = await params;
  const supabase = createServiceRoleClient();

  try {
    // Get loan details
    const { data: loan, error: loanError } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loanId)
      .single();

    if (loanError) {
      if (loanError.code === "PGRST116") {
        return NextResponse.json({ error: "Loan not found" }, { status: 404 });
      }
      throw loanError;
    }

    // Get user email
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find((u) => u.id === loan.user_id);
    const email = authUser?.email ?? null;

    // Get onboarding details
    const { data: onboarding } = await supabase
      .from("web_onboarding")
      .select("details, step_completed")
      .eq("user_id", loan.user_id)
      .maybeSingle();

    // Get payout details
    const { data: payout } = await supabase
      .from("web_loan_payouts")
      .select("payout_method, payout_details")
      .eq("user_id", loan.user_id)
      .maybeSingle();

    // Get user balances
    const { data: balances } = await supabase
      .from("user_balances")
      .select("token_symbol, balance, admin_balance, network, usd_value")
      .eq("user_id", loan.user_id);

    const data = {
      ...loan,
      user: {
        email,
        display_name: getDisplayName(email),
      },
      onboarding: onboarding ?? null,
      payout: payout ?? null,
      balances: balances ?? [],
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching loan:", error);
    return NextResponse.json(
      { error: "Failed to fetch loan" },
      { status: 500 }
    );
  }
}
