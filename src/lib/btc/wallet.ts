import { address as btcAddress, initEccLib, networks, payments } from "bitcoinjs-lib";
import * as secp256k1 from "@bitcoinerlab/secp256k1";
import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

initEccLib(secp256k1);

const BTC_ACCOUNT_PATH = "m/84'/0'/0'";
const BTC_NETWORK = networks.bitcoin;

export interface BtcAccount {
  accountPath: string;
  xpub: string;
}

export interface BtcAddress {
  address: string;
  derivationIndex: number;
  derivationPath: string;
}

export function deriveBtcPrivateKey(mnemonic: string, derivationIndex: number): Uint8Array {
  if (!Number.isSafeInteger(derivationIndex) || derivationIndex < 0) {
    throw new Error("Invalid Bitcoin derivation index");
  }

  const seed = mnemonicToSeedSync(mnemonic.trim().replace(/\s+/g, " "));
  const child = HDKey.fromMasterSeed(seed).derive(`${BTC_ACCOUNT_PATH}/0/${derivationIndex}`);
  if (!child.privateKey) {
    throw new Error("Unable to derive Bitcoin signing key");
  }

  return child.privateKey;
}

function getAccountNode(mnemonic: string): HDKey {
  const phrase = mnemonic.trim().replace(/\s+/g, " ");
  if (!validateMnemonic(phrase, wordlist)) {
    throw new Error("Invalid Bitcoin recovery phrase");
  }

  const seed = mnemonicToSeedSync(phrase);
  return HDKey.fromMasterSeed(seed).derive(BTC_ACCOUNT_PATH);
}

export function deriveBtcAccount(mnemonic: string): BtcAccount {
  const account = getAccountNode(mnemonic);
  if (!account.publicExtendedKey) {
    throw new Error("Unable to derive Bitcoin account public key");
  }

  return {
    accountPath: BTC_ACCOUNT_PATH,
    xpub: account.publicExtendedKey,
  };
}

export function deriveBtcAddress(
  xpub: string,
  derivationIndex: number,
): BtcAddress {
  if (!Number.isSafeInteger(derivationIndex) || derivationIndex < 0) {
    throw new Error("Invalid Bitcoin derivation index");
  }

  const account = HDKey.fromExtendedKey(xpub);
  const child = account.derive(`m/0/${derivationIndex}`);
  if (!child.publicKey) {
    throw new Error("Unable to derive Bitcoin deposit address");
  }

  const payment = payments.p2wpkh({
    pubkey: Buffer.from(child.publicKey),
    network: BTC_NETWORK,
  });

  if (!payment.address) {
    throw new Error("Unable to encode Bitcoin deposit address");
  }

  return {
    address: payment.address,
    derivationIndex,
    derivationPath: `${BTC_ACCOUNT_PATH}/0/${derivationIndex}`,
  };
}

export function isValidBtcAddress(address: string): boolean {
  try {
    const normalized = address.trim();
    if (!normalized) return false;
    btcAddress.toOutputScript(normalized, BTC_NETWORK);
    return true;
  } catch {
    return false;
  }
}

export function btcToSatoshis(amount: string | number): number {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid Bitcoin amount");
  }

  const satoshis = Math.round(value * 100_000_000);
  if (!Number.isSafeInteger(satoshis) || satoshis <= 0) {
    throw new Error("Bitcoin amount is outside the supported range");
  }

  return satoshis;
}

export function satoshisToBtc(satoshis: number | bigint): string {
  const value = typeof satoshis === "bigint" ? satoshis : BigInt(satoshis);
  if (value < BigInt(0)) {
    throw new Error("Invalid satoshi amount");
  }

  const whole = value / BigInt(100_000_000);
  const fraction = (value % BigInt(100_000_000)).toString().padStart(8, "0");
  return `${whole}.${fraction}`;
}

/** Convert a decimal BTC amount string (e.g. "0.00002000", as stored in user_balances)
 *  to integer satoshis. Unlike `btcToSatoshis`, this allows zero/negative-adjacent
 *  values so it's safe to use for balance bookkeeping, not just user-submitted amounts. */
export function btcStringToSats(value: string | null | undefined): bigint {
  if (!value) return BigInt(0);
  const trimmed = value.trim();
  const negative = trimmed.startsWith("-");
  const abs = negative ? trimmed.slice(1) : trimmed;
  const [wholePartRaw, fracPartRaw = ""] = abs.split(".");
  const wholePart = wholePartRaw || "0";
  const fracPart = (fracPartRaw + "00000000").slice(0, 8);
  const sats = BigInt(wholePart || "0") * BigInt(100_000_000) + BigInt(fracPart || "0");
  return negative ? -sats : sats;
}
