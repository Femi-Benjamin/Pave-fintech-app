import React, { useState } from "react";
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
  ArrowDownLeft,
  RotateCw,
} from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Logo, { BrandText } from "../components/Logo";
import { Badge } from "../components/UI";
import { Screen, fmt, pct } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { Skeleton } from "../components/Skeleton";
import {
  useAllTransactionsQuery,
  useSavingsQuery,
  useWalletBalanceQuery,
} from "../hooks/usePaveApi";
import { useGroupSavingsQuery } from "../hooks/useGroupSavingApi";
import type { TransactionRecord } from "../api/transactions";
import type { Saving } from "../api/savings";
import { isGroupSavingMember } from "../api/groupSaving";
import {
  getApiErrorMessage,
  getAuthenticatedUserEmail,
  getAuthenticatedUserId,
} from "../api/auth";

function homeTransaction(record: TransactionRecord, index: number) {
  const kind =
    `${record.transactionType ?? ""} ${record.type ?? ""}`.toLowerCase();
  const type =
    kind.includes("credit") || kind.includes("deposit") ? "credit" : "debit";
  const description =
    `${record.destination ?? ""} ${record.description ?? ""} ${record.type ?? ""}`.toLowerCase();
  const category = description.includes("saving")
    ? "savings"
    : description.includes("bill")
      ? "bills"
      : description.includes("airtime")
        ? "airtime"
        : description.includes("transfer")
          ? "transfer"
          : "wallet";

  return {
    id: record.id ?? record._id ?? record.reference ?? `transaction-${index}`,
    type,
    desc: record.description ?? record.type ?? "Transaction",
    amount: Number(record.amount) || 0,
    date: record.createdAt
      ? new Date(record.createdAt).toLocaleDateString()
      : "",
    category,
  };
}

function getWeeklySpending(transactions: TransactionRecord[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      date,
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      amount: 0,
    };
  });
  const amountsByDay = new Map(days.map((day) => [day.key, day]));

  transactions.forEach((transaction) => {
    const status = transaction.status?.toLowerCase();
    if (!status || !["success", "successful", "completed"].includes(status)) {
      return;
    }

    const kind =
      `${transaction.transactionType ?? ""} ${transaction.type ?? ""}`.toLowerCase();
    if (kind.includes("credit") || kind.includes("deposit")) return;

    const createdAt = transaction.createdAt
      ? new Date(transaction.createdAt)
      : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDate()}`;
    const day = amountsByDay.get(key);
    if (day) day.amount += Number(transaction.amount) || 0;
  });

  return days.map(({ day, amount }) => ({ day, amount }));
}

export function HomeScreen({
  onNav,
  onSelectGroup,
  onSelectSaving,
}: {
  onNav: (s: Screen) => void;
  onSelectGroup: (groupId: string) => void;
  onSelectSaving: (savingId: string) => void;
}) {
  const { authUser } = useLocalStore();
  const currentUserId = getAuthenticatedUserId(authUser);
  const userEmail = getAuthenticatedUserEmail(authUser);
  const walletBalanceQuery = useWalletBalanceQuery();
  const savingsQuery = useSavingsQuery();
  const groupSavingsQuery = useGroupSavingsQuery();
  const transactionsQuery = useAllTransactionsQuery();
  const savings = savingsQuery.data?.data.savings ?? [];
  const groupSavings = (groupSavingsQuery.data?.data ?? []).filter((group) =>
    isGroupSavingMember(group, currentUserId, userEmail),
  );
  const transactions =
    transactionsQuery.data?.transactions.map(homeTransaction) ?? [];
  const weeklySpending = getWeeklySpending(
    transactionsQuery.data?.transactions ?? [],
  );
  const hasWeeklySpending = weeklySpending.some((day) => day.amount > 0);
  const walletBalance = walletBalanceQuery.data
    ? Number(walletBalanceQuery.data.balance)
    : null;
  const [balVisible, setBalVisible] = useState(true);
  const firstName =
    authUser?.firstName?.trim() ||
    authUser?.fullName?.trim().split(" ")[0] ||
    "there";

  const handleRefresh = () => {
    void Promise.all([
      walletBalanceQuery.refetch(),
      savingsQuery.refetch(),
      groupSavingsQuery.refetch(),
      transactionsQuery.refetch(),
    ]);
  };

  const quickActions = [
    {
      icon: <Plus size={20} />,
      label: "Fund",
      color: "#7C3AED",
      bg: "#F5F3FF",
      screen: "fund-wallet",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime",
      color: "#7C3AED",
      bg: "#F5F3FF",
      screen: "airtime",
    },
    {
      icon: <Zap size={20} />,
      label: "Bills",
      color: "#059669",
      bg: "#ECFDF5",
      screen: "bills",
    },
    {
      icon: <ArrowUpRight size={20} />,
      label: "Transfer",
      color: "#3730A3",
      bg: "#EEF2FF",
      screen: "transfer",
      disabled: true,
    },
  ];

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
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
              {`Welcome, ${firstName} 👋`}
            </h1>
            {/* <p className="hidden sm:block text-sm text-[#6B7280]">
              Here's what's happening with your finances today.
            </p> */}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* <button
            onClick={handleRefresh}
            title="Refresh finances"
            className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-[#E5E7EB] items-center justify-center cursor-pointer shadow-xs hover:bg-[#F9FAFB] text-[#6B7280] hover:text-[#3730A3] transition-colors"
          >
            <RotateCw size={16} />
          </button> */}
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
              {walletBalanceQuery.isLoading && balVisible ? (
                <Skeleton dark className="h-10 w-56 rounded-xl" />
              ) : balVisible ? (
                walletBalance === null ? (
                  "Unavailable"
                ) : (
                  fmt(walletBalance)
                )
              ) : (
                "₦ ••••••••"
              )}
            </div>
            {walletBalanceQuery.isError && (
              <p role="alert" className="mb-3 text-xs text-white">
                {getApiErrorMessage(
                  walletBalanceQuery.error,
                  "Unable to load your wallet balance.",
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-white/70" />
                <span className="text-white/70 text-xs">Virtual Account:</span>
                <p className="text-white text-xs font-mono font-bold">
                  View details in Wallet
                </p>
              </div>
              <span className="text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                Wema Bank • <BrandText variant="light" className="text-[10px]" />
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
                  disabled={a.disabled}
                  aria-disabled={a.disabled || undefined}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-colors ${
                    a.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-[#F9FAFB] cursor-pointer"
                  }`}
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform ${
                      a.disabled ? "" : "hover:scale-105"
                    }`}
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

          {/* Personal Savings Goals */}
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
                  Your personal savings progress
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
              {savings.slice(0, 2).map((saving: Saving) => (
                <button
                  key={saving.id}
                  onClick={() => {
                    onSelectSaving(saving.id);
                    onNav("savings-detail");
                  }}
                  className="bg-white rounded-2xl p-4 border border-[#CBD5E1] hover:border-[#3730A3]/30 transition-all text-left cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3 gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm sm:text-base font-bold text-[#0F172A]">
                        {saving.name}
                      </div>
                      <div className="mt-1 text-xs sm:text-sm font-semibold capitalize text-[#475569]">
                        {saving.frequency}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm sm:text-base font-bold text-[#0F172A]">
                        {fmt(Number(saving.totalSaved) || 0)}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#475569]">
                        of {fmt(Number(saving.targetAmount) || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          Number(saving.targetAmount) > 0
                            ? pct(
                                Number(saving.totalSaved),
                                Number(saving.targetAmount),
                              )
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#059669]"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-[#334155]">
                    <span className="font-bold text-[#059669]">
                      {Number(saving.targetAmount) > 0
                        ? pct(
                            Number(saving.totalSaved),
                            Number(saving.targetAmount),
                          )
                        : 0}
                      % saved
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold capitalize">
                      {saving.status ?? "active"}
                    </span>
                  </div>
                </button>
              ))}
              {savingsQuery.isLoading &&
                [1, 2].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#F1F3FB] p-4"
                  >
                    <Skeleton className="mb-3 h-4 w-2/3 rounded-md" />
                    <Skeleton className="mb-4 h-3 w-1/2 rounded-md" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              {savingsQuery.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getApiErrorMessage(
                    savingsQuery.error,
                    "Unable to load your savings goals.",
                  )}
                </p>
              )}
              {!savingsQuery.isLoading &&
                !savingsQuery.isError &&
                savings.length === 0 && (
                  <p className="text-sm text-[#6B7280]">
                    You don't have any savings goals yet.
                  </p>
                )}
            </div>
          </div>

          {/* My AJO Groups */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="text-lg font-bold text-[#0D0F1C]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  My AJO Groups
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Group balances and progress
                </p>
              </div>
              <button
                onClick={() => onNav("group-savings")}
                className="text-xs text-[#3730A3] font-bold hover:underline cursor-pointer"
              >
                View all ({groupSavings.length})
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupSavings.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectGroup(s.id);
                    onNav("group-saving-detail");
                  }}
                  className="bg-white rounded-2xl p-4 border border-[#CBD5E1] hover:border-[#3730A3]/30 transition-all text-left cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#3730A3] font-bold text-base border border-[#C7D2FE]">
                        {s.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm sm:text-base font-bold text-[#0F172A]">
                          {s.name}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold capitalize text-[#475569]">
                          {s.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-bold text-[#0F172A]">
                        {fmt(Number(s.currentBalance) || 0)}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#475569]">
                        of {fmt(Number(s.targetAmount) || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          Number(s.targetAmount) > 0
                            ? pct(
                                Number(s.currentBalance),
                                Number(s.targetAmount),
                              )
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "#3730A3" }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-[#334155]">
                    <span className="font-bold text-[#3730A3]">
                      {Number(s.targetAmount) > 0
                        ? pct(Number(s.currentBalance), Number(s.targetAmount))
                        : 0}
                      % reached
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-[#3730A3] border border-[#C7D2FE] rounded-md text-[11px] font-bold capitalize">
                      {s.status ?? "active"}
                    </span>
                  </div>
                </button>
              ))}
              {groupSavingsQuery.isLoading &&
                [1, 2].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#F1F3FB] p-4"
                  >
                    <Skeleton className="h-4 w-2/3 rounded-md mb-3" />
                    <Skeleton className="h-3 w-1/2 rounded-md mb-4" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              {groupSavingsQuery.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getApiErrorMessage(
                    groupSavingsQuery.error,
                    "Unable to load your AJO groups.",
                  )}
                </p>
              )}
              {!groupSavingsQuery.isLoading &&
                !groupSavingsQuery.isError &&
                groupSavings.length === 0 && (
                  <p className="text-sm text-[#6B7280]">
                    You haven't joined any AJO groups yet. Join with an
                    invitation code to see your groups here.
                  </p>
                )}
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
              {transactionsQuery.isLoading &&
                [1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 py-2">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-2/3 rounded-md mb-2" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                ))}
              {transactionsQuery.isError && (
                <p role="alert" className="text-sm text-red-600">
                  {getApiErrorMessage(
                    transactionsQuery.error,
                    "Unable to load recent transactions.",
                  )}
                </p>
              )}
              {!transactionsQuery.isLoading &&
                !transactionsQuery.isError &&
                transactions.length === 0 && (
                  <p className="text-sm text-[#6B7280]">
                    No recent transactions.
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on lg): Spending Chart + Marketplace */}
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
              <Badge color="indigo">Last 7 days</Badge>
            </div>
            {transactionsQuery.isLoading ? (
              <div
                className="flex h-40 items-center justify-center text-sm text-[#6B7280]"
                role="status"
              >
                Loading spending...
              </div>
            ) : transactionsQuery.isError ? (
              <div
                className="flex h-40 items-center justify-center text-center text-sm text-red-600"
                role="alert"
              >
                {getApiErrorMessage(
                  transactionsQuery.error,
                  "Unable to load weekly spending.",
                )}
              </div>
            ) : hasWeeklySpending ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={weeklySpending}>
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
                    formatter={(value) =>
                      `₦${Number(value ?? 0).toLocaleString()}`
                    }
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
            ) : (
              <div className="flex h-40 items-center justify-center text-center text-sm text-[#6B7280]">
                No successful spending in the last 7 days.
              </div>
            )}
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
              Secure by paying small small
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
    </div>
  );
}
