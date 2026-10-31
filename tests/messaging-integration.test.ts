import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createGroupChat,
  getGroupChat,
  getGroupChats,
  updateGroupChat,
  deleteGroupChat,
  sendGroupChatMessage,
  getGroupChatMessages,
  createOneOnOneChat,
  getAllUserChat,
  getOneOnOneChats,
  deleteOneOnOneMessage,
  deleteOneOnOneChat,
  getOneOnOneMessages,
  normalizeList,
  formatParticipantName,
  getOtherParticipant,
  getCurrentUserId,
  OneOnOneChat,
} from "../src/api/messaging";
import { messagingQueryKeys } from "../src/hooks/useMessagingApi";

describe("Messaging Integration API & Logic Suite", () => {
  it("All 13 messaging API functions are exported and callable", () => {
    assert.equal(typeof createGroupChat, "function");
    assert.equal(typeof getGroupChat, "function");
    assert.equal(typeof getGroupChats, "function");
    assert.equal(typeof updateGroupChat, "function");
    assert.equal(typeof deleteGroupChat, "function");
    assert.equal(typeof sendGroupChatMessage, "function");
    assert.equal(typeof getGroupChatMessages, "function");
    assert.equal(typeof createOneOnOneChat, "function");
    assert.equal(typeof getAllUserChat, "function");
    assert.equal(typeof getOneOnOneChats, "function");
    assert.equal(typeof deleteOneOnOneMessage, "function");
    assert.equal(typeof deleteOneOnOneChat, "function");
    assert.equal(typeof getOneOnOneMessages, "function");
  });

  it("createGroupChat: rejects empty groupName", async () => {
    await assert.rejects(
      async () => {
        await createGroupChat({ groupName: "  ", emails: [] });
      },
      { message: "Group name is required" },
    );
  });

  it("getGroupChat: rejects empty chatId", async () => {
    await assert.rejects(
      async () => {
        await getGroupChat("");
      },
      { message: "Chat ID is required" },
    );
  });

  it("updateGroupChat: rejects empty groupId", async () => {
    await assert.rejects(
      async () => {
        await updateGroupChat("", { groupName: "New Name" });
      },
      { message: "Group ID is required" },
    );
  });

  it("deleteGroupChat: rejects empty groupId", async () => {
    await assert.rejects(
      async () => {
        await deleteGroupChat("");
      },
      { message: "Group ID is required" },
    );
  });

  it("sendGroupChatMessage: rejects empty groupId or empty message", async () => {
    await assert.rejects(
      async () => {
        await sendGroupChatMessage("", { message: "Hello" });
      },
      { message: "Group ID is required" },
    );

    await assert.rejects(
      async () => {
        await sendGroupChatMessage("group-123", { message: "   " });
      },
      { message: "Message content cannot be empty" },
    );
  });

  it("getGroupChatMessages: rejects empty groupId", async () => {
    await assert.rejects(
      async () => {
        await getGroupChatMessages("");
      },
      { message: "Group ID is required" },
    );
  });

  it("createOneOnOneChat: rejects empty userId", async () => {
    await assert.rejects(
      async () => {
        await createOneOnOneChat({ userId: "" });
      },
      { message: "Target user ID is required" },
    );
  });

  it("deleteOneOnOneMessage: rejects empty messageId", async () => {
    await assert.rejects(
      async () => {
        await deleteOneOnOneMessage("");
      },
      { message: "Message ID is required" },
    );
  });

  it("deleteOneOnOneChat: rejects empty chatId", async () => {
    await assert.rejects(
      async () => {
        await deleteOneOnOneChat("");
      },
      { message: "Chat ID is required" },
    );
  });

  it("getOneOnOneMessages: rejects empty chatId", async () => {
    await assert.rejects(
      async () => {
        await getOneOnOneMessages("");
      },
      { message: "Chat ID is required" },
    );
  });

  it("normalizeList: properly unpacks direct arrays, { data: [...] }, and { rows: [...] }", () => {
    assert.deepEqual(normalizeList([1, 2, 3]), [1, 2, 3]);
    assert.deepEqual(normalizeList({ data: [4, 5] }), [4, 5]);
    assert.deepEqual(normalizeList({ rows: [6, 7] }), [6, 7]);
    assert.deepEqual(normalizeList({ data: { rows: [8, 9] } }), [8, 9]);
    assert.deepEqual(normalizeList(null), []);
    assert.deepEqual(normalizeList(undefined), []);
  });

  it("formatParticipantName: formats first and last name, or falls back to email prefix", () => {
    assert.equal(
      formatParticipantName({ id: "1", firstName: "Emeka", lastName: "Okafor" }),
      "Emeka Okafor",
    );
    assert.equal(
      formatParticipantName({ id: "2", firstName: "Fatima" }),
      "Fatima",
    );
    assert.equal(
      formatParticipantName({ id: "3", email: "babajide@example.com" }),
      "babajide",
    );
    assert.equal(formatParticipantName(null), "User");
  });

  it("getOtherParticipant: correctly identifies conversational counterpart in 1-on-1 chat", () => {
    const chat: OneOnOneChat = {
      id: "chat-1",
      senderId: "user-alice",
      replyerId: "user-bob",
      createdAt: "2026-08-14T21:10:02Z",
      updatedAt: "2026-08-14T21:10:02Z",
      sender: { id: "user-alice", firstName: "Alice" },
      replier: { id: "user-bob", firstName: "Bob" },
    };

    // When Alice views the chat, the other participant is Bob
    const aliceView = getOtherParticipant(chat, "user-alice");
    assert.equal(aliceView?.firstName, "Bob");

    // When Bob views the chat, the other participant is Alice
    const bobView = getOtherParticipant(chat, "user-bob");
    assert.equal(bobView?.firstName, "Alice");
  });

  it("getCurrentUserId: extracts id from user object first", () => {
    assert.equal(getCurrentUserId({ id: "user-123" }), "user-123");
    assert.equal(getCurrentUserId(null), "");
  });

  it("messagingQueryKeys: generates stable keys for React Query invalidations", () => {
    assert.deepEqual(messagingQueryKeys.groupChats(), ["messaging", "groupChats"]);
    assert.deepEqual(messagingQueryKeys.groupChat("g1"), [
      "messaging",
      "groupChat",
      "g1",
    ]);
    assert.deepEqual(messagingQueryKeys.groupMessages("g1"), [
      "messaging",
      "groupMessages",
      "g1",
    ]);
    assert.deepEqual(messagingQueryKeys.oneOnOneChats(), [
      "messaging",
      "oneOnOneChats",
    ]);
    assert.deepEqual(messagingQueryKeys.oneOnOneMessages("c1"), [
      "messaging",
      "oneOnOneMessages",
      "c1",
    ]);
    assert.deepEqual(messagingQueryKeys.recipients(), ["messaging", "recipients"]);
  });
});
