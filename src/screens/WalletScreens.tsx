import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreHorizontal,
  Plus,
  Send,
  Zap,
  Phone,
  QrCode,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle,
  CheckCircle2,
  X,
  Search,
  ChevronRight,
  MessageSquare,
  Hash,
  DollarSign,
  Loader,
  BarChart2,
  RotateCw,
  Copy,
} from "lucide-react";
import { PaveBtn, Input, Badge, ScreenHeader, Avatar } from "../components/UI";
import { Screen, Transaction, fmt } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { Skeleton } from "../components/Skeleton";
import { getApiErrorMessage } from "../api/auth";
import {
  useAllTransactionsQuery,
  useBuyAirtimeMutation,
  useBuyDataMutation,
  useBuyElectricityMutation,
  useBuyTvSubscriptionMutation,
  useDataDetailsQuery,
  useDedicationVirtualAccountQuery,
  useFundWalletMutation,
  useSearchUserTransactionsQuery,
  useTvSubscriptionDetailsQuery,
  useTransactionByIdQuery,
  useVerifyElectricityAccountQuery,
  useVerifyTvAccountQuery,
  useWalletBalanceQuery,
} from "../hooks/usePaveApi";
import type {
  TransactionRecord,
  UserTransactionSearchParams,
} from "../api/transactions";

function toWalletTransaction(
  transaction: TransactionRecord,
  index: number,
): Transaction {
  const transactionKind =
    `${transaction.transactionType ?? ""} ${transaction.type ?? ""}`.toLowerCase();
  const type: Transaction["type"] =
    transactionKind.includes("credit") ||
    transactionKind.includes("fund") ||
    transactionKind.includes("deposit")
      ? "credit"
      : "debit";

  const categoryText =
    `${transaction.destination ?? ""} ${transaction.type ?? ""} ${transaction.description ?? ""}`.toLowerCase();
  const category: Transaction["category"] = categoryText.includes("saving")
    ? "savings"
    : categoryText.includes("bill") || categoryText.includes("electricity")
      ? "bills"
      : categoryText.includes("airtime") || categoryText.includes("data")
        ? "airtime"
        : categoryText.includes("transfer")
          ? "transfer"
          : categoryText.includes("market") || categoryText.includes("purchase")
            ? "marketplace"
            : "wallet";
  const normalizedStatus = transaction.status?.toLowerCase() ?? "";
  const status: Transaction["status"] = normalizedStatus.includes("success")
    ? "success"
    : normalizedStatus.includes("pending")
      ? "pending"
      : "failed";
  const createdAt = transaction.createdAt;
  const parsedDate = createdAt ? new Date(createdAt) : undefined;

  return {
    id:
      transaction.id ??
      transaction._id ??
      transaction.reference ??
      `transaction-${index}`,
    type,
    desc: transaction.description ?? transaction.type ?? "Transaction",
    amount: Number(transaction.amount) || 0,
    date:
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString()
        : (createdAt ?? ""),
    category,
    status,
  };
}

export function WalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { authUser } = useLocalStore();
  const virtualAccountQuery = useDedicationVirtualAccountQuery(true);
  const [showVirtualAccount, setShowVirtualAccount] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [accountNotification, setAccountNotification] = useState<string | null>(null);
  const [liveAccountNumber, setLiveAccountNumber] = useState("");
  const [liveBankName, setLiveBankName] = useState("");
  const walletBalanceQuery = useWalletBalanceQuery();
  const transactionsQuery = useAllTransactionsQuery();
  const transactions =
    transactionsQuery.data?.transactions.map(toWalletTransaction) ?? [];
  const displayedBalance = walletBalanceQuery.data
    ? Number(walletBalanceQuery.data.balance)
    : null;

  // Retrieve cached virtual account from localStorage if previously discovered
  const savedAccountNum =
    typeof window !== "undefined"
      ? localStorage.getItem("pave_virtual_account_number") || ""
      : "";
  const savedBankName =
    typeof window !== "undefined"
      ? localStorage.getItem("pave_virtual_bank_name") || "Wema Bank"
      : "Wema Bank";

  const rawVAccount =
    virtualAccountQuery.data?.data ||
    (virtualAccountQuery.data as any)?.virtualAccount ||
    (virtualAccountQuery.data as any);

  // Parse backend responses where account details are delivered in message strings
  // e.g. "You already had an account: 9817600139, Wema Bank"
  const potentialMessages = [
    typeof virtualAccountQuery.data?.message === "string"
      ? virtualAccountQuery.data.message
      : "",
    typeof (virtualAccountQuery.data as any)?.msg === "string"
      ? (virtualAccountQuery.data as any).msg
      : "",
    typeof rawVAccount === "string" ? rawVAccount : "",
    typeof (virtualAccountQuery.error as any)?.response?.data?.message === "string"
      ? (virtualAccountQuery.error as any).response.data.message
      : "",
    typeof (virtualAccountQuery.error as any)?.message === "string"
      ? (virtualAccountQuery.error as any).message
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  let parsedNumFromMsg = "";
  let parsedBankFromMsg = "";
  if (potentialMessages) {
    const numMatch = potentialMessages.match(/\b\d{10}\b/);
    if (numMatch) {
      parsedNumFromMsg = numMatch[0];
    }
    if (/wema/i.test(potentialMessages)) {
      parsedBankFromMsg = "Wema Bank";
    } else {
      const bankMatch = potentialMessages.match(/,\s*([A-Za-z0-9\s]+(?:Bank)?)/i);
      if (bankMatch && bankMatch[1] && bankMatch[1].trim().length < 30) {
        parsedBankFromMsg = bankMatch[1].trim();
      }
    }
  }

  const extractedAccountNumber =
    liveAccountNumber ||
    (typeof rawVAccount === "object" && rawVAccount !== null
      ? rawVAccount.accountNumber ||
        rawVAccount.account_number ||
        rawVAccount.accountNo ||
        rawVAccount.virtualAccountNumber
      : "") ||
    parsedNumFromMsg ||
    savedAccountNum ||
    "";

  const extractedBankName =
    liveBankName ||
    (typeof rawVAccount === "object" && rawVAccount !== null
      ? rawVAccount.bankName || rawVAccount.bank_name
      : "") ||
    parsedBankFromMsg ||
    savedBankName ||
    "Wema Bank";

  const extractedAccountName =
    (typeof rawVAccount === "object" && rawVAccount !== null
      ? rawVAccount.accountName || rawVAccount.account_name
      : "") ||
    authUser?.fullName ||
    [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") ||
    "PAVE Customer";

  // When backend indicates user already has an account, treat that as success, not an error
  const isAccountAlreadyExists =
    potentialMessages.toLowerCase().includes("already had an account") ||
    potentialMessages.toLowerCase().includes("already exists") ||
    potentialMessages.toLowerCase().includes("account already") ||
    potentialMessages.toLowerCase().includes("already");

  const shouldShowVirtualAccountError =
    virtualAccountQuery.isError &&
    !isAccountAlreadyExists &&
    !extractedAccountNumber &&
    !potentialMessages.toLowerCase().includes("already");

  // Cache to localStorage once discovered
  useEffect(() => {
    if (extractedAccountNumber && typeof window !== "undefined") {
      localStorage.setItem("pave_virtual_account_number", extractedAccountNumber);
      if (extractedBankName) {
        localStorage.setItem("pave_virtual_bank_name", extractedBankName);
      }
    }
  }, [extractedAccountNumber, extractedBankName]);

  const handleCopyAccountNumber = (accNum: string) => {
    if (!accNum) return;
    navigator.clipboard
      .writeText(accNum)
      .then(() => {
        setCopiedAccount(true);
        setAccountNotification(`Account number ${accNum} copied to clipboard!`);
        window.setTimeout(() => setCopiedAccount(false), 2500);
        window.setTimeout(() => setAccountNotification(null), 3500);
      })
      .catch(() => {});
  };

  const handleRefresh = () => {
    void Promise.all([
      walletBalanceQuery.refetch(),
      transactionsQuery.refetch(),
      virtualAccountQuery.refetch(),
    ]);
  };

  const moneyIn = transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.amount, 0);
  const moneyOut = transactions
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => acc + t.amount, 0);

  const actions = [
    {
      icon: <Plus size={20} />,
      label: "Fund",
      screen: "fund-wallet",
      color: "#3730A3",
      bg: "#EEF2FF",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime & Data",
      screen: "airtime",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      icon: <Send size={20} />,
      label: "Transfer",
      screen: "transfer",
      color: "#059669",
      bg: "#ECFDF5",
      disabled: true,
    },
    {
      icon: <Landmark size={20} />,
      label: "Virtual account",
      screen: "wallet",
      color: "#0891B2",
      bg: "#ECFEFF",
    },
    {
      icon: <Zap size={20} />,
      label: "Pay Bills",
      screen: "bills",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      icon: <QrCode size={20} />,
      label: "QR Pay",
      screen: "wallet",
      color: "#DB2777",
      bg: "#FDF2F8",
      disabled: true,
    },
  ];
  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Toast Notification for User */}
      <AnimatePresence>
        {accountNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] bg-[#0891B2] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={18} className="shrink-0 text-[#CFFAFE]" />
            <p className="text-xs font-medium flex-1 leading-snug">
              {accountNotification}
            </p>
            <button
              type="button"
              onClick={() => setAccountNotification(null)}
              className="text-white/80 hover:text-white cursor-pointer p-1"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          background: "linear-gradient(145deg, #059669 0%, #047857 100%)",
        }}
        className="px-6 pt-14 pb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="mb-4 text-[22px] font-bold text-white md:text-[28px]">
            My Wallet
          </h2>
        </div>
        <div className="text-white/70 text-md mb">Available Balance</div>
        <div
          className="text-white mb-2 text-md"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 36,
          }}
        >
          {walletBalanceQuery.isLoading ? (
            <Skeleton dark className="h-10 w-56 rounded-xl" />
          ) : displayedBalance === null ? (
            "Unavailable"
          ) : (
            fmt(displayedBalance)
          )}
        </div>
        {walletBalanceQuery.isError && (
          <p role="alert" className="mb-3 text-xs text-white">
            {getApiErrorMessage(
              walletBalanceQuery.error,
              "Unable to refresh your wallet balance.",
            )}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 bg-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <Landmark size={14} className="text-white/70 shrink-0" />
            <span className="text-white/70 text-[11px] sm:text-xs shrink-0">
              {extractedBankName} / PAVE:{" "}
            </span>
            <span className="text-white text-[11px] sm:text-xs font-mono font-semibold truncate">
              {virtualAccountQuery.isFetching && !extractedAccountNumber
                ? "Loading account..."
                : extractedAccountNumber || "Tap 'Virtual account' to view"}
            </span>
          </div>
          {extractedAccountNumber ? (
            <button
              type="button"
              onClick={() => handleCopyAccountNumber(extractedAccountNumber)}
              className="shrink-0 text-[11px] text-white bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedAccount ? <Check size={12} /> : <Copy size={12} />}
              {copiedAccount ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F3FB]">
          <div className="grid grid-cols-3 gap-4">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  if (a.label.toLowerCase().includes("virtual")) {
                    setShowVirtualAccount(true);
                    void virtualAccountQuery
                      .refetch()
                      .then((res) => {
                        const resMsg = [
                          typeof res.data?.message === "string" ? res.data.message : "",
                          typeof (res.data as any)?.msg === "string" ? (res.data as any).msg : "",
                          typeof res.data?.data === "string" ? res.data.data : "",
                        ].filter(Boolean).join(" ");
                        const m = resMsg.match(/\b\d{10}\b/);
                        const accNum =
                          (typeof res.data?.data === "object" && res.data?.data !== null
                            ? (res.data?.data as any).accountNumber || (res.data?.data as any).account_number
                            : null) ||
                          (m ? m[0] : extractedAccountNumber);

                        let bName = extractedBankName;
                        if (/wema/i.test(resMsg)) {
                          bName = "Wema Bank";
                        } else if (
                          typeof res.data?.data === "object" &&
                          res.data?.data !== null &&
                          (res.data?.data as any).bankName
                        ) {
                          bName = (res.data?.data as any).bankName;
                        }

                        if (accNum) {
                          setLiveAccountNumber(accNum);
                          setLiveBankName(bName);
                          localStorage.setItem("pave_virtual_account_number", accNum);
                          localStorage.setItem("pave_virtual_bank_name", bName);
                          setAccountNotification(
                            `Virtual account active: ${accNum} (${bName})`,
                          );
                          window.setTimeout(() => setAccountNotification(null), 4000);
                        } else {
                          setAccountNotification("Virtual account active");
                          window.setTimeout(() => setAccountNotification(null), 3000);
                        }
                      })
                      .catch((err) => {
                        const errMsg = [
                          typeof err?.response?.data?.message === "string" ? err.response.data.message : "",
                          typeof err?.message === "string" ? err.message : "",
                        ].filter(Boolean).join(" ");
                        const numMatch = errMsg.match(/\b\d{10}\b/);
                        const accNum = numMatch ? numMatch[0] : extractedAccountNumber;
                        if (accNum) {
                          setLiveAccountNumber(accNum);
                          localStorage.setItem("pave_virtual_account_number", accNum);
                          setAccountNotification(
                            `Virtual account active: ${accNum} (${extractedBankName})`,
                          );
                          window.setTimeout(() => setAccountNotification(null), 4000);
                        }
                      });
                    return;
                  }
                  onNav(a.screen as Screen);
                }}
                disabled={
                  a.disabled ||
                  (a.label.toLowerCase().includes("virtual") &&
                    virtualAccountQuery.isFetching)
                }
                className={`flex flex-col items-center gap-2 ${
                  a.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: a.bg, color: a.color }}
                >
                  {a.icon}
                </div>
                <span className="text-xs text-[#374151] font-medium text-center leading-tight">
                  {a.label.toLowerCase().includes("virtual") &&
                  virtualAccountQuery.isFetching
                    ? "Loading..."
                    : a.label}
                </span>
              </button>
            ))}
          </div>
          {shouldShowVirtualAccountError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {getApiErrorMessage(
                virtualAccountQuery.error,
                "Unable to load virtual account details.",
              )}
            </p>
          )}

          {/* Dedicated Virtual Account Details Card */}
          {/* Shown only after tapping "Virtual account"; the Hide button closes it. */}
          {showVirtualAccount && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-[#A5F3FC] bg-gradient-to-br from-[#ECFEFF] via-[#F0FDFA] to-[#EFF6FF] p-5 shadow-xs"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0891B2] text-white shadow-xs">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0E7490]">
                      Dedicated Virtual Account
                    </h3>
                    <p className="text-xs text-[#155E75]">
                      Instant funding via Nigerian bank transfer
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualAccount(false)}
                  className="text-[#0E7490] hover:text-[#155E75] text-xs font-semibold cursor-pointer"
                >
                  Hide
                </button>
              </div>

              {virtualAccountQuery.isLoading && (
                <div className="flex items-center gap-2 py-4 text-xs text-[#0E7490]">
                  <Loader size={16} className="animate-spin" />
                  <span>Retrieving your dedicated account number...</span>
                </div>
              )}

              {extractedAccountNumber ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-white p-4 border border-[#CFFAFE] shadow-xs">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                      Bank Name
                    </div>
                    <div className="text-sm font-bold text-[#0F172A] mb-3">
                      {extractedBankName}
                    </div>

                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                      Account Number (NUBAN)
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono text-lg sm:text-2xl font-bold tracking-wider text-[#0891B2] select-all">
                        {extractedAccountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyAccountNumber(extractedAccountNumber)}
                        className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-[#0891B2] px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E7490] active:scale-95 cursor-pointer transition-all whitespace-nowrap"
                      >
                        {copiedAccount ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedAccount ? "Copied!" : "Copy Number"}</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-0.5">
                        Account Name / Beneficiary
                      </div>
                      <div className="text-xs font-semibold text-[#334155]">
                        {extractedAccountName}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    ⚡ Transfer from any Nigerian banking app (GTBank, Zenith, Access, Kuda, OPay, PalmPay, etc.) directly into this 10-digit account number to fund your PAVE wallet instantly.
                  </p>
                </div>
              ) : !virtualAccountQuery.isLoading && (
                <div className="rounded-xl bg-white/80 p-4 text-xs text-[#475569]">
                  <p className="mb-2">Your dedicated virtual account is being provisioned with Wema Bank.</p>
                  <button
                    type="button"
                    onClick={() => void virtualAccountQuery.refetch()}
                    className="font-semibold text-[#0891B2] hover:underline cursor-pointer"
                  >
                    Refresh Account Details
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Money In",
              value: fmt(moneyIn),
              icon: <ArrowDownLeft size={16} />,
              color: "#059669",
              bg: "#ECFDF5",
            },
            {
              label: "Money Out",
              value: fmt(moneyOut),
              icon: <ArrowUpRight size={16} />,
              color: "#DC2626",
              bg: "#FEF2F2",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 border border-[#F1F3FB]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <span className="text-xs text-[#9CA3AF]">{s.label}</span>
              </div>
              <div
                className="font-semibold text-[#0D0F1C]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {transactionsQuery.isLoading ? (
                  <Skeleton className="h-5 w-20 rounded-md" />
                ) : (
                  s.value
                )}
              </div>
              <div className="text-xs text-[#9CA3AF]">This month</div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="mb-6">
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Transaction History
          </h3>
          {transactionsQuery.isError && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {getApiErrorMessage(
                transactionsQuery.error,
                "Unable to load your transactions.",
              )}
            </p>
          )}
          {transactionsQuery.isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB]"
                >
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/3 rounded-md mb-2" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              ))}
            </div>
          )}
          {transactions.length === 0 &&
            !transactionsQuery.isLoading &&
            !transactionsQuery.isError && (
              <p className="text-sm text-[#6B7280]">No transactions found.</p>
            )}
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB]"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5]" : "bg-[#F9FAFB]"}`}
                >
                  {t.type === "credit" ? (
                    <ArrowDownLeft size={18} className="text-[#059669]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0D0F1C] truncate">
                    {t.desc}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {t.date} · {t.category}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C]"}`}
                >
                  {t.type === "credit" ? "+" : "-"}
                  {fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FundWalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [amount, setAmount] = useState("");
  const fundingMutation = useFundWalletMutation();
  const presets = ["5,000", "10,000", "20,000", "50,000", "100,000"];

  const handleFund = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (num > 0) {
      fundingMutation.mutate({ amount: String(num) });
    }
  };
  return (
    <div className="flex-1 flex flex-col h-screen">
      <ScreenHeader title="Fund Wallet" onBack={() => onNav("wallet")} />
      {!fundingMutation.isSuccess ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-md font-medium text-[#374151]">
              Amount (₦)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 24,
              }}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className="px-3 py-1.5 bg-[#EEF2FF] text-[#3730A3] rounded-full text-xs font-medium cursor-pointer"
                >
                  ₦{p}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-[#EEF2FF] p-4 text-sm text-[#3730A3]">
            We’ll create a secure Paystack checkout link to complete your wallet
            funding.
          </div>
          {fundingMutation.isError && (
            <p role="alert" className="text-sm text-red-600">
              {getApiErrorMessage(
                fundingMutation.error,
                "Unable to start wallet funding.",
              )}
            </p>
          )}
          <div className="mt-auto md:pb-10 pb-22">
            <PaveBtn
              onClick={handleFund}
              disabled={
                !amount ||
                Number(amount.replace(/,/g, "")) <= 0 ||
                fundingMutation.isPending
              }
            >
              {fundingMutation.isPending
                ? "Preparing payment..."
                : "Fund Wallet"}
            </PaveBtn>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Complete your ₦{amount} funding
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              {fundingMutation.data.message}
            </p>
          </div>
          {fundingMutation.data.paystackLink && (
            <a
              href={fundingMutation.data.paystackLink}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-xl bg-[#3730A3] px-5 py-4 text-center text-sm font-semibold text-white"
            >
              Continue to payment
            </a>
          )}
          <PaveBtn onClick={() => onNav("wallet")}>Back to Wallet</PaveBtn>
        </div>
      )}
    </div>
  );
}

export function TransferScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { walletBalance, transferMoney } = useLocalStore();
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [found, setFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const recents = [
    { name: "Chinwe Okonkwo", acct: "0123456789", bank: "GTBank" },
    { name: "Adewale Bello", acct: "0987654321", bank: "First Bank" },
  ];
  const lookup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFound(true);
    }, 800);
  };
  const transfer = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (num <= 0) return;
    setLoading(true);
    setTimeout(() => {
      transferMoney(num, "Chinwe Okonkwo", "GTBank", note);
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader
        title="Send Money"
        onBack={() => (step > 1 ? setStep(step - 1) : onNav("wallet"))}
      />
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Transfer Successful!
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              ₦{amount} sent to Chinwe Okonkwo
            </p>
          </div>
          <div className="w-full bg-[#F1F3FB] rounded-2xl p-4 text-sm flex flex-col gap-2">
            {[
              ["Recipient", "Chinwe Okonkwo"],
              ["Amount", `₦${amount}`],
              ["Fee", "₦0.00"],
              ["Reference", "TXN-2024061401"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#6B7280]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <PaveBtn onClick={() => onNav("wallet")}>Done</PaveBtn>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          {step === 1 && (
            <>
              <Input
                label="Account Number or Phone"
                placeholder="0123456789"
                value={recipient}
                onChange={setRecipient}
                icon={<Search size={16} />}
                right={
                  recipient.length >= 10 ? (
                    <button
                      onClick={lookup}
                      className="text-[#3730A3] text-xs font-semibold cursor-pointer"
                    >
                      {loading ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        "Find"
                      )}
                    </button>
                  ) : null
                }
              />
              {found && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#ECFDF5] rounded-2xl p-4 flex items-center gap-3"
                >
                  <Avatar name="Chinwe Okonkwo" size={44} color="#059669" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Chinwe Okonkwo</div>
                    <div className="text-xs text-[#6B7280]">
                      GTBank • 0123456789
                    </div>
                  </div>
                  <Check size={18} className="text-[#059669]" />
                </motion.div>
              )}
              <div>
                <div className="text-sm font-medium text-[#374151] mb-2">
                  Recent Transfers
                </div>
                {recents.map((r) => (
                  <button
                    key={r.acct}
                    onClick={() => {
                      setRecipient(r.acct);
                      setFound(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F1F3FB] transition-colors cursor-pointer"
                  >
                    <Avatar name={r.name} size={40} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-[#9CA3AF]">
                        {r.bank} • {r.acct}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#D1D5DB]" />
                  </button>
                ))}
              </div>
              <div className="mt-auto">
                <PaveBtn onClick={() => setStep(2)} disabled={!found}>
                  Continue
                </PaveBtn>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="bg-[#EEF2FF] rounded-2xl p-4 flex items-center gap-3">
                <Avatar name="Chinwe Okonkwo" size={44} color="#3730A3" />
                <div>
                  <div className="font-semibold text-sm">Chinwe Okonkwo</div>
                  <div className="text-xs text-[#6B7280]">
                    GTBank • 0123456789
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Amount (₦)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 24,
                  }}
                />
              </div>
              <Input
                label="Add a note (optional)"
                placeholder="What's this for?"
                value={note}
                onChange={setNote}
                icon={<MessageSquare size={16} />}
              />
              {amount && (
                <div className="bg-[#F1F3FB] rounded-xl p-3 text-sm flex justify-between">
                  <span className="text-[#6B7280]">
                    New balance after transfer:
                  </span>
                  <span
                    className={`font-semibold ${
                      walletBalance < Number(amount.replace(/,/g, ""))
                        ? "text-red-500"
                        : "text-[#0D0F1C]"
                    }`}
                  >
                    {walletBalance < Number(amount.replace(/,/g, ""))
                      ? "Insufficient balance"
                      : fmt(walletBalance - Number(amount.replace(/,/g, "")))}
                  </span>
                </div>
              )}
              <div className="mt-auto">
                <PaveBtn
                  onClick={transfer}
                  disabled={
                    !amount ||
                    loading ||
                    Number(amount.replace(/,/g, "")) <= 0 ||
                    walletBalance < Number(amount.replace(/,/g, ""))
                  }
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Send ₦${amount || "0"}`
                  )}
                </PaveBtn>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function BillsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selected, setSelected] = useState<"electricity" | "tv" | "">("");
  const [serviceID, setServiceID] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"prepaid" | "postpaid">(
    "prepaid",
  );
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [variationCode, setVariationCode] = useState("");
  const [lookupParams, setLookupParams] = useState<{
    serviceID: string;
    accountNumber: string;
    accountType: "prepaid" | "postpaid";
  } | null>(null);
  const [purchase, setPurchase] = useState<{
    message: string;
    reference?: string;
    token?: string;
  } | null>(null);
  const walletBalanceQuery = useWalletBalanceQuery();
  const tvDetailsQuery = useTvSubscriptionDetailsQuery(
    serviceID,
    selected === "tv",
  );
  const tvLookup = useVerifyTvAccountQuery(
    {
      serviceID: lookupParams?.serviceID ?? "",
      smartcardNumber: lookupParams?.accountNumber ?? "",
    },
    selected === "tv" && lookupParams !== null,
  );
  const electricityLookup = useVerifyElectricityAccountQuery(
    {
      serviceID: lookupParams?.serviceID ?? "",
      meterNumber: lookupParams?.accountNumber ?? "",
      type: lookupParams?.accountType ?? accountType,
    },
    selected === "electricity" && lookupParams !== null,
  );
  const tvPurchaseMutation = useBuyTvSubscriptionMutation();
  const electricityPurchaseMutation = useBuyElectricityMutation();
  const walletBalance = Number(walletBalanceQuery.data?.balance ?? 0);
  const lookupMatchesCurrent =
    lookupParams?.serviceID === serviceID &&
    lookupParams?.accountNumber === accountNumber &&
    (selected !== "electricity" || lookupParams?.accountType === accountType);
  const lookupQuery = selected === "tv" ? tvLookup : electricityLookup;
  const isVerified = lookupMatchesCurrent && lookupQuery.isSuccess;
  const variations = tvDetailsQuery.data?.data.content.variations ?? [];
  const customer = lookupQuery.data?.data.content;
  const providers =
    selected === "tv"
      ? [
          { id: "dstv", label: "DStv" },
          { id: "gotv", label: "GOtv" },
          { id: "startimes", label: "StarTimes" },
        ]
      : [
          { id: "ikeja-electric", label: "Ikeja Electric" },
          { id: "eko-electric", label: "Eko Electric" },
          { id: "abuja-electric", label: "Abuja Electric" },
          { id: "kano-electric", label: "Kano Electric" },
          { id: "portharcourt-electric", label: "Port Harcourt Electric" },
          { id: "jos-electric", label: "Jos Electric" },
          { id: "ibadan-electric", label: "Ibadan Electric" },
          { id: "kaduna-electric", label: "Kaduna Electric" },
          { id: "enugu-electric", label: "Enugu Electric" },
          { id: "benin-electric", label: "Benin Electric" },
        ];
  const tvPackages = [
    { id: "electricity", label: "Electricity", icon: "⚡" },
    { id: "tv", label: "Cable TV", icon: "📺" },
  ];
  const purchaseMutation =
    selected === "tv" ? tvPurchaseMutation : electricityPurchaseMutation;
  const errorMessage = [
    walletBalanceQuery.isError
      ? getApiErrorMessage(
          walletBalanceQuery.error,
          "Unable to load wallet balance.",
        )
      : "",
    tvDetailsQuery.isError
      ? getApiErrorMessage(tvDetailsQuery.error, "Unable to load TV packages.")
      : "",
    lookupQuery.isError
      ? getApiErrorMessage(lookupQuery.error, "Unable to verify this account.")
      : "",
    purchaseMutation.isError
      ? getApiErrorMessage(purchaseMutation.error, "Payment failed.")
      : "",
  ].find(Boolean);
  const clearLookup = () => {
    setLookupParams(null);
    setAmount("");
    setVariationCode("");
  };
  const buyBill = () => {
    const numericAmount = Number(amount.replace(/,/g, ""));
    if (
      !isVerified ||
      !phone.trim() ||
      numericAmount <= 0 ||
      numericAmount > walletBalance ||
      !walletBalanceQuery.data
    ) {
      return;
    }
    const onSuccess = (response: {
      message: string;
      data: {
        reference?: string;
        metadata?: { content?: { transactions?: { token?: string } } };
      };
    }) =>
      setPurchase({
        message: response.message,
        reference: response.data.reference,
        token: response.data.metadata?.content?.transactions?.token,
      });

    if (selected === "tv") {
      tvPurchaseMutation.mutate(
        {
          serviceID,
          smartcardNumber: accountNumber,
          phone,
          amount: numericAmount,
          variation_code: variationCode,
        },
        { onSuccess },
      );
    } else {
      electricityPurchaseMutation.mutate(
        {
          serviceID,
          meterNumber: accountNumber,
          phone,
          amount: numericAmount,
          variation_code: accountType,
        },
        { onSuccess },
      );
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Pay Bills" onBack={() => onNav("wallet")} />
      {!purchase ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            {tvPackages.map((bill) => (
              <button
                key={bill.id}
                onClick={() => {
                  const nextSelected = bill.id as "electricity" | "tv";
                  setSelected(nextSelected);
                  setServiceID(
                    nextSelected === "tv" ? "dstv" : "ikeja-electric",
                  );
                  setAccountNumber("");
                  setPhone("");
                  setLookupParams(null);
                  setAmount("");
                  setVariationCode("");
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected === bill.id ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
              >
                <span className="text-2xl">{bill.icon}</span>
                <span className="text-xs font-medium text-[#374151]">
                  {bill.label}
                </span>
              </button>
            ))}
          </div>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <label className="text-sm font-medium text-[#374151]">
                {selected === "tv" ? "TV provider" : "Distribution company"}
                <select
                  value={serviceID}
                  onChange={(event) => {
                    setServiceID(event.target.value);
                    setAccountNumber("");
                    setPhone("");
                    clearLookup();
                  }}
                  className="mt-1.5 w-full bg-[#F1F3FB] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </label>
              {selected === "electricity" && (
                <label className="text-sm font-medium text-[#374151]">
                  Meter type
                  <select
                    value={accountType}
                    onChange={(event) => {
                      setAccountType(event.target.value as typeof accountType);
                      setLookupParams(null);
                      setAmount("");
                    }}
                    className="mt-1.5 w-full bg-[#F1F3FB] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                  >
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                  </select>
                </label>
              )}
              <Input
                label={
                  selected === "electricity"
                    ? "Meter Number"
                    : "Smartcard Number"
                }
                placeholder={
                  selected === "electricity"
                    ? "Enter meter number"
                    : "Enter smartcard number"
                }
                value={accountNumber}
                onChange={(value: string) => {
                  setAccountNumber(value);
                  setLookupParams(null);
                  setAmount("");
                  setVariationCode("");
                }}
                icon={<Hash size={16} />}
              />
              <PaveBtn
                variant="outline"
                onClick={() => {
                  setLookupParams({
                    serviceID,
                    accountNumber,
                    accountType,
                  });
                  setAmount("");
                  setVariationCode("");
                }}
                disabled={
                  !accountNumber.trim() ||
                  !serviceID ||
                  lookupQuery.isFetching ||
                  !walletBalanceQuery.data
                }
              >
                {lookupQuery.isFetching ? "Verifying..." : "Verify Account"}
              </PaveBtn>
              {lookupQuery.isSuccess && lookupMatchesCurrent && (
                <div className="rounded-xl bg-[#ECFDF5] px-4 py-3 text-sm text-[#047857]">
                  Account verified
                  {customer?.Customer_Name ? `: ${customer.Customer_Name}` : ""}
                  {customer?.Address ? ` · ${customer.Address}` : ""}
                </div>
              )}
              {isVerified && selected === "tv" && (
                <label className="text-sm font-medium text-[#374151]">
                  Subscription package
                  <select
                    value={variationCode}
                    onChange={(event) => {
                      setVariationCode(event.target.value);
                      const plan = variations.find(
                        (item) => item.variation_code === event.target.value,
                      );
                      setAmount(plan?.variation_amount ?? "");
                    }}
                    className="mt-1.5 w-full bg-[#F1F3FB] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3]"
                  >
                    <option value="">Choose a package</option>
                    {variations.map((plan) => (
                      <option
                        key={plan.variation_code}
                        value={plan.variation_code}
                      >
                        {plan.name} · ₦
                        {Number(plan.variation_amount).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {tvDetailsQuery.isLoading && (
                    <span className="mt-1 block text-xs text-[#6B7280]">
                      Loading available packages...
                    </span>
                  )}
                </label>
              )}
              {isVerified && selected === "electricity" && (
                <Input
                  label="Amount (₦)"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={setAmount}
                  icon={<DollarSign size={16} />}
                />
              )}
              {isVerified && (
                <Input
                  label="Phone Number"
                  placeholder="08011111111"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  icon={<Phone size={16} />}
                />
              )}
              {amount && Number(amount.replace(/,/g, "")) > walletBalance && (
                <div className="text-xs text-red-500 font-medium">
                  Insufficient wallet balance ({fmt(walletBalance)})
                </div>
              )}
              {isVerified && (
                <PaveBtn
                  onClick={buyBill}
                  disabled={
                    !phone.trim() ||
                    !amount ||
                    (selected === "tv" && !variationCode) ||
                    Number(amount.replace(/,/g, "")) <= 0 ||
                    Number(amount.replace(/,/g, "")) > walletBalance ||
                    !walletBalanceQuery.data ||
                    purchaseMutation.isPending
                  }
                >
                  {purchaseMutation.isPending ? "Processing..." : "Pay Now"}
                </PaveBtn>
              )}
            </motion.div>
          )}
          {tvDetailsQuery.isLoading && selected === "tv" && (
            <p className="text-sm text-[#6B7280]">Loading TV packages...</p>
          )}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-[#FEF2F2] p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}
          {walletBalanceQuery.data && (
            <p className="text-xs text-[#6B7280]">
              Available balance: {fmt(walletBalance)}
            </p>
          )}
          {!selected && (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <Zap size={40} className="text-[#E5E7EB]" />
              <p className="text-[#9CA3AF] text-sm">
                Choose electricity or cable TV to continue
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Payment Successful
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">{purchase.message}</p>
            {purchase.reference && (
              <p className="text-xs text-[#6B7280] mt-2">
                Reference: {purchase.reference}
              </p>
            )}
            {purchase.token && (
              <p className="text-sm font-semibold text-[#3730A3] mt-3">
                Electricity token: {purchase.token}
              </p>
            )}
          </div>
          <PaveBtn
            onClick={() => {
              setPurchase(null);
              setSelected("");
              setServiceID("");
              setAccountNumber("");
              setPhone("");
              setAmount("");
              setVariationCode("");
              setLookupParams(null);
            }}
          >
            Pay Another Bill
          </PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("wallet")}>
            Back to Wallet
          </PaveBtn>
        </div>
      )}
    </div>
  );
}

export function AirtimeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const walletBalanceQuery = useWalletBalanceQuery();
  const [tab, setTab] = useState<"airtime" | "data">("airtime");
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [variationCode, setVariationCode] = useState("");
  const [purchase, setPurchase] = useState<{
    message: string;
    reference?: string;
  } | null>(null);
  const airtimeMutation = useBuyAirtimeMutation();
  const dataMutation = useBuyDataMutation();
  const airtimeServiceIDs: Record<string, string> = {
    mtn: "mtn",
    airtel: "airtel",
    glo: "glo",
    "9mobile": "etisalat",
  };
  const dataServiceIDs: Record<string, string> = {
    mtn: "mtn-data",
    airtel: "airtel-data",
    glo: "glo-data",
    "9mobile": "etisalat-data",
  };
  const serviceID =
    tab === "data"
      ? (dataServiceIDs[network] ?? "")
      : (airtimeServiceIDs[network] ?? "");
  const dataDetailsQuery = useDataDetailsQuery(serviceID, tab === "data");
  const variations = dataDetailsQuery.data?.data.content.variations ?? [];
  const walletBalance = Number(walletBalanceQuery.data?.balance ?? 0);
  const purchaseMutation = tab === "airtime" ? airtimeMutation : dataMutation;
  const errorMessage = [
    walletBalanceQuery.isError
      ? getApiErrorMessage(
          walletBalanceQuery.error,
          "Unable to load wallet balance.",
        )
      : "",
    dataDetailsQuery.isError
      ? getApiErrorMessage(
          dataDetailsQuery.error,
          "Unable to load data bundles.",
        )
      : "",
    purchaseMutation.isError
      ? getApiErrorMessage(purchaseMutation.error, "Purchase failed.")
      : "",
  ].find(Boolean);
  const networks = [
    {
      id: "mtn",
      label: "MTN",
      color: "#FBBF24",
      bg: "#FFFBEB",
      logo: "/logos/mtn.png",
    },
    {
      id: "airtel",
      label: "Airtel",
      color: "#DC2626",
      bg: "#FEF2F2",
      logo: "/logos/airtel.png",
    },
    {
      id: "glo",
      label: "Glo",
      color: "#059669",
      bg: "#ECFDF5",
      logo: "/logos/glo.png",
    },
    {
      id: "9mobile",
      label: "9Mobile",
      color: "#059669",
      bg: "#ECFDF5",
      logo: "/logos/9mobile.png",
    },
  ];
  const handleBuy = () => {
    const numericAmount = Number(amount.replace(/,/g, ""));
    if (
      !network ||
      !phone.trim() ||
      numericAmount <= 0 ||
      numericAmount > walletBalance ||
      !walletBalanceQuery.data
    ) {
      return;
    }
    if (tab === "airtime") {
      airtimeMutation.mutate(
        { serviceID, phone, amount: numericAmount },
        {
          onSuccess: (response) =>
            setPurchase({
              message: response.message,
              reference: response.data.reference,
            }),
        },
      );
    } else if (variationCode) {
      dataMutation.mutate(
        {
          serviceID,
          phone,
          amount: numericAmount,
          variation_code: variationCode,
        },
        {
          onSuccess: (response) =>
            setPurchase({
              message: response.message,
              reference: response.data.reference,
            }),
        },
      );
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Airtime & Data" onBack={() => onNav("wallet")} />
      {!purchase ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="bg-[#F1F3FB] p-1 rounded-xl flex">
            {(["airtime", "data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setNetwork("");
                  setAmount("");
                  setVariationCode("");
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${tab === t ? "bg-white text-[#0D0F1C] shadow-sm" : "text-[#9CA3AF]"}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {networks.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setNetwork(n.id);
                  setAmount("");
                  setVariationCode("");
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${network === n.id ? "border-[#3730A3]" : "border-[#E5E7EB]"}`}
                style={{ background: n.bg }}
              >
                <img
                  src={n.logo}
                  alt={`${n.label} logo`}
                  className="h-8 w-full max-w-20 object-contain"
                />
                <span className="text-xs" style={{ color: n.color }}>
                  {n.label}
                </span>
              </button>
            ))}
          </div>
          <Input
            label="Phone Number"
            placeholder="+234 801 234 5678"
            type="tel"
            value={phone}
            onChange={setPhone}
            icon={<Phone size={16} />}
          />
          {tab === "airtime" ? (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Amount
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₦0.00"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["100", "200", "500", "1,000", "2,000"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className="px-3 py-1.5 bg-[#EEF2FF] text-[#3730A3] rounded-full text-xs font-medium cursor-pointer"
                    >
                      ₦{a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {variations.map((plan) => (
                <button
                  key={plan.variation_code}
                  onClick={() => {
                    setAmount(plan.variation_amount);
                    setVariationCode(plan.variation_code);
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${variationCode === plan.variation_code ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-sm">{plan.name}</div>
                  </div>
                  <div className="font-semibold text-[#3730A3]">
                    ₦{Number(plan.variation_amount).toLocaleString()}
                  </div>
                </button>
              ))}
              {dataDetailsQuery.isLoading && (
                <p className="text-center text-sm text-[#6B7280]">
                  Loading available bundles...
                </p>
              )}
              {dataDetailsQuery.isSuccess && variations.length === 0 && (
                <p className="text-center text-sm text-[#6B7280]">
                  No data bundles are currently available for this network.
                </p>
              )}
            </div>
          )}
          {amount && Number(amount.replace(/,/g, "")) > walletBalance && (
            <div className="text-xs text-red-500 font-medium">
              Insufficient wallet balance ({fmt(walletBalance)})
            </div>
          )}
          {walletBalanceQuery.isLoading && (
            <p className="text-sm text-[#6B7280]">Loading wallet balance...</p>
          )}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-[#FEF2F2] p-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}
          <PaveBtn
            onClick={handleBuy}
            disabled={
              !network ||
              !phone ||
              !amount ||
              Number(amount.replace(/,/g, "")) <= 0 ||
              Number(amount.replace(/,/g, "")) > walletBalance ||
              (tab === "data" && !variationCode) ||
              !walletBalanceQuery.data ||
              purchaseMutation.isPending
            }
          >
            {purchaseMutation.isPending
              ? "Processing..."
              : `Buy ${tab === "airtime" ? "Airtime" : "Data"}`}
          </PaveBtn>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Success! 🎉
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              {purchase.message} Sent to {phone}.
            </p>
            {purchase.reference && (
              <p className="text-xs text-[#6B7280] mt-2">
                Reference: {purchase.reference}
              </p>
            )}
          </div>
          <PaveBtn
            onClick={() => {
              setPurchase(null);
              setAmount("");
              setPhone("");
              setVariationCode("");
              setNetwork("");
            }}
          >
            Buy More
          </PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("wallet")}>
            Back to Wallet
          </PaveBtn>
        </div>
      )}
    </div>
  );
}

export function TransactionsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const transactionsQuery = useAllTransactionsQuery();
  const [searchMeterNumber, setSearchMeterNumber] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [searchParams, setSearchParams] = useState<UserTransactionSearchParams>(
    {},
  );
  const [searchActive, setSearchActive] = useState(false);
  const [searchInputError, setSearchInputError] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const searchQuery = useSearchUserTransactionsQuery(
    searchParams,
    searchActive,
  );
  const records = searchActive
    ? (searchQuery.data?.data ?? [])
    : (transactionsQuery.data?.transactions ?? []);
  const transactions = records.map(toWalletTransaction);
  const transactionDetailQuery = useTransactionByIdQuery(
    selectedTransactionId,
    Boolean(selectedTransactionId),
  );
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Credit", "Debit", "Savings", "Bills"];
  const filtered = transactions.filter(
    (t) =>
      filter === "All" ||
      (filter === "Credit" && t.type === "credit") ||
      (filter === "Debit" && t.type === "debit") ||
      (filter !== "Credit" &&
        filter !== "Debit" &&
        t.category.toLowerCase() === filter.toLowerCase()),
  );
  const submitSearch = () => {
    const params: UserTransactionSearchParams = {
      meterNumber: searchMeterNumber.trim() || undefined,
      amount: searchAmount.trim() || undefined,
      startDate: searchStartDate || undefined,
      endDate: searchEndDate || undefined,
    };
    if (
      !params.meterNumber &&
      !params.amount &&
      !(params.startDate && params.endDate)
    ) {
      setSearchInputError(
        "Search using a meter number, an amount, or both dates.",
      );
      return;
    }

    setSearchInputError("");
    setSelectedTransactionId("");
    setSearchParams(params);
    setSearchActive(true);
  };
  const clearSearch = () => {
    setSearchActive(false);
    setSearchParams({});
    setSearchInputError("");
    setSelectedTransactionId("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 pt-14 pb-4 bg-white border-b border-[#F1F3FB]">
        <h2
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
          className="mb-4"
        >
          Transactions
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${filter === f ? "bg-[#3730A3] text-white" : "bg-[#F1F3FB] text-[#374151]"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <section className="mt-4 rounded-xl bg-[#F7F8FF] p-3">
          <h3 className="mb-2 text-sm font-semibold text-[#0D0F1C]">
            Search transactions
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              value={searchMeterNumber}
              onChange={(event) => setSearchMeterNumber(event.target.value)}
              placeholder="Meter number"
              aria-label="Meter number"
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              value={searchAmount}
              onChange={(event) => setSearchAmount(event.target.value)}
              placeholder="Amount"
              aria-label="Transaction amount"
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={searchStartDate}
              onChange={(event) => setSearchStartDate(event.target.value)}
              aria-label="Search start date"
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={searchEndDate}
              onChange={(event) => setSearchEndDate(event.target.value)}
              aria-label="Search end date"
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
            />
          </div>
          {searchInputError && (
            <p role="alert" className="mt-2 text-xs text-red-600">
              {searchInputError}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <PaveBtn
              small
              onClick={submitSearch}
              disabled={searchQuery.isFetching}
            >
              {searchQuery.isFetching ? "Searching..." : "Search"}
            </PaveBtn>
            {searchActive && (
              <PaveBtn small variant="ghost" onClick={clearSearch}>
                Clear
              </PaveBtn>
            )}
          </div>
        </section>
      </div>
      <div className="flex-1 px-4 py-4">
        {!searchActive && transactionsQuery.isError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {getApiErrorMessage(
              transactionsQuery.error,
              "Unable to load your transactions.",
            )}
          </p>
        )}
        {!searchActive && transactionsQuery.isLoading && (
          <p role="status" className="mb-3 text-sm text-[#6B7280]">
            Loading transactions…
          </p>
        )}
        {searchActive && searchQuery.isFetching && (
          <p role="status" className="mb-3 text-sm text-[#6B7280]">
            Searching transactions...
          </p>
        )}
        {searchActive && searchQuery.isError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {getApiErrorMessage(
              searchQuery.error,
              "Unable to search transactions.",
            )}
          </p>
        )}
        {transactionDetailQuery.isLoading && (
          <p role="status" className="mb-3 text-sm text-[#6B7280]">
            Loading transaction details...
          </p>
        )}
        {transactionDetailQuery.isError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {getApiErrorMessage(
              transactionDetailQuery.error,
              "Unable to load transaction details.",
            )}
          </p>
        )}
        {transactionDetailQuery.data && (
          <section className="mb-4 rounded-xl border border-[#C7D2FE] bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0D0F1C]">
                Transaction details
              </h3>
              <button
                onClick={() => setSelectedTransactionId("")}
                className="text-xs font-medium text-[#3730A3]"
              >
                Close
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(transactionDetailQuery.data.transaction)
                .filter(([, value]) => value !== null && value !== undefined)
                .map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <dt className="text-xs text-[#9CA3AF]">{key}</dt>
                    <dd className="wrap-break-word font-medium text-[#0D0F1C]">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        )}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <BarChart2 size={40} className="text-[#E5E7EB]" />
            <p className="text-[#9CA3AF] text-sm">
              {searchActive && searchQuery.isError
                ? "Search failed"
                : "No transactions found"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => {
                  const record = records.find(
                    (candidate) =>
                      candidate.id === t.id || candidate._id === t.id,
                  );
                  const id = record?.id ?? record?._id;
                  if (id) setSelectedTransactionId(id);
                }}
                disabled={
                  !records.some(
                    (candidate) =>
                      candidate.id === t.id || candidate._id === t.id,
                  )
                }
                className="w-full text-left bg-white rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB] disabled:cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5]" : "bg-[#F9FAFB]"}`}
                >
                  {t.type === "credit" ? (
                    <ArrowDownLeft size={18} className="text-[#059669]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0D0F1C]">
                    {t.desc}
                  </div>
                  <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
                    {t.date}
                    <span>·</span>
                    {t.category}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-semibold ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C]"}`}
                  >
                    {t.type === "credit" ? "+" : "-"}
                    {fmt(t.amount)}
                  </div>
                  <Badge
                    color={
                      t.status === "success"
                        ? "green"
                        : t.status === "pending"
                          ? "gold"
                          : "red"
                    }
                  >
                    {t.status === "success"
                      ? "Success"
                      : t.status === "pending"
                        ? "Pending"
                        : "Failed"}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}