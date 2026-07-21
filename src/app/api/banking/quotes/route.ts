import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAssetPriceMap, getBankingOverviewForUser } from "@/lib/banking/overview";
import { calculateTransferQuote, validateAvailableBalance, validateTransferRequest } from "@/lib/banking/transfer";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { createClient } from "@/utils/supabase/server";

const transferSchema = z.object({
  direction: z.enum(["spot_to_funding", "funding_to_spot", "funding_to_bank", "spot_to_bank"]),
  asset: z.string().trim().min(1).max(12),
  amount: z.number().finite().positive(),
  payoutCurrency: z.enum(["USD", "EUR", "GBP"]),
  bankAccountId: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!checkRateLimit(`banking-quote:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many quote requests. Try again shortly." }, { status: 429 });
    }

    const parsed = transferSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid transfer details" }, { status: 400 });
    }

    const validation = validateTransferRequest(parsed.data);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const overview = await getBankingOverviewForUser(supabase, user.id, user.email ?? null);

    const balanceValidation = validateAvailableBalance(parsed.data, overview.assets);
    if (!balanceValidation.valid) {
      return NextResponse.json({ error: balanceValidation.error }, { status: 400 });
    }

    if (parsed.data.direction.endsWith("_to_bank")) {
      const bankAccount = overview.bankAccounts.find((account) => account.id === parsed.data.bankAccountId);
      if (!bankAccount || bankAccount.status !== "verified" || bankAccount.currency !== parsed.data.payoutCurrency) {
        return NextResponse.json({ error: "Select a verified bank account for the payout currency" }, { status: 400 });
      }
    }

    const quote = calculateTransferQuote(parsed.data, buildAssetPriceMap(overview.assets));
    return NextResponse.json({ data: quote }, { status: 200 });
  } catch (error) {
    console.error("Banking quote error", error);
    return NextResponse.json({ error: "Unable to create transfer quote" }, { status: 500 });
  }
}
