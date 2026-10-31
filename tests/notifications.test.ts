import assert from "node:assert/strict";
import test from "node:test";
import { api } from "../src/lib/api-client";
import {
  normalizeNotifications,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
  notificationTitle,
  notificationIcon,
} from "../src/api/notifications";

test("normalizeNotifications: { data: { notifications } } with _id and counts", () => {
  const r = normalizeNotifications({
    status: true,
    data: {
      notifications: [{ _id: "n1", type: "VENDING_SUCCESS", message: "ok", isRead: false, createdAt: "2026-01-01" }],
      unReadcount: 1,
      readcount: 0,
    },
  });
  assert.equal(r.items.length, 1);
  assert.equal(r.items[0].id, "n1");
  assert.equal(r.unreadCount, 1);
});

test("normalizeNotifications: { data: [...] } with id, counts unread itself", () => {
  const r = normalizeNotifications({
    success: true,
    data: [
      { id: "a", type: "KYC", message: "m", isRead: true, createdAt: "x" },
      { id: "b", type: "KYC", message: "m", isRead: false, createdAt: "x" },
    ],
  });
  assert.equal(r.items.length, 2);
  assert.equal(r.unreadCount, 1);
});

test("normalizeNotifications: empty, null and junk are safe", () => {
  assert.deepEqual(normalizeNotifications(null), { items: [], unreadCount: 0 });
  assert.deepEqual(normalizeNotifications({ data: { notifications: [null, {}, 5] } }), { items: [], unreadCount: 0 });
});

test("Notification endpoints use the documented methods and URLs", async () => {
  const original = api.defaults.adapter;
  const calls: string[] = [];
  (api.defaults as any).adapter = async (config: any) => {
    calls.push(`${String(config.method).toUpperCase()} ${config.url}`);
    return { data: { status: true, data: { notifications: [] } }, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    await getUserNotifications();
    await markNotificationRead("abc");
    await markAllNotificationsRead();
    await deleteNotification("abc");
    await deleteAllNotifications();
  } finally {
    (api.defaults as any).adapter = original;
  }
  assert.deepEqual(calls, [
    "GET /api/v1/notifications/getUserNotifications",
    "PATCH /api/v1/notifications/mark-as-read/abc",
    "PATCH /api/v1/notifications/mark-all-as-read",
    "DELETE /api/v1/notifications/delete/abc",
    "DELETE /api/v1/notifications/delete-all",
  ]);
});

test("Notification display helpers have safe defaults", () => {
  assert.equal(notificationTitle("VENDING_SUCCESS"), "Vending Success");
  assert.equal(notificationTitle(""), "Notification");
  assert.equal(notificationIcon("SOMETHING_NEW"), "🔔");
});
