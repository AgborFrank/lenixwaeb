import { NextResponse } from "next/server";
import { z } from "zod";
import { decryptData } from "@/utils/crypto";
import { createClient } from "@/utils/supabase/server";
import { deriveBtcAccount, deriveBtcAddress } from "@/lib/btc/wallet";

const provisionSchema = z.object({
  password: z.string().min(8),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const walletTable = supabase.from("user_wallets") as any;
    const { data: wallet, error } = await walletTable
      .select("id, bitcoin_address, bitcoin_network, bitcoin_xpub, bitcoin_next_index")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("BTC wallet lookup error", error);
      return NextResponse.json({ error: "Unable to load Bitcoin wallet" }, { status: 500 });
    }

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        address: wallet.bitcoin_address,
        network: wallet.bitcoin_network || "mainnet",
        provisioned: Boolean(wallet.bitcoin_xpub && wallet.bitcoin_address),
        nextAddressIndex: wallet.bitcoin_next_index ?? 0,
      },
    });
  } catch (error) {
    console.error("BTC wallet GET error", error);
    return NextResponse.json({ error: "Unable to load Bitcoin wallet" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = provisionSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "A valid wallet password is required" }, { status: 400 });
    }

    const walletTable = supabase.from("user_wallets") as any;
    const { data: wallet, error: walletError } = await walletTable
      .select("id, encrypted_data, bitcoin_address, bitcoin_network, bitcoin_xpub, bitcoin_next_index")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (walletError) {
      console.error("BTC wallet provisioning lookup error", walletError);
      return NextResponse.json({ error: "Unable to provision Bitcoin wallet" }, { status: 500 });
    }

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (wallet.bitcoin_xpub && wallet.bitcoin_address) {
      return NextResponse.json({
        data: {
          address: wallet.bitcoin_address,
          network: wallet.bitcoin_network || "mainnet",
          provisioned: true,
          nextAddressIndex: wallet.bitcoin_next_index ?? 1,
        },
      });
    }

    const encryptedMnemonic = wallet.encrypted_data?.mnemonic;
    if (!encryptedMnemonic) {
      return NextResponse.json({ error: "Wallet recovery data is unavailable" }, { status: 422 });
    }

    let mnemonic: string;
    try {
      mnemonic = await decryptData(encryptedMnemonic, parsed.data.password);
    } catch {
      return NextResponse.json({ error: "Unable to verify wallet password" }, { status: 401 });
    }

    const account = deriveBtcAccount(mnemonic);
    const depositAddress = deriveBtcAddress(account.xpub, 0);

    const { error: updateError } = await walletTable
      .update({
        bitcoin_address: depositAddress.address,
        bitcoin_xpub: account.xpub,
        bitcoin_next_index: 1,
        bitcoin_network: "mainnet",
        updated_at: new Date().toISOString(),
      })
      .eq("id", wallet.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("BTC wallet provisioning update error", updateError);
      return NextResponse.json({ error: "Unable to provision Bitcoin wallet" }, { status: 500 });
    }

    const addressTable = supabase.from("btc_addresses") as any;
    const { error: addressError } = await addressTable.insert({
      user_id: user.id,
      wallet_id: wallet.id,
      derivation_index: depositAddress.derivationIndex,
      address: depositAddress.address,
      status: "available",
    });

    if (addressError && addressError.code !== "23505") {
      console.error("BTC address provisioning error", addressError);
      return NextResponse.json({ error: "Unable to save Bitcoin deposit address" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        address: depositAddress.address,
        network: "mainnet",
        provisioned: true,
        nextAddressIndex: 1,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("BTC wallet POST error", error);
    return NextResponse.json({ error: "Unable to provision Bitcoin wallet" }, { status: 500 });
  }
}
