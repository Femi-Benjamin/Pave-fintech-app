import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Zap,
  Phone,
  Plus,
  Bell,
  Eye,
  EyeOff,
  Landmark,
  Copy,
  ArrowDownLeft,
  RotateCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Logo from "../components/Logo";
import { Badge } from "../components/UI";
import { Screen, SPEND_DATA, fmt, pct } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { HomeScreenSkeleton } from "../components/Skeleton";

export function HomeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { walletBalance, transactions, savings } = useLocalStore();
  const [balVisible, setBalVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 650);
  };

  const quickActions = [
    {
      icon: <ArrowUpRight size={20} />,
      label: "Transfer",
      color: "#3730A3",
      bg: "#EEF2FF",
      screen: "transfer",
    },
    {
      icon: <Zap size={20} />,
      label: "Bills",
      color: "#059669",
      bg: "#ECFDF5",
      screen: "bills",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime",
      color: "#D97706",
      bg: "#FFFBEB",
      screen: "airtime",
    },
    {
      icon: <Plus size={20} />,
      label: "Fund",
      color: "#7C3AED",
      bg: "#F5F3FF",
      screen: "fund-wallet",
    },
  ];

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6"
    >
      {/* Top Welcome Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Logo size="sm" showText={false} />
          </div>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-[#0D0F1C]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Welcome back, Joe 👋
            </h1>
            <p className="text-sm text-[#6B7280]">
              Here's what's happening with your finances today.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRefresh}
            title="Refresh finances"
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#F9FAFB] text-[#6B7280] hover:text-[#3730A3] transition-colors"
          >
            <RotateCw size={16} />
          </button>
          <button
            onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#F9FAFB]"
          >
            <Bell size={18} className="text-[#374151]" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#D97706] rounded-full" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2 columns on lg (8 cols and 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Balance + Quick Actions + Savings + Recent Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Wallet Balance Card */}
          <div
            style={{
              background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
            }}
            className="p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm font-medium">
                Total Wallet Balance
              </span>
              <button
                onClick={() => setBalVisible(!balVisible)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                {balVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div
              className="text-white mb-6"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 800,
                fontSize: 36,
                letterSpacing: "-0.5px",
              }}
            >
              {balVisible ? fmt(walletBalance) : "₦ ••••••••"}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-white/70" />
                <span className="text-white/70 text-xs">Virtual Account:</span>
                <span className="text-white text-xs font-mono font-bold">
                  9031 204 8871
                </span>
                <button className="text-white/70 hover:text-white cursor-pointer ml-1">
                  <Copy size={13} />
                </button>
              </div>
              <span className="text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full">
                Wema Bank • PAVE
              </span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-4">
              Quick Financial Actions
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => onNav(a.screen as Screen)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform hover:scale-105"
                    style={{ background: a.bg, color: a.color }}
                  >
                    {a.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-[#374151] font-semibold">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* My Savings Section (2 columns on tablet/desktop) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-lg font-bold text-[#0D0F1C]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  My Savings Goals
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Active discipline targets
                </p>
              </div>
              <button
                onClick={() => onNav("savings")}
                className="text-xs text-[#3730A3] font-bold hover:underline cursor-pointer"
              >
                View all ({savings.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savings.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNav("savings-detail")}
                  className="bg-[#F7F8FF] rounded-2xl p-4 border border-[#F1F3FB] hover:border-[#C7D2FE] transition-all text-left cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="text-sm font-bold text-[#0D0F1C]">
                          {s.name}
                        </div>
                        <div className="text-xs text-[#9CA3AF]">{s.freq}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#0D0F1C]">
                        {fmt(s.current)}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        of {fmt(s.goal)}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct(s.current, s.goal)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#9CA3AF]">
                    <span className="font-semibold text-[#3730A3]">
                      {pct(s.current, s.goal)}% reached
                    </span>
                    <span>{s.daysLeft} days left</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-bold text-[#0D0F1C]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Recent Transactions
              </h3>
              <button
                onClick={() => onNav("transactions")}
                className="text-xs text-[#3730A3] font-bold hover:underline cursor-pointer"
              >
                See all activity
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {transactions.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl flex items-center justify-between hover:bg-[#F7F8FF] transition-colors border border-transparent hover:border-[#F1F3FB]"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5]" : "bg-[#F3F4F6]"}`}
                    >
                      {t.type === "credit" ? (
                        <ArrowDownLeft size={18} className="text-[#059669]" />
                      ) : (
                        <ArrowUpRight size={18} className="text-[#6B7280]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0D0F1C]">
                        {t.desc}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        {t.date} • {t.category}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C]"}`}
                  >
                    {t.type === "credit" ? "+" : "-"}
                    {fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on lg): Spending Chart + Community Thrift */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Spending Analysis Chart Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-bold text-base text-[#0D0F1C]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Weekly Spending
              </h3>
              <Badge color="indigo">June 2024</Badge>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={SPEND_DATA}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3730A3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3730A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: any) => `₦${Number(v).toLocaleString()}`}
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3730A3"
                  strokeWidth={2.5}
                  fill="url(#spendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Community Thrift Summary Card */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-bold text-base text-[#0D0F1C]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Community Thrift
              </h3>
              <Badge color="green">Active</Badge>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F8FF] border border-[#F1F3FB] mb-4">
              <div className="font-bold text-sm text-[#0D0F1C]">
                PAVE Community Thrift
              </div>
              <div className="text-xs text-[#6B7280] mt-0.5">
                24 members • Admin: Okonkwo Group
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-[#6B7280]">Target: ₦1,000,000</span>
                <span className="font-bold text-[#3730A3]">68%</span>
              </div>
              <div className="h-1.5 bg-white rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-[#3730A3] rounded-full w-[68%]" />
              </div>
            </div>
            <button
              onClick={() => onNav("savings-programs")}
              className="w-full py-3 rounded-xl border border-[#3730A3] text-[#3730A3] text-xs font-bold hover:bg-[#EEF2FF] transition-colors cursor-pointer"
            >
              Manage Thrift Circles
            </button>
          </div>

          {/* Marketplace Promo Card */}
          <div
            className="rounded-2xl p-5 text-white shadow-md"
            style={{
              background: "linear-gradient(145deg, #3730A3 0%, #1E1B4B 100%)",
            }}
          >
            <div className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">
              BNPL Marketplace
            </div>
            <div
              className="font-bold text-base mb-2"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Pay 50% Down, Own Today
            </div>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Get top electronics, home essentials, and fashion with flexible
              installments.
            </p>
            <button
              onClick={() => onNav("marketplace")}
              className="bg-white text-[#3730A3] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors cursor-pointer"
            >
              Explore Marketplace →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
