import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  ArrowLeft,
  Paperclip,
  Send,
  Users,
  Trash2,
  Info,
  Edit2,
  X,
  Loader2,
  AlertCircle,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import { Avatar } from "../components/UI";
import {
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../hooks/useNotificationsApi";
import { notificationIcon, notificationTitle } from "../api/notifications";
import type { AppNotification } from "../api/notifications";
import {
  canDeleteGroupChat,
  canDeleteMessage,
  mergeMessages,
  buildChatRows,
  avatarColorFor,
  DELETE_DIRECT_CHAT_WARNING,
  DELETE_GROUP_CHAT_WARNING,
} from "../utils/messaging";
import { Screen } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import {
  useGroupChatsQuery,
  useGroupChatQuery,
  useGroupChatMessagesQuery,
  useOneOnOneChatsQuery,
  useOneOnOneMessagesQuery,
  useChatRecipientsQuery,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useDeleteGroupChatMutation,
  useSendGroupChatMessageMutation,
  useCreateOrSendOneOnOneMutation,
  useDeleteOneOnOneMessageMutation,
  useDeleteOneOnOneChatMutation,
} from "../hooks/useMessagingApi";
import {
  GroupChat,
  OneOnOneChat,
  ChatMessageItem,
  RecipientUser,
  getCurrentUserId,
  formatParticipantName,
  getOtherParticipant,
  getGroupChatMessages,
  getOneOnOneMessages,
} from "../api/messaging";

export interface ActiveChatState {
  type: "direct" | "group";
  id: string; // groupChatId or 1-on-1 chatId
  recipientId?: string; // target user for direct chat
  name: string;
  description?: string;
  adminId?: string;
  participantUser?: RecipientUser;
}

// ─── Format Time Helper ──────────────────────────────────────────────────────
function formatMessageTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

// ─── Shared visuals ──────────────────────────────────────────────────────────
function AvatarStack({
  people,
  total,
  size = 22,
}: {
  people: { name: string; image?: string | null }[];
  total: number;
  size?: number;
}) {
  const shown = people.slice(0, 3);
  const extra = Math.max(0, total - shown.length);
  if (shown.length === 0) return null;
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className="rounded-full ring-2 ring-white"
          style={{ marginLeft: i === 0 ? 0 : -Math.round(size * 0.32) }}
        >
          {p.image ? (
            <Avatar name={p.name} size={size} src={p.image} color={avatarColorFor(p.name)} />
          ) : (
            <div
              className="rounded-full text-white font-bold flex items-center justify-center"
              style={{
                width: size,
                height: size,
                background: avatarColorFor(p.name),
                fontSize: Math.max(9, Math.round(size * 0.46)),
              }}
              aria-hidden="true"
            >
              {(p.name.trim()[0] || "?").toUpperCase()}
            </div>
          )}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="rounded-full ring-2 ring-white bg-[#EEF2FF] text-[#3730A3] font-bold flex items-center justify-center"
          style={{
            width: size,
            height: size,
            marginLeft: -Math.round(size * 0.32),
            fontSize: Math.max(9, Math.round(size * 0.4)),
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

// Groups are rounded tiles, people are circles: the shape tells you which is which.
function ConversationAvatar({
  name,
  type,
  size = 52,
}: {
  name: string;
  type: "group" | "direct";
  size?: number;
}) {
  if (type === "direct") {
    return <Avatar name={name} size={size} color={avatarColorFor(name)} />;
  }
  return (
    <div
      className="shrink-0 flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.34),
        background: "linear-gradient(140deg, #7C3AED 0%, #3730A3 100%)",
        fontFamily: "var(--font-family-display)",
        fontSize: Math.round(size * 0.42),
      }}
      aria-hidden="true"
    >
      {(name.trim()[0] || "G").toUpperCase()}
    </div>
  );
}

function formatClock(dateString?: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Conversation List Item View Model ───────────────────────────────────────
interface UnifiedConversationItem {
  id: string;
  type: "direct" | "group";
  name: string;
  subtitle: string;
  time: string;
  timestamp: number;
  recipientId?: string;
  adminId?: string;
  memberCount?: number;
  members?: { name: string; image?: string | null }[];
  rawGroup?: GroupChat;
  rawDirect?: OneOnOneChat;
}

// ─── MessagesScreen ──────────────────────────────────────────────────────────
export function MessagesScreen({
  onNav,
  setActiveChat,
  activeChatId,
}: {
  onNav: (s: Screen) => void;
  setActiveChat: (c: ActiveChatState) => void;
  /** Id of the conversation open in the right-hand pane (desktop) */
  activeChatId?: string;
}) {
  const { authUser } = useLocalStore();
  const currentUserId = getCurrentUserId(authUser);

  const [activeTab, setActiveTab] = useState<"all" | "direct" | "groups">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] =
    useState<UnifiedConversationItem | null>(null);
  const [listError, setListError] = useState("");

  // Queries
  const {
    data: groupChats = [],
    isLoading: isGroupsLoading,
    error: groupError,
    refetch: refetchGroups,
  } = useGroupChatsQuery();

  const {
    data: oneOnOneChats = [],
    isLoading: isDirectLoading,
    error: directError,
    refetch: refetchDirect,
  } = useOneOnOneChatsQuery();

  // Delete mutations
  const deleteGroupMutation = useDeleteGroupChatMutation();
  const deleteDirectMutation = useDeleteOneOnOneChatMutation();

  const isLoading = isGroupsLoading || isDirectLoading;
  const hasError = groupError || directError;

  // Build unified conversation list
  const unifiedList: UnifiedConversationItem[] = [];

  // 1. Group chats
  groupChats.forEach((g) => {
    const timeStr = g.updatedAt || g.createdAt;
    const ts = timeStr ? new Date(timeStr).getTime() : 0;
    unifiedList.push({
      id: g.id,
      type: "group",
      name: g.groupName || "Unnamed Group",
      subtitle: g.description || `${g.members?.length || 0} members`,
      time: formatMessageTime(timeStr),
      timestamp: isNaN(ts) ? 0 : ts,
      adminId: g.adminId,
      memberCount: g.members?.length,
      members: (g.members || []).map((m) => ({
        name: formatParticipantName(m.user),
        image: m.user?.image,
      })),
      rawGroup: g,
    });
  });

  // 2. Direct chats
  oneOnOneChats.forEach((d) => {
    const other = getOtherParticipant(d, currentUserId);
    const otherName = formatParticipantName(other);
    const targetUserId =
      d.senderId === currentUserId ? d.replyerId : d.senderId;
    const timeStr = d.updatedAt || d.createdAt;
    const ts = timeStr ? new Date(timeStr).getTime() : 0;
    unifiedList.push({
      id: d.id,
      type: "direct",
      name: otherName,
      subtitle: other?.email || "Direct Message",
      time: formatMessageTime(timeStr),
      timestamp: isNaN(ts) ? 0 : ts,
      recipientId: targetUserId,
      rawDirect: d,
    });
  });

  // Sort by latest activity descending
  unifiedList.sort((a, b) => b.timestamp - a.timestamp);

  // Filter by tab and search
  const filtered = unifiedList.filter((item) => {
    if (activeTab === "direct" && item.type !== "direct") return false;
    if (activeTab === "groups" && item.type !== "group") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenChat = (item: UnifiedConversationItem) => {
    setActiveChat({
      type: item.type,
      id: item.id,
      name: item.name,
      description: item.subtitle,
      recipientId: item.recipientId,
      adminId: item.adminId,
    });
    onNav(item.type === "group" ? "group-chat" : "chat");
  };

  const handleDeleteChat = async () => {
    if (!confirmDeleteChat) return;
    try {
      if (confirmDeleteChat.type === "group") {
        await deleteGroupMutation.mutateAsync(confirmDeleteChat.id);
      } else {
        await deleteDirectMutation.mutateAsync(confirmDeleteChat.id);
      }
      if (activeChatId && confirmDeleteChat.id === activeChatId) onNav("messages");
      setConfirmDeleteChat(null);
    } catch (err: any) {
      setConfirmDeleteChat(null);
      setListError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete conversation",
      );
    }
  };

  const directCount = unifiedList.filter((i) => i.type === "direct").length;
  const groupCount = unifiedList.length - directCount;
  const tabs = [
    { id: "all", label: "All", count: unifiedList.length },
    { id: "direct", label: "People", count: directCount },
    { id: "groups", label: "Groups", count: groupCount },
  ] as const;

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6FF] overflow-hidden">
      {/* Header band */}
      <div
        className="shrink-0 px-5 sm:px-8 pt-12 pb-14 lg:pt-10 lg:pb-6"
        style={{
          background:
            "linear-gradient(135deg, #1E1B4B 0%, #312E81 55%, #4C1D95 100%)",
        }}
      >
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h2
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontWeight: 700,
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
                className="text-white"
              >
                Messages
              </h2>
              <p className="text-sm text-white/70 mt-1.5">
                Talk to people and your savings groups
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="shrink-0 flex items-center gap-1.5 pl-3 pr-4 py-2.5 rounded-full bg-white text-[#3730A3] text-sm font-semibold hover:bg-[#EEF2FF] active:scale-95 transition cursor-pointer shadow-lg shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Plus size={18} />
              <span>New chat</span>
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-white/10 border border-white/15 px-4 py-3 focus-within:bg-white/15 focus-within:border-white/40 transition-colors">
            <Search size={17} className="text-white/60 shrink-0" />
            <input
              placeholder="Search by name or email"
              aria-label="Search conversations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-[16px] sm:text-sm text-white outline-none placeholder-white/55"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 min-h-0 -mt-7 lg:mt-0 flex flex-col">
        <div className="mx-auto w-full max-w-3xl flex-1 min-h-0 flex flex-col bg-white rounded-t-[28px] lg:rounded-none shadow-[0_-8px_30px_rgba(30,27,75,0.12)] lg:shadow-none overflow-hidden">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Conversation type"
            className="shrink-0 flex items-center gap-1.5 px-5 pt-5 pb-3"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3730A3] ${
                    active
                      ? "bg-[#3730A3] text-white font-semibold"
                      : "text-[#6B7280] hover:bg-[#F5F6FF] hover:text-[#1E1B4B]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] font-semibold px-1.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-[#EEF2FF] text-[#3730A3]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {listError && (
              <div className="mx-5 mb-2 px-4 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-between text-xs text-[#991B1B]">
                <span>{listError}</span>
                <button
                  onClick={() => setListError("")}
                  className="text-[11px] font-semibold text-[#DC2626] hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {hasError && (
              <div className="mx-5 mb-2 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#991B1B]">
                      Couldn't load your conversations
                    </p>
                    <p className="text-xs text-[#DC2626] mt-0.5">
                      Check your connection, then try again.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    refetchGroups();
                    refetchDirect();
                  }}
                  className="text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Try again
                </button>
              </div>
            )}

            {isLoading ? (
              <div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                    <div className="w-[52px] h-[52px] rounded-full bg-[#EEF0FA] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-[#EEF0FA] rounded w-1/3 mb-2.5" />
                      <div className="h-3 bg-[#F3F4FB] rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute left-0 top-3 w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#3730A3]">
                    <MessageSquare size={22} />
                  </div>
                  <div
                    className="absolute right-0 bottom-0 w-12 h-12 flex items-center justify-center text-white"
                    style={{
                      borderRadius: 16,
                      background: "linear-gradient(140deg, #7C3AED 0%, #3730A3 100%)",
                    }}
                  >
                    <Users size={22} />
                  </div>
                </div>
                <h3
                  style={{ fontFamily: "var(--font-family-display)" }}
                  className="font-bold text-lg text-[#1E1B4B]"
                >
                  {search ? "No matches" : "Nothing here yet"}
                </h3>
                <p className="text-sm text-[#6B7280] max-w-xs mt-1.5 leading-relaxed">
                  {search
                    ? `No conversation matches "${search}". Try a different name or email.`
                    : activeTab === "groups"
                    ? "Create a group chat to talk with your savings circle."
                    : activeTab === "direct"
                    ? "Start a chat with another Pave user."
                    : "Start a chat with a person or create a group for your savings circle."}
                </p>
                {!search && (
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="mt-5 px-5 py-2.5 rounded-full bg-[#3730A3] text-white text-sm font-semibold hover:bg-[#2E2882] active:scale-95 transition cursor-pointer"
                  >
                    New chat
                  </button>
                )}
              </div>
            ) : (
              <ul className="pb-6">
                {filtered.map((item) => {
                  const canDelete =
                    item.type === "direct" ||
                    canDeleteGroupChat(item.adminId, currentUserId);
                  return (
                    <li key={`${item.type}-${item.id}`} className="group relative">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenChat(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleOpenChat(item);
                          }
                        }}
                        aria-current={item.id === activeChatId ? "true" : undefined}
                        className={`flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3730A3] ${
                          item.id === activeChatId
                            ? "bg-[#EEF2FF]"
                            : "hover:bg-[#F5F6FF] active:bg-[#EEF2FF]"
                        }`}
                      >
                        <ConversationAvatar name={item.name} type={item.type} />
                        <div className="flex-1 min-w-0 border-b border-[#EEF0FA] pb-3.5 -mb-3.5 group-last:border-b-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <span
                              style={{ fontFamily: "var(--font-family-display)" }}
                              className="font-bold text-[16px] text-[#1E1B4B] truncate"
                            >
                              {item.name}
                            </span>
                            {item.time && (
                              <span className="text-xs text-[#9CA3AF] shrink-0 tabular-nums">
                                {item.time}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2 min-w-0">
                            {item.type === "group" && item.members && item.members.length > 0 && (
                              <AvatarStack
                                people={item.members}
                                total={item.memberCount || item.members.length}
                                size={20}
                              />
                            )}
                            <span className="text-[13px] text-[#6B7280] truncate">
                              {item.type === "group"
                                ? `${item.memberCount || 0} member${item.memberCount === 1 ? "" : "s"}${
                                    item.subtitle && !/^\d+ members$/.test(item.subtitle)
                                      ? ` · ${item.subtitle}`
                                      : ""
                                  }`
                                : item.subtitle}
                            </span>
                          </div>
                        </div>
                        <div className="w-8 shrink-0" aria-hidden="true" />
                      </div>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteChat(item)}
                          aria-label={`Delete conversation with ${item.name}`}
                          title="Delete conversation"
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewModal && (
        <NewChatModal
          onClose={() => setShowNewModal(false)}
          onStartDirect={(recipient) => {
            setShowNewModal(false);
            setActiveChat({
              type: "direct",
              id: "", // Will be assigned once first message is sent or created
              recipientId: recipient.id,
              name: formatParticipantName(recipient),
              description: recipient.email,
              participantUser: recipient,
            });
            onNav("chat");
          }}
          onGroupCreated={(group) => {
            setShowNewModal(false);
            setActiveChat({
              type: "group",
              id: group.id,
              name: group.groupName,
              description: group.description,
              adminId: group.adminId,
            });
            onNav("group-chat");
          }}
        />
      )}

      {/* Confirm Delete Conversation Modal */}
      {confirmDeleteChat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h4 className="text-center font-bold text-base text-[#0D0F1C]">
              Delete Conversation?
            </h4>
            <p className="text-center text-xs text-[#6B7280] mt-2 leading-relaxed">
              <strong className="text-[#0D0F1C]">
                {confirmDeleteChat.name}
              </strong>
              <br />
              {confirmDeleteChat.type === "group"
                ? DELETE_GROUP_CHAT_WARNING
                : DELETE_DIRECT_CHAT_WARNING}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDeleteChat(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteChat}
                disabled={
                  deleteGroupMutation.isPending ||
                  deleteDirectMutation.isPending
                }
                className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {(deleteGroupMutation.isPending ||
                  deleteDirectMutation.isPending) && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Workspace: list + chat side by side on desktop ─────────────────────────
// Phones keep the one-screen-at-a-time flow; from lg up the list stays on the
// left and the open conversation fills the right.
export function MessagesWorkspace({
  screen,
  onNav,
  chat,
  setActiveChat,
}: {
  screen: Screen;
  onNav: (s: Screen) => void;
  chat?: ActiveChatState | null;
  setActiveChat: (c: ActiveChatState) => void;
}) {
  const showingChat = screen !== "messages" && !!chat;
  return (
    <div
      className={`flex-1 flex min-h-0 lg:h-screen lg:max-h-screen overflow-hidden ${
        showingChat ? "max-lg:h-dvh" : ""
      }`}
    >
      <div
        className={`${
          showingChat ? "hidden lg:flex" : "flex"
        } w-full lg:w-[400px] xl:w-[440px] lg:shrink-0 flex-col min-h-0 lg:border-r border-[#E7E9F7]`}
      >
        <MessagesScreen
          onNav={onNav}
          setActiveChat={setActiveChat}
          activeChatId={showingChat ? chat?.id : undefined}
        />
      </div>
      <div
        className={`${
          showingChat ? "flex" : "hidden lg:flex"
        } flex-1 min-w-0 min-h-0 flex-col`}
      >
        {showingChat && chat ? (
          <ChatScreen
            key={`${chat.type}-${chat.id || chat.recipientId || "new"}`}
            onNav={onNav}
            chat={chat}
          />
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-[#F5F6FF]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(55,48,163,0.07) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            <div className="relative w-28 h-24 mb-6">
              <div className="absolute left-0 top-4 w-16 h-16 rounded-full bg-white border border-[#DDE0F5] shadow-sm flex items-center justify-center text-[#3730A3]">
                <MessageSquare size={28} />
              </div>
              <div
                className="absolute right-0 bottom-0 w-16 h-16 flex items-center justify-center text-white shadow-lg shadow-[#3730A3]/25"
                style={{
                  borderRadius: 22,
                  background: "linear-gradient(140deg, #7C3AED 0%, #3730A3 100%)",
                }}
              >
                <Users size={28} />
              </div>
            </div>
            <h3
              style={{ fontFamily: "var(--font-family-display)" }}
              className="font-bold text-xl text-[#1E1B4B]"
            >
              Pick a conversation
            </h3>
            <p className="mt-2 max-w-xs text-sm text-[#6B7280] leading-relaxed">
              Choose a person or group on the left, or start a new chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NewChatModal ────────────────────────────────────────────────────────────
function NewChatModal({
  onClose,
  onStartDirect,
  onGroupCreated,
}: {
  onClose: () => void;
  onStartDirect: (recipient: RecipientUser) => void;
  onGroupCreated: (group: GroupChat) => void;
}) {
  const [tab, setTab] = useState<"direct" | "group">("direct");
  const [recipientSearch, setRecipientSearch] = useState("");

  // Group creation state
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [memberEmails, setMemberEmails] = useState("");
  const [groupError, setGroupError] = useState("");

  // Queries & Mutations
  const {
    data: recipients = [],
    isLoading: isRecipientsLoading,
    error: recipientsError,
  } = useChatRecipientsQuery();
  const createGroupMutation = useCreateGroupChatMutation();

  const filteredRecipients = recipients.filter((r) => {
    const q = recipientSearch.toLowerCase();
    const fullName = `${r.firstName || ""} ${r.lastName || ""}`.toLowerCase();
    const email = (r.email || "").toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError("");

    if (!groupName.trim()) {
      setGroupError("Please enter a group name");
      return;
    }

    const emailList = memberEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    try {
      const res = await createGroupMutation.mutateAsync({
        groupName: groupName.trim(),
        description: groupDesc.trim(),
        emails: emailList,
      });

      if (res?.data) {
        onGroupCreated(res.data);
      }
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create group";
      const notFound = err?.response?.data?.notFoundEmails;
      if (Array.isArray(notFound) && notFound.length > 0) {
        setGroupError(
          `${backendMessage}: ${notFound.join(", ")}. Please remove unregistered emails.`,
        );
      } else {
        setGroupError(backendMessage);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F1F3FB] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#0D0F1C]">
            New Conversation
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#6B7280] hover:text-[#0D0F1C] flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#F1F3FB] px-6 pt-3">
          <button
            onClick={() => setTab("direct")}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 cursor-pointer transition-colors ${
              tab === "direct"
                ? "border-[#3730A3] text-[#3730A3]"
                : "border-transparent text-[#6B7280] hover:text-[#0D0F1C]"
            }`}
          >
            Direct Message
          </button>
          <button
            onClick={() => setTab("group")}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 cursor-pointer transition-colors ${
              tab === "group"
                ? "border-[#3730A3] text-[#3730A3]"
                : "border-transparent text-[#6B7280] hover:text-[#0D0F1C]"
            }`}
          >
            Create Group Chat
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "direct" ? (
            <div className="flex flex-col gap-4">
              <div className="bg-[#F8F9FD] rounded-xl px-3.5 py-2 flex items-center gap-2 border border-[#E5E7EB]">
                <Search size={16} className="text-[#9CA3AF]" />
                <input
                  placeholder="Search registered users by name or email..."
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-[#0D0F1C] outline-none placeholder-[#9CA3AF]"
                />
              </div>

              {isRecipientsLoading ? (
                <div className="py-8 flex flex-col items-center justify-center text-xs text-[#6B7280] gap-2">
                  <Loader2 size={20} className="animate-spin text-[#3730A3]" />
                  <span>Loading eligible users...</span>
                </div>
              ) : recipientsError ? (
                <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B]">
                  Unable to load recipient list from backend.
                </div>
              ) : filteredRecipients.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B7280]">
                  No eligible recipients found.
                </div>
              ) : (
                <div className="divide-y divide-[#F3F4F6] max-h-64 overflow-y-auto">
                  {filteredRecipients.map((rec) => {
                    const name = formatParticipantName(rec);
                    return (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => onStartDirect(rec)}
                        className="w-full flex items-center gap-3 py-3 px-2 hover:bg-[#F9FAFB] rounded-xl transition-colors cursor-pointer text-left"
                      >
                        <Avatar name={name} size={40} color="#3730A3" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-[#0D0F1C] truncate">
                            {name}
                          </div>
                          <div className="text-[11px] text-[#6B7280] truncate mt-0.5">
                            {rec.email}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              {groupError && (
                <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2 text-xs text-[#991B1B]">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{groupError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Group Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Monthly Savings Clan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] text-xs text-[#0D0F1C] outline-none focus:border-[#3730A3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="e.g. Discussion group for our contributions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] text-xs text-[#0D0F1C] outline-none focus:border-[#3730A3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Member Emails (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={memberEmails}
                  onChange={(e) => setMemberEmails(e.target.value)}
                  placeholder="user1@example.com, user2@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D1D5DB] text-xs text-[#0D0F1C] outline-none focus:border-[#3730A3] resize-none"
                />
                <span className="text-[11px] text-[#6B7280] mt-1 block">
                  Only registered users on PAVEPADI can be added.
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createGroupMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-[#2E2882] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {createGroupMutation.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  <span>Create Group</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ChatScreen ──────────────────────────────────────────────────────────────
export function ChatScreen({
  onNav,
  chat,
}: {
  onNav: (s: Screen) => void;
  chat?: ActiveChatState;
}) {
  const { authUser } = useLocalStore();
  const currentUserId = getCurrentUserId(authUser);

  const [inputMessage, setInputMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(false);
  const [deleteMessageTarget, setDeleteMessageTarget] =
    useState<ChatMessageItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const skipScrollRef = useRef(false);

  // Older pages loaded on demand (page 1 is the polled query)
  const [extraMessages, setExtraMessages] = useState<ChatMessageItem[]>([]);
  const [nextPage, setNextPage] = useState(2);
  const [moreAvailable, setMoreAvailable] = useState<boolean | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Active chat metadata. A new direct conversation receives its ID from
  // the first successful oneOnOneChat response.
  const isGroup = chat?.type === "group";
  const [resolvedChatId, setResolvedChatId] = useState(chat?.id || "");
  useEffect(() => {
    setResolvedChatId(chat?.id || "");
  }, [chat?.id]);
  const chatId = resolvedChatId;
  const recipientId = chat?.recipientId || "";
  const chatName = chat?.name || (isGroup ? "Group Chat" : "Direct Chat");

  // Queries for messages
  const groupMessagesQuery = useGroupChatMessagesQuery(chatId, {
    enabled: isGroup && Boolean(chatId),
    refetchInterval: 5000,
  });

  const directMessagesQuery = useOneOnOneMessagesQuery(chatId, {
    enabled: !isGroup && Boolean(chatId),
    refetchInterval: 5000,
  });

  // Group metadata query for info/admin actions
  const groupDetailsQuery = useGroupChatQuery(
    chatId,
    isGroup && Boolean(chatId),
  );
  const groupData = groupDetailsQuery.data?.data;
  const groupAdminId = groupData?.adminId ?? chat?.adminId;
  const isGroupAdmin =
    isGroup && canDeleteGroupChat(groupAdminId, currentUserId);

  // Mutations
  const sendGroupMessageMutation = useSendGroupChatMessageMutation();
  const sendOneOnOneMutation = useCreateOrSendOneOnOneMutation();
  const deleteOneOnOneMsgMutation = useDeleteOneOnOneMessageMutation();
  const deleteGroupMutation = useDeleteGroupChatMutation();
  const deleteDirectMutation = useDeleteOneOnOneChatMutation();

  const isSending =
    sendGroupMessageMutation.isPending || sendOneOnOneMutation.isPending;

  // Reset local paging state when switching conversation
  useEffect(() => {
    setExtraMessages([]);
    setNextPage(2);
    setMoreAvailable(null);
  }, [chat?.id, chat?.recipientId]);

  const firstPage = isGroup
    ? groupMessagesQuery.data
    : directMessagesQuery.data;
  const firstPagination = firstPage?.pagination;
  const hasMore =
    moreAvailable ??
    (firstPagination
      ? firstPagination.page < firstPagination.totalPages
      : false);

  // Resolved messages list (merged by id, deleted removed, oldest first)
  const messagesList: ChatMessageItem[] = mergeMessages(
    extraMessages,
    firstPage?.messages || [],
  );

  const handleLoadMore = async () => {
    if (!chatId || loadingMore) return;
    setLoadingMore(true);
    setErrorMessage("");
    try {
      const params = { page: nextPage, limit: firstPagination?.limit };
      const res = isGroup
        ? await getGroupChatMessages(chatId, params)
        : await getOneOnOneMessages(chatId, params);
      skipScrollRef.current = true;
      setExtraMessages((cur) => mergeMessages(cur, res.messages));
      setNextPage((p) => p + 1);
      setMoreAvailable(
        res.messages.length > 0 &&
          (res.pagination
            ? res.pagination.page < res.pagination.totalPages
            : true),
      );
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Could not load more messages.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const isLoadingMessages = isGroup
    ? groupMessagesQuery.isLoading
    : directMessagesQuery.isLoading;

  const messagesError = isGroup
    ? groupMessagesQuery.error
    : directMessagesQuery.error;

  // Scroll to bottom on load and whenever messages change
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList.length]);

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    setErrorMessage("");
    const textToSend = inputMessage.trim();

    try {
      if (isGroup) {
        if (!chatId) throw new Error("Missing group conversation ID");
        await sendGroupMessageMutation.mutateAsync({
          groupId: chatId,
          payload: { message: textToSend, messageType: "text" },
        });
      } else {
        if (!recipientId && !chatId) {
          throw new Error("Missing recipient or conversation reference");
        }
        const response = await sendOneOnOneMutation.mutateAsync({
          userId: recipientId,
          message: textToSend,
          messageType: "text",
        });
        const createdChatId = response?.data?.chat?.id;
        if (createdChatId) {
          setResolvedChatId(createdChatId);
        }
      }
      setInputMessage("");
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send message. Please retry.",
      );
    }
  };

  // Delete message handler
  const handleDeleteMessage = async () => {
    if (!deleteMessageTarget) return;
    // Backend does not check ownership, so only ever delete own 1-on-1 messages
    if (isGroup || !canDeleteMessage(deleteMessageTarget, currentUserId)) {
      setDeleteMessageTarget(null);
      return;
    }
    try {
      await deleteOneOnOneMsgMutation.mutateAsync({
        messageId: deleteMessageTarget.id,
        chatId,
      });
      const removedId = deleteMessageTarget.id;
      setExtraMessages((cur) => cur.filter((m) => m.id !== removedId));
      setDeleteMessageTarget(null);
    } catch (err: any) {
      setDeleteMessageTarget(null);
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete message",
      );
    }
  };

  // Delete entire conversation
  const handleDeleteConversation = async () => {
    if (isGroup && !canDeleteGroupChat(groupAdminId, currentUserId)) {
      setConfirmDeleteChat(false);
      return;
    }
    try {
      if (isGroup) {
        await deleteGroupMutation.mutateAsync(chatId);
      } else {
        await deleteDirectMutation.mutateAsync(chatId);
      }
      onNav("messages");
    } catch (err: any) {
      setConfirmDeleteChat(false);
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete conversation",
      );
    }
  };

  const rows = buildChatRows(messagesList);
  const firstName = chatName.trim().split(" ")[0] || "them";
  const starters = isGroup
    ? ["Hello everyone 👋", "When is the next contribution?"]
    : ["Hello 👋", "How are you?", "Can we talk about our contribution?"];
  const groupPeople = (groupData?.members || []).map((m) => ({
    name: formatParticipantName(m.user),
    image: m.user?.image,
  }));

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6FF] overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 bg-white border-b border-[#E7E9F7]">
        <div className="w-full flex items-center gap-3 px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 lg:pt-4 pb-3">
          <button
            onClick={() => onNav("messages")}
            aria-label="Back to messages"
            className="lg:hidden w-10 h-10 rounded-full text-[#374151] hover:bg-[#F5F6FF] active:scale-95 flex items-center justify-center cursor-pointer transition focus-visible:outline-2 focus-visible:outline-[#3730A3]"
          >
            <ArrowLeft size={20} />
          </button>

          <ConversationAvatar
            name={chatName}
            type={isGroup ? "group" : "direct"}
            size={44}
          />

          <div className="flex-1 min-w-0">
            <div
              style={{ fontFamily: "var(--font-family-display)" }}
              className="text-[17px] font-bold text-[#1E1B4B] truncate leading-tight"
            >
              {chatName}
            </div>
            <div className="mt-1 flex items-center gap-2 min-w-0 text-xs text-[#6B7280]">
              {isGroup ? (
                <>
                  {groupPeople.length > 0 && (
                    <AvatarStack
                      people={groupPeople}
                      total={groupData?.members?.length || groupPeople.length}
                      size={18}
                    />
                  )}
                  <span className="truncate">
                    {groupData
                      ? `${groupData.members?.length || 0} members`
                      : "Group chat"}
                  </span>
                </>
              ) : (
                <span className="truncate">
                  {chat?.description || "Direct message"}
                </span>
              )}
            </div>
          </div>

          {isGroup && (
            <button
              onClick={() => setShowInfoModal(true)}
              aria-label="Group info"
              title="Group info"
              className="w-10 h-10 rounded-full text-[#6B7280] hover:text-[#3730A3] hover:bg-[#EEF2FF] flex items-center justify-center cursor-pointer transition focus-visible:outline-2 focus-visible:outline-[#3730A3]"
            >
              <Info size={19} />
            </button>
          )}

          {chatId && (!isGroup || isGroupAdmin) && (
            <button
              onClick={() => setConfirmDeleteChat(true)}
              aria-label="Delete conversation"
              title="Delete conversation"
              className="w-10 h-10 rounded-full text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center cursor-pointer transition focus-visible:outline-2 focus-visible:outline-[#DC2626]"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="shrink-0 px-4 py-2 bg-[#FEF2F2] border-b border-[#FCA5A5] text-xs text-[#991B1B]">
          <div className="mx-auto w-full max-w-3xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-[11px] font-semibold text-[#DC2626] hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            "radial-gradient(rgba(55,48,163,0.07) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="mx-auto w-full max-w-4xl min-h-full px-3 sm:px-5 lg:px-8 py-4 flex flex-col">
          {isLoadingMessages ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                >
                  <div className="w-52 h-12 rounded-2xl bg-[#E4E7F7] animate-pulse" />
                </div>
              ))}
            </div>
          ) : messagesError ? (
            <div className="my-auto p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-center text-xs text-[#991B1B]">
              Couldn't load this conversation. Go back and open it again.
            </div>
          ) : messagesList.length === 0 ? (
            <div className="my-auto flex flex-col items-center text-center px-4 py-10">
              <div className="mb-4">
                {isGroup && groupPeople.length > 0 ? (
                  <AvatarStack
                    people={groupPeople}
                    total={groupData?.members?.length || groupPeople.length}
                    size={44}
                  />
                ) : (
                  <ConversationAvatar
                    name={chatName}
                    type={isGroup ? "group" : "direct"}
                    size={72}
                  />
                )}
              </div>
              <h3
                style={{ fontFamily: "var(--font-family-display)" }}
                className="font-bold text-lg text-[#1E1B4B]"
              >
                {isGroup ? `Start chatting in ${chatName}` : `Say hello to ${firstName}`}
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-[#6B7280] leading-relaxed">
                Your messages will appear here. Pick one below or write your own.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {starters.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => setInputMessage(text)}
                    className="px-3.5 py-2 rounded-full bg-white border border-[#DDE0F5] text-[13px] text-[#3730A3] font-medium hover:bg-[#EEF2FF] active:scale-95 transition cursor-pointer"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="self-center mb-3 text-xs font-semibold text-[#3730A3] bg-white border border-[#DDE0F5] rounded-full px-4 py-1.5 cursor-pointer disabled:opacity-60 flex items-center gap-1.5 hover:bg-[#EEF2FF] transition"
                >
                  {loadingMore && <Loader2 size={12} className="animate-spin" />}
                  <span>Load more messages</span>
                </button>
              )}
              {rows.map((row) => {
                if (row.kind === "day") {
                  return (
                    <div key={row.key} className="flex justify-center my-3">
                      <span className="text-[11px] font-semibold text-[#6B7280] bg-white/90 border border-[#E7E9F7] rounded-full px-3 py-1">
                        {row.label}
                      </span>
                    </div>
                  );
                }
                const m = row.message;
                const isMe = m.senderId === currentUserId;
                const senderName = formatParticipantName(m.sender);
                const showSender = isGroup && !isMe && row.isFirstInRun;
                const showAvatar = isGroup && !isMe;
                const radius = isMe
                  ? row.isFirstInRun && row.isLastInRun
                    ? "rounded-2xl rounded-br-md"
                    : row.isFirstInRun
                    ? "rounded-2xl rounded-br-md"
                    : row.isLastInRun
                    ? "rounded-2xl rounded-tr-md"
                    : "rounded-2xl rounded-r-md"
                  : row.isFirstInRun && row.isLastInRun
                  ? "rounded-2xl rounded-bl-md"
                  : row.isFirstInRun
                  ? "rounded-2xl rounded-bl-md"
                  : row.isLastInRun
                  ? "rounded-2xl rounded-tl-md"
                  : "rounded-2xl rounded-l-md";

                return (
                  <div
                    key={row.key}
                    className={`group flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"} ${
                      row.isFirstInRun ? "mt-3" : "mt-0.5"
                    }`}
                  >
                    {showAvatar && (
                      <div className="w-7 shrink-0">
                        {row.isLastInRun && (
                          <Avatar
                            name={senderName}
                            size={28}
                            src={m.sender?.image || undefined}
                            color={avatarColorFor(senderName)}
                          />
                        )}
                      </div>
                    )}

                    {!isGroup && canDeleteMessage(m, currentUserId) && (
                      <button
                        type="button"
                        onClick={() => setDeleteMessageTarget(m)}
                        aria-label="Delete message"
                        title="Delete message"
                        className={`self-center p-1.5 rounded-full text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition cursor-pointer ${
                          selectedMessageId === m.id ? "" : "max-sm:hidden"
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    <div className="max-w-[78%] sm:max-w-[68%] min-w-0">
                      {showSender && (
                        <div
                          className="text-xs font-semibold mb-1 px-1 truncate"
                          style={{ color: avatarColorFor(senderName) }}
                        >
                          {senderName}
                        </div>
                      )}
                      <div
                        onClick={() =>
                          setSelectedMessageId((cur) => (cur === m.id ? null : m.id))
                        }
                        className={`px-3.5 py-2 text-[15px] sm:text-sm leading-relaxed wrap-break-word whitespace-pre-wrap ${radius} ${
                          isMe
                            ? "bg-[#3730A3] text-white shadow-[0_1px_2px_rgba(55,48,163,0.35)]"
                            : "bg-white text-[#1E1B4B] border border-[#E7E9F7]"
                        }`}
                      >
                        {m.message}
                        {row.isLastInRun && (
                          <span
                            className={`ml-2 inline-flex items-center gap-1 align-bottom text-[10px] tabular-nums translate-y-0.5 ${
                              isMe ? "text-white/70" : "text-[#9CA3AF]"
                            }`}
                          >
                            {formatClock(m.createdAt)}
                            {isMe &&
                              (m.isRead ? (
                                <CheckCheck size={13} className="text-[#A5B4FC]" aria-label="Read" />
                              ) : (
                                <Check size={13} aria-label="Sent" />
                              ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSendMessage}
        className="shrink-0 px-3 sm:px-5 lg:px-8 pb-3 lg:pb-5 pt-2"
      >
        <div className="mx-auto w-full max-w-4xl flex items-center gap-1.5 bg-white rounded-full border border-[#DDE0F5] shadow-[0_4px_18px_rgba(30,27,75,0.08)] p-1.5 focus-within:border-[#3730A3] transition-colors">
          <button
            type="button"
            onClick={() =>
              setErrorMessage("File and media attachments are not supported yet.")
            }
            aria-label="Attach a file"
            title="Attachments aren't available yet"
            className="w-10 h-10 rounded-full text-[#6B7280] hover:text-[#3730A3] hover:bg-[#F5F6FF] flex items-center justify-center cursor-pointer transition shrink-0"
          >
            <Paperclip size={18} />
          </button>

          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Write a message"
            aria-label="Message"
            disabled={isSending}
            className="flex-1 min-w-0 bg-transparent px-2 py-2 text-[16px] sm:text-sm text-[#1E1B4B] outline-none placeholder-[#9CA3AF] disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-[#3730A3] hover:bg-[#2E2882] active:scale-95 disabled:bg-[#C7CBEE] text-white flex items-center justify-center cursor-pointer transition shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3730A3]"
          >
            {isSending ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <Send size={17} />
            )}
          </button>
        </div>
      </form>

      {/* Group Info Modal */}
      {showInfoModal && isGroup && (
        <GroupDetailsModal
          groupId={chatId}
          isGroupAdmin={!!isGroupAdmin}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {/* Delete Message Confirmation */}
      {deleteMessageTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-sm text-[#0D0F1C]">
              Delete message?
            </h4>
            <p className="text-xs text-[#6B7280] mt-1.5">
              This message will be removed from the conversation.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setDeleteMessageTarget(null)}
                className="flex-1 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteMessage}
                disabled={deleteOneOnOneMsgMutation.isPending}
                className="flex-1 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] cursor-pointer flex items-center justify-center gap-1"
              >
                {deleteOneOnOneMsgMutation.isPending && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Conversation Confirmation */}
      {confirmDeleteChat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h4 className="text-center font-bold text-base text-[#0D0F1C]">
              Delete Conversation?
            </h4>
            <p className="text-center text-xs text-[#6B7280] mt-2 leading-relaxed">
              {isGroup ? DELETE_GROUP_CHAT_WARNING : DELETE_DIRECT_CHAT_WARNING}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDeleteChat(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConversation}
                disabled={
                  deleteGroupMutation.isPending ||
                  deleteDirectMutation.isPending
                }
                className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {(deleteGroupMutation.isPending ||
                  deleteDirectMutation.isPending) && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GroupDetailsModal ───────────────────────────────────────────────────────
function GroupDetailsModal({
  groupId,
  isGroupAdmin,
  onClose,
}: {
  groupId: string;
  isGroupAdmin: boolean;
  onClose: () => void;
}) {
  const { data: groupRes, isLoading } = useGroupChatQuery(groupId);
  const group = groupRes?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editError, setEditError] = useState("");
  const updateMutation = useUpdateGroupChatMutation();

  useEffect(() => {
    if (group) {
      setEditName(group.groupName || "");
      setEditDesc(group.description || "");
    }
  }, [group]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");

    const memberEmails = (group?.members || [])
      .map((member) => member.user?.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email));

    if (memberEmails.length === 0) {
      setEditError(
        "We couldn't retrieve the group members' email addresses. Refresh the group details and try again.",
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        groupId,
        payload: {
          groupName: editName.trim(),
          description: editDesc.trim(),
          emails: memberEmails,
        },
      });
      setIsEditing(false);
    } catch (err: any) {
      setEditError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update group information",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F3FB]">
          <h4 className="font-bold text-sm text-[#0D0F1C]">Group Info</h4>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3F4F6] text-[#6B7280] hover:text-[#0D0F1C] flex items-center justify-center cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center text-xs text-[#6B7280] gap-2">
            <Loader2 size={20} className="animate-spin text-[#3730A3]" />
            <span>Loading group details...</span>
          </div>
        ) : !group ? (
          <div className="py-8 text-center text-xs text-[#6B7280]">
            Group details unavailable.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center mx-auto text-xl font-bold mb-2">
                {group.groupName?.substring(0, 2).toUpperCase() || "GC"}
              </div>
              <h3 className="font-bold text-base text-[#0D0F1C]">
                {group.groupName}
              </h3>
              {group.description && (
                <p className="text-xs text-[#6B7280] mt-1">
                  {group.description}
                </p>
              )}
            </div>

            {isGroupAdmin && (
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 rounded-xl bg-[#EEF2FF] text-[#3730A3] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#E0E7FF] transition-colors"
                  >
                    <Edit2 size={13} />
                    <span>Edit Group Details</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleUpdate}
                    className="flex flex-col gap-2 mt-2"
                  >
                    {editError && (
                      <div className="text-[11px] text-[#DC2626]">
                        {editError}
                      </div>
                    )}
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Group name"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D1D5DB]"
                    />
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#D1D5DB]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-1 text-xs text-[#6B7280] border border-[#D1D5DB] rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="flex-1 py-1 text-xs bg-[#3730A3] text-white rounded-lg flex items-center justify-center gap-1"
                      >
                        {updateMutation.isPending && (
                          <Loader2 size={11} className="animate-spin" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Members List */}
            <div>
              <div className="text-xs font-semibold text-[#374151] mb-2 flex items-center justify-between">
                <span>Members ({group.members?.length || 0})</span>
              </div>
              <div className="divide-y divide-[#F3F4F6] max-h-48 overflow-y-auto">
                {group.members?.map((m) => {
                  const mName = formatParticipantName(m.user);
                  const isUserAdmin =
                    m.role === "admin" || m.userId === group.adminId;
                  return (
                    <div
                      key={m.id}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={mName} size={28} color="#3730A3" />
                        <span className="font-medium text-[#0D0F1C]">
                          {mName}
                        </span>
                      </div>
                      {isUserAdmin && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#FEF3C7] text-[#D97706] rounded font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NotificationsScreen (live API) ──────────────────────────────────────────
export function NotificationsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { data, isLoading, error, refetch } = useNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();
  const deleteOne = useDeleteNotificationMutation();
  const deleteAll = useDeleteAllNotificationsMutation();

  const [actionError, setActionError] = useState("");
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const items = data?.items || [];
  const unread = data?.unreadCount ?? 0;

  const fail = (err: any, fallback: string) =>
    setActionError(err?.response?.data?.message || err?.message || fallback);

  const handleOpen = (n: AppNotification) => {
    if (n.isRead) return;
    markRead.mutate(n.id, {
      onError: (e) => fail(e, "Could not mark as read."),
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 pt-14 pb-4 bg-white border-b border-[#F1F3FB]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNav("home")}
            aria-label="Back to home"
            title="Back to home"
            className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Notifications
          </h2>
          <button
            onClick={() =>
              markAll.mutate(undefined, {
                onError: (e) => fail(e, "Could not mark all as read."),
              })
            }
            disabled={unread === 0 || markAll.isPending}
            className="text-sm text-[#3730A3] font-medium cursor-pointer disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>
        {items.length > 0 && (
          <div className="flex items-center justify-between mt-3 text-xs text-[#6B7280]">
            <span>{unread} unread</span>
            <button
              onClick={() => setConfirmClearAll(true)}
              className="text-[#DC2626] font-semibold hover:underline cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="mx-4 mt-3 px-4 py-2 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-between text-xs text-[#991B1B]">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError("")}
            className="text-[11px] font-semibold text-[#DC2626] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-[#F3F4F6] animate-pulse"
            />
          ))
        ) : error ? (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-between text-xs text-[#991B1B]">
            <span>Unable to load notifications.</span>
            <button
              onClick={() => refetch()}
              className="font-semibold text-[#DC2626] hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center text-2xl mb-3">
              🔔
            </div>
            <p className="font-semibold text-sm text-[#0D0F1C]">
              No notifications yet
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Updates about your wallet, savings and messages will show here.
            </p>
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              onClick={() => handleOpen(n)}
              className={`flex items-start gap-4 p-4 rounded-2xl transition-colors cursor-pointer ${
                n.isRead
                  ? "bg-white border border-[#F1F3FB]"
                  : "bg-[#EEF2FF] border border-[#C7D2FE]"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#3730A3]/10 flex items-center justify-center shrink-0 text-xl">
                {notificationIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#0D0F1C] truncate">
                    {notificationTitle(n.type)}
                  </span>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#3730A3] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed wrap-break-word">
                  {n.message}
                </p>
                <span className="text-xs text-[#9CA3AF] mt-1 block">
                  {formatMessageTime(n.createdAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(n.id);
                }}
                aria-label="Delete notification"
                title="Delete notification"
                className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] rounded cursor-pointer shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {(confirmClearAll || confirmDeleteId) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-xl">
            <h4 className="font-bold text-sm text-[#0D0F1C]">
              {confirmClearAll
                ? "Clear all notifications?"
                : "Delete notification?"}
            </h4>
            <p className="text-xs text-[#6B7280] mt-1.5">
              This cannot be undone.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setConfirmClearAll(false);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#374151] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmClearAll) {
                    deleteAll.mutate(undefined, {
                      onError: (e) => fail(e, "Could not clear notifications."),
                    });
                  } else if (confirmDeleteId) {
                    deleteOne.mutate(confirmDeleteId, {
                      onError: (e) => fail(e, "Could not delete notification."),
                    });
                  }
                  setConfirmClearAll(false);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
