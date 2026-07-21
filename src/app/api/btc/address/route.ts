import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { deriveBtcAddress } from "@/lib/btc/wallet";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const walletTable = supabase.from("user_wallets") as any;
    const { data: wallet, error: walletError } = await walletTable
      .select("id, bitcoin_xpub, bitcoin_next_index, bitcoin_network")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (walletError) {
      console.error("BTC address wallet lookup error", walletError);
      return NextResponse.json({ error: "Unable to allocate Bitcoin address" }, { status: 500 });
    }

    if (!wallet?.bitcoin_xpub) {
      return NextResponse.json({ error: "Bitcoin wallet is not provisioned" }, { status: 409 });
    }

    const derivationIndex = wallet.bitcoin_next_index ?? 0;
    const depositAddress = deriveBtcAddress(wallet.bitcoin_xpub, derivationIndex);

    const { error: addressError } = await (supabase.from("btc_addresses") as any).insert({
      user_id: user.id,
      wallet_id: wallet.id,
      derivation_index: derivationIndex,
      address: depositAddress.address,
      status: "available",
    });

    if (addressError && addressError.code !== "23505") {
      console.error("BTC address insert error", addressError);
      return NextResponse.json({ error: "Unable to allocate Bitcoin address" }, { status: 500 });
    }

    const { error: updateError } = await walletTable
      .update({
        bitcoin_next_index: derivationIndex + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet.id)
      .eq("user_id", user.id)
      .eq("bitcoin_next_index", derivationIndex);

    if (updateError) {
      console.error("BTC address index update error", updateError);
      return NextResponse.json({ error: "Unable to allocate Bitcoin address" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        address: depositAddress.address,
        network: wallet.bitcoin_network || "mainnet",
        derivationIndex,
        derivationPath: depositAddress.derivationPath,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("BTC address POST error", error);
    return NextResponse.json({ error: "Unable to allocate Bitcoin address" }, { status: 500 });
  }
}
