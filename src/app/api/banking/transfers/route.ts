import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAssetPriceMap, getBankingOverviewForUser } from "@/lib/banking/overview";
import { calculateTransferQuote, validateAvailableBalance, validateTransferRequest } from "@/lib/banking/transfer";
import type { TransferRecord } from "@/lib/banking/types";
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

    if (!checkRateLimit(`banking-transfer:${user.id}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many transfer attempts. Try again shortly." }, { status: 429 });
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

    const quote = calculateTransferQuote(parsed.data, buildAssetPriceMap(overview.assets));
    const isBankTransfer = parsed.data.direction.endsWith("_to_bank");
    const bankAccount = overview.bankAccounts.find((account) => account.id === parsed.data.bankAccountId);

    if (isBankTransfer && (!bankAccount || bankAccount.status !== "verified" || bankAccount.currency !== parsed.data.payoutCurrency)) {
      return NextResponse.json({ error: "Select a verified bank account for the payout currency" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const transfer: TransferRecord = {
      id: `txn_${id}`,
      reference: `LNX-${isBankTransfer ? "BW" : "IT"}-${id.slice(0, 8).toUpperCase()}`,
      direction: parsed.data.direction,
      asset: parsed.data.asset,
      assetAmount: parsed.data.amount,
      fiatCurrency: parsed.data.payoutCurrency,
      fiatAmount: quote.recipientAmount,
      feeUsd: quote.totalFeeUsd,
      status: isBankTransfer ? "processing" : "completed",
      destination: bankAccount ? `${bankAccount.bankName} ${bankAccount.maskedNumber}` : parsed.data.direction === "spot_to_funding" ? "Funding wallet" : "Spot wallet",
      createdAt,
      estimatedArrival: quote.estimatedArrival,
      timeline: isBankTransfer
        ? [
            { label: "Request submitted", timestamp: "Just now", status: "complete" },
            { label: "Compliance screening", timestamp: "In progress", status: "current" },
            { label: "Asset conversion", timestamp: null, status: "upcoming" },
            { label: "Bank payout initiated", timestamp: null, status: "upcoming" },
            { label: "Settlement completed", timestamp: null, status: "upcoming" },
          ]
        : [
            { label: "Transfer authorized", timestamp: "Just now", status: "complete" },
            { label: parsed.data.direction === "spot_to_funding" ? "Funding wallet credited" : "Spot wallet credited", timestamp: "Just now", status: "complete" },
          ],
    };

    return NextResponse.json({ data: transfer }, { status: 201 });
  } catch (error) {
    console.error("Banking transfer error", error);
    return NextResponse.json({ error: "Unable to submit transfer" }, { status: 500 });
  }
}
