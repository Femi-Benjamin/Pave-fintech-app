import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Search,
  ArrowLeft,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  Users,
} from "lucide-react";
import { Avatar } from "../components/UI";
import { Screen, MOCK_MESSAGES } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { MessagesScreenSkeleton } from "../components/Skeleton";

export function MessagesScreen({
  onNav,
  setActiveChat,
}: {
  onNav: (s: Screen) => void;
  setActiveChat: (c: any) => void;
}) {
  const { messages } = useLocalStore();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <MessagesScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col overflow-y-auto"
    >
      <div className="px-6 pt-14 pb-4 bg-white border-b border-[#F1F3FB]">
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Messages
          </h2>
          <button
            onClick={() => onNav("chat")}
            className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center cursor-pointer"
          >
            <Plus size={18} className="text-[#3730A3]" />
          </button>
        </div>
        <div className="bg-[#F1F3FB] rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Search size={16} className="text-[#9CA3AF]" />
          <input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>
      <div className="flex-1">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveChat(m);
              onNav(m.isGroup ? "group-chat" : "chat");
            }}
            className="w-full flex items-center gap-4 px-6 py-4 border-b border-[#F9FAFB] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-left"
          >
            <div className="relative shrink-0">
              <Avatar
                name={m.name}
                size={48}
                color={m.isGroup ? "#7C3AED" : "#3730A3"}
              />
              {m.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#059669] rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#0D0F1C]">
                    {m.name}
                  </span>
                  {m.isGroup && <Users size={12} className="text-[#9CA3AF]" />}
                </div>
                <span className="text-xs text-[#9CA3AF]">{m.time}</span>
              </div>
              <div className="text-sm text-[#9CA3AF] truncate mt-0.5">
                {m.lastMsg}
              </div>
            </div>
            {m.unread > 0 && (
              <div
                className="w-5 h-5 rounded-full bg-[#3730A3] flex items-center justify-center text-white shrink-0"
                style={{ fontSize: 11 }}
              >
                {m.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function ChatScreen({
  onNav,
  chat,
}: {
  onNav: (s: Screen) => void;
  chat?: any;
}) {
  const { messages, chatMessages, sendMessage } = useLocalStore();
  const c = chat || messages[0] || MOCK_MESSAGES[0];
  const [msg, setMsg] = useState("");
  const send = () => {
    if (!msg.trim()) return;
    sendMessage(c.name, msg);
    setMsg("");
  };
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#F1F3FB]">
        <button
          onClick={() => onNav("messages")}
          className="w-8 h-8 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="relative">
          <Avatar name={c.name} size={38} color="#3730A3" />
          {c.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#059669] rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{c.name}</div>
          <div className="text-xs text-[#059669]">
            {c.online ? "Online" : "Last seen 2h ago"}
          </div>
        </div>
        <button className="cursor-pointer">
          <MoreHorizontal size={20} className="text-[#9CA3AF]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {chatMessages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.from === "me" ? "bg-[#3730A3] text-white rounded-br-md" : "bg-white text-[#0D0F1C] border border-[#F1F3FB] rounded-bl-md"}`}
            >
              {m.text}
              <div
                className={`text-xs mt-1 ${m.from === "me" ? "text-white/60" : "text-[#9CA3AF]"}`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 bg-white border-t border-[#F1F3FB] flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer">
          <Paperclip size={16} className="text-[#9CA3AF]" />
        </button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 bg-[#F1F3FB] rounded-full px-4 py-2.5 text-sm outline-none"
        />
        <button className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer">
          <Smile size={16} className="text-[#9CA3AF]" />
        </button>
        <button
          onClick={send}
          className="w-9 h-9 rounded-full bg-[#3730A3] flex items-center justify-center cursor-pointer"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}

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
    {
      id: "6",
      icon: "📅",
      title: "Group Contribution Due",
      body: "PAVE Community Thrift contribution is due in 3 days.",
      time: "2d ago",
      color: "#3730A3",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifs((current) => current.map((notification) => ({ ...notification, read: true })));
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
            className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${n.read ? "bg-white border border-[#F1F3FB]" : "bg-[#EEF2FF] border border-[#C7D2FE]"}`}
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
