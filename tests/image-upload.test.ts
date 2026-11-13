import assert from "node:assert/strict";
import { test } from "node:test";
import { validateImageUpload } from "../src/utils/imageUpload";

test("accepts JPG and PNG under 5MB", () => {
  assert.equal(validateImageUpload({ size: 1000, type: "image/jpeg" }), "");
  assert.equal(validateImageUpload({ size: 5 * 1024 * 1024, type: "image/png" }), "");
});

test("rejects files over 5MB", () => {
  assert.match(validateImageUpload({ size: 5 * 1024 * 1024 + 1, type: "image/png" }), /5MB/);
});

test("rejects empty and non JPG/PNG files", () => {
  assert.match(validateImageUpload({ size: 0, type: "image/png" }), /empty/);
  assert.match(validateImageUpload({ size: 10, type: "application/pdf" }), /JPG or PNG/);
  assert.match(validateImageUpload({ size: 10, type: "" }), /JPG or PNG/);
});
