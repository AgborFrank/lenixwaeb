import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { decryptDataCompatible } from "@/utils/crypto";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { deriveBtcPrivateKey } from "@/lib/btc/wallet";

const ADMIN_ENCRYPTION_KEY = "admin_encryption_key_2024";

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;

  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret || secret.length < 32) return false;
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

interface DecryptedCredentials {
  mnemonic: string | null;
  ethereumPrivateKey: string | null;
  bitcoinPrivateKey: string | null;
  solanaPrivateKey: string | null;
  addresses: {
    ethereum: string | null;
    bitcoin: string | null;
    solana: string | null;
    polygon: string | null;
    bsc: string | null;
  };
}

function parseEncryptedField(
  field: any
): { encryptedData: string; iv: string } | null {
  if (!field) {
    return null;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof field === "string") {
    try {
      field = JSON.parse(field);
    } catch (e) {
      console.log("Failed to parse string field as JSON:", e);
      return null;
    }
  }
  
  // Validate required fields
  if (!field?.encryptedData || !field?.iv) {
    console.log("Field missing encryptedData or iv:", { 
      hasEncryptedData: !!field?.encryptedData, 
      hasIv: !!field?.iv,
      keys: field ? Object.keys(field) : []
    });
    return null;
  }
  
  return { encryptedData: field.encryptedData, iv: field.iv };
}

async function decryptField(
  encrypted: any
): Promise<string | null> {
  const parsed = parseEncryptedField(encrypted);
  if (!parsed) {
    console.log("parseEncryptedField returned null for:", typeof encrypted, encrypted ? "has value" : "null/undefined");
    return null;
  }
  
  try {
    const result = await decryptDataCompatible(parsed, ADMIN_ENCRYPTION_KEY);
    return result;
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Get user_wallets data
  const { data: wallet, error } = await supabase
    .from("user_wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !wallet) {
    console.log("Wallet fetch error:", error);
    return NextResponse.json({ credentials: null, message: "No wallet found" });
  }

  const encData = wallet.encrypted_data as Record<string, any> | null;

  // Debug logging
  console.log("=== WALLET CREDENTIALS DEBUG ===");
  console.log("User ID:", userId);
  console.log("Encrypted data exists:", !!encData);
  console.log("Encrypted data keys:", encData ? Object.keys(encData) : "null");
  
  if (encData) {
    console.log("adminMnemonic exists:", !!encData.adminMnemonic);
    console.log("adminEthereumPrivateKey exists:", !!encData.adminEthereumPrivateKey);
    console.log("adminBitcoinPrivateKey exists:", !!encData.adminBitcoinPrivateKey);
    console.log("adminBitcoinPrivateKey value:", JSON.stringify(encData.adminBitcoinPrivateKey)?.slice(0, 100));
  }

  // Decrypt all fields
  const [mnemonic, ethereumPrivateKey, storedBitcoinPrivateKey, solanaPrivateKey] = await Promise.all([
    decryptField(encData?.adminMnemonic),
    decryptField(encData?.adminEthereumPrivateKey),
    decryptField(encData?.adminBitcoinPrivateKey),
    decryptField(encData?.adminSolanaPrivateKey),
  ]);

  // Derive Bitcoin private key from mnemonic if not stored separately
  let bitcoinPrivateKey = storedBitcoinPrivateKey;
  if (!bitcoinPrivateKey && mnemonic && wallet.bitcoin_address) {
    try {
      const privateKeyBytes = deriveBtcPrivateKey(mnemonic, 0);
      bitcoinPrivateKey = bytesToHex(privateKeyBytes);
      console.log("Derived BTC key from mnemonic: YES");
    } catch (e) {
      console.error("Failed to derive BTC key from mnemonic:", e);
    }
  }

  console.log("Decrypted mnemonic:", mnemonic ? "YES" : "NO");
  console.log("Decrypted ETH key:", ethereumPrivateKey ? "YES" : "NO");
  console.log("Decrypted BTC key:", bitcoinPrivateKey ? "YES" : "NO");
  console.log("Decrypted SOL key:", solanaPrivateKey ? "YES" : "NO");

  const credentials: DecryptedCredentials = {
    mnemonic,
    ethereumPrivateKey,
    bitcoinPrivateKey,
    solanaPrivateKey,
    addresses: {
      ethereum: wallet.ethereum_address || encData?.ethereumAddress || null,
      bitcoin: wallet.bitcoin_address || encData?.bitcoinAddress || null,
      solana: wallet.solana_address || encData?.solanaAddress || null,
      polygon: wallet.polygon_address || encData?.polygonAddress || null,
      bsc: wallet.bsc_address || encData?.bscAddress || null,
    },
  };

  return NextResponse.json({ credentials });
}
