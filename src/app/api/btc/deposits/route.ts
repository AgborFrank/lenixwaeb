import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/utils/supabase/server";
import { getBtcAddressDeposits, getBtcTipHeight } from "@/lib/btc/provider";

const REQUIRED_CONFIRMATIONS = 2;
const ADDRESS_SCAN_LIMIT = 20;

interface BtcAddressRecord {
  id: string;
  wallet_id: string;
  address: string;
  status: "available" | "used" | "disabled";
}

interface BtcDepositRecord {
  id: string;
  txid: string;
  vout: number;
  amount_sats: number;
  confirmations: number;
  status: "pending" | "confirmed" | "reorged";
  credited_at: string | null;
}

/** Convert a decimal BTC amount string (e.g. "0.00002000") to integer satoshis. */
function btcStringToSats(value: string | null | undefined): bigint {
  if (!value) return BigInt(0);
  const trimmed = value.trim();
  const negative = trimmed.startsWith("-");
  const abs = negative ? trimmed.slice(1) : trimmed;
  const [wholePartRaw, fracPartRaw = ""] = abs.split(".");
  const wholePart = wholePartRaw || "0";
  const fracPart = (fracPartRaw + "00000000").slice(0, 8);
  const sats = BigInt(wholePart) * BigInt(100_000_000) + BigInt(fracPart || "0");
  return negative ? -sats : sats;
}

/** Convert integer satoshis to a decimal BTC amount string with 8 decimal places. */
function satsToBtcString(sats: bigint): string {
  const negative = sats < BigInt(0);
  const abs = negative ? -sats : sats;
  const whole = abs / BigInt(100_000_000);
  const frac = (abs % BigInt(100_000_000)).toString().padStart(8, "0");
  return `${negative ? "-" : ""}${whole}.${frac}`;
}

async function creditConfirmedDeposit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  walletId: string,
  amountSats: number,
  depositAddress: string,
  txid: string,
  vout: number,
  blockHeight: number | null,
  confirmations: number,
  fromAddress?: string | null,
) {
  const balancesTable = supabase.from("user_balances") as any;
  const { data: balance, error: balanceError } = await balancesTable
    .select("id, balance, usd_value")
    .eq("user_id", userId)
    .eq("wallet_id", walletId)
    .eq("token_symbol", "BTC")
    .eq("network", "bitcoin")
    .limit(1)
    .maybeSingle();

  if (balanceError) throw balanceError;

  // `balance` is stored as a decimal BTC string (e.g. "0.00002000"), not raw sats.
  const currentSats = btcStringToSats(balance?.balance);
  const newSats = currentSats + BigInt(amountSats);
  const balanceBtc = satsToBtcString(newSats);
  const previousBalanceBtc = satsToBtcString(currentSats);

  if (balance) {
    const { error } = await balancesTable
      .update({ balance: balanceBtc, last_updated: new Date().toISOString() })
      .eq("id", balance.id)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await balancesTable.insert({
      user_id: userId,
      wallet_id: walletId,
      token_symbol: "BTC",
      token_address: null,
      balance: balanceBtc,
      usd_value: 0,
      network: "bitcoin",
      address: null,
    });
    if (error) throw error;
  }

  // Record a real-looking transaction so it shows up alongside other transfers
  const amountBtc = satsToBtcString(BigInt(amountSats));
  const { error: txError } = await supabase.from("user_transactions").insert({
    user_id: userId,
    wallet_id: walletId,
    transaction_hash: txid,
    from_address: fromAddress ?? "unknown",
    to_address: depositAddress,
    amount: amountBtc,
    token_symbol: "BTC",
    network: "bitcoin",
    status: "confirmed",
    transaction_type: "receive",
    usd_value: "0",
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    balance_before: previousBalanceBtc,
    balance_after: balanceBtc,
    block_number: blockHeight ?? null,
    confirmations,
  });
  if (txError) console.error("Failed to record BTC deposit transaction:", txError);

  // A user with a frozen asset that requires a BTC fee to unfreeze pays that fee by
  // depositing at least the required amount into their own (already-monitored) BTC
  // wallet — no separate escrow address needed. Check now that the deposit landed.
  await releaseFreezesForBtcDeposit(supabase, userId, walletId, amountSats, txid);

  return balanceBtc;
}

/** After a BTC deposit is credited, check whether it covers the fee required to lift
 *  any admin-set freeze on this user's assets, and auto-unfreeze + charge the fee if so. */
async function releaseFreezesForBtcDeposit(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
  walletId: string,
  depositAmountSats: number,
  depositTxid: string,
) {
  const { data: frozenRows, error: frozenError } = await (supabase.from("user_balances") as any)
    .select("id, token_symbol, network, freeze_fee_amount")
    .eq("user_id", userId)
    .eq("is_frozen", true)
    .eq("freeze_fee_currency", "BTC")
    .not("freeze_fee_amount", "is", null);

  if (frozenError) {
    console.error("Failed to load frozen assets for unfreeze check:", frozenError);
    return;
  }
  if (!frozenRows || frozenRows.length === 0) return;

  let remainingSats = BigInt(depositAmountSats);
  // Settle cheapest fees first so a single deposit can clear multiple small freezes.
  const sorted = [...frozenRows].sort(
    (a, b) => Number(a.freeze_fee_amount) - Number(b.freeze_fee_amount),
  );

  for (const row of sorted) {
    const feeSats = btcStringToSats(row.freeze_fee_amount);
    if (feeSats <= BigInt(0) || remainingSats < feeSats) continue;

    const { data: btcBalance, error: btcBalanceError } = await (supabase.from("user_balances") as any)
      .select("id, balance")
      .eq("user_id", userId)
      .eq("wallet_id", walletId)
      .eq("token_symbol", "BTC")
      .eq("network", "bitcoin")
      .maybeSingle();
    if (btcBalanceError || !btcBalance) continue;

    const currentSats = btcStringToSats(btcBalance.balance);
    const newSats = currentSats - feeSats;
    if (newSats < BigInt(0)) continue; // Safety net; shouldn't happen since we just credited.

    const previousBalanceBtc = satsToBtcString(currentSats);
    const newBalanceBtc = satsToBtcString(newSats);

    const { error: deductError } = await (supabase.from("user_balances") as any)
      .update({ balance: newBalanceBtc, last_updated: new Date().toISOString() })
      .eq("id", btcBalance.id);
    if (deductError) {
      console.error("Failed to deduct unfreeze fee:", deductError);
      continue;
    }

    remainingSats -= feeSats;

    const now = new Date().toISOString();
    await (supabase.from("user_balances") as any)
      .update({
        is_frozen: false,
        freeze_reason: null,
        freeze_fee_amount: null,
        freeze_fee_currency: null,
        frozen_at: null,
        frozen_by: null,
      })
      .eq("id", row.id);

    await supabase.from("user_transactions").insert({
      user_id: userId,
      wallet_id: walletId,
      transaction_hash: `unfreeze-fee-${depositTxid}-${row.id}`,
      from_address: "Lenix Compliance",
      to_address: "Account unfreeze fee",
      amount: row.freeze_fee_amount,
      token_symbol: "BTC",
      network: "bitcoin",
      status: "confirmed",
      transaction_type: "send",
      usd_value: "0",
      timestamp: now,
      created_at: now,
      balance_before: previousBalanceBtc,
      balance_after: newBalanceBtc,
      metadata: { reason: "Account unfreeze fee", frozenAsset: row.token_symbol, frozenNetwork: row.network },
    });

    await supabase.from("account_freeze_events").insert({
      user_id: userId,
      balance_id: row.id,
      token_symbol: row.token_symbol,
      network: row.network,
      action: "unfreeze",
      reason: "Required fee paid via BTC deposit",
      fee_amount: row.freeze_fee_amount,
      fee_currency: "BTC",
      fee_tx_hash: depositTxid,
      actor: "system_auto",
      created_at: now,
    });

    console.log(`[Freeze] Auto-unfroze ${row.token_symbol} (${row.network}) for user ${userId} via deposit ${depositTxid}`);
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use the service-role client for all writes: user_balances RLS policies key off a
    // custom `app.user_id` session setting that is never populated for normal requests,
    // which silently blocks balance updates/inserts made with the user-scoped client.
    const db = createServiceRoleClient();

    const { data: wallet, error: walletError } = await (db.from("user_wallets") as any)
      .select("id, bitcoin_xpub, bitcoin_address")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (walletError) {
      console.error("BTC deposit wallet lookup error", walletError);
      return NextResponse.json({ error: "Unable to sync Bitcoin deposits" }, { status: 500 });
    }

    if (!wallet?.bitcoin_xpub) {
      return NextResponse.json({ error: "Bitcoin wallet is not provisioned" }, { status: 409 });
    }

    const { data: addresses, error: addressesError } = await (db.from("btc_addresses") as any)
      .select("id, wallet_id, address, status")
      .eq("user_id", user.id)
      .eq("wallet_id", wallet.id)
      .neq("status", "disabled")
      .order("derivation_index", { ascending: false })
      .limit(ADDRESS_SCAN_LIMIT);

    if (addressesError) {
      console.error("BTC deposit address lookup error", addressesError);
      return NextResponse.json({ error: "Unable to sync Bitcoin deposits" }, { status: 500 });
    }

    const addressRecords = (addresses || []) as BtcAddressRecord[];
    if (addressRecords.length === 0) {
      return NextResponse.json({ data: { scannedAddresses: 0, deposits: [] } });
    }

    const { data: tipHeight, provider: tipProvider } = await getBtcTipHeight();
    console.log(`[BTC Deposits] Tip height fetched via ${tipProvider}: ${tipHeight}`);
    const syncedDeposits: Array<{ txid: string; vout: number; status: string; confirmations: number }> = [];

    for (const address of addressRecords) {
      const { data: candidates, provider: depositsProvider } = await getBtcAddressDeposits(address.address, tipHeight);
      console.log(`[BTC Deposits] Address ${address.address.slice(0, 8)}... scanned via ${depositsProvider}, found ${candidates.length} deposits`);

      for (const candidate of candidates) {
        const { data: existing, error: existingError } = await (db.from("btc_deposits") as any)
          .select("id, txid, vout, amount_sats, confirmations, status, credited_at")
          .eq("txid", candidate.txid)
          .eq("vout", candidate.vout)
          .limit(1)
          .maybeSingle();

        if (existingError) throw existingError;

        const shouldConfirm = candidate.confirmations >= REQUIRED_CONFIRMATIONS;
        const nextStatus = shouldConfirm ? "confirmed" : "pending";
        const deposit = existing as BtcDepositRecord | null;

        if (!deposit) {
          // Insert with credited_at left null; only stamp it after the credit
          // actually succeeds so a failed credit can be retried on the next scan
          // instead of getting permanently stuck as "credited".
          const { data: inserted, error: insertError } = await (db.from("btc_deposits") as any)
            .insert({
              user_id: user.id,
              wallet_id: wallet.id,
              address_id: address.id,
              txid: candidate.txid,
              vout: candidate.vout ?? 0,
              amount_sats: candidate.amountSats ?? 0,
              confirmations: candidate.confirmations ?? 0,
              block_height: candidate.blockHeight ?? 0,
              status: nextStatus,
              credited_at: null,
            })
            .select("id, txid, vout, amount_sats, confirmations, status, credited_at")
            .maybeSingle();

          if (insertError) throw insertError;
          if (inserted && shouldConfirm) {
            await creditConfirmedDeposit(
              db,
              user.id,
              wallet.id,
              candidate.amountSats,
              address.address,
              candidate.txid,
              candidate.vout ?? 0,
              candidate.blockHeight ?? null,
              candidate.confirmations ?? 0,
              candidate.fromAddress,
            );
            await (db.from("btc_deposits") as any)
              .update({ credited_at: new Date().toISOString() })
              .eq("id", inserted.id);
          }
          if (inserted) syncedDeposits.push({ txid: inserted.txid, vout: inserted.vout, status: inserted.status, confirmations: inserted.confirmations });
        } else {
          const wasCredited = Boolean(deposit.credited_at);
          // Same ordering guarantee here: update confirmations/status first, but
          // only stamp credited_at once creditConfirmedDeposit has succeeded.
          const { error: updateError } = await (db.from("btc_deposits") as any)
            .update({
              confirmations: candidate.confirmations ?? 0,
              block_height: candidate.blockHeight ?? 0,
              status: nextStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", deposit.id)
            .eq("user_id", user.id);

          if (updateError) throw updateError;
          if (shouldConfirm && !wasCredited) {
            await creditConfirmedDeposit(
              db,
              user.id,
              wallet.id,
              candidate.amountSats,
              address.address,
              candidate.txid,
              candidate.vout ?? 0,
              candidate.blockHeight ?? null,
              candidate.confirmations ?? 0,
              candidate.fromAddress,
            );
            await (db.from("btc_deposits") as any)
              .update({ credited_at: new Date().toISOString() })
              .eq("id", deposit.id);
          }
          syncedDeposits.push({ txid: deposit.txid, vout: deposit.vout, status: nextStatus, confirmations: candidate.confirmations });
        }

        if (address.status === "available") {
          await (db.from("btc_addresses") as any)
            .update({ status: "used", first_seen_at: new Date().toISOString(), last_seen_at: new Date().toISOString() })
            .eq("id", address.id)
            .eq("user_id", user.id);
          address.status = "used";
        }
      }
    }

    return NextResponse.json({
      data: {
        scannedAddresses: addressRecords.length,
        deposits: syncedDeposits,
        requiredConfirmations: REQUIRED_CONFIRMATIONS,
      },
    });
  } catch (error) {
    console.error("BTC deposits POST error", error);
    return NextResponse.json({ error: "Unable to sync Bitcoin deposits" }, { status: 500 });
  }
}
