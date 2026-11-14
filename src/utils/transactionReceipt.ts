import { normalizeTransactionStatus, type TxStatus } from "./transactionStatus";

export interface ReceiptRow {
  label: string;
  value: string;
}

export interface TransactionReceiptData {
  title: string;
  status: TxStatus;
  direction: "credit" | "debit";
  amount: number;
  rows: ReceiptRow[];
  reference?: string;
  createdAt?: string;
}

export const PENDING_STALE_MINUTES = 10;

export interface PendingNotice {
  title: string;
  body: string;
  /** true once it has been pending long enough that the user should contact support */
  stale: boolean;
}

/** Explains a pending transaction, and escalates to "contact support" after 10 minutes. */
export function pendingNotice(
  createdAt: string | undefined,
  now: number = Date.now(),
): PendingNotice {
  const started = createdAt ? Date.parse(createdAt) : NaN;
  const minutes = Number.isFinite(started) ? (now - started) / 60000 : 0;
  if (minutes >= PENDING_STALE_MINUTES) {
    return {
      title: "Still pending",
      body: "This is taking longer than usual. Please do not repeat it. If it stays pending, contact support and share the reference below.",
      stale: true,
    };
  }
  return {
    title: "Being processed",
    body: "Transfers and payments can take a few minutes to confirm. This page updates automatically once it is done.",
    stale: false,
  };
}

const naira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function tryParseObject(v: unknown): Record<string, unknown> | null {
  if (v && typeof v === "object") return v as Record<string, unknown>;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

/** credit (money in) or debit (money out), same rule everywhere in the app. */
export function transactionDirection(
  record: Record<string, unknown>,
): "credit" | "debit" {
  const kind = `${record.transactionType ?? ""} ${record.type ?? ""}`.toLowerCase();
  return kind.includes("credit") ||
    kind.includes("fund") ||
    kind.includes("deposit")
    ? "credit"
    : "debit";
}

/** Bank narrations like "6423078517/9817600139/PACEPLOYTLTD/AD" are not readable titles. */
export function isBankNarration(text?: string): boolean {
  const t = (text ?? "").trim();
  return (/^\d{6,}\//.test(t) || (t.includes("/") && !/\s/.test(t) && t.length > 20));
}

export function friendlyTransactionTitle(
  description: string | undefined,
  direction: "credit" | "debit",
): string {
  if (isBankNarration(description)) {
    return direction === "credit" ? "Bank transfer received" : "Bank transfer sent";
  }
  return receiptTitle(description);
}

export function sentenceCase(text: string): string {
  const t = text.trim().toLowerCase();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

/** Fix the backend's "Airtie" typo and tidy the description for display. */
export function receiptTitle(description?: string): string {
  const t = (description ?? "")
    .replace(/\bairtie\b/gi, "Airtime")
    .replace(/\bmtn\b/gi, "MTN")
    .replace(/\bairtel\b/gi, "Airtel")
    .replace(/\bglo\b/gi, "Glo")
    .trim();
  return t || "Transaction";
}

function formatDateTime(value?: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildTransactionReceipt(
  record: Record<string, unknown>,
  balanceOverride?: { before: number; after: number } | null,
): TransactionReceiptData {
  const direction = transactionDirection(record);

  const rows: ReceiptRow[] = [];
  const add = (label: string, value: string | null | undefined) => {
    if (value) rows.push({ label, value });
  };

  if (typeof record.transactionType === "string") {
    add("Type", record.transactionType);
  }
  if (isBankNarration(record.description as string | undefined)) {
    add("Narration", String(record.description));
  }
  if (record.destination) add("Recipient", String(record.destination));
  add("Date & time", formatDateTime(record.createdAt));
  if (record.paymentMethod) add("Payment method", String(record.paymentMethod));

  const fee = toNumber(record.transactionFees);
  if (fee && fee > 0) add("Fee", naira(fee));
  const vat = toNumber(record.vat);
  if (vat && vat > 0) add("VAT", naira(vat));

  const before = balanceOverride ? balanceOverride.before : toNumber(record.balanceBefore);
  const after = balanceOverride ? balanceOverride.after : toNumber(record.balanceAfter);
  if (before !== null) add("Balance before", naira(before));
  if (after !== null) add("Balance after", naira(after));

  const meta = tryParseObject(record.metadata);
  const providerText = (meta as any)?.response_description;
  if (typeof providerText === "string" && providerText.trim()) {
    add("Provider response", sentenceCase(providerText));
  }
  const delivery = (meta as any)?.content?.transactions?.status;
  if (typeof delivery === "string" && delivery.trim()) {
    add("Delivery", sentenceCase(delivery));
  }

  return {
    title: friendlyTransactionTitle(record.description as string | undefined, direction),
    status: normalizeTransactionStatus(record.status as string | undefined),
    direction,
    amount: toNumber(record.amount) ?? 0,
    rows,
    reference: record.reference ? String(record.reference) : undefined,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : undefined,
  };
}
