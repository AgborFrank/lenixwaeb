import assert from "node:assert/strict";
import test from "node:test";
import { firstZodMessage, refundIntakeSchema } from "./schema";

void test("accepts a complete buyer intake", () => {
  const parsed = refundIntakeSchema.safeParse({
    role: "buyer",
    name: "Ada Okonkwo",
    email: "ada@example.com",
    payment_tx_hash: "0xabc1234567890",
    amount: "480",
    currency: "USDT",
    blockchain: "ETH",
    incident_summary:
      "Jacket arrived two sizes smaller than listed and the seller stopped answering after I sent photos.",
    counterparty_name: "Northwind Apparel",
    order_ref: "ORD-2044",
  });

  assert.equal(parsed.success, true);
});

void test("rejects a summary that is too short", () => {
  const parsed = refundIntakeSchema.safeParse({
    role: "seller",
    name: "Shop",
    email: "shop@example.com",
    payment_tx_hash: "0xabc1234567890",
    amount: "50",
    currency: "USD",
    incident_summary: "Bad item",
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.match(firstZodMessage(parsed.error), /fell short/i);
  }
});

void test("accepts an empty blockchain as omitted", () => {
  const parsed = refundIntakeSchema.safeParse({
    role: "buyer",
    name: "Ada Okonkwo",
    email: "ada@example.com",
    payment_tx_hash: "INV-2044-WEST",
    amount: "480",
    currency: "USD",
    blockchain: "",
    incident_summary:
      "Jacket arrived two sizes smaller than listed and the seller stopped answering after I sent photos.",
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.blockchain, undefined);
  }
});

void test("rejects an invalid role", () => {
  const parsed = refundIntakeSchema.safeParse({
    role: "agent",
    name: "Ada",
    email: "ada@example.com",
    payment_tx_hash: "0xabc1234567890",
    amount: "10",
    currency: "USD",
    incident_summary: "The parcel never showed up and tracking stopped updating a week ago.",
  });

  assert.equal(parsed.success, false);
});
