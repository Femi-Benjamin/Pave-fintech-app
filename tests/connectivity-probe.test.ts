import test from "node:test";
import assert from "node:assert/strict";
import { probeConnectivity } from "../src/components/NetworkStatus";

test("connectivity probe reports successful and failed responses", async () => {
  assert.equal(await probeConnectivity(async () => new Response(null, { status: 204 })), true);
  assert.equal(await probeConnectivity(async () => new Response(null, { status: 503 })), false);
  assert.equal(await probeConnectivity(async () => { throw new Error("offline"); }), false);
});

test("connectivity probe aborts a stalled request at its timeout", async () => {
  const probe = probeConnectivity((_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
  }), 10);
  assert.equal(await probe, false);
});
