import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MoreHorizontal,
  Plus,
  Send,
  Zap,
  Phone,
  QrCode,
  Landmark,
  Copy,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Check,
  CheckCircle,
  Search,
  ChevronRight,
  MessageSquare,
  Hash,
  DollarSign,
  Loader,
  BarChart2,
  RotateCw,
} from "lucide-react";
import { PaveBtn, Input, Badge, ScreenHeader, Avatar } from "../components/UI";
import { Screen, fmt } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { WalletScreenSkeleton } from "../components/Skeleton";

export function WalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { walletBalance, transactions } = useLocalStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 650);
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
      label: "Fund Wallet",
      screen: "fund-wallet",
      color: "#3730A3",
      bg: "#EEF2FF",
    },
    {
      icon: <Send size={20} />,
      label: "Transfer",
      screen: "transfer",
      color: "#059669",
      bg: "#ECFDF5",
    },
    {
      icon: <Zap size={20} />,
      label: "Pay Bills",
      screen: "bills",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime & Data",
      screen: "airtime",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      icon: <QrCode size={20} />,
      label: "QR Pay",
      screen: "wallet",
      color: "#DB2777",
      bg: "#FDF2F8",
    },
    {
      icon: <Landmark size={20} />,
      label: "Virtual Account",
      screen: "wallet",
      color: "#0891B2",
      bg: "#ECFEFF",
    },
  ];
  if (isLoading) {
    return <WalletScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #059669 0%, #047857 100%)",
        }}
        className="px-6 pt-14 pb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-white font-semibold"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            My Wallet
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh wallet"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-white transition-colors"
            >
              <RotateCw size={15} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
        <div className="text-white/70 text-sm mb-1">Available Balance</div>
        <div
          className="text-white mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 36,
          }}
        >
          {fmt(walletBalance)}
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 w-fit">
          <Landmark size={14} className="text-white/70" />
          <span className="text-white/70 text-xs">PAVE/Wema: </span>
          <span className="text-white text-xs font-mono font-semibold">
            9031 204 8871
          </span>
          <Copy size={12} className="text-white/60" />
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F3FB]">
          <div className="grid grid-cols-3 gap-4">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => onNav(a.screen as Screen)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: a.bg, color: a.color }}
                >
                  {a.icon}
                </div>
                <span className="text-xs text-[#374151] font-medium text-center leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
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
                {s.value}
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
    </motion.div>
  );
}

export function FundWalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { fundWallet } = useLocalStore();
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const presets = ["5,000", "10,000", "20,000", "50,000", "100,000"];

  const handleFund = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (num > 0) {
      fundWallet(num, method === "bank" ? "Bank Transfer" : "Debit Card");
      setSuccess(true);
    }
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Fund Wallet" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151]">
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
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151]">
              Payment Method
            </label>
            {[
              {
                id: "bank",
                label: "Bank Transfer",
                desc: "Transfer to virtual account",
                icon: <Landmark size={20} />,
              },
              {
                id: "card",
                label: "Debit Card",
                desc: "Pay with your card",
                icon: <CreditCard size={20} />,
              },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${method === m.id ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F1F3FB] flex items-center justify-center text-[#3730A3]">
                  {m.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-[#0D0F1C]">
                    {m.label}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">{m.desc}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-[#3730A3] bg-[#3730A3]" : "border-[#D1D5DB]"}`}
                >
                  {method === m.id && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {method === "bank" && (
            <div className="bg-[#EEF2FF] rounded-2xl p-4">
              <div className="text-xs font-semibold text-[#3730A3] mb-3">
                Transfer to this account:
              </div>
              <div className="flex flex-col gap-2">
                {[
                  ["Bank", "Wema Bank"],
                  ["Account Name", "PAVE/Joe Adeyemi"],
                  ["Account Number", "9031 204 8871"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto pt-2">
            <PaveBtn
              onClick={handleFund}
              disabled={!amount || !method || Number(amount.replace(/,/g, "")) <= 0}
            >
              Fund Wallet
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
              ₦{amount} Funded!
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              Your wallet has been credited successfully.
            </p>
          </div>
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
  const { walletBalance, payBill } = useLocalStore();
  const [selected, setSelected] = useState("");
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [meter, setMeter] = useState("");
  const bills = [
    { id: "electricity", label: "Electricity", icon: "⚡", color: "#D97706" },
    { id: "water", label: "Water", icon: "💧", color: "#0891B2" },
    { id: "tv", label: "Cable TV", icon: "📺", color: "#7C3AED" },
    { id: "internet", label: "Internet", icon: "🌐", color: "#059669" },
    { id: "school", label: "School Fees", icon: "🎓", color: "#3730A3" },
    { id: "govt", label: "Govt Fees", icon: "🏛️", color: "#374151" },
  ];

  const handlePay = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (num <= 0 || num > walletBalance) return;
    const billObj = bills.find((b) => b.id === selected);
    payBill("bills", billObj ? `${billObj.label} Bill` : "Utility Bill", num, meter);
    setSuccess(true);
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Pay Bills" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {bills.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected === b.id ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-medium text-[#374151]">
                  {b.label}
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
              <Input
                label={
                  selected === "electricity"
                    ? "Meter Number"
                    : "Reference Number"
                }
                placeholder={
                  selected === "electricity"
                    ? "0123456789012"
                    : "Enter reference"
                }
                value={meter}
                onChange={setMeter}
                icon={<Hash size={16} />}
              />
              <Input
                label="Amount (₦)"
                placeholder="Enter amount"
                value={amount}
                onChange={setAmount}
                icon={<DollarSign size={16} />}
              />
              {amount && Number(amount.replace(/,/g, "")) > walletBalance && (
                <div className="text-xs text-red-500 font-medium">
                  Insufficient wallet balance ({fmt(walletBalance)})
                </div>
              )}
              <PaveBtn
                onClick={handlePay}
                disabled={
                  !meter ||
                  !amount ||
                  Number(amount.replace(/,/g, "")) <= 0 ||
                  Number(amount.replace(/,/g, "")) > walletBalance
                }
              >
                Pay Now
              </PaveBtn>
            </motion.div>
          )}
          {!selected && (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <Zap size={40} className="text-[#E5E7EB]" />
              <p className="text-[#9CA3AF] text-sm">
                Select a bill category above to continue
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
              Payment Successful!
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              ₦{amount} bill payment completed
            </p>
          </div>
          <PaveBtn
            onClick={() => {
              setSuccess(false);
              setSelected("");
              setAmount("");
              setMeter("");
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
  const { walletBalance, buyAirtime } = useLocalStore();
  const [tab, setTab] = useState<"airtime" | "data">("airtime");
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleBuy = () => {
    const num = Number(amount.replace(/,/g, ""));
    if (num <= 0 || num > walletBalance) return;
    buyAirtime(phone, network.toUpperCase(), num);
    setSuccess(true);
  };
  const networks = [
    { id: "mtn", label: "MTN", color: "#FBBF24", bg: "#FFFBEB" },
    { id: "airtel", label: "Airtel", color: "#DC2626", bg: "#FEF2F2" },
    { id: "glo", label: "Glo", color: "#059669", bg: "#ECFDF5" },
    { id: "9mobile", label: "9Mobile", color: "#059669", bg: "#ECFDF5" },
  ];
  const dataplans = [
    { label: "500MB", price: "₦200", validity: "1 day" },
    { label: "1GB", price: "₦500", validity: "7 days" },
    { label: "2GB", price: "₦1,000", validity: "30 days" },
    { label: "5GB", price: "₦2,000", validity: "30 days" },
    { label: "10GB", price: "₦3,500", validity: "30 days" },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Airtime & Data" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="bg-[#F1F3FB] p-1 rounded-xl flex">
            {(["airtime", "data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
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
                onClick={() => setNetwork(n.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${network === n.id ? "border-[#3730A3]" : "border-[#E5E7EB]"}`}
                style={{ background: n.bg }}
              >
                <span className="text-lg font-bold" style={{ color: n.color }}>
                  {n.label[0]}
                </span>
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
              {dataplans.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAmount(p.price.replace("₦", ""))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${amount === p.price.replace("₦", "") ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-sm">{p.label}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      Valid for {p.validity}
                    </div>
                  </div>
                  <div className="font-semibold text-[#3730A3]">{p.price}</div>
                </button>
              ))}
            </div>
          )}
          {amount && Number(amount.replace(/,/g, "")) > walletBalance && (
            <div className="text-xs text-red-500 font-medium">
              Insufficient wallet balance ({fmt(walletBalance)})
            </div>
          )}
          <PaveBtn
            onClick={handleBuy}
            disabled={
              !network ||
              !phone ||
              !amount ||
              Number(amount.replace(/,/g, "")) <= 0 ||
              Number(amount.replace(/,/g, "")) > walletBalance
            }
          >
            Buy {tab === "airtime" ? "Airtime" : "Data"}
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
              {tab === "airtime" ? `₦${amount} airtime` : `Data bundle`} sent to{" "}
              {phone}
            </p>
          </div>
          <PaveBtn
            onClick={() => {
              setSuccess(false);
              setAmount("");
              setPhone("");
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
  const { transactions } = useLocalStore();
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
      </div>
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <BarChart2 size={40} className="text-[#E5E7EB]" />
            <p className="text-[#9CA3AF] text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB]"
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
                  <Badge color="green">Success</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
