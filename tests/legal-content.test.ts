import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import {
  FAQ_GROUPS,
  LEGAL,
  LEGAL_DOCUMENTS,
  getContactChannels,
} from "../src/content/legal";
import type { Block } from "../src/content/legal";
import { getPublicInfoRoute } from "../src/lib/publicRoutes";

const text = (b: Block) => (typeof b === "string" ? b : b.list.join(" "));
const allText = () =>
  [
    ...Object.values(LEGAL_DOCUMENTS).flatMap((d) => [
      d.title,
      d.summary,
      ...d.sections.flatMap((s) => [s.title, ...s.body.map(text)]),
    ]),
    ...FAQ_GROUPS.flatMap((g) => g.items.flatMap((i) => [i.q, i.a])),
  ].join("\n");

test("every document has unique section ids and non-empty sections", () => {
  for (const doc of Object.values(LEGAL_DOCUMENTS)) {
    const ids = doc.sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, `${doc.slug} ids are unique`);
    for (const section of doc.sections) {
      assert.ok(section.title.trim() && section.body.length > 0, section.id);
    }
  }
});

test("content has no unfinished placeholders", () => {
  assert.doesNotMatch(allText(), /TODO|TBD|lorem|\[[A-Z _]{3,}\]|\{\{/i);
});

test("documents name the operator and do not claim to be a bank or deposit-insured", () => {
  const all = allText();
  assert.ok(all.includes(LEGAL.entity));
  assert.match(all, /is not a bank/i);
  assert.doesNotMatch(all, /NDIC|deposit insurance|CBN[- ]licen[cs]ed/i);
});

test("documents match what the app really does", () => {
  const privacy = text({
    list: LEGAL_DOCUMENTS.privacy.sections.flatMap((s) => s.body.map(text)),
  });
  for (const term of [
    "NIN",
    "selfie",
    "Nigeria Data Protection",
    "do not sell",
  ]) {
    assert.ok(privacy.includes(term), `privacy mentions ${term}`);
  }
  const cookies = LEGAL_DOCUMENTS.cookies.sections
    .flatMap((s) => s.body.map(text))
    .join(" ");
  assert.match(cookies, /Returning-user cookie/);
  assert.match(cookies, /does not store your financial data/i);
});

test("help never asks users to share secrets and warns against it", () => {
  const faq = FAQ_GROUPS.flatMap((g) => g.items.map((i) => i.a)).join(" ");
  assert.match(faq, /never ask/i);
  assert.doesNotMatch(faq, /send (us )?your (password|pin|otp)/i);
});

test("contact channels show only what is configured", () => {
  assert.deepEqual(
    getContactChannels({ email: "", phone: "", whatsapp: "" }),
    [],
  );
  const channels = getContactChannels({
    email: "help@example.com",
    phone: "0801 234 5678",
    whatsapp: "08012345678",
  });
  assert.deepEqual(
    channels.map((c) => c.id),
    ["email", "whatsapp", "phone"],
  );
  assert.equal(channels[0].href, "mailto:help@example.com");
  assert.equal(channels[1].href, "https://wa.me/2348012345678");
  assert.equal(channels[2].href, "tel:08012345678");
});

test("public routes match only the four info pages", () => {
  assert.equal(getPublicInfoRoute("/terms"), "terms");
  assert.equal(getPublicInfoRoute("/Privacy/"), "privacy");
  assert.equal(getPublicInfoRoute("/cookies"), "cookies");
  assert.equal(getPublicInfoRoute("/help"), "help");
  assert.equal(getPublicInfoRoute("/"), null);
  assert.equal(getPublicInfoRoute("/wallet"), null);
  assert.equal(getPublicInfoRoute("/terms/extra"), null);
});

test("app copy makes no unverified insurance, licence or security-standard claims", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = `${dir}/${name}`;
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(tsx?|html)$/.test(name)) files.push(full);
    }
  };
  walk("src");
  const banned =
    /\bNDIC\b|deposit insurance|bank-grade|CBN[- ]licen[cs]ed|AES[- ]?256|ISO 27001|\bMFB\b/i;
  const offenders = files.filter((file) => {
    const code = readFileSync(file, "utf8")
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    return banned.test(code);
  });
  assert.deepEqual(
    offenders,
    [],
    "remove or verify these claims before shipping",
  );
});
