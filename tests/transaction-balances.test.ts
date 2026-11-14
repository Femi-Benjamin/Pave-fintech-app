import assert from "node:assert/strict";
import { test } from "node:test";
import { reconcileBalances } from "../src/utils/transactionBalances";
import {
  friendlyTransactionTitle,
  isBankNarration,
  buildTransactionReceipt,
} from "../src/utils/transactionReceipt";

const tx = (id: string, iso: string, type: string, amount: number, before: number, after: number, status = "SUCCESS") => ({
  id, createdAt: iso, transactionType: type, amount, balanceBefore: before, balanceAfter: after, status,
});

const history = () => [
  tx("a", "2026-11-09T10:00:00Z", "airtime", 99.1, 100, 0.9),
  // backend recorded the funding's "before" AFTER the money was added
  tx("b", "2026-11-14T12:19:00Z", "wallet funding", 5000, 5000.9, 10000.9),
  tx("c", "2026-11-14T15:00:00Z", "bill", 1585.6, 5000.9, 3415.3),
  tx("d", "2026-11-14T17:10:00Z", "transfer", 3215.3, 3415.3, 200, "PENDING"),
];

test("fixes a funding whose reported balance before already included the credit", () => {
  const fixed = reconcileBalances(history(), 200);
  assert.deepEqual(fixed.get("b"), { before: 0.9, after: 5000.9 });
  assert.equal(fixed.has("a"), false);
  assert.equal(fixed.has("c"), false);
  assert.equal(fixed.has("d"), false);
});

test("consistent history needs no corrections", () => {
  const ok = history();
  ok[1] = tx("b", "2026-11-14T12:19:00Z", "wallet funding", 5000, 0.9, 5000.9);
  assert.equal(reconcileBalances(ok, 200).size, 0);
});

test("does nothing when the live balance disagrees with the newest transaction", () => {
  assert.equal(reconcileBalances(history(), 999).size, 0);
});

test("does nothing when history is impossible (negative running balance)", () => {
  const bad = [tx("x", "2026-11-14T10:00:00Z", "wallet funding", 500, 0, 100)];
  assert.equal(reconcileBalances(bad, 100).size, 0);
});

test("ignores failed transactions and bails out on incomplete rows", () => {
  const h = history();
  h.push(tx("f", "2026-11-14T16:00:00Z", "transfer", 9999, 1, 1, "FAILED"));
  assert.deepEqual(reconcileBalances(h, 200).get("b"), { before: 0.9, after: 5000.9 });
  const missingDate = [...history(), { id: "z", amount: 5, transactionType: "bill", status: "SUCCESS" }];
  assert.equal(reconcileBalances(missingDate as any, 200).size, 0);
});

test("bank narrations get a readable title and keep the raw text as a row", () => {
  const n = "6423078517/9817600139/PACEPLOYTLTD/AD";
  assert.equal(isBankNarration(n), true);
  assert.equal(isBankNarration("Funding wallet"), false);
  assert.equal(friendlyTransactionTitle(n, "credit"), "Bank transfer received");
  assert.equal(friendlyTransactionTitle("Airtie Purchase mtn", "debit"), "Airtime Purchase MTN");
  const rec = buildTransactionReceipt({ description: n, transactionType: "wallet funding", amount: 5000, status: "SUCCESS" });
  assert.equal(rec.title, "Bank transfer received");
  assert.ok(rec.rows.some((r) => r.label === "Narration" && r.value === n));
});

test("receipt uses corrected balances when given", () => {
  const rec = buildTransactionReceipt(history()[1] as any, { before: 0.9, after: 5000.9 });
  assert.ok(rec.rows.some((r) => r.label === "Balance before" && r.value.includes("0.90")));
  assert.ok(rec.rows.some((r) => r.label === "Balance after" && r.value.includes("5,000.90")));
});
