import assert from "node:assert/strict";
import { test } from "node:test";

const store = new Map<string, string>();
(globalThis as any).window = {};
(globalThis as any).document = { cookie: "" };
(globalThis as any).sessionStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
};
(window as any).sessionStorage = (globalThis as any).sessionStorage;

const realDateNow = Date.now;
const jwt = (payload: object) =>
  `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;

function withDeviceClockOffset(ms: number, fn: () => void) {
  Date.now = () => realDateNow() + ms;
  try {
    fn();
  } finally {
    Date.now = realDateNow;
  }
}

test("a device clock that is hours ahead does not make a fresh token look expired", async () => {
  const { setToken, getToken, isTokenValid, clearToken } =
    await import("../src/lib/authStorage");
  const iat = Math.floor(realDateNow() / 1000);
  const token = jwt({ iat, exp: iat + 3600 });
  withDeviceClockOffset(3 * 3600e3, () => {
    setToken(token);
    assert.equal(isTokenValid(getToken()), true);
  });
  clearToken();
});

test("a device clock that is behind does not keep an expired token alive", async () => {
  const { setToken, getToken, isTokenValid, clearToken } =
    await import("../src/lib/authStorage");
  const iat = Math.floor(realDateNow() / 1000);
  const token = jwt({ iat, exp: iat + 3600 });
  withDeviceClockOffset(-2 * 3600e3, () => {
    setToken(token);
    assert.equal(isTokenValid(getToken()), true);
  });
  // Real time moves past exp: the corrected check must expire it.
  withDeviceClockOffset(0, () => {
    store.set("pave_clock_skew_ms", String(2 * 3600e3));
    assert.equal(isTokenValid(getToken()), false);
  });
  clearToken();
});

test("a correct clock stores no correction, and tokens without iat are checked as before", async () => {
  const { setToken, getClockSkewMs, isTokenValid, clearToken } =
    await import("../src/lib/authStorage");
  const iat = Math.floor(realDateNow() / 1000);
  setToken(jwt({ iat: iat - 5, exp: iat + 3600 }));
  assert.equal(getClockSkewMs(), 0);
  clearToken();
  setToken(jwt({ exp: iat + 3600 }));
  assert.equal(getClockSkewMs(), 0);
  assert.equal(isTokenValid(jwt({ exp: iat - 10 })), false);
  clearToken();
});

test("signing out clears the correction", async () => {
  const { setToken, getClockSkewMs, clearToken } =
    await import("../src/lib/authStorage");
  const iat = Math.floor(realDateNow() / 1000);
  withDeviceClockOffset(2 * 3600e3, () =>
    setToken(jwt({ iat, exp: iat + 3600 })),
  );
  assert.notEqual(getClockSkewMs(), 0);
  clearToken();
  assert.equal(getClockSkewMs(), 0);
});
