import assert from "node:assert/strict";
import test from "node:test";
import {
  parseDataPlans,
  groupPlansByDuration,
  availableCategories,
  planDisplayLabel,
} from "../src/utils/dataPlans";

const mk = (name: string, amt: string) => ({ name, variation_amount: amt, variation_code: name });

test("plans are categorised and labelled from their names", () => {
  const p = parseDataPlans([
    mk("110MB Daily Plan (1 Day) - N100", "100"),
    mk("1.5GB Weekly Plan (7 Days) - N1,000", "1000"),
    mk("7GB Monthly Plan - N3,500", "3500"),
    mk("16.5GB + 10mins Monthly Plan - N6500", "6500"),
    mk("Glo Data N200 - 350MB - 4 days", "200"),
    mk("Youtube N130 1.5GB Oneoff", "130"),
  ]);
  assert.deepEqual(p.map((x) => x.category), ["daily", "weekly", "monthly", "monthly", "weekly", "other"]);
  assert.equal(p[0].label, "110MB");
  assert.equal(p[1].label, "1.5GB");
  assert.equal(p[3].label, "16.5GB + 10mins");
  assert.equal(p[4].label, "Glo Data - 350MB");
  assert.deepEqual(availableCategories(p).map((c) => c.id), ["daily", "weekly", "monthly", "other"]);
});

test("groupPlansByDuration orders groups and prices", () => {
  const p = parseDataPlans([
    mk("5GB 30 days", "2000"),
    mk("2GB 7 days", "1000"),
    mk("1GB 7 days", "500"),
    mk("10GB 30 days", "3000"),
  ]);
  const g = groupPlansByDuration(p, "weekly");
  assert.equal(g.length, 1);
  assert.equal(g[0].title, "7-DAY PLAN");
  assert.deepEqual(g[0].items.map((i) => i.amount), [500, 1000]);
  assert.equal(groupPlansByDuration(p, "monthly")[0].title, "30-DAY PLAN");
});

test("label falls back to the full name when nothing is left", () => {
  assert.equal(planDisplayLabel("Monthly Plan"), "Monthly Plan");
});
