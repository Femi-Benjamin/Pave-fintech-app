import React, { useState } from "react";
import {
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Smartphone,
  Copy,
  Check,
  Building,
  Sparkles,
  Search,
  Clock,
} from "lucide-react";
import sendReceiveHeroImg from "../../assets/images/send_receive_hero_1791561176083.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function SendReceiveMoneyPage({ onOpenApp }: PageProps) {
  const [copied, setCopied] = useState(false);
  const [transferAmount, setTransferAmount] = useState(25000);
  const [transferType, setTransferType] = useState<"bank" | "tag">("bank");
  const [selectedBank, setSelectedBank] = useState("GTBank");
  const [accountNumber, setAccountNumber] = useState("0123456789");
  const [simulatedReceipt, setSimulatedReceipt] = useState(false);

  // Bank charges comparison
  const bankFee = transferAmount > 50000 ? 53.75 : transferAmount > 5000 ? 26.88 : 10.75;
  const stampDuty = transferAmount >= 10000 ? 50 : 0;
  const totalBankCost = bankFee + stampDuty;
  const paveCost = 0; // ₦0 peer transfer

  const handleCopy = () => {
    navigator.clipboard?.writeText("9876543210");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulation = () => {
    setSimulatedReceipt(true);
    setTimeout(() => setSimulatedReceipt(false), 5000);
  };

  const banks = [
    "GTBank",
    "Access Bank",
    "Zenith Bank",
    "First Bank",
    "Kuda Bank",
    "OPay",
    "Palmpay",
    "Wema Bank",
  ];

  const faqs = [
    {
      q: "Are transfers between PAVE users really free?",
      a: "Yes! 100% free. Any transfer between PAVE wallet users using their phone number or @pave-tag settles instantly with zero network or processing fees.",
    },
    {
      q: "How fast do transfers to other commercial banks arrive?",
      a: "Transfers are routed directly through the Nigeria Inter-Bank Settlement System (NIBSS Instant Payment - NIP) network, typically delivering within 1.5 to 3 seconds with immediate confirmation.",
    },
    {
      q: "How does my dedicated virtual account work?",
      a: "As soon as you register and verify your BVN/NIN on PAVE, a dedicated 10-digit NUBAN virtual account is automatically provisioned for you with our licensed partner bank (Wema Bank). You can receive money from any banking app or USSD in Nigeria directly into your PAVE wallet.",
    },
    {
      q: "Is there a daily transfer limit?",
      a: "Tier 1 accounts can transfer up to ₦50,000 daily. Upgrading to Tier 2 and Tier 3 with proof of address and NIN unlocks daily transfer limits up to ₦5,000,000 and unlimited circle payouts.",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/70 text-[#7C3AED] dark:text-[#A78BFA] text-xs font-bold w-fit border border-purple-200 dark:border-purple-800/60 shadow-xs">
              <Zap size={14} />
              <span>Zero Transfer Fees & 2-Second Settlement</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Send & Receive Money Faster Than You Can Blink
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Transfer funds instantly to any Nigerian commercial bank account with 
              99.9% uptime. Receive direct deposits straight into your personal dedicated 
              virtual account without awkward transfer delays or surprise stamp duty deductions.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-lg shadow-[#7C3AED]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Get Your Free Virtual Account</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-850 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/80 dark:bg-transparent"
              >
                Send Money Now
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400" />
                <span>₦0 PAVE-to-PAVE Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>NIBSS Instant Payment (NIP)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Encrypted Virtual Escrow</span>
              </div>
            </div>
          </div>

          {/* Hero Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10">
              <img
                src={sendReceiveHeroImg}
                alt="Seamless Nigerian retail cafe payment using PAVE instant transfer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  Instant POS & P2P Settlement
                </div>
                <div className="text-xl font-bold">₦15,000 Transferred in 1.4s</div>
                <div className="text-xs text-white/90">Zero transfer charges · Instant SMS alert to recipient</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Transfer Flow Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] dark:text-[#A78BFA]">
              Interactive Transfer Engine
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Test Real-Time NUBAN Verification & Zero-Fee Dispatch
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              Experience how easy it is to verify recipients and send money with zero deductions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Destination Type
                </label>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => setTransferType("bank")}
                    className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      transferType === "bank"
                        ? "bg-white dark:bg-[#1A1D36] text-[#7C3AED] dark:text-[#A78BFA] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    To Nigerian Bank Account
                  </button>
                  <button
                    onClick={() => setTransferType("tag")}
                    className={`px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      transferType === "tag"
                        ? "bg-white dark:bg-[#1A1D36] text-[#7C3AED] dark:text-[#A78BFA] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    <span>To @pave-tag (Instant & Free)</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      Coming Soon
                    </span>
                  </button>
                </div>
              </div>

              {transferType === "bank" ? (
                <>
                  {/* Bank selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Select Destination Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-hidden focus:border-[#7C3AED]"
                    >
                      {banks.map((b) => (
                        <option key={b} value={b} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Account Number with Verification */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      10-Digit NUBAN Account Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="0123456789"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-[#7C3AED]"
                      />
                      <div className="absolute right-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 size={13} />
                        <span>OLUWANISHOLA ADEOYE</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Coming Soon Callout */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                      <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                        To @pave-tag (Instant & Free) — Coming Soon
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-normal">
                      Direct P2P username transfers without account numbers are currently in final pilot testing. 
                      You can currently send funds to any Nigerian commercial bank account with zero fees below.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Recipient PAVE Tag Preview
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="@benjamin_0000"
                        placeholder="@username"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-hidden focus:border-[#7C3AED]"
                      />
                      <div className="absolute right-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-1 rounded-lg">
                        <Sparkles size={13} />
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount slider */}
              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Transfer Amount
                  </label>
                  <span className="text-lg font-extrabold text-[#7C3AED] dark:text-[#A78BFA]">
                    ₦{transferAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  className="w-full accent-[#7C3AED] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>₦1,000</span>
                  <span>₦100,000</span>
                  <span>₦250,000</span>
                </div>
              </div>
            </div>

            {/* Right Column: Simulated Receipt / Summary (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#181B34] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Settlement Preview
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                    NIP Instant Routing
                  </span>
                </div>

                <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-white/10 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Beneficiary:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      OLUWANISHOLA ADEOYE
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Destination:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {transferType === "bank" ? `${selectedBank} · ${accountNumber}` : "@benjamin_0000"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Amount Sent:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      ₦{transferAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">PAVE Transfer Fee:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      ₦0.00 (Zero Fee)
                    </span>
                  </div>
                  
                  {/* Conventional Bank Fee: NOT crossed out since we are trying to make a difference */}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-white/5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Conventional Bank Fee:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                      ₦{totalBankCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Clear PAVE value proposition callout */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <span>PAVE Direct Savings:</span>
                  <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                    ₦{totalBankCost.toFixed(2)} saved per transfer
                  </span>
                </div>

                {simulatedReceipt ? (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <strong className="text-sm">Transfer Dispatched Successfully</strong>
                    </div>
                    <p className="text-xs">
                      Session Ref: 0000132609{Math.floor(Math.random() * 899999 + 100000)} · Beneficiary credited in 1.4s.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 text-xs text-purple-900 dark:text-purple-200 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#7C3AED] shrink-0" />
                    <span>Protected by CBN framework & encrypted 4-digit transaction PIN.</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSendSimulation}
                  className="w-full py-3.5 px-6 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Test 2-Second Transfer (Simulate)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp("signup")}
                  className="w-full py-3 px-6 rounded-full bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-100 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Get Real Account Number
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dedicated Virtual Account Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-[#1E1B4B] to-[#3730A3] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Personalized Banking Infrastructure
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mt-1 mb-4"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Get Your Own Dedicated Wema Bank Account in 60 Seconds
            </h2>
            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed mb-6 font-normal">
              When you complete your PAVE signup, a personalized 10-digit Nigerian NUBAN account number is automatically created for you. Anyone can transfer money from GTBank, Zenith, Access, Kuda, or OPay directly into your PAVE wallet.
            </p>

            <button
              onClick={() => onOpenApp("signup")}
              className="px-7 py-3.5 rounded-full bg-white text-[#1E1B4B] font-bold text-sm hover:bg-purple-50 transition-colors cursor-pointer shadow-lg"
            >
              Claim Your Account Number
            </button>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/80 font-medium">Wema Bank / PAVE MFB</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-400/30">
                Active & Verified
              </span>
            </div>

            <div className="text-xs text-white/80 mb-1 font-medium">Your Account Number</div>
            <div className="flex items-center justify-between bg-black/25 rounded-xl px-4 py-3 mb-4 border border-white/10">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white">
                9876543210
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
                title="Copy account number"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Changed account name to Jona Israel as requested */}
            <div className="text-sm text-white/90">
              Account Name: <strong className="text-white font-bold">Jona Israel</strong>
            </div>
            <div className="text-xs text-purple-200 mt-1">
              PAVE Tag: <span className="font-mono font-semibold text-white">@benjamin_0000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Transfer Answers
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Frequently Asked Transfer Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#121426] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
