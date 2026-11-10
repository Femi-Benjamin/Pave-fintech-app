import assert from "node:assert/strict";
import test from "node:test";
import { api } from "../src/lib/api-client";
import { createOneOnOneChat } from "../src/api/messaging";
import {
  attachmentKindFor,
  validateAttachment,
  formatFileSize,
  MAX_ATTACHMENT_BYTES,
} from "../src/utils/messaging";

test("attachmentKindFor maps mime types to message types", () => {
  assert.equal(attachmentKindFor({ type: "image/png" }), "image");
  assert.equal(attachmentKindFor({ type: "video/mp4" }), "video");
  assert.equal(attachmentKindFor({ type: "audio/mpeg" }), "audio");
  assert.equal(attachmentKindFor({ type: "application/pdf" }), "file");
  assert.equal(attachmentKindFor({}), "file");
});

test("validateAttachment enforces the 5MB limit and rejects empty files", () => {
  assert.equal(validateAttachment({ size: 1024 }), "");
  assert.equal(validateAttachment({ size: MAX_ATTACHMENT_BYTES }), "");
  assert.match(validateAttachment({ size: MAX_ATTACHMENT_BYTES + 1 }), /5MB/);
  assert.match(validateAttachment({ size: 0 }), /empty/);
  assert.equal(formatFileSize(2048), "2 KB");
  assert.equal(formatFileSize(1572864), "1.5 MB");
});

test("createOneOnOneChat sends the file as multipart form-data in attachmentUrl", async () => {
  const original = api.defaults.adapter;
  let seen: any;
  (api.defaults as any).adapter = async (config: any) => {
    seen = config;
    return { data: { data: { chat: { id: "c1" } } }, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const file = new File(["hello"], "pic.png", { type: "image/png" });
    await createOneOnOneChat({
      userId: " u-1 ",
      message: "look",
      messageType: "image",
      attachment: file,
    });
    assert.equal(seen.url, "/api/v1/message/createOneOnOneChat");
    assert.ok(seen.data instanceof FormData);
    assert.equal(seen.data.get("userId"), "u-1");
    assert.equal(seen.data.get("message"), "look");
    assert.equal(seen.data.get("messageType"), "image");
    const sent = seen.data.get("attachmentUrl");
    assert.ok(sent instanceof File);
    assert.equal(sent.name, "pic.png");
  } finally {
    (api.defaults as any).adapter = original;
  }
});

test("text-only one-on-one messages still go as JSON", async () => {
  const original = api.defaults.adapter;
  let seen: any;
  (api.defaults as any).adapter = async (config: any) => {
    seen = config;
    return { data: {}, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    await createOneOnOneChat({ userId: "u-1", message: "hi" });
    const body = typeof seen.data === "string" ? JSON.parse(seen.data) : seen.data;
    assert.equal(body.message, "hi");
    assert.equal(body.messageType, "text");
  } finally {
    (api.defaults as any).adapter = original;
  }
});
