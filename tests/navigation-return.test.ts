import assert from "node:assert/strict";
import test from "node:test";
import { resolveReturnScreen } from "../src/utils/navigation";

test("Navigation Return Helper: resolveReturnScreen returns valid screen or falls back to marketplace", () => {
  // Known screen names return as-is
  assert.equal(resolveReturnScreen("group-saving-detail"), "group-saving-detail");
  assert.equal(resolveReturnScreen("marketplace"), "marketplace");
  assert.equal(resolveReturnScreen("home"), "home");
  assert.equal(resolveReturnScreen("profile"), "profile");

  // Unknown, invalid, or empty screen values fall back to "marketplace"
  assert.equal(resolveReturnScreen("unknown-screen"), "marketplace");
  assert.equal(resolveReturnScreen("invalid_screen_123"), "marketplace");
  assert.equal(resolveReturnScreen(""), "marketplace");
  assert.equal(resolveReturnScreen(null), "marketplace");
  assert.equal(resolveReturnScreen(undefined), "marketplace");
});
