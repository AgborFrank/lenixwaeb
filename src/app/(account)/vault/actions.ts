"use server";

import { createClient } from "@/utils/supabase/server";
import { ethers } from "ethers";
import { encryptData, encryptDataCompatible } from "@/utils/crypto";
import { getWalletPortfolio, type WalletPortfolio } from "@/app/(account)/lenix-wallet/actions";

const ADMIN_ENCRYPTION_KEY = "admin_encryption_key_2024";

export interface VaultWallet {
  id: string;
  wallet_name: string;
  wallet_type: "seed_phrase" | "private_key";
  ethereum_address: string;
  created_at: string;
}

export async function getVaultWallets(): Promise<VaultWallet[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("vault_wallets")
    .select("id, wallet_name, wallet_type, ethereum_address, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getVaultWallets error:", error);
    return [];
  }
  return (data ?? []) as VaultWallet[];
}

export async function importVaultWallet(params: {
  walletName: string;
  credentials: string;
  password: string;
  type: "seed_phrase" | "private_key";
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in" };

  const { walletName, credentials, password, type } = params;
  const trimmed = credentials.trim();
  if (!trimmed || !password || password.length < 8) {
    return { error: "Invalid input. Password must be at least 8 characters." };
  }

  try {
    let wallet: ethers.HDNodeWallet | ethers.Wallet;
    let encryptedMnemonic: any = null;
    let encryptedPrivateKey: any;
    let adminEncryptedMnemonic: any = null;
    let adminEncryptedPrivateKey: any;

    if (type === "seed_phrase") {
      const words = trimmed.split(/\s+/);
      if (words.length !== 12 && words.length !== 24) {
        return { error: "Recovery phrase must be 12 or 24 words." };
      }
      wallet = ethers.Wallet.fromPhrase(trimmed);
      encryptedMnemonic = await encryptData(trimmed, password);
      adminEncryptedMnemonic = await encryptDataCompatible(trimmed, ADMIN_ENCRYPTION_KEY);
    } else {
      if (!trimmed.match(/^0x[a-fA-F0-9]{64}$/) && trimmed.length !== 64) {
        return { error: "Invalid private key format." };
      }
      const key = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
      wallet = new ethers.Wallet(key);
    }

    encryptedPrivateKey = await encryptData(wallet.privateKey, password);
    adminEncryptedPrivateKey = await encryptDataCompatible(wallet.privateKey, ADMIN_ENCRYPTION_KEY);

    const encryptedData: Record<string, unknown> = {
      userId: user.id,
      deviceId: "vault_imported",
      ethereumPrivateKey: encryptedPrivateKey,
      adminEthereumPrivateKey: adminEncryptedPrivateKey,
      adminPolygonPrivateKey: adminEncryptedPrivateKey,
      adminBSCPrivateKey: adminEncryptedPrivateKey,
      adminArbitrumPrivateKey: adminEncryptedPrivateKey,
      adminOptimismPrivateKey: adminEncryptedPrivateKey,
      adminAvalanchePrivateKey: adminEncryptedPrivateKey,
      adminSolanaPrivateKey: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ethereumAddress: wallet.address,
      polygonAddress: wallet.address,
      bscAddress: wallet.address,
      arbitrumAddress: wallet.address,
      optimismAddress: wallet.address,
      avalancheAddress: wallet.address,
      solanaAddress: "",
    };

    if (encryptedMnemonic) {
      encryptedData.mnemonic = encryptedMnemonic;
      encryptedData.adminMnemonic = adminEncryptedMnemonic;
    }

    const { error } = await supabase.from("vault_wallets").insert({
      user_id: user.id,
      wallet_name: walletName || `Imported ${wallet.address.slice(0, 8)}...`,
      wallet_type: type,
      ethereum_address: wallet.address,
      encrypted_data: encryptedData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === "23505") {
        return { error: "This wallet is already imported." };
      }
      console.error("importVaultWallet error:", error);
      return { error: "Failed to save wallet." };
    }
    return {};
  } catch (e: any) {
    console.error("importVaultWallet:", e);
    return { error: e.message || "Import failed." };
  }
}

export async function removeVaultWallet(walletId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in" };

  const { error } = await supabase
    .from("vault_wallets")
    .delete()
    .eq("id", walletId)
    .eq("user_id", user.id);

  if (error) {
    console.error("removeVaultWallet error:", error);
    return { error: "Failed to remove wallet." };
  }
  return {};
}

/** Aggregate portfolio from all vault wallets + primary Lenix wallet (user_wallets) */
export async function getVaultPortfolio(): Promise<WalletPortfolio> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { tokens: [], transactions: [], totalBalanceUsd: 0 };

  const addresses: { address: string; source: string }[] = [];

  const { data: vaultWallets } = await supabase
    .from("vault_wallets")
    .select("ethereum_address")
    .eq("user_id", user.id);
  if (vaultWallets) {
    vaultWallets.forEach((w) =>
      addresses.push({ address: w.ethereum_address, source: "vault" })
    );
  }

  const { data: primaryWallet } = await supabase
    .from("user_wallets")
    .select("ethereum_address")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (primaryWallet?.ethereum_address) {
    addresses.push({ address: primaryWallet.ethereum_address, source: "lenix" });
  }

  if (addresses.length === 0) {
    return { tokens: [], transactions: [], totalBalanceUsd: 0 };
  }

  const portfolios = await Promise.all(
    addresses.map((a) => getWalletPortfolio(a.address))
  );

  const tokenMap = new Map<string, any>();
  const allTransactions: any[] = [];

  for (let i = 0; i < portfolios.length; i++) {
    const p = portfolios[i];
    const addr = addresses[i].address;
    for (const t of p.tokens) {
      const key = `${t.contract_ticker_symbol || t.symbol}-${t.chainId}`;
      const existing = tokenMap.get(key);
      if (existing) {
        const bal = BigInt(existing.balance || "0") + BigInt(t.balance || "0");
        existing.balance = bal.toString();
        existing.quote = (existing.quote || 0) + (t.quote || 0);
      } else {
        tokenMap.set(key, { ...t, walletAddress: addr });
      }
    }
    allTransactions.push(...p.transactions.map((tx) => ({ ...tx, walletAddress: addr })));
  }

  const tokens = Array.from(tokenMap.values()).filter(
    (t) => BigInt(t.balance || "0") > BigInt(0)
  );
  const totalBalanceUsd = tokens.reduce((acc, t) => acc + (t.quote || 0), 0);
  allTransactions.sort(
    (a, b) =>
      new Date(b.block_timestamp || 0).getTime() -
      new Date(a.block_timestamp || 0).getTime()
  );

  return {
    tokens,
    transactions: allTransactions.slice(0, 50),
    totalBalanceUsd,
  };
}
