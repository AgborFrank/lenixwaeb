import assert from "node:assert/strict";
import test from "node:test";
import {
  btcToSatoshis,
  deriveBtcAccount,
  deriveBtcAddress,
  isValidBtcAddress,
  satoshisToBtc,
} from "./wallet";

const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

void test("derives the deterministic BIP84 Bitcoin address", () => {
  const account = deriveBtcAccount(TEST_MNEMONIC);
  const address = deriveBtcAddress(account.xpub, 0);

  assert.equal(address.address, "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu");
  assert.equal(address.derivationPath, "m/84'/0'/0'/0/0");
  assert.equal(isValidBtcAddress(address.address), true);
});

void test("rejects malformed or testnet Bitcoin addresses", () => {
  assert.equal(isValidBtcAddress("not-a-bitcoin-address"), false);
  assert.equal(isValidBtcAddress("tb1qexample"), false);
});

void test("converts BTC amounts without floating-point satoshi loss", () => {
  assert.equal(btcToSatoshis("0.00000001"), 1);
  assert.equal(satoshisToBtc(123456789), "1.23456789");
});
