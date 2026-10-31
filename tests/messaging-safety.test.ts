import assert from "node:assert/strict";
import test from "node:test";
import { api } from "../src/lib/api-client";
import { updateGroupChat } from "../src/api/messaging";
import type { ChatMessageItem } from "../src/api/messaging";
import {
  canDeleteGroupChat,
  canDeleteMessage,
  mergeMessages,
  DELETE_DIRECT_CHAT_WARNING,
  DELETE_GROUP_CHAT_WARNING,
} from "../src/utils/messaging";

async function captureCalls(run: () => Promise<unknown>) {
  const original = api.defaults.adapter;
  const calls: { method: string; url: string }[] = [];
  (api.defaults as any).adapter = async (config: any) => {
    calls.push({
      method: String(config.method).toLowerCase(),
      url: String(config.url),
    });
    return {
      data: { success: true, data: {} },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  try {
    await run();
  } finally {
    (api.defaults as any).adapter = original;
  }
  return calls;
}

test("Group delete is admin-only in the UI", () => {
  assert.equal(canDeleteGroupChat("admin-1", "admin-1"), true);
  assert.equal(canDeleteGroupChat("admin-1", "member-2"), false);
  assert.equal(canDeleteGroupChat(undefined, "member-2"), false);
  assert.equal(canDeleteGroupChat("admin-1", ""), false);
});

test("Only the sender can delete a message", () => {
  assert.equal(canDeleteMessage({ senderId: "u1" }, "u1"), true);
  assert.equal(canDeleteMessage({ senderId: "u2" }, "u1"), false);
  assert.equal(canDeleteMessage({ senderId: "u1" }, ""), false);
});

test("Delete warnings tell users who is affected", () => {
  assert.match(DELETE_DIRECT_CHAT_WARNING, /other person/);
  assert.match(DELETE_GROUP_CHAT_WARNING, /ALL members/);
});

test("updateGroupChat uses PUT only (never GET)", async () => {
  const calls = await captureCalls(() =>
    updateGroupChat("g1", { groupName: "New", emails: ["a@b.com"] }),
  );
  assert.deepEqual(
    calls.map((c) => c.method),
    ["put"],
  );
  assert.ok(calls[0].url.endsWith("/api/v1/message/updateGroupChat/g1"));
});

test("updateGroupChat does not fall back to GET when PUT fails with 404", async () => {
  const original = api.defaults.adapter;
  const methods: string[] = [];
  (api.defaults as any).adapter = async (config: any) => {
    methods.push(String(config.method).toLowerCase());
    const err: any = new Error("Not found");
    err.config = config;
    err.response = { status: 404, data: {}, config };
    err.isAxiosError = true;
    throw err;
  };
  try {
    await assert.rejects(() =>
      updateGroupChat("g1", { groupName: "x", emails: ["a@b.com"] }),
    );
  } finally {
    (api.defaults as any).adapter = original;
  }
  assert.deepEqual(methods, ["put"]);
});

test("mergeMessages merges pages without duplicates, sorted oldest first, drops deleted", () => {
  const m = (
    id: string,
    t: string,
    extra: Partial<ChatMessageItem> = {},
  ): ChatMessageItem => ({
    id,
    senderId: "u1",
    message: id,
    messageType: "text",
    createdAt: t,
    ...extra,
  });
  const page1 = [
    m("c", "2026-01-03T00:00:00Z"),
    m("b", "2026-01-02T00:00:00Z"),
  ];
  const page2 = [
    m("b", "2026-01-02T00:00:00Z"),
    m("a", "2026-01-01T00:00:00Z"),
    m("x", "2026-01-01T12:00:00Z", { isDeleted: true }),
  ];
  const merged = mergeMessages(page2, page1);
  assert.deepEqual(
    merged.map((x) => x.id),
    ["a", "b", "c"],
  );
});

test("createOneOnOneChat sends userId in the JSON body, never in the URL or query params", async () => {
  const original = api.defaults.adapter;
  let sent: any = null;
  (api.defaults as any).adapter = async (config: any) => {
    sent = { method: String(config.method).toLowerCase(), url: String(config.url), params: config.params, data: config.data };
    return { data: { success: true, data: { chat: { id: "c1" } } }, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const { createOneOnOneChat } = await import("../src/api/messaging");
    await createOneOnOneChat({ userId: "user-123", message: "hi" });
  } finally {
    (api.defaults as any).adapter = original;
  }
  assert.equal(sent.method, "post");
  assert.equal(sent.url, "/api/v1/message/createOneOnOneChat");
  assert.equal(sent.params, undefined);
  assert.equal(JSON.parse(sent.data).userId, "user-123");
  assert.equal(JSON.parse(sent.data).message, "hi");
});
