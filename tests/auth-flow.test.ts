import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeJwtPayload,
  isTokenValid,
  getTokenExpiry,
} from "../src/lib/authStorage";

// Helper to create a fake base64url JWT payload
function createMockJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = "fake_signature_for_test";
  return `${header}.${body}.${signature}`;
}

test("Auth: decodeJwtPayload decodes payload accurately", () => {
  const token = createMockJwt({ id: "user123", email: "user@example.com", exp: 2000000000 });
  const payload = decodeJwtPayload(token);
  assert.equal(payload?.id, "user123");
  assert.equal(payload?.email, "user@example.com");
  assert.equal(payload?.exp, 2000000000);
});

test("Auth: isTokenValid returns false for empty, null, or undefined tokens", () => {
  assert.equal(isTokenValid(undefined), false);
  assert.equal(isTokenValid(null), false);
  assert.equal(isTokenValid(""), false);
  assert.equal(isTokenValid("   "), false);
});

test("Auth: isTokenValid validates JWT token exp claims accurately", () => {
  const futureUnix = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
  const pastUnix = Math.floor(Date.now() / 1000) - 3600; // 1 hour in past

  const validToken = createMockJwt({ exp: futureUnix, id: "u1" });
  const expiredToken = createMockJwt({ exp: pastUnix, id: "u2" });

  assert.equal(isTokenValid(validToken), true);
  assert.equal(isTokenValid(expiredToken), false);
});

test("Auth: getTokenExpiry extracts millisecond timestamp from JWT exp", () => {
  const futureUnix = 1893456000;
  const token = createMockJwt({ exp: futureUnix });
  const expiryMs = getTokenExpiry(token);
  assert.equal(expiryMs, futureUnix * 1000);
});
