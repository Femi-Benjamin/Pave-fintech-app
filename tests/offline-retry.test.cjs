const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
// package.json is "type": "module", so load the browser script the way a
// classic script is loaded and read its exports from a fake CommonJS module.
const sandbox = { exports: {} };
new Function("module", fs.readFileSync("public/offline.js", "utf8"))(sandbox);
const { init, probe, MESSAGES } = sandbox.exports;

function setup(fetchImpl) {
  const events = {};
  const button = {
    textContent: "Retry connection",
    attrs: {},
    listeners: {},
    addEventListener(type, fn) { this.listeners[type] = fn; },
    setAttribute(k, v) { this.attrs[k] = v; },
  };
  const status = { textContent: "" };
  const log = { home: 0, ticks: [], cleared: 0 };
  let visible = true;
  const handle = init({
    button, status,
    fetch: fetchImpl,
    goHome: () => { log.home += 1; },
    onOnline: (fn) => { events.online = fn; },
    isVisible: () => visible,
    setInterval: (fn) => { log.ticks.push(fn); return 1; },
    clearInterval: () => { log.cleared += 1; },
  });
  const click = () => {
    let prevented = false;
    button.listeners.click({ preventDefault() { prevented = true; } });
    return prevented;
  };
  return { button, status, log, events, handle, click, setVisible: (v) => { visible = v; } };
}
const tick = () => new Promise((r) => setImmediate(r));

test("tapping Retry checks first, then opens the app when the connection works", async () => {
  const t = setup(async () => ({ ok: true }));
  assert.equal(t.click(), true, "the link's default navigation is replaced");
  assert.equal(t.status.textContent, MESSAGES.checking);
  assert.equal(t.button.attrs["aria-disabled"], "true");
  await tick();
  assert.equal(t.log.home, 1);
});

test("a failed manual retry stays on the page and says so", async () => {
  const t = setup(async () => { throw new Error("no network"); });
  t.click();
  await tick();
  assert.equal(t.log.home, 0);
  assert.equal(t.status.textContent, MESSAGES.failed);
  assert.equal(t.button.textContent, "Retry connection");
  assert.equal(t.button.attrs["aria-disabled"], "false");
});

test("a server error response counts as not connected", async () => {
  const t = setup(async () => ({ ok: false }));
  t.click();
  await tick();
  assert.equal(t.log.home, 0);
  assert.equal(t.status.textContent, MESSAGES.failed);
});

test("double taps do not start two checks", async () => {
  let calls = 0;
  const t = setup(async () => { calls += 1; return { ok: false }; });
  t.click(); t.click();
  await tick();
  assert.equal(calls, 1);
});

test("the browser coming back online retries automatically and opens the app", async () => {
  const t = setup(async () => ({ ok: true }));
  t.events.online();
  await tick();
  assert.equal(t.log.home, 1);
});

test("automatic retries stay quiet when they fail", async () => {
  const t = setup(async () => ({ ok: false }));
  t.log.ticks[0]();
  await tick();
  assert.equal(t.log.home, 0);
  assert.equal(t.status.textContent, "");
});

test("the timer does not probe while the page is hidden", async () => {
  let calls = 0;
  const t = setup(async () => { calls += 1; return { ok: false }; });
  t.setVisible(false);
  t.log.ticks[0]();
  await tick();
  assert.equal(calls, 0);
});

test("probe sends a no-store HEAD request and reports ok", async () => {
  let seen;
  const ok = await probe(async (url, options) => { seen = { url, options }; return { ok: true }; }, 1000);
  assert.equal(ok, true);
  assert.match(seen.url, /^\/favicon\.svg\?retry=\d+$/);
  assert.equal(seen.options.method, "HEAD");
  assert.equal(seen.options.cache, "no-store");
});

test("offline page uses only same-origin scripts and does not claim there is no internet", () => {
  const html = fs.readFileSync("public/offline.html", "utf8");
  assert.ok(!/<script(?![^>]*\ssrc=)[^>]*>/i.test(html), "no inline scripts (CSP script-src 'self')");
  assert.match(html, /<script src="\/offline\.js">/);
  assert.ok(!/no internet connection/i.test(html));
  const sw = fs.readFileSync("public/service-worker.js", "utf8");
  assert.match(sw, /"\/offline\.js"/, "the retry script is precached so it works offline");
});
