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
} from "lucide-react";
import { Avatar } from "../components/UI";
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
  rawGroup?: GroupChat;
  rawDirect?: OneOnOneChat;
}

// ─── MessagesScreen ──────────────────────────────────────────────────────────
export function MessagesScreen({
  onNav,
  setActiveChat,
}: {
  onNav: (s: Screen) => void;
  setActiveChat: (c: ActiveChatState) => void;
}) {
  const { authUser } = useLocalStore();
  const currentUserId = getCurrentUserId(authUser);

  const [activeTab, setActiveTab] = useState<"all" | "direct" | "groups">("all");
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] =
    useState<UnifiedConversationItem | null>(null);

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
      setConfirmDeleteChat(null);
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete conversation",
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#F1F3FB]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
              className="text-[#0D0F1C]"
            >
              Messages
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Chat with users and savings groups
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-[#2E2882] transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-[#F8F9FD] rounded-xl px-4 py-2.5 flex items-center gap-2 border border-[#E5E7EB]">
          <Search size={16} className="text-[#9CA3AF]" />
          <input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#0D0F1C] outline-none placeholder-[#9CA3AF]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-[#9CA3AF] hover:text-[#0D0F1C]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-4">
          {(
            [
              { id: "all", label: "All Messages" },
              { id: "direct", label: "Direct" },
              { id: "groups", label: "Groups" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#EEF2FF] text-[#3730A3] font-semibold"
                  : "text-[#6B7280] hover:text-[#0D0F1C] hover:bg-[#F3F4F6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {hasError && (
          <div className="m-4 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#991B1B]">
                  Unable to load conversations
                </p>
                <p className="text-xs text-[#DC2626] mt-0.5">
                  Check your network connection or verify authentication.
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
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="divide-y divide-[#F9FAFB]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-[#E5E7EB] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-[#E5E7EB] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#F3F4F6] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#3730A3] mb-4">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-semibold text-base text-[#0D0F1C]">
              No conversations found
            </h3>
            <p className="text-xs text-[#6B7280] max-w-xs mt-1.5 leading-relaxed">
              {search
                ? `No results matching "${search}". Try searching for another name.`
                : activeTab === "groups"
                ? "You haven't joined or created any group chats yet."
                : activeTab === "direct"
                ? "You have no direct conversations yet."
                : "Connect with team members or your savings group to start chatting."}
            </p>
            {!search && (
              <button
                onClick={() => setShowNewModal(true)}
                className="mt-5 px-4 py-2 rounded-xl bg-[#3730A3] text-white text-xs font-semibold hover:bg-[#2E2882] transition-colors cursor-pointer shadow-sm"
              >
                Start a New Conversation
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#F9FAFB]">
            {filtered.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="group w-full flex items-center justify-between px-6 py-4 hover:bg-[#F9FAFB] transition-colors text-left cursor-pointer"
                onClick={() => handleOpenChat(item)}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <Avatar
                      name={item.name}
                      size={48}
                      color={item.type === "group" ? "#7C3AED" : "#3730A3"}
                    />
                    {item.type === "group" && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center border-2 border-white">
                        <Users size={10} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-sm text-[#0D0F1C] truncate">
                          {item.name}
                        </span>
                        {item.type === "group" && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#F3E8FF] text-[#7C3AED] rounded font-medium shrink-0">
                            Group
                          </span>
                        )}
                      </div>
                      {item.time && (
                        <span className="text-xs text-[#9CA3AF] shrink-0">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7280] truncate mt-1">
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {/* Delete button (subject to authorization) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDeleteChat(item);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 ml-2 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-all cursor-pointer"
                  title="Delete conversation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
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
              Are you sure you want to delete{" "}
              <strong className="text-[#0D0F1C]">{confirmDeleteChat.name}</strong>
              ? This action cannot be undone.
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
                  deleteGroupMutation.isPending || deleteDirectMutation.isPending
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
        err?.response?.data?.message || err?.message || "Failed to create group";
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
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(false);
  const [deleteMessageTarget, setDeleteMessageTarget] =
    useState<ChatMessageItem | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active chat metadata
  const isGroup = chat?.type === "group";
  const chatId = chat?.id || "";
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
  const groupDetailsQuery = useGroupChatQuery(chatId, isGroup && Boolean(chatId));

  // Mutations
  const sendGroupMessageMutation = useSendGroupChatMessageMutation();
  const sendOneOnOneMutation = useCreateOrSendOneOnOneMutation();
  const deleteOneOnOneMsgMutation = useDeleteOneOnOneMessageMutation();
  const deleteGroupMutation = useDeleteGroupChatMutation();
  const deleteDirectMutation = useDeleteOneOnOneChatMutation();

  const isSending =
    sendGroupMessageMutation.isPending || sendOneOnOneMutation.isPending;

  // Resolved messages list
  const messagesList: ChatMessageItem[] = isGroup
    ? groupMessagesQuery.data?.messages || []
    : directMessagesQuery.data?.messages || [];

  const isLoadingMessages = isGroup
    ? groupMessagesQuery.isLoading
    : directMessagesQuery.isLoading;

  const messagesError = isGroup
    ? groupMessagesQuery.error
    : directMessagesQuery.error;

  // Scroll to bottom on load and whenever messages change
  useEffect(() => {
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
        await sendOneOnOneMutation.mutateAsync({
          userId: recipientId,
          message: textToSend,
          messageType: "text",
        });
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
    try {
      if (!isGroup) {
        await deleteOneOnOneMsgMutation.mutateAsync({
          messageId: deleteMessageTarget.id,
          chatId,
        });
      } else {
        alert(
          "Group message deletion is not supported by the current backend API.",
        );
      }
      setDeleteMessageTarget(null);
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete message",
      );
    }
  };

  // Delete entire conversation
  const handleDeleteConversation = async () => {
    try {
      if (isGroup) {
        await deleteGroupMutation.mutateAsync(chatId);
      } else {
        await deleteDirectMutation.mutateAsync(chatId);
      }
      onNav("messages");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete conversation",
      );
    }
  };

  const groupData = groupDetailsQuery.data?.data;
  const isGroupAdmin = isGroup && groupData && groupData.adminId === currentUserId;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F1F3FB] shrink-0">
        <button
          onClick={() => onNav("messages")}
          className="w-8 h-8 rounded-full bg-[#F3F4F6] text-[#374151] hover:text-[#0D0F1C] flex items-center justify-center cursor-pointer transition-colors"
          title="Back to messages"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="relative shrink-0">
          <Avatar
            name={chatName}
            size={40}
            color={isGroup ? "#7C3AED" : "#3730A3"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#0D0F1C] truncate">
            {chatName}
          </div>
          <div className="text-xs text-[#6B7280] truncate">
            {isGroup
              ? groupData
                ? `${groupData.members?.length || 0} members`
                : "Group Chat"
              : chat?.description || "Direct Message"}
          </div>
        </div>

        {isGroup && (
          <button
            onClick={() => setShowInfoModal(true)}
            className="w-8 h-8 rounded-full text-[#6B7280] hover:text-[#3730A3] hover:bg-[#EEF2FF] flex items-center justify-center cursor-pointer transition-colors"
            title="Group info"
          >
            <Info size={18} />
          </button>
        )}

        {chatId && (
          <button
            onClick={() => setConfirmDeleteChat(true)}
            className="w-8 h-8 rounded-full text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center cursor-pointer transition-colors"
            title="Delete conversation"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-[#FEF2F2] border-b border-[#FCA5A5] flex items-center justify-between text-xs text-[#991B1B]">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-[11px] font-semibold text-[#DC2626] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F8F9FD]">
        {isLoadingMessages ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div className="w-48 h-12 rounded-2xl bg-[#E5E7EB] animate-pulse" />
              </div>
            ))}
          </div>
        ) : messagesError ? (
          <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-center text-xs text-[#991B1B]">
            Unable to retrieve messages for this conversation.
          </div>
        ) : messagesList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-xs text-[#6B7280]">
            <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#3730A3] flex items-center justify-center mb-3">
              <MessageSquare size={22} />
            </div>
            <p className="font-semibold text-sm text-[#0D0F1C]">
              No messages yet
            </p>
            <p className="mt-1 max-w-xs text-[#6B7280]">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          messagesList.map((m) => {
            const isMe = m.senderId === currentUserId;
            const senderName = isMe
              ? "You"
              : formatParticipantName(m.sender);

            return (
              <div
                key={m.id}
                className={`group flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Sender name for group chats */}
                {isGroup && !isMe && (
                  <span className="text-[11px] font-semibold text-[#6B7280] mb-1 px-1">
                    {senderName}
                  </span>
                )}

                <div className="flex items-end gap-1.5 max-w-[82%]">
                  {/* Delete message action on hover for current user's messages */}
                  {isMe && !isGroup && (
                    <button
                      type="button"
                      onClick={() => setDeleteMessageTarget(m)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#9CA3AF] hover:text-[#DC2626] rounded transition-all cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs break-words shadow-sm leading-relaxed ${
                      isMe
                        ? "bg-[#3730A3] text-white rounded-br-xs"
                        : "bg-white text-[#0D0F1C] border border-[#E5E7EB] rounded-bl-xs"
                    }`}
                  >
                    <div>{m.message}</div>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isMe ? "text-white/70" : "text-[#9CA3AF]"
                      }`}
                    >
                      {formatMessageTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <form
        onSubmit={handleSendMessage}
        className="px-4 py-3 bg-white border-t border-[#F1F3FB] flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={() =>
            alert(
              "File and media attachment uploads are not supported by the current backend API.",
            )
          }
          className="w-9 h-9 rounded-full bg-[#F3F4F6] text-[#6B7280] hover:text-[#0D0F1C] flex items-center justify-center cursor-pointer transition-colors"
          title="Attach file (not supported by backend)"
        >
          <Paperclip size={16} />
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
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 bg-[#F8F9FD] border border-[#E5E7EB] rounded-full px-4 py-2 text-xs text-[#0D0F1C] outline-none focus:border-[#3730A3] placeholder-[#9CA3AF] disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="w-9 h-9 rounded-full bg-[#3730A3] hover:bg-[#2E2882] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-sm"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin text-white" />
          ) : (
            <Send size={15} />
          )}
        </button>
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
            <h4 className="font-bold text-sm text-[#0D0F1C]">Delete message?</h4>
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
              Are you sure you want to delete this conversation? This action cannot
              be undone.
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
                  deleteGroupMutation.isPending || deleteDirectMutation.isPending
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
    try {
      await updateMutation.mutateAsync({
        groupId,
        payload: { groupName: editName.trim(), description: editDesc.trim() },
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
                <p className="text-xs text-[#6B7280] mt-1">{group.description}</p>
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
                  <form onSubmit={handleUpdate} className="flex flex-col gap-2 mt-2">
                    {editError && (
                      <div className="text-[11px] text-[#DC2626]">{editError}</div>
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
                  const isUserAdmin = m.role === "admin" || m.userId === group.adminId;
                  return (
                    <div
                      key={m.id}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar name={mName} size={28} color="#3730A3" />
                        <span className="font-medium text-[#0D0F1C]">{mName}</span>
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

// ─── NotificationsScreen (Preserved) ─────────────────────────────────────────
export function NotificationsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [notifs, setNotifs] = useState([
    {
      id: "1",
      icon: "💰",
      title: "Savings Reminder",
      body: "Your weekly iPhone goal deposit of ₦7,500 is due today.",
      time: "2m ago",
      color: "#3730A3",
      read: false,
    },
    {
      id: "2",
      icon: "✅",
      title: "KYC Approved",
      body: "Your identity has been verified successfully!",
      time: "1h ago",
      color: "#059669",
      read: false,
    },
    {
      id: "3",
      icon: "📦",
      title: "Product Update",
      body: "Great news! You've paid 50% toward Samsung Galaxy S25.",
      time: "3h ago",
      color: "#7C3AED",
      read: true,
    },
    {
      id: "4",
      icon: "💬",
      title: "New Message",
      body: "Chinwe Okonkwo sent you a message.",
      time: "5h ago",
      color: "#D97706",
      read: true,
    },
    {
      id: "5",
      icon: "🏦",
      title: "Wallet Credited",
      body: "₦50,000 has been added to your wallet.",
      time: "1d ago",
      color: "#059669",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifs((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
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
            onClick={markAllAsRead}
            className="text-sm text-[#3730A3] font-medium cursor-pointer"
          >
            Mark all read
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${
              n.read
                ? "bg-white border border-[#F1F3FB]"
                : "bg-[#EEF2FF] border border-[#C7D2FE]"
            }`}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
              style={{ background: `${n.color}15` }}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0D0F1C]">
                  {n.title}
                </span>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#3730A3] shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                {n.body}
              </p>
              <span className="text-xs text-[#9CA3AF] mt-1 block">
                {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
