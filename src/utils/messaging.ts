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
  return (
    Boolean(adminId) && Boolean(currentUserId) && adminId === currentUserId
  );
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
export function mergeMessages(
  ...lists: ChatMessageItem[][]
): ChatMessageItem[] {
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

// ─── Chat layout helpers (pure, so they can be tested) ───────────────────────

const RUN_GAP_MS = 5 * 60 * 1000;

export function dayKey(dateString?: string): string {
  const d = new Date(dateString || "");
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function formatDayLabel(dateString?: string, now: Date = new Date()): string {
  const d = new Date(dateString || "");
  if (isNaN(d.getTime())) return "";
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return d.toLocaleDateString([], { weekday: "long" });
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

export type ChatRow =
  | { kind: "day"; key: string; label: string }
  | {
      kind: "msg";
      key: string;
      message: ChatMessageItem;
      isFirstInRun: boolean;
      isLastInRun: boolean;
    };

/** Turn a sorted message list into day dividers + messages grouped into runs by sender. */
export function buildChatRows(
  messages: ChatMessageItem[],
  now: Date = new Date(),
): ChatRow[] {
  const rows: ChatRow[] = [];
  let prevDay = "";
  const sameRun = (a?: ChatMessageItem, b?: ChatMessageItem) => {
    if (!a || !b) return false;
    if (a.senderId !== b.senderId) return false;
    if (dayKey(a.createdAt) !== dayKey(b.createdAt)) return false;
    const gap = Math.abs(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return !isNaN(gap) && gap <= RUN_GAP_MS;
  };
  messages.forEach((m, i) => {
    const day = dayKey(m.createdAt);
    if (day && day !== prevDay) {
      rows.push({ kind: "day", key: `day-${day}`, label: formatDayLabel(m.createdAt, now) });
      prevDay = day;
    }
    rows.push({
      kind: "msg",
      key: m.id,
      message: m,
      isFirstInRun: !sameRun(messages[i - 1], m),
      isLastInRun: !sameRun(m, messages[i + 1]),
    });
  });
  return rows;
}

const AVATAR_COLORS = ["#3730A3", "#7C3AED", "#0F766E", "#B45309", "#BE185D", "#1D4ED8", "#047857"];

/** Stable brand-harmonious colour for a name, so people are easy to tell apart. */
export function avatarColorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
