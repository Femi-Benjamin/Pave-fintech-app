export type TxStatus = "success" | "pending" | "failed";

const SUCCESS = ["success", "completed", "complete", "delivered", "paid", "approved", "settled"];
const FAILED = ["fail", "declin", "reject", "error", "cancel", "revers", "refund", "expired", "abandon"];
const PENDING = ["pending", "process", "initiat", "queue", "progress", "await", "submitted"];

/**
 * Maps whatever the backend calls a transaction's status ("COMPLETED",
 * "successful", "delivered", ...) to the three states the UI shows.
 * Only an explicit failure word is shown as failed — an unfamiliar status is
 * never presented to the user as a failed payment.
 */
export function normalizeTransactionStatus(raw?: string | null): TxStatus {
  const s = (raw ?? "").toLowerCase().trim();
  if (!s) return "pending";
  if (FAILED.some((w) => s.includes(w))) return "failed";
  if (SUCCESS.some((w) => s.includes(w))) return "success";
  if (PENDING.some((w) => s.includes(w))) return "pending";
  return "pending";
}
