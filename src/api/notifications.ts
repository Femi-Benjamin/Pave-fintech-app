import axios from "axios";
import { api } from "../lib/api-client";

export interface AppNotification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  /** Preserve backend-specific fields so the detail view can display them. */
  [key: string]: unknown;
}

export interface NotificationDetailField {
  label: string;
  value: string;
}

const HIDDEN_DETAIL_KEYS = new Set([
  "id", "_id", "isRead", "read", "createdAt", "updatedAt", "__v",
  "type", "message",
]);

function humanizeDetailKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDetailValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => formatDetailValue(item)).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !HIDDEN_DETAIL_KEYS.has(key))
      .map(([key, nested]) => {
        const formatted = formatDetailValue(nested);
        return formatted ? `${humanizeDetailKey(key)}: ${formatted}` : "";
      })
      .filter(Boolean)
      .join(" · ");
  }
  return String(value);
}

/** Return additional backend-provided data for the notification detail view. */
export function getNotificationDetailFields(
  notification: AppNotification,
): NotificationDetailField[] {
  const fields: NotificationDetailField[] = [];
  for (const [key, value] of Object.entries(notification)) {
    if (HIDDEN_DETAIL_KEYS.has(key)) continue;
    const formatted = formatDetailValue(value);
    if (!formatted) continue;
    fields.push({ label: humanizeDetailKey(key), value: formatted });
  }
  return fields;
}

export interface NotificationsResult {
  items: AppNotification[];
  unreadCount: number;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

/**
 * The Postman sample for notifications may come from an older backend
 * (Mongo `_id`, `status: true`), so accept every shape seen so far.
 */
export function normalizeNotifications(raw: unknown): NotificationsResult {
  const root = asRecord(raw);
  const data = root ? root.data : raw;
  const dataObj = asRecord(data);

  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (dataObj && Array.isArray(dataObj.notifications)) list = dataObj.notifications;
  else if (dataObj && Array.isArray(dataObj.rows)) list = dataObj.rows;
  else if (root && Array.isArray(root.notifications)) list = root.notifications;
  else if (Array.isArray(raw)) list = raw;

  const items: AppNotification[] = [];
  for (const entry of list) {
    const n = asRecord(entry);
    if (!n) continue;
    const id = String(n.id ?? n._id ?? "").trim();
    if (!id) continue;
    items.push({
      ...n,
      id,
      type: String(n.type ?? ""),
      message: String(n.message ?? ""),
      isRead: n.isRead === true,
      createdAt: String(n.createdAt ?? ""),
    } as AppNotification);
  }

  const reported = dataObj?.unReadcount ?? dataObj?.unreadCount;
  const unreadCount =
    typeof reported === "number"
      ? reported
      : items.filter((n) => !n.isRead).length;

  return { items, unreadCount };
}

export async function getUserNotifications(): Promise<NotificationsResult> {
  try {
    const res = await api.get("/api/v1/notifications/getUserNotifications");
    return normalizeNotifications(res.data);
  } catch (error) {
    // The backend answers 404 ("no notifications found") when the list is
    // empty, e.g. right after "Clear all". That is an empty inbox, not a failure.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { items: [], unreadCount: 0 };
    }
    throw error;
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!id || !id.trim()) throw new Error("Notification ID is required");
  await api.patch(`/api/v1/notifications/mark-as-read/${encodeURIComponent(id.trim())}`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/api/v1/notifications/mark-all-as-read");
}

export async function deleteNotification(id: string): Promise<void> {
  if (!id || !id.trim()) throw new Error("Notification ID is required");
  await api.delete(`/api/v1/notifications/delete/${encodeURIComponent(id.trim())}`);
}

export async function deleteAllNotifications(): Promise<void> {
  await api.delete("/api/v1/notifications/delete-all");
}

const ACRONYMS = new Set(["kyc", "nin", "otp", "bvn", "id", "sms"]);

export function notificationTitle(type: string): string {
  const t = (type || "").trim();
  if (!t) return "Notification";
  return t
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) =>
      ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

export function notificationIcon(type: string): string {
  const t = (type || "").toUpperCase();
  if (/VEND|BILL|AIRTIME|DATA|ELECTRIC/.test(t)) return "🧾";
  if (/TRANSFER|WALLET|CREDIT|DEBIT|FUND|WITHDRAW/.test(t)) return "🏦";
  if (/SAV|CONTRIB|GOAL|AJO/.test(t)) return "💰";
  if (/KYC|VERIF/.test(t)) return "✅";
  if (/MESSAGE|CHAT/.test(t)) return "💬";
  if (/ORDER|PRODUCT|PURCHASE|MARKET/.test(t)) return "📦";
  return "🔔";
}
