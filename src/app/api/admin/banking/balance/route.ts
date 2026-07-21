import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

const operationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  operationType: z.enum(["credit", "debit"]),
  currency: z.enum(["USD", "EUR", "GBP"]),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  reason: z.string().max(500).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const { data: balances, error } = await supabase
        .from("user_fiat_balances")
        .select("id, currency, balance, updated_at")
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: "Failed to fetch fiat balances" }, { status: 500 });
      }
      return NextResponse.json({ balances: balances || [] });
    }

    const { data: operations, error } = await supabase
      .from("admin_fiat_operations")
      .select("id, user_id, operation_type, currency, amount, previous_balance, new_balance, reason, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch operations" }, { status: 500 });
    }
    return NextResponse.json({ operations: operations || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin fiat balance GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Admin credits or debits a user's fiat (bank) balance — a separate ledger from crypto
 *  user_balances, backing the "Bank accounts" / funding view on /en/banking. */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const supabase = createServiceRoleClient();

    const body = await request.json();
    const parsed = operationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid request" }, { status: 400 });
    }

    const { userId, operationType, currency, amount, reason } = parsed.data;
    const amountNum = parseFloat(amount);
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("user_fiat_balances")
      .select("id, balance")
      .eq("user_id", userId)
      .eq("currency", currency)
      .maybeSingle();

    const previousBalance = Number(existing?.balance || 0);
    const newBalance = operationType === "credit" ? previousBalance + amountNum : previousBalance - amountNum;

    if (newBalance < 0) {
      return NextResponse.json({ error: "Insufficient balance for debit operation" }, { status: 400 });
    }

    if (existing) {
      const { error } = await supabase
        .from("user_fiat_balances")
        .update({ balance: newBalance, updated_at: now })
        .eq("id", existing.id);
      if (error) {
        console.error("Fiat balance update error:", error);
        return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("user_fiat_balances").insert({
        user_id: userId,
        currency,
        balance: newBalance,
        updated_at: now,
      });
      if (error) {
        console.error("Fiat balance insert error:", error);
        return NextResponse.json({ error: "Failed to create balance" }, { status: 500 });
      }
    }

    await supabase.from("admin_fiat_operations").insert({
      admin_id: admin.id,
      user_id: userId,
      operation_type: operationType,
      currency,
      amount: amountNum,
      previous_balance: previousBalance,
      new_balance: newBalance,
      reason: reason || null,
      status: "completed",
      created_at: now,
    });

    // Mirror into user_transactions so it shows up in the banking Activity feed
    // alongside crypto transfers, consistent with how BTC deposits/admin crypto
    // credits are recorded.
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));
    const reference = "BANK" + Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    await supabase.from("user_transactions").insert({
      user_id: userId,
      transaction_hash: reference,
      from_address: operationType === "credit" ? "Lenix Treasury Desk" : `${currency} funding`,
      to_address: operationType === "credit" ? `${currency} funding` : "Lenix Treasury Desk",
      amount: amount,
      token_symbol: currency,
      network: "banking",
      status: "confirmed",
      transaction_type: operationType === "credit" ? "receive" : "send",
      usd_value: currency === "USD" ? amount : "0",
      timestamp: now,
      created_at: now,
      balance_before: previousBalance.toString(),
      balance_after: newBalance.toString(),
      metadata: reason ? { reason } : {},
    });

    return NextResponse.json({
      success: true,
      operation: { type: operationType, amount: amountNum, currency, previousBalance, newBalance },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin fiat balance POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
