import assert from "node:assert/strict";
import test from "node:test";
import { api } from "../src/lib/api-client";
import { setToken, getToken, subscribeToAuthLogout } from "../src/lib/authStorage";

function fakeJwt() {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  return `h.${payload}.s`;
}

async function run(balanceStatus: number) {
  const store: Record<string, string> = {};
  const ss = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
  };
  (globalThis as any).sessionStorage = ss;
  (globalThis as any).localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  (globalThis as any).window = Object.assign(new EventTarget(), { sessionStorage: ss, localStorage: (globalThis as any).localStorage });
  (globalThis as any).CustomEvent ??= class extends Event { detail: any; constructor(t: string, i?: any) { super(t); this.detail = i?.detail; } };
  setToken(fakeJwt());
  let logouts = 0;
  const off = subscribeToAuthLogout(() => { logouts++; });
  const original = api.defaults.adapter;
  (api.defaults as any).adapter = async (config: any) => {
    const status = String(config.url).includes("getWalletBalance") ? balanceStatus : 401;
    const res = { data: { message: "nope" }, status, statusText: "", headers: {}, config };
    if (status >= 400) { const e: any = new Error("fail"); e.isAxiosError = true; e.config = config; e.response = res; throw e; }
    return res;
  };
  let err: any;
  try { await api.post("/api/v1/bills/buy-airtime", {}); } catch (e) { err = e; }
  (api.defaults as any).adapter = original;
  off();
  return { logouts, err, tokenKept: Boolean(getToken()) };
}

test("a 401 from an action endpoint does NOT log out when the session is still valid", async () => {
  const r = await run(200);
  assert.equal(r.err?.response?.status, 401);
  assert.equal(r.logouts, 0);
  assert.equal(r.tokenKept, true);
});

test("a 401 that is confirmed by the session check logs the user out", async () => {
  const r = await run(401);
  assert.equal(r.logouts, 1);
  assert.equal(r.tokenKept, false);
});
