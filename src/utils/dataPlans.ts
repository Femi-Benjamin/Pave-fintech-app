export type PlanCategory = "daily" | "weekly" | "monthly" | "other";

export interface ParsedPlan<T> {
  plan: T;
  label: string;
  days: number | null;
  category: PlanCategory;
  amount: number;
}

export const PLAN_CATEGORIES: { id: PlanCategory; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "other", label: "Other" },
];

/** How many days a plan lasts, read from its name; null when it doesn't say. */
export function planDurationDays(name: string): number | null {
  const n = name.toLowerCase();
  const explicit = n.match(/(\d+)\s*-?\s*days?\b/);
  if (explicit) return Number(explicit[1]);
  const weeks = n.match(/(\d+)\s*-?\s*weeks?\b/);
  if (weeks) return Number(weeks[1]) * 7;
  const months = n.match(/(\d+)\s*-?\s*months?\b/);
  if (months) return Number(months[1]) * 30;
  if (/\bdaily\b/.test(n)) return 1;
  if (/\bweekly\b/.test(n)) return 7;
  if (/\bmonthly\b/.test(n)) return 30;
  if (/\b(yearly|annual)\b/.test(n)) return 365;
  return null;
}

export function planCategoryFor(days: number | null): PlanCategory {
  if (days === null) return "other";
  if (days <= 3) return "daily";
  if (days <= 14) return "weekly";
  return "monthly";
}

/** Plan name without the price and duration, e.g. "1.5GB Weekly Plan (7 Days) - N1,000" → "1.5GB". */
export function planDisplayLabel(name: string): string {
  const cleaned = name
    .replace(/\(\s*\d+\s*-?\s*days?\s*\)/gi, " ")
    .replace(/\b\d+\s*-?\s*(days?|weeks?|months?)\b/gi, " ")
    .replace(/\b(daily|weekly|monthly|yearly|annual)\b/gi, " ")
    .replace(/\bplan\b/gi, " ")
    .replace(/\bN\s?\d[\d,]*(\.\d+)?\b/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(\s*[-–]\s*)+$/g, "")
    .replace(/^(\s*[-–]\s*)+/g, "")
    .replace(/\s+[-–]\s+[-–]\s+/g, " - ")
    .trim();
  return cleaned || name.trim();
}

export function parseDataPlans<
  T extends { name: string; variation_amount: string | number },
>(plans: T[]): ParsedPlan<T>[] {
  return plans.map((plan) => {
    const days = planDurationDays(plan.name);
    return {
      plan,
      label: planDisplayLabel(plan.name),
      days,
      category: planCategoryFor(days),
      amount: Number(plan.variation_amount) || 0,
    };
  });
}

/** Plans of one category, grouped by duration (shortest first), cheapest first inside each group. */
export function groupPlansByDuration<T>(
  parsed: ParsedPlan<T>[],
  category: PlanCategory,
): { days: number | null; title: string; items: ParsedPlan<T>[] }[] {
  const byDays = new Map<number | null, ParsedPlan<T>[]>();
  for (const p of parsed.filter((x) => x.category === category)) {
    byDays.set(p.days, [...(byDays.get(p.days) ?? []), p]);
  }
  return [...byDays.entries()]
    .sort((a, b) => (a[0] ?? 9999) - (b[0] ?? 9999))
    .map(([days, items]) => ({
      days,
      title: days === null ? "OTHER PLANS" : `${days}-DAY PLAN`,
      items: [...items].sort((a, b) => a.amount - b.amount),
    }));
}

/** Categories that have at least one plan, in display order. */
export function availableCategories<T>(parsed: ParsedPlan<T>[]) {
  return PLAN_CATEGORIES.filter((c) => parsed.some((p) => p.category === c.id));
}
