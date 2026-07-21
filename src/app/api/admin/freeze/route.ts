import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/utils/supabase/server";

const freezeSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  tokenSymbol: z.string().min(1).max(10),
  network: z.string().min(1).max(20),
  action: z.enum(["freeze", "unfreeze"]),
  reason: z.string().min(1, "A reason/purpose is required").max(500).optional(),
  feeAmount: z
    .string()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), "Fee amount must be a positive number")
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Recent freeze/unfreeze activity across all users
      const { data: events, error } = await supabase
        .from("account_freeze_events")
        .select("id, user_id, token_symbol, network, action, reason, fee_amount, fee_currency, fee_tx_hash, actor, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: "Failed to fetch freeze events" }, { status: 500 });
      }
      return NextResponse.json({ events: events || [] });
    }

    const { data: balances, error } = await supabase
      .from("user_balances")
      .select("id, token_symbol, network, balance, admin_balance, is_frozen, freeze_reason, freeze_fee_amount, freeze_fee_currency, frozen_at")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch balances" }, { status: 500 });
    }

    return NextResponse.json({ balances: balances || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin freeze GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Freeze or unfreeze a specific asset for a user. Freezing requires a stated reason and,
 *  optionally, a BTC fee amount the user must deposit to their own BTC wallet before the
 *  asset auto-unfreezes (checked against incoming deposits in /api/btc/deposits). */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const supabase = createServiceRoleClient();

    const body = await request.json();
    const parsed = freezeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid request" }, { status: 400 });
    }

    const { userId, tokenSymbol, network, action, reason, feeAmount } = parsed.data;

    if (action === "freeze" && !reason) {
      return NextResponse.json({ error: "A reason/purpose is required to freeze an asset" }, { status: 400 });
    }

    const { data: wallet } = await supabase
      .from("user_wallets")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!wallet) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let { data: balance } = await supabase
      .from("user_balances")
      .select("id, is_frozen")
      .eq("user_id", userId)
      .eq("token_symbol", tokenSymbol)
      .eq("network", network)
      .maybeSingle();

    const now = new Date().toISOString();

    if (!balance) {
      if (action === "unfreeze") {
        return NextResponse.json({ error: "No balance record found for this asset" }, { status: 404 });
      }
      const { data: created, error: insertError } = await supabase
        .from("user_balances")
        .insert({
          user_id: userId,
          wallet_id: wallet.id,
          token_symbol: tokenSymbol,
          network,
          balance: "0",
          admin_balance: 0,
          usd_value: 0,
          last_updated: now,
        })
        .select("id, is_frozen")
        .single();
      if (insertError) {
        console.error("Freeze balance insert error:", insertError);
        return NextResponse.json({ error: "Failed to create balance record" }, { status: 500 });
      }
      balance = created;
    }

    const updatePayload =
      action === "freeze"
        ? {
            is_frozen: true,
            freeze_reason: reason,
            freeze_fee_amount: feeAmount || null,
            freeze_fee_currency: "BTC",
            frozen_at: now,
            frozen_by: admin.id,
          }
        : {
            is_frozen: false,
            freeze_reason: null,
            freeze_fee_amount: null,
            freeze_fee_currency: null,
            frozen_at: null,
            frozen_by: null,
          };

    const { error: updateError } = await supabase.from("user_balances").update(updatePayload).eq("id", balance.id);

    if (updateError) {
      console.error("Freeze update error:", updateError);
      return NextResponse.json({ error: "Failed to update freeze state" }, { status: 500 });
    }

    await supabase.from("account_freeze_events").insert({
      user_id: userId,
      balance_id: balance.id,
      token_symbol: tokenSymbol,
      network,
      action,
      reason: reason || null,
      fee_amount: feeAmount || null,
      fee_currency: feeAmount ? "BTC" : null,
      actor: `admin:${admin.id}`,
      created_at: now,
    });

    return NextResponse.json({ success: true, action, tokenSymbol, network });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin freeze POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
