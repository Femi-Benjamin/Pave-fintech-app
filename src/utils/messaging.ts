import type { ChatMessageItem } from "../api/messaging";

/**
 * UI-side permission rules for Messages. The backend does NOT check who is
 * calling delete endpoints, so these guards are the only protection a normal
 * user gets. They are UX guards, not security: the backend must enforce too.
 */
export function canDeleteGroupChat(
  adminId: string | undefined | null,
  currentUserId: string,
): boolean {
  return Boolean(adminId) && Boolean(currentUserId) && adminId === currentUserId;
}

export function canDeleteMessage(
  message: { senderId?: string | null },
  currentUserId: string,
): boolean {
  return Boolean(currentUserId) && message.senderId === currentUserId;
}

export const DELETE_DIRECT_CHAT_WARNING =
  "This will delete the conversation for you AND the other person. This cannot be undone.";
export const DELETE_GROUP_CHAT_WARNING =
  "This will delete the group and all messages for ALL members. This cannot be undone.";

/** Merge message lists by id (later lists win), drop deleted, sort oldest to newest. */
export function mergeMessages(...lists: ChatMessageItem[][]): ChatMessageItem[] {
  const byId = new Map<string, ChatMessageItem>();
  for (const list of lists) {
    for (const m of list) {
      if (m && m.id) byId.set(m.id, m);
    }
  }
  return Array.from(byId.values())
    .filter((m) => !m.isDeleted)
    .sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      return ta - tb;
    });
}
