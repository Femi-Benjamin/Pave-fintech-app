import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus, Calendar, ArrowLeft, Check } from "lucide-react";
import { PaveBtn, Badge, ScreenHeader } from "../components/UI";
import { Screen, fmt, pct, MOCK_SAVINGS } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";

export function SavingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { savings, programs } = useLocalStore();
  const [tab, setTab] = useState<"personal" | "programs">("personal");
  const totalSaved = savings.reduce((acc, s) => acc + s.current, 0);
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #D97706 0%, #B45309 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <h2
          className="text-white mb-4"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          My Savings
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-xs mb-1">Total Saved</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              {fmt(totalSaved)}
            </div>
            <div className="text-white/60 text-xs mt-1">
              Across {savings.length} goals
            </div>
          </div>
          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-white/70 text-xs mb-1">Monthly Target</div>
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-family-display)", fontSize: 22 }}
            >
              ₦75,000
            </div>
            <div className="text-white/60 text-xs mt-1">On track ✓</div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-5">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F1F3FB]">
          <div className="flex">
            {(["personal", "programs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-medium transition-all cursor-pointer ${tab === t ? "bg-[#3730A3] text-white" : "text-[#9CA3AF]"}`}
              >
                {t === "personal" ? "Personal Goals" : "Group Programs"}
              </button>
            ))}
          </div>
        </div>

        {tab === "personal" ? (
          <>
            <button
              onClick={() => onNav("create-savings")}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              <span className="text-[#3730A3] font-medium text-sm">
                Create New Savings Goal
              </span>
            </button>
            {savings.map((s) => (
              <button
                key={s.id}
                onClick={() => onNav("savings-detail")}
                className="bg-white rounded-2xl p-5 border border-[#F1F3FB] shadow-sm text-left cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="font-semibold text-[#0D0F1C]">
                        {s.name}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        {s.freq} · {s.daysLeft} days left
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#0D0F1C]">
                      {fmt(s.current)}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {pct(s.current, s.goal)}%
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F3FB] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(s.current, s.goal)}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#9CA3AF]">
                  <span>Goal: {fmt(s.goal)}</span>
                  <span>{fmt(s.goal - s.current)} remaining</span>
                </div>
              </button>
            ))}
          </>
        ) : (
          <>
            <button
              onClick={() => onNav("join-program")}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              <span className="text-[#3730A3] font-medium text-sm">
                Join a Savings Program
              </span>
            </button>
            {programs.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-[#F1F3FB] shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-[#0D0F1C]">{p.name}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      by {p.admin} · {p.members} members
                    </div>
                  </div>
                  <Badge color="indigo">{p.freq}</Badge>
                </div>
                <div className="h-2 bg-[#F1F3FB] rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(p.current, p.target)}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-[#3730A3]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Total Target", fmt(p.target)],
                    ["Collected", fmt(p.current)],
                    ["My Share", fmt(p.myContrib)],
                  ].map(([k, v]) => (
                    <div key={k} className="text-center">
                      <div className="text-xs text-[#9CA3AF]">{k}</div>
                      <div className="text-sm font-semibold text-[#0D0F1C]">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F3FB] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Calendar size={12} />
                    <span>Next due: {p.nextDue}</span>
                  </div>
                  <PaveBtn small variant="primary" onClick={() => {}}>
                    Deposit
                  </PaveBtn>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="h-6" />
      </div>
    </div>
  );
}

export function CreateSavingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { addSavingsGoal } = useLocalStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    goal: "",
    amount: "",
    freq: "",
    time: "",
    purpose: "",
    type: "personal",
  });
  const set = (k: string) => (v: string) => setForm({ ...form, [k]: v });
  const [success, setSuccess] = useState(false);

  const handleCreate = () => {
    const targetNum = Number(form.goal.replace(/,/g, "")) || 100000;
    const icons = ["🎯", "💰", "🏖️", "🚗", "🏠", "🎓", "📱", "💻"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    addSavingsGoal({
      name: form.name || "My Savings Target",
      goal: targetNum,
      color: form.type === "personal" ? "#3730A3" : "#059669",
      icon: randomIcon,
      daysLeft: 60,
      freq: form.freq || "Weekly",
    });
    setSuccess(true);
  };
  const freqs = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly"];
  const times = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "12:00 PM",
    "6:00 PM",
    "9:00 PM",
  ];
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader
        title="Create Savings Goal"
        onBack={() => (step > 1 ? setStep(step - 1) : onNav("savings"))}
      />
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-6xl"
          >
            🎯
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Goal Created! 🎉
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              Your savings goal "{form.name}" has been set up. Stay consistent!
            </p>
          </div>
          <PaveBtn onClick={() => onNav("savings")}>View My Goals</PaveBtn>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: i <= step ? "#3730A3" : "#E5E7EB" }}
              />
            ))}
          </div>
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Goal Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="e.g. New iPhone, Holiday Trip..."
                  className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Target Amount (₦)
                </label>
                <input
                  value={form.goal}
                  onChange={(e) => set("goal")(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 24,
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-2">
                  Savings Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "personal",
                      label: "Personal",
                      icon: "👤",
                      desc: "Save on your own",
                    },
                    {
                      id: "group",
                      label: "With Admin",
                      icon: "👥",
                      desc: "Save with your group",
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => set("type")(t.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${form.type === t.id ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
                    >
                      <div className="text-2xl mb-2">{t.icon}</div>
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="text-xs text-[#9CA3AF]">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <PaveBtn
                onClick={() => setStep(2)}
                disabled={!form.name || !form.goal}
              >
                Continue
              </PaveBtn>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Deposit Amount per {form.freq || "Period"} (₦)
                </label>
                <input
                  value={form.amount}
                  onChange={(e) => set("amount")(e.target.value)}
                  placeholder="e.g. 5,000"
                  className="w-full bg-[#F1F3FB] rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-2">
                  Save Every
                </label>
                <div className="flex flex-wrap gap-2">
                  {freqs.map((f) => (
                    <button
                      key={f}
                      onClick={() => set("freq")(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${form.freq === f ? "bg-[#3730A3] border-[#3730A3] text-white" : "border-[#E5E7EB] text-[#374151]"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-2">
                  Preferred Time
                </label>
                <div className="flex flex-wrap gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => set("time")(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${form.time === t ? "bg-[#3730A3] border-[#3730A3] text-white" : "border-[#E5E7EB] text-[#374151]"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {form.goal && form.amount && form.freq && (
                <div className="bg-[#EEF2FF] rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#3730A3] mb-2">
                    📊 Projection
                  </div>
                  <div className="text-[#374151]">
                    Saving ₦{form.amount} {form.freq.toLowerCase()} will reach
                    your goal of ₦{form.goal} in approximately{" "}
                    <strong>
                      {Math.ceil(
                        Number(form.goal.replace(/,/g, "")) /
                          Number(form.amount.replace(/,/g, "")),
                      )}{" "}
                      {form.freq.toLowerCase()} periods
                    </strong>
                    .
                  </div>
                </div>
              )}
              <PaveBtn
                onClick={() => setStep(3)}
                disabled={!form.amount || !form.freq || !form.time}
              >
                Continue
              </PaveBtn>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] block mb-1.5">
                  Purpose / Motivation
                </label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => set("purpose")(e.target.value)}
                  placeholder="Why are you saving for this? Remind yourself..."
                  rows={4}
                  className="w-full bg-[#F1F3FB] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors resize-none"
                />
              </div>
              <div className="bg-white rounded-2xl border border-[#F1F3FB] p-5 flex flex-col gap-3">
                <div className="font-semibold text-[#0D0F1C] mb-1">
                  Goal Summary
                </div>
                {[
                  ["Goal Name", form.name || "—"],
                  ["Target Amount", form.goal ? `₦${form.goal}` : "—"],
                  [
                    "Type",
                    form.type === "personal" ? "Personal" : "With Admin",
                  ],
                  ["Frequency", form.freq || "—"],
                  ["Deposit Amount", form.amount ? `₦${form.amount}` : "—"],
                  ["Reminder Time", form.time || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#9CA3AF]">{k}</span>
                    <span className="font-medium text-[#0D0F1C]">{v}</span>
                  </div>
                ))}
              </div>
              <PaveBtn onClick={handleCreate} variant="green">
                🎯 Create Goal
              </PaveBtn>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function SavingsDetailScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { savings, depositToSavings, walletBalance } = useLocalStore();
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmt, setDepositAmt] = useState("10,000");
  const s = savings[0] || MOCK_SAVINGS[0];
  const history = [
    { date: "Jun 14", amount: 7500, note: "Weekly deposit" },
    { date: "Jun 7", amount: 7500 },
    { date: "May 31", amount: 7500 },
    { date: "May 24", amount: 7500 },
  ];

  const handleDeposit = () => {
    const num = Number(depositAmt.replace(/,/g, ""));
    if (num > 0 && num <= walletBalance) {
      depositToSavings(s.id, num);
      setShowDeposit(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div
        style={{
          background: `linear-gradient(145deg, ${s.color} 0%, ${s.color}CC 100%)`,
        }}
        className="px-6 pt-14 pb-8"
      >
        <button
          onClick={() => onNav("savings")}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4 cursor-pointer"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{s.icon}</span>
          <div>
            <h2
              className="text-white font-bold text-xl"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              {s.name}
            </h2>
            <div className="text-white/70 text-xs">
              {s.freq} deposits · {s.daysLeft} days left
            </div>
          </div>
        </div>
        <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <div className="text-white/70 text-xs mb-1">Saved so far</div>
          <div
            className="text-white mb-3"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 30,
            }}
          >
            {fmt(s.current)}
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct(s.current, s.goal)}%` }}
              transition={{ duration: 1.2 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <div className="flex justify-between mt-2 text-white/70 text-xs">
            <span>
              {pct(s.current, s.goal)}% of {fmt(s.goal)}
            </span>
            <span>{fmt(s.goal - s.current)} to go</span>
          </div>
        </div>
      </div>
      <div className="px-6 -mt-4 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <PaveBtn onClick={() => setShowDeposit(!showDeposit)} full={false}>
            + Add Funds
          </PaveBtn>
          <PaveBtn onClick={() => {}} variant="outline" full={false}>
            Pause Goal
          </PaveBtn>
        </div>

        {showDeposit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-[#3730A3]/20 shadow-sm flex flex-col gap-3"
          >
            <div className="text-sm font-semibold text-[#0D0F1C]">
              Deposit from Wallet (Balance: {fmt(walletBalance)})
            </div>
            <div className="flex gap-2">
              {["5,000", "10,000", "20,000", "50,000"].map((p) => (
                <button
                  key={p}
                  onClick={() => setDepositAmt(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
                    depositAmt === p
                      ? "bg-[#3730A3] text-white"
                      : "bg-[#EEF2FF] text-[#3730A3]"
                  }`}
                >
                  ₦{p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={depositAmt}
                onChange={(e) => setDepositAmt(e.target.value)}
                placeholder="Amount"
                className="flex-1 bg-[#F1F3FB] rounded-xl px-4 py-2.5 text-sm outline-none border focus:border-[#3730A3]"
              />
              <PaveBtn
                small
                onClick={handleDeposit}
                disabled={
                  !depositAmt ||
                  Number(depositAmt.replace(/,/g, "")) <= 0 ||
                  Number(depositAmt.replace(/,/g, "")) > walletBalance
                }
              >
                Confirm
              </PaveBtn>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-[#F1F3FB]">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Target", fmt(s.goal)],
              ["Deposited", fmt(s.current)],
              ["Remaining", fmt(s.goal - s.current)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-[#9CA3AF]">{k}</div>
                <div className="text-sm font-semibold text-[#0D0F1C]">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Deposit History
          </h3>
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-[#F1F3FB]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                  <Check size={15} className="text-[#059669]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0D0F1C]">
                    {h.note || "Scheduled deposit"}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">{h.date}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-[#059669]">
                +{fmt(h.amount)}
              </div>
            </div>
          ))}
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

export function JoinProgramScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { joinProgram } = useLocalStore();
  const [selected, setSelected] = useState("");
  const [success, setSuccess] = useState(false);
  const available = [
    {
      id: "thrift2",
      name: "Lagos Island Thrift",
      admin: "Mrs. Adaeze Nwosu",
      freq: "Monthly",
      amount: 25000,
      members: 15,
      target: 300000,
    },
    {
      id: "coop2",
      name: "Educators' Cooperative",
      admin: "Mr. Kunle Olatunji",
      freq: "Bi-weekly",
      amount: 10000,
      members: 22,
      target: 200000,
    },
  ];

  const handleJoin = () => {
    const prog = available.find((p) => p.id === selected);
    if (prog) {
      joinProgram({
        name: prog.name,
        admin: prog.admin,
        members: prog.members + 1,
        target: prog.target,
        nextDue: "Jun 28",
        freq: prog.freq,
      });
    }
    setSuccess(true);
  };
  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Join a Program" onBack={() => onNav("savings")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-4">
          <p className="text-sm text-[#6B7280]">
            Select an available savings program to join, managed by your invited
            admin.
          </p>
          {available.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${selected === p.id ? "border-[#3730A3] bg-[#EEF2FF]" : "border-[#E5E7EB] bg-white"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-[#0D0F1C]">{p.name}</div>
                  <div className="text-xs text-[#9CA3AF]">
                    by {p.admin} · {p.members} members
                  </div>
                </div>
                <Badge color="indigo">{p.freq}</Badge>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-[#6B7280]">Your contribution</span>
                <span className="font-bold text-[#3730A3]">
                  {fmt(p.amount)}/{p.freq}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[#6B7280]">Group target</span>
                <span className="font-medium">{fmt(p.target)}</span>
              </div>
            </button>
          ))}
          <div className="mt-auto pt-2">
            <PaveBtn onClick={handleJoin} disabled={!selected}>
              Join Selected Program
            </PaveBtn>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl"
          >
            🤝
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Welcome to the Group!
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              You've joined the savings program. Your first contribution is due
              on the next cycle date.
            </p>
          </div>
          <PaveBtn onClick={() => onNav("savings")}>View My Programs</PaveBtn>
        </div>
      )}
    </div>
  );
}
