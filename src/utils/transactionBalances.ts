import { normalizeTransactionStatus } from "./transactionStatus";
import { transactionDirection } from "./transactionReceipt";

export interface ReconciledBalance {
  before: number;
  after: number;
}

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const r2 = (n: number) => Math.round(n * 100) / 100;
const recordId = (r: Record<string, unknown>) =>
  String(r.id ?? r._id ?? r.reference ?? "");

/**
 * The balance before/after reported on each transaction comes from the backend
 * and can be wrong (for example a funding that shows a balance before that
 * already included the money). This rebuilds the running balance from the
 * wallet's live balance, walking back through the history, and returns the
 * corrected before/after for every transaction whose reported figures disagree.
 *
 * It only returns corrections when it is safe to: the history must be complete
 * and the newest transaction must agree with the live balance (otherwise the
 * two data sources are out of sync and nothing is overridden).
 */
export function reconcileBalances(
  records: Record<string, unknown>[],
  currentBalance: number,
): Map<string, ReconciledBalance> {
  const none = new Map<string, ReconciledBalance>();
  if (!Number.isFinite(currentBalance)) return none;

  const live = records.filter(
    (r) => normalizeTransactionStatus(r.status as string | undefined) !== "failed",
  );
  const entries = live
    .map((r) => ({
      r,
      id: recordId(r),
      amount: num(r.amount),
      t: Date.parse(String(r.createdAt ?? "")),
      dir: transactionDirection(r),
    }))
    .filter((e) => e.id && e.amount !== null && Number.isFinite(e.t));
  if (entries.length === 0 || entries.length !== live.length) return none;

  entries.sort((a, b) => b.t - a.t);

  const computed = new Map<string, ReconciledBalance>();
  let running = currentBalance;
  for (const e of entries) {
    const signed = e.dir === "credit" ? (e.amount as number) : -(e.amount as number);
    const after = running;
    const before = after - signed;
    if (before < -0.005) return none; // impossible history: data is incomplete
    computed.set(e.id, { before: r2(before), after: r2(after) });
    running = before;
  }

  // The newest transaction must agree with the live balance, otherwise the
  // list and the balance were fetched at different moments: don't override.
  const newest = entries[0];
  const reportedNewestAfter = num(newest.r.balanceAfter);
  if (
    reportedNewestAfter === null ||
    Math.abs(reportedNewestAfter - currentBalance) > 0.01
  ) {
    return none;
  }

  const corrections = new Map<string, ReconciledBalance>();
  for (const e of entries) {
    const c = computed.get(e.id)!;
    const rb = num(e.r.balanceBefore);
    const ra = num(e.r.balanceAfter);
    if (
      rb === null ||
      ra === null ||
      Math.abs(rb - c.before) > 0.01 ||
      Math.abs(ra - c.after) > 0.01
    ) {
      corrections.set(e.id, c);
    }
  }
  return corrections;
}
