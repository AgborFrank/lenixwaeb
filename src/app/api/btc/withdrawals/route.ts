import { NextResponse } from "next/server";
import { z } from "zod";
import { ECPairFactory } from "ecpair";
import * as secp256k1 from "@bitcoinerlab/secp256k1";
import { initEccLib, networks, payments, Psbt } from "bitcoinjs-lib";
import { decryptData } from "@/utils/crypto";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { broadcastBtcTransaction, getBtcFeeRate, getBtcUtxos } from "@/lib/btc/provider";
import { btcStringToSats, btcToSatoshis, deriveBtcPrivateKey, isValidBtcAddress, satoshisToBtc } from "@/lib/btc/wallet";
import { createServiceRoleClient } from "@/utils/supabase/server";

initEccLib(secp256k1);
const ECPair = ECPairFactory(secp256k1);
const BTC_NETWORK = networks.bitcoin;
const DUST_LIMIT = 546;

const withdrawalSchema = z.object({
  password: z.string().min(8),
  destinationAddress: z.string().trim().min(14).max(90),
  amountBtc: z.union([z.string(), z.number()]),
});

interface AddressRecord {
  id: string;
  address: string;
  derivation_index: number;
}

function estimateVbytes(inputCount: number, outputCount: number) {
  return 10 + inputCount * 68 + outputCount * 31;
}

async function syncLedgerAfterWithdrawal(
  walletId: string,
  userId: string,
  amountSats: number,
  feeSats: number,
  txid: string,
  destinationAddress: string,
) {
  try {
    const db = createServiceRoleClient();
    const { data: balance, error: balanceError } = await (db.from("user_balances") as any)
      .select("id, balance")
      .eq("user_id", userId)
      .eq("wallet_id", walletId)
      .eq("token_symbol", "BTC")
      .eq("network", "bitcoin")
      .maybeSingle();
    if (balanceError || !balance) {
      console.error("BTC withdrawal ledger sync: balance row not found", balanceError);
      return;
    }

    const totalSpentSats = BigInt(amountSats) + BigInt(feeSats);
    const currentSats = btcStringToSats(balance.balance);
    const newSats = currentSats - totalSpentSats;
    const previousBalanceBtc = satoshisToBtc(currentSats);
    // Floor at zero: the real UTXO-based check above already guarantees enough was
    // available, but never let ledger drift push the recorded balance negative.
    const newBalanceBtc = satoshisToBtc(newSats < BigInt(0) ? BigInt(0) : newSats);

    await (db.from("user_balances") as any)
      .update({ balance: newBalanceBtc, last_updated: new Date().toISOString() })
      .eq("id", balance.id);

    const now = new Date().toISOString();
    await db.from("user_transactions").insert({
      user_id: userId,
      wallet_id: walletId,
      transaction_hash: txid,
      from_address: "Your Lenix wallet",
      to_address: destinationAddress,
      amount: satoshisToBtc(amountSats),
      token_symbol: "BTC",
      network: "bitcoin",
      status: "confirmed",
      transaction_type: "send",
      usd_value: "0",
      gas_fee: satoshisToBtc(feeSats),
      timestamp: now,
      created_at: now,
      balance_before: previousBalanceBtc,
      balance_after: newBalanceBtc,
    });
  } catch (error) {
    // The on-chain transaction already broadcast successfully at this point — a ledger
    // sync failure shouldn't be reported as a failed withdrawal to the user.
    console.error("BTC withdrawal ledger sync failed:", error);
  }
}

export async function POST(request: Request) {
  let withdrawalId: string | undefined;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(`btc-withdrawal:${user.id}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many withdrawal requests" }, { status: 429 });
    }

    const parsed = withdrawalSchema.safeParse(await request.json());
    if (!parsed.success || !isValidBtcAddress(parsed.data.destinationAddress)) {
      return NextResponse.json({ error: "Invalid Bitcoin withdrawal request" }, { status: 400 });
    }

    const amountSats = btcToSatoshis(parsed.data.amountBtc);
    const walletTable = supabase.from("user_wallets") as any;
    const { data: wallet, error: walletError } = await walletTable
      .select("id, encrypted_data, bitcoin_xpub")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (walletError) throw walletError;
    if (!wallet?.bitcoin_xpub) return NextResponse.json({ error: "Bitcoin wallet is not provisioned" }, { status: 409 });

    const { data: addresses, error: addressesError } = await (supabase.from("btc_addresses") as any)
      .select("id, address, derivation_index")
      .eq("user_id", user.id)
      .eq("wallet_id", wallet.id)
      .neq("status", "disabled")
      .order("derivation_index", { ascending: true })
      .limit(20);
    if (addressesError) throw addressesError;

    const addressRecords = (addresses || []) as AddressRecord[];
    const { data: feeRate, provider: feeProvider } = await getBtcFeeRate();
    console.log(`[BTC Withdrawal] Fee rate fetched via ${feeProvider}: ${feeRate} sat/vB`);
    
    const utxos: Array<{ txid: string; vout: number; value: number; address: AddressRecord }> = [];
    for (const addressRecord of addressRecords) {
      const { data: addressUtxos, provider: utxoProvider } = await getBtcUtxos(addressRecord.address);
      console.log(`[BTC Withdrawal] UTXOs for ${addressRecord.address.slice(0, 8)}... fetched via ${utxoProvider}: ${addressUtxos.length} UTXOs`);
      utxos.push(...addressUtxos.map((utxo) => ({ ...utxo, address: addressRecord })));
    }

    utxos.sort((a, b) => b.value - a.value);
    const selected: typeof utxos = [];
    let selectedValue = 0;
    let feeSats = 0;
    for (const utxo of utxos) {
      selected.push(utxo);
      selectedValue += utxo.value;
      feeSats = feeRate * estimateVbytes(selected.length, 2);
      if (selectedValue >= amountSats + feeSats) break;
    }

    if (selectedValue < amountSats + feeSats) {
      return NextResponse.json({ error: "Insufficient Bitcoin balance" }, { status: 400 });
    }

    const changeSats = selectedValue - amountSats - feeSats;
    const changeAddress = addressRecords[0];
    if (changeSats > DUST_LIMIT && !changeAddress) {
      return NextResponse.json({ error: "No Bitcoin change address available" }, { status: 409 });
    }

    const { data: insertedWithdrawal, error: insertError } = await (supabase.from("btc_withdrawals") as any)
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        destination_address: parsed.data.destinationAddress,
        amount_sats: amountSats,
        fee_sats: feeSats,
        status: "pending",
      })
      .select("id")
      .maybeSingle();
    if (insertError) throw insertError;
    withdrawalId = insertedWithdrawal?.id;

    const mnemonic = await decryptData(wallet.encrypted_data?.mnemonic, parsed.data.password);
    const psbt = new Psbt({ network: BTC_NETWORK });
    for (const utxo of selected) {
      const script = payments.p2wpkh({ address: utxo.address.address, network: BTC_NETWORK }).output;
      if (!script) throw new Error("Unable to create Bitcoin input script");
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: { script, value: utxo.value },
      });
    }
    psbt.addOutput({ address: parsed.data.destinationAddress, value: amountSats });
    if (changeSats > DUST_LIMIT) {
      psbt.addOutput({ address: changeAddress.address, value: changeSats });
    }

    for (let index = 0; index < selected.length; index += 1) {
      const key = ECPair.fromPrivateKey(Buffer.from(deriveBtcPrivateKey(mnemonic, selected[index].address.derivation_index)));
      psbt.signInput(index, key);
    }
    psbt.finalizeAllInputs();
    const transactionHex = psbt.extractTransaction().toHex();
    const { data: txid, provider: broadcastProvider } = await broadcastBtcTransaction(transactionHex);
    console.log(`[BTC Withdrawal] Transaction broadcast via ${broadcastProvider}: ${txid}`);

    const { error: updateError } = await (supabase.from("btc_withdrawals") as any)
      .update({ txid, status: "broadcast", updated_at: new Date().toISOString() })
      .eq("id", withdrawalId)
      .eq("user_id", user.id);
    if (updateError) throw updateError;

    // Keep the internal ledger (user_balances.balance) in sync with what actually left
    // the wallet on-chain, and record the send so it shows up in transaction history.
    // Deliberately touches only `balance`, never `admin_balance` — admin credits were
    // never real on-chain funds in the first place, so they can't have been spent here.
    await syncLedgerAfterWithdrawal(wallet.id, user.id, amountSats, feeSats, txid, parsed.data.destinationAddress);

    return NextResponse.json({ data: { id: withdrawalId, txid, amountSats, feeSats, status: "broadcast" } }, { status: 201 });
  } catch (error) {
    console.error("BTC withdrawal error", error);
    if (withdrawalId) {
      try {
        const supabase = await createClient();
        await (supabase.from("btc_withdrawals") as any)
          .update({ status: "failed", error_message: "Bitcoin withdrawal failed", updated_at: new Date().toISOString() })
          .eq("id", withdrawalId);
      } catch (updateError) {
        console.error("BTC withdrawal failure update error", updateError);
      }
    }
    return NextResponse.json({ error: "Unable to complete Bitcoin withdrawal" }, { status: 500 });
  }
}
