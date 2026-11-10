import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTransactionStatus as n } from "../src/utils/transactionStatus";

test("backend 'COMPLETED' and friends are successes", () => {
  for (const s of ["COMPLETED", "completed", "success", "Successful", "delivered", "PAID"]) {
    assert.equal(n(s), "success", s);
  }
});
test("explicit failures are failed", () => {
  for (const s of ["FAILED", "declined", "Rejected", "cancelled", "reversed"]) {
    assert.equal(n(s), "failed", s);
  }
});
test("pending and unknown statuses are never shown as failed", () => {
  for (const s of ["PENDING", "processing", "initiated", "", undefined, null, "something-new"]) {
    assert.equal(n(s as any), "pending", String(s));
  }
});
