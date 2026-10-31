import axios from "axios";
import { api } from "../lib/api-client";
import { getToken } from "../lib/authStorage";
import { extractUserIdFromToken } from "./auth";

// ─── Interfaces & Types ───────────────────────────────────────────────────────

export interface ChatUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string | null;
  phoneNumber?: string;
}

export interface GroupChatMember {
  id: string;
  groupChatId: string;
  userId: string;
  role: "admin" | "member" | string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  user?: ChatUser;
}

export interface GroupChat {
  id: string;
  groupName: string;
  description?: string;
  adminId: string;
  groupImage?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  admin?: ChatUser;
  members?: GroupChatMember[];
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface MessageReplyTo {
  id: string;
  message: string;
  messageType?: string;
  senderId?: string;
  createdAt?: string;
}

export interface ChatMessageItem {
  id: string;
  chatId?: string;
  groupChatId?: string;
  senderId: string;
  message: string;
  messageType: "text" | "image" | "audio" | "video" | string;
  attachmentUrl?: string | null;
  replyToMessageId?: string | null;
  isDeleted?: boolean;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  sender?: ChatUser;
  replyTo?: MessageReplyTo | null;
}

export interface OneOnOneChat {
  id: string;
  senderId: string;
  replyerId: string;
  lastMessageId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  sender?: ChatUser;
  replier?: ChatUser;
  lastMessage?: string;
}

export interface RecipientUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: PaginationInfo;
  notFoundEmails?: string[];
}

// ─── Payloads ────────────────────────────────────────────────────────────────

export interface CreateGroupChatPayload {
  groupName: string;
  description?: string;
  emails: string[];
}

export interface UpdateGroupChatPayload {
  groupName?: string;
  description?: string;
  emails?: string[];
}

export interface SendGroupMessagePayload {
  message: string;
  messageType?: "text" | "image" | "audio" | "video";
  attachmentUrl?: string;
  replyToMessageId?: string;
}

export interface OneOnOneChatPayload {
  userId: string;
  message?: string;
  messageType?: "text" | "image" | "audio" | "video";
  attachmentUrl?: string;
  replyToMessageId?: string;
}

// ─── Response Normalizers ────────────────────────────────────────────────────

export function normalizeList<T>(resData: unknown): T[] {
  if (!resData) return [];
  if (Array.isArray(resData)) return resData as T[];
  if (typeof resData === "object" && resData !== null) {
    const obj = resData as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.rows)) return obj.rows as T[];
    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.rows)) return inner.rows as T[];
      if (Array.isArray(inner.data)) return inner.data as T[];
    }
  }
  return [];
}

export function getCurrentUserId(
  explicitUser?: { id?: string } | null,
): string {
  if (explicitUser?.id && String(explicitUser.id).trim()) {
    return String(explicitUser.id).trim();
  }
  const token = getToken();
  if (token) {
    const extracted = extractUserIdFromToken(token);
    if (extracted) return extracted;
  }
  return "";
}

// ─── GROUP MESSAGING API FUNCTIONS ───────────────────────────────────────────

/**
 * 1. Create Group Chat
 * POST /api/v1/message/createGroupChat
 */
export async function createGroupChat(
  payload: CreateGroupChatPayload,
): Promise<ApiResponse<GroupChat>> {
  if (!payload.groupName || !payload.groupName.trim()) {
    throw new Error("Group name is required");
  }
  const cleanPayload = {
    groupName: payload.groupName.trim(),
    description: payload.description?.trim() || "",
    emails: Array.isArray(payload.emails)
      ? payload.emails.map((e) => e.trim().toLowerCase()).filter(Boolean)
      : [],
  };

  const response = await api.post<ApiResponse<GroupChat>>(
    "/api/v1/message/createGroupChat",
    cleanPayload,
  );
  return response.data;
}

/**
 * 2. Get Group Chat by ID
 * GET /api/v1/message/getGroupChat/:chatId
 */
export async function getGroupChat(
  chatId: string,
): Promise<ApiResponse<GroupChat>> {
  if (!chatId || !chatId.trim()) {
    throw new Error("Chat ID is required");
  }
  const cleanId = encodeURIComponent(chatId.trim());
  const response = await api.get<ApiResponse<GroupChat>>(
    `/api/v1/message/getGroupChat/${cleanId}`,
  );
  return response.data;
}

/**
 * 3. Get All Group Chats for authenticated user
 * GET /api/v1/message/getGroupChats
 */
export async function getGroupChats(): Promise<GroupChat[]> {
  const response = await api.get<ApiResponse<GroupChat[]> | GroupChat[]>(
    "/api/v1/message/getGroupChats",
  );
  return normalizeList<GroupChat>(response.data);
}

/**
 * 4. Update Group Chat
 * PUT /api/v1/message/updateGroupChat/:groupId
 *
 * Use the documented PUT operation only. GET is read-only and must never be
 * used as a fallback for a failed update.
 */
export async function updateGroupChat(
  groupId: string,
  payload: UpdateGroupChatPayload,
): Promise<ApiResponse<GroupChat>> {
  if (!groupId || !groupId.trim()) {
    throw new Error("Group ID is required");
  }
  const cleanId = encodeURIComponent(groupId.trim());
  const cleanPayload: Record<string, unknown> = {};

  if (payload.groupName !== undefined)
    cleanPayload.groupName = payload.groupName.trim();
  if (payload.description !== undefined)
    cleanPayload.description = payload.description.trim();
  if (payload.emails !== undefined) {
    cleanPayload.emails = payload.emails
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }

  if (!Array.isArray(cleanPayload.emails) || cleanPayload.emails.length === 0) {
    throw new Error(
      "At least one existing group member email is required to update this group.",
    );
  }

  const response = await api.put<ApiResponse<GroupChat>>(
    `/api/v1/message/updateGroupChat/${cleanId}`,
    cleanPayload,
  );
  return response.data;
}

/**
 * 5. Delete Group Chat
 * DELETE /api/v1/message/deleteGroupChat/:groupId
 */
export async function deleteGroupChat(
  groupId: string,
): Promise<{ success: boolean; message: string }> {
  if (!groupId || !groupId.trim()) {
    throw new Error("Group ID is required");
  }
  const cleanId = encodeURIComponent(groupId.trim());
  const response = await api.delete<{ success: boolean; message: string }>(
    `/api/v1/message/deleteGroupChat/${cleanId}`,
  );
  return response.data;
}

/**
 * 6. Send Group Chat Message
 * POST /api/v1/message/sendGroupChatMessage/:groupId
 */
export async function sendGroupChatMessage(
  groupId: string,
  payload: SendGroupMessagePayload,
): Promise<ApiResponse<ChatMessageItem>> {
  if (!groupId || !groupId.trim()) {
    throw new Error("Group ID is required");
  }
  if (!payload.message || !payload.message.trim()) {
    throw new Error("Message content cannot be empty");
  }
  const cleanId = encodeURIComponent(groupId.trim());
  const cleanPayload = {
    message: payload.message.trim(),
    messageType: payload.messageType || "text",
    attachmentUrl: payload.attachmentUrl || "",
    replyToMessageId: payload.replyToMessageId || "",
  };

  const response = await api.post<ApiResponse<ChatMessageItem>>(
    `/api/v1/message/sendGroupChatMessage/${cleanId}`,
    cleanPayload,
  );
  return response.data;
}

/**
 * 7. Get Group Chat Messages
 * GET /api/v1/message/getGroupChatMessages/:groupId
 */
export async function getGroupChatMessages(
  groupId: string,
  params?: { page?: number; limit?: number },
): Promise<{ messages: ChatMessageItem[]; pagination?: PaginationInfo }> {
  if (!groupId || !groupId.trim()) {
    throw new Error("Group ID is required");
  }
  const cleanId = encodeURIComponent(groupId.trim());
  const response = await api.get<ApiResponse<ChatMessageItem[]>>(
    `/api/v1/message/getGroupChatMessages/${cleanId}`,
    { params },
  );

  const raw = response.data;
  const messages = normalizeList<ChatMessageItem>(raw);
  const pagination =
    (raw && typeof raw === "object" && (raw as any).pagination) || undefined;
  return { messages, pagination };
}

// ─── ONE-ON-ONE MESSAGING API FUNCTIONS ──────────────────────────────────────

/**
 * 8. Create One-on-One Chat / Send One-on-One Message
 * POST /api/v1/message/oneOnOneChat
 * Also serves as the sending mechanism for 1-on-1 messages with userId and optional message body.
 */
export async function createOneOnOneChat(
  payload: OneOnOneChatPayload,
): Promise<ApiResponse<{ chat: OneOnOneChat; message?: ChatMessageItem }>> {
  if (!payload.userId || !payload.userId.trim()) {
    throw new Error("Target user ID is required");
  }
  const cleanPayload: Record<string, unknown> = {
    userId: payload.userId.trim(),
  };
  if (payload.message !== undefined && payload.message.trim()) {
    cleanPayload.message = payload.message.trim();
    cleanPayload.messageType = payload.messageType || "text";
    cleanPayload.attachmentUrl = payload.attachmentUrl || "";
    cleanPayload.replyToMessageId = payload.replyToMessageId || "";
  }

  const response = await api.post<
    ApiResponse<{ chat: OneOnOneChat; message?: ChatMessageItem }>
  >("/api/v1/message/oneOnOneChat", cleanPayload);
  return response.data;
}

/**
 * 9. Get All Recipients eligible for One-on-One Chat
 * GET /api/v1/message/getAllUserChat
 */
export async function getAllUserChat(): Promise<RecipientUser[]> {
  const response = await api.get<
    ApiResponse<{ count: number; rows: RecipientUser[] }>
  >("/api/v1/message/getAllUserChat");

  const raw = response.data;
  if (raw && typeof raw === "object") {
    if (Array.isArray((raw as any).data?.rows)) {
      return (raw as any).data.rows;
    }
    if (Array.isArray((raw as any).rows)) {
      return (raw as any).rows;
    }
  }
  return normalizeList<RecipientUser>(raw);
}

/**
 * 10. Get One-on-One Chats for authenticated user
 * GET /api/v1/message/getOneOnOneChats
 */
export async function getOneOnOneChats(): Promise<OneOnOneChat[]> {
  try {
    const response = await api.get<
      ApiResponse<OneOnOneChat[]> | OneOnOneChat[]
    >("/api/v1/message/getOneOnOneChats");
    return normalizeList<OneOnOneChat>(response.data);
  } catch (error) {
    // The backend currently returns 404 when the account has no direct chats.
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const message = axios.isAxiosError(error)
      ? String(
          (error.response?.data as { message?: string } | undefined)?.message ||
            "",
        )
      : "";
    if (status === 404 && /no one[- ]on[- ]one chats found/i.test(message)) {
      return [];
    }
    throw error;
  }
}

/**
 * 11. Delete One-on-One Message
 * DELETE /api/v1/message/deleteOneOnOneMessage/:messageId
 */
export async function deleteOneOnOneMessage(
  messageId: string,
): Promise<{ success: boolean; message: string }> {
  if (!messageId || !messageId.trim()) {
    throw new Error("Message ID is required");
  }
  const cleanId = encodeURIComponent(messageId.trim());
  const response = await api.delete<{ success: boolean; message: string }>(
    `/api/v1/message/deleteOneOnOneMessage/${cleanId}`,
  );
  return response.data;
}

/**
 * 12. Delete One-on-One Chat
 * DELETE /api/v1/message/deleteOneOnOneChat/:chatId
 */
export async function deleteOneOnOneChat(
  chatId: string,
): Promise<{ success: boolean; message: string }> {
  if (!chatId || !chatId.trim()) {
    throw new Error("Chat ID is required");
  }
  const cleanId = encodeURIComponent(chatId.trim());
  const response = await api.delete<{ success: boolean; message: string }>(
    `/api/v1/message/deleteOneOnOneChat/${cleanId}`,
  );
  return response.data;
}

/**
 * 13. Get One-on-One Messages
 * GET /api/v1/message/getOneOnOneMessages/:chatId
 */
export async function getOneOnOneMessages(
  chatId: string,
  params?: { page?: number; limit?: number },
): Promise<{ messages: ChatMessageItem[]; pagination?: PaginationInfo }> {
  if (!chatId || !chatId.trim()) {
    throw new Error("Chat ID is required");
  }
  const cleanId = encodeURIComponent(chatId.trim());
  const response = await api.get<ApiResponse<ChatMessageItem[]>>(
    `/api/v1/message/getOneOnOneMessages/${cleanId}`,
    { params },
  );

  const raw = response.data;
  const messages = normalizeList<ChatMessageItem>(raw);
  const pagination =
    (raw && typeof raw === "object" && (raw as any).pagination) || undefined;
  return { messages, pagination };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats a user's display name from participant data
 */
export function formatParticipantName(user?: ChatUser | null): string {
  if (!user) return "User";
  const first = user.firstName?.trim() || "";
  const last = user.lastName?.trim() || "";
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (user.email) return user.email.split("@")[0];
  return "User";
}

/**
 * Returns the other participant in a 1-on-1 conversation
 */
export function getOtherParticipant(
  chat: OneOnOneChat,
  currentUserId: string,
): ChatUser | undefined {
  if (chat.senderId === currentUserId) {
    return chat.replier || chat.sender;
  }
  return chat.sender || chat.replier;
}
