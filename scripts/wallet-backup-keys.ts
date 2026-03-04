/**
 * Wallet backup encryption key: generate and (optionally) decrypt.
 *
 * Generate a new key (add to .env.local as WALLET_BACKUP_ENCRYPTION_KEY):
 *   npx tsx scripts/wallet-backup-keys.ts
 *
 * Decrypt a backup (base64 from recovery email; requires .env.local):
 *   npx tsx scripts/wallet-backup-keys.ts --decrypt "<base64_string>"
 */

import { randomBytes, createDecipheriv } from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ALG = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_LEN = 32;

function generateKey(): string {
  return randomBytes(KEY_LEN).toString("hex");
}

function decryptBackup(encryptedBase64: string, keyHex: string): string {
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== KEY_LEN) {
    throw new Error(`Key must be ${KEY_LEN} bytes (64 hex chars), got ${key.length}`);
  }
  const buf = Buffer.from(encryptedBase64, "base64");
  if (buf.length < IV_LEN + TAG_LEN) {
    throw new Error("Invalid encrypted payload (too short)");
  }
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALG, key, iv, { authTagLength: TAG_LEN });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

function main() {
  const args = process.argv.slice(2);
  const decryptIdx = args.indexOf("--decrypt");
  const doDecrypt = decryptIdx !== -1;
  const encryptedArg = doDecrypt ? args[decryptIdx + 1] : null;

  if (doDecrypt && encryptedArg) {
    const keyHex = process.env.WALLET_BACKUP_ENCRYPTION_KEY;
    if (!keyHex) {
      console.error("WALLET_BACKUP_ENCRYPTION_KEY not set in .env.local");
      process.exit(1);
    }
    try {
      const payload = decryptBackup(encryptedArg.trim(), keyHex);
      const obj = JSON.parse(payload) as { privateKey?: string; mnemonic?: string | null; walletAddress?: string };
      console.log("Decrypted payload:");
      console.log("  walletAddress:", obj.walletAddress);
      console.log("  privateKey:  ", obj.privateKey ? `${obj.privateKey.slice(0, 10)}...` : "(none)");
      console.log("  mnemonic:     ", obj.mnemonic ? `${obj.mnemonic.split(" ").slice(0, 3).join(" ")}...` : "(none)");
      console.log("\nFull payload (use with care):");
      console.log(payload);
    } catch (e) {
      console.error("Decryption failed:", e);
      process.exit(1);
    }
    return;
  }

  // Generate new key
  const key = generateKey();
  console.log("Generated 32-byte key (64 hex characters).");
  console.log("Add to .env.local:\n");
  console.log(`WALLET_BACKUP_ENCRYPTION_KEY=${key}`);
  console.log("\nKeep this key secret. Use the same key to decrypt wallet backups.");
}

main();
