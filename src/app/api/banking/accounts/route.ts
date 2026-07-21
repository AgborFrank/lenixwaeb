import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const CURRENCIES = ["USD", "EUR", "GBP"] as const;

const addBankAccountSchema = z.object({
  bankName: z.string().trim().min(2).max(120),
  accountHolderName: z.string().trim().min(2).max(120),
  accountNumber: z.string().trim().min(4).max(34),
  routingNumber: z.string().trim().max(20).optional().or(z.literal("")),
  iban: z.string().trim().max(34).optional().or(z.literal("")),
  swiftBic: z.string().trim().max(11).optional().or(z.literal("")),
  accountType: z.enum(["checking", "savings"]).default("checking"),
  currency: z.enum(CURRENCIES).default("USD"),
  country: z.string().trim().min(2).max(60),
});

/** User adds a bank account to their banking workspace. Always saved as "pending" — an
 *  admin must verify it (see /api/admin/banking/accounts/[id]) before it can receive
 *  withdrawals or be selected as a transfer destination. */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = addBankAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid bank account details" },
        { status: 400 },
      );
    }

    const { bankName, accountHolderName, accountNumber, routingNumber, iban, swiftBic, accountType, currency, country } =
      parsed.data;

    // First bank account for a user becomes their default automatically.
    const { count: existingCount } = await supabase
      .from("user_bank_accounts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { data: created, error } = await supabase
      .from("user_bank_accounts")
      .insert({
        user_id: user.id,
        bank_name: bankName,
        account_holder_name: accountHolderName,
        account_number: accountNumber,
        routing_number: routingNumber || null,
        iban: iban || null,
        swift_bic: swiftBic || null,
        account_type: accountType,
        currency,
        country,
        is_default: (existingCount ?? 0) === 0,
        status: "pending",
      })
      .select("id, bank_name, account_type, currency, status, is_default, created_at")
      .single();

    if (error) {
      console.error("Add bank account error:", error);
      return NextResponse.json({ error: "Failed to add bank account" }, { status: 500 });
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Banking accounts POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
