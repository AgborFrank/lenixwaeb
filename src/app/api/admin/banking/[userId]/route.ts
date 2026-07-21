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
  { params }: { params: Promise<{ userId: string }> }
) {
  const { valid } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  const supabase = createServiceRoleClient();

  try {
    // Get user email
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const authUser = authUsers?.users?.find((u) => u.id === userId);
    const email = authUser?.email ?? null;

    // Get payout details
    const { data: payout } = await supabase
      .from("web_loan_payouts")
      .select("payout_method, payout_details, created_at")
      .eq("user_id", userId)
      .maybeSingle();

    // Get balances
    const { data: balances } = await supabase
      .from("user_balances")
      .select("token_symbol, balance, admin_balance, network, usd_value")
      .eq("user_id", userId);

    // Get recent transactions
    const { data: transactions } = await supabase
      .from("user_transactions")
      .select(
        "id, amount, token_symbol, transaction_type, status, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Get onboarding
    const { data: onboarding } = await supabase
      .from("web_onboarding")
      .select("step_completed, details")
      .eq("user_id", userId)
      .maybeSingle();

    // Get linked bank accounts (self-submitted, pending admin review)
    const { data: bankAccounts } = await supabase
      .from("user_bank_accounts")
      .select("id, bank_name, account_holder_name, account_number, routing_number, iban, swift_bic, account_type, currency, country, status, is_default, admin_notes, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const data = {
      user_id: userId,
      email,
      display_name: getDisplayName(email),
      payout_method: payout?.payout_method ?? null,
      payout_details: payout?.payout_details ?? null,
      balances: balances ?? [],
      transactions: transactions ?? [],
      onboarding: onboarding ?? null,
      bank_accounts: bankAccounts ?? [],
      created_at: payout?.created_at ?? authUser?.created_at ?? new Date().toISOString(),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching user banking data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { valid } = await verifyAdmin();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;

  let body: { payout_method?: string; payout_details?: Record<string, any> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  try {
    // Check if record exists
    const { data: existing } = await supabase
      .from("web_loan_payouts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const updateData = {
      payout_method: body.payout_method,
      payout_details: body.payout_details,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await supabase
        .from("web_loan_payouts")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("web_loan_payouts")
        .insert({
          user_id: userId,
          ...updateData,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user banking data:", error);
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}
