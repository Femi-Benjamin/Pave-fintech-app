import assert from "node:assert/strict";
import test from "node:test";
import { buildTransactionReceipt } from "../src/utils/transactionReceipt";

const sample = {
  id: "aa98", userId: "bf31", amount: "99.1", reference: "20261109203327a252",
  status: "COMPLETED", type: "DEBIT", description: "Airtie Purchase mtn",
  destination: "08160989601", transactionFees: "0.00", vat: "0.00", currency: "NGN",
  paymentMethod: "Wallet", transactionType: "Bill Payment", balanceBefore: "100.00",
  balanceAfter: "0.90", createdAt: "2026-11-09T19:33:23.399Z",
  metadata: JSON.stringify({ response_description: "TRANSACTION SUCCESSFUL", content: { transactions: { status: "delivered" } } }),
};

test("builds a readable receipt from the raw record", () => {
  const r = buildTransactionReceipt(sample);
  assert.equal(r.title, "Airtime Purchase MTN");
  assert.equal(r.status, "success");
  assert.equal(r.direction, "debit");
  assert.equal(r.amount, 99.1);
  const labels = r.rows.map((x) => x.label);
  assert.ok(labels.includes("Recipient") && labels.includes("Balance after"));
  assert.ok(!labels.includes("Fee") && !labels.includes("VAT")); // zero fees hidden
  assert.equal(r.rows.find((x) => x.label === "Provider response")?.value, "Transaction successful");
  assert.equal(r.rows.find((x) => x.label === "Delivery")?.value, "Delivered");
  assert.equal(r.rows.find((x) => x.label === "Balance after")?.value, "₦0.90");
});

test("ids and raw metadata are never shown to users", () => {
  const r = buildTransactionReceipt(sample);
  assert.ok(!r.rows.some((x) => /^(id|userId|metadata)$/i.test(x.label)));
  assert.ok(!r.rows.some((x) => x.value.includes("{")));
});

test("funding is a credit; broken metadata does not throw", () => {
  const r = buildTransactionReceipt({ amount: 100, status: "success", type: "CREDIT", description: "Funding wallet", metadata: "{not json" });
  assert.equal(r.direction, "credit");
  assert.equal(r.status, "success");
});
