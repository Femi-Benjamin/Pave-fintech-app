import assert from "node:assert/strict";
import test from "node:test";
import { normalizeNigerianPhone } from "../src/utils/phone";

test('Phone Helper: "07044316229" valid unchanged', () => {
  const result = normalizeNigerianPhone("07044316229");
  assert.equal(result.value, "07044316229");
  assert.equal(result.valid, true);
});

test('Phone Helper: "0704 431 6229" -> "07044316229"', () => {
  const result = normalizeNigerianPhone("0704 431 6229");
  assert.equal(result.value, "07044316229");
  assert.equal(result.valid, true);
});

test('Phone Helper: "+2347044316229" -> "07044316229"', () => {
  const result = normalizeNigerianPhone("+2347044316229");
  assert.equal(result.value, "07044316229");
  assert.equal(result.valid, true);
});

test('Phone Helper: "2347044316229" -> "07044316229"', () => {
  const result = normalizeNigerianPhone("2347044316229");
  assert.equal(result.value, "07044316229");
  assert.equal(result.valid, true);
});

test('Phone Helper: "0704-431-6229" -> "07044316229"', () => {
  const result = normalizeNigerianPhone("0704-431-6229");
  assert.equal(result.value, "07044316229");
  assert.equal(result.valid, true);
});

test('Phone Helper: "7044316229" invalid', () => {
  const result = normalizeNigerianPhone("7044316229");
  assert.equal(result.valid, false);
});

test('Phone Helper: "0704431622" invalid (10 digits)', () => {
  const result = normalizeNigerianPhone("0704431622");
  assert.equal(result.valid, false);
});

test('Phone Helper: "abc" invalid', () => {
  const result = normalizeNigerianPhone("abc");
  assert.equal(result.valid, false);
});

test('Phone Helper: "" invalid', () => {
  const result = normalizeNigerianPhone("");
  assert.equal(result.valid, false);
});
