import assert from "node:assert/strict";
import { test } from "node:test";
import { formatAmountInput, parseAmountInput } from "../src/utils/amountInput";
import { loadingLabelFor } from "../src/utils/loadingLabels";

test("formatAmountInput adds separators and strips junk", () => {
  assert.equal(formatAmountInput("5000"), "5,000");
  assert.equal(formatAmountInput("5,000abc"), "5,000");
  assert.equal(formatAmountInput("0012"), "12");
  assert.equal(formatAmountInput(""), "");
  assert.equal(formatAmountInput("100000"), "100,000");
});

test("parseAmountInput returns a positive number or 0", () => {
  assert.equal(parseAmountInput("100,000"), 100000);
  assert.equal(parseAmountInput(""), 0);
  assert.equal(parseAmountInput("0"), 0);
});

test("loadingLabelFor gives screen-specific text with a safe default", () => {
  assert.match(loadingLabelFor("wallet").title, /wallet/i);
  assert.equal(loadingLabelFor("nope").title, "Loading");
  assert.equal(loadingLabelFor().title, "Loading");
});
