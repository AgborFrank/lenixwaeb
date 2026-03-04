"use server";

import { createDecipheriv } from "crypto";

const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

export type DecryptResult =
  | { ok: true; walletAddress: string; privateKey: string; mnemonic: string | null }
  | { ok: false; error: string };

function decryptBackup(encryptedBase64: string, keyHex: string): string {
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== KEY_LEN) throw new Error("Invalid key length");
  const buf = Buffer.from(encryptedBase64.trim(), "base64");
  if (buf.length < IV_LEN + TAG_LEN) throw new Error("Invalid payload (too short)");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALG, key, iv, { authTagLength: TAG_LEN });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export async function decryptWalletBackup(
  encryptedBase64: string,
  teamSecret: string
): Promise<DecryptResult> {
  const expectedSecret = process.env.INTERNAL_DECRYPT_SECRET;
  if (!expectedSecret || teamSecret !== expectedSecret) {
    return { ok: false, error: "Invalid team secret" };
  }

  const keyHex = process.env.WALLET_BACKUP_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64 || !/^[0-9a-fA-F]+$/.test(keyHex)) {
    return { ok: false, error: "Backup decryption not configured" };
  }

  try {
    const payload = decryptBackup(encryptedBase64, keyHex);
    const obj = JSON.parse(payload) as {
      privateKey?: string;
      mnemonic?: string | null;
      walletAddress?: string;
    };
    if (!obj.privateKey || !obj.walletAddress) {
      return { ok: false, error: "Invalid backup payload" };
    }
    return {
      ok: true,
      walletAddress: obj.walletAddress,
      privateKey: obj.privateKey,
      mnemonic: obj.mnemonic ?? null,
    };
  } catch (e: any) {
    return { ok: false, error: e.message ?? "Decryption failed" };
  }
}
