import assert from "node:assert/strict";
import test from "node:test";
import { buildChatRows, formatDayLabel, avatarColorFor } from "../src/utils/messaging";
import type { ChatMessageItem } from "../src/api/messaging";

const msg = (id: string, senderId: string, createdAt: string): ChatMessageItem => ({
  id, senderId, message: id, messageType: "text", createdAt,
});

test("formatDayLabel: Today, Yesterday, weekday and date", () => {
  const now = new Date(2026, 9, 31, 12, 0, 0);
  assert.equal(formatDayLabel(new Date(2026, 9, 31, 1, 0).toISOString(), now), "Today");
  assert.equal(formatDayLabel(new Date(2026, 9, 30, 23, 0).toISOString(), now), "Yesterday");
  assert.ok(["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].includes(
    formatDayLabel(new Date(2026, 9, 28, 9, 0).toISOString(), now)));
  assert.equal(formatDayLabel("not a date", now), "");
});

test("buildChatRows: day dividers and sender runs", () => {
  const now = new Date(2026, 9, 31, 12, 0, 0);
  const t = (d: number, h: number, m: number) => new Date(2026, 9, d, h, m).toISOString();
  const rows = buildChatRows(
    [
      msg("a1", "me", t(30, 9, 0)),
      msg("a2", "me", t(30, 9, 2)),
      msg("b1", "them", t(30, 9, 3)),
      msg("a3", "me", t(31, 8, 0)),
    ],
    now,
  );
  assert.deepEqual(rows.map((r) => (r.kind === "day" ? `day:${r.label}` : r.key)),
    ["day:Yesterday", "a1", "a2", "b1", "day:Today", "a3"]);
  const get = (k: string) => rows.find((r) => r.kind === "msg" && r.key === k) as any;
  assert.equal(get("a1").isFirstInRun, true);
  assert.equal(get("a1").isLastInRun, false);
  assert.equal(get("a2").isLastInRun, true);
  assert.equal(get("b1").isFirstInRun, true);
  assert.equal(get("a3").isFirstInRun, true);
});

test("buildChatRows: a long pause starts a new run", () => {
  const t = (m: number) => new Date(2026, 9, 31, 9, m).toISOString();
  const rows = buildChatRows([msg("x", "me", t(0)), msg("y", "me", t(30))]);
  const y = rows.find((r) => r.kind === "msg" && r.key === "y") as any;
  assert.equal(y.isFirstInRun, true);
});

test("avatarColorFor is stable and always a brand colour", () => {
  assert.equal(avatarColorFor("Josef Ade"), avatarColorFor("Josef Ade"));
  assert.match(avatarColorFor("Anyone"), /^#[0-9A-F]{6}$/);
});
