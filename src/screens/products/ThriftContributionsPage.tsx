import React, { useState } from "react";
import {
  RotateCw,
  Building2,
  Users2,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
  Landmark,
  BadgePercent,
  Sparkles,
  Calendar,
  Check,
  Lock,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import thriftHeroImg from "../../assets/images/thrift_contributions_hero_1791561150195.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function ThriftContributionsPage({ onOpenApp }: PageProps) {
  // Interactive Daily Thrift Simulator state
  const [dailyAmount, setDailyAmount] = useState(2000);
  const [activeDays, setActiveDays] = useState(30);

  const totalAccumulated = dailyAmount * activeDays;
  const standardCommissionFee = 0; // PAVE charges ₦0 vs traditional 1-day collector cut

  const tiers = [
    {
      title: "Daily Market Thrift (Alajo)",
      tag: "Traders & Daily Earners",
      desc: "Deposit consistent daily micro-contributions (₦500 - ₦10,000) collected automatically from your wallet every morning. Withdraw your lump sum at month-end without paper cards or physical collection risk.",
      icon: "🏪",
      rate: "Zero cash loss risk",
    },
    {
      title: "Weekly Cooperative Pool",
      tag: "SMEs & Salaried Staff",
      desc: "Pool funds with colleagues or business partners every Friday. Enjoy flexible rotation orders, automated SMS receipts, and penalty-backed accountability.",
      icon: "🏢",
      rate: "Automated wallet debit",
    },
    {
      title: "Monthly Executive Society",
      tag: "Alumni & High-Net-Worth Circles",
      desc: "High-volume thrift clubs (₦100,000 - ₦1,000,000 monthly). Features multi-signature administrative approvals, dividend sharing, and legal escrow protections.",
      icon: "💎",
      rate: "Multi-signature escrow",
    },
  ];

  const faqs = [
    {
      q: "What is the difference between Ajo Rotating Savings and Thrift Contribution?",
      a: "In Rotating Savings, members pool funds together and one member collects the full lump-sum each cycle on a rotational basis. In Daily Thrift (Alajo), you save your own money daily (e.g., ₦1,000/day) and collect your full lump-sum (₦30,000) at month-end.",
    },
    {
      q: "Do traditional thrift collectors take a cut, and how does PAVE differ?",
      a: "Yes, traditional street 'Alajo' collectors traditionally pocket the first day's contribution (e.g. 1/30th or ₦1,000) as their management fee. PAVE charges zero collection commission, so you collect 100% of your hard-earned money.",
    },
    {
      q: "Can cooperative associations manage their members on PAVE?",
      a: "Yes! Society presidents and treasurers can create a registered Cooperative Society on PAVE, invite members, set contribution rules, and generate audit-ready financial statements.",
    },
    {
      q: "Are the funds safe from theft or market fire disasters?",
      a: "Yes. All funds are held in CBN-regulated, NDIC-insured custody partner banks. Unlike physical cash kept under market counters, your money is 100% digitally secured.",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-[#D97706] dark:text-[#F59E0B] text-xs font-bold w-fit border border-amber-200 dark:border-amber-800/60 shadow-xs">
              <RotateCw size={14} />
              <span>Digitized Cooperative Finance</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Thrift Contributions Without Cash Risks or Lost Ledgers
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              We brought Nigeria’s revered cooperative culture into the
              smartphone era. Manage group thrift societies, track member
              ledgers with 100% digital transparency, and disburse payouts
              automatically with CBN-licensed bank security.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-lg shadow-[#D97706]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Start Daily Thrift</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/70 dark:bg-transparent"
              >
                Open Society Portal
              </button>
            </div>

            {/* <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400" />
                <span>₦0 First-Day Cut (Free Alajo)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>NDIC-Insured Custody</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>Automated Audit Ledger</span>
              </div>
            </div> */}
          </div>

          {/* Hero Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10 ">
              <img
                src={thriftHeroImg}
                alt="Nigerian market entrepreneur saving with digital daily thrift on PAVE"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  Daily Alajo Micro-Vault
                </div>
                <div className="text-xl font-bold">
                  ₦60,000 Saved This Month
                </div>
                <div className="text-xs text-white/90">
                  ₦2,000 auto-debited daily at 7:00 AM · Full lump sum ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Daily Alajo Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B]">
              Daily Thrift Tracker Simulator
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              See How Micro Daily Deposits Turn Into Working Capital
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              Save little-by-little each business day and collect your lump sum
              without fear of traditional cash collector disappearance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Select Daily Contribution Amount
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[500, 1000, 2000, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDailyAmount(amt)}
                      className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        dailyAmount === amt
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-white dark:bg-[#181B34] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Cycle Duration (Days in Month)
                  </label>
                  <span className="text-base font-extrabold text-[#D97706] dark:text-[#F59E0B]">
                    {activeDays} days
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={31}
                  value={activeDays}
                  onChange={(e) => setActiveDays(Number(e.target.value))}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>10 days (Short)</span>
                  <span>20 days (Mid)</span>
                  <span>31 days (Full Month)</span>
                </div>
              </div>

              {/* 30-day Calendar Grid Visualizer */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
                  Simulated Month Daily Check-in Card
                </span>
                <div className="grid grid-cols-7 gap-1.5 p-4 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                        i < activeDays
                          ? "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/70"
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600"
                      }`}
                    >
                      {i + 1}
                      {i < activeDays && (
                        <Check
                          size={12}
                          className="ml-1 text-amber-700 dark:text-amber-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Maturity Pot Card (6 cols) */}
            <div className="lg:col-span-6 bg-linear-to-br from-amber-950 via-[#B45309] to-[#D97706] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                    Digital Alajo Escrow
                  </span>
                  <span className="text-xs text-amber-100 font-medium">
                    Auto-Disbursed at Month End
                  </span>
                </div>

                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
                  Total Accumulated Lump Sum
                </span>
                <div
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  ₦{totalAccumulated.toLocaleString()}
                </div>

                <div className="space-y-3 border-t border-white/20 pt-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-amber-100">Daily Saved:</span>
                    <span className="font-bold">
                      ₦{dailyAmount.toLocaleString()}/day
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-100">PAVE Collection Fee:</span>
                    <span className="font-bold text-amber-200">
                      ₦0.00 (Zero Fee)
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-200/80">
                    <span>Street Alajo Deductions:</span>
                    <span>-₦{dailyAmount.toLocaleString()} (1st day lost)</span>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-2xl bg-black/20 border border-white/10 text-xs text-amber-100 flex items-center gap-2">
                  <BadgePercent size={16} className="text-amber-300 shrink-0" />
                  <span>
                    You retain 100% of your savings. Zero collector cuts!
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenApp("signup")}
                className="mt-8 w-full py-4 rounded-xl bg-white hover:bg-amber-50 text-[#B45309] font-bold text-sm shadow-md transition-colors cursor-pointer text-center"
              >
                Start Daily Thrift for ₦{dailyAmount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three Specialized Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cooperative Structure
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Thrift Cycles Built For Every Association
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
            Whether you run a market association in Balogun or an alumni
            network, PAVE automates the entire ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-4">{t.icon}</div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {t.tag}
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mt-1 mb-3">
                  {t.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  {t.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  {t.rate}
                </span>
                <button
                  onClick={() => onOpenApp("signup")}
                  className="font-bold text-[#D97706] hover:underline cursor-pointer"
                >
                  Join Circle →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Administrative Superpowers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Cooperative Leadership
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1 mb-3"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Admin Tools That Free You From Physical Paper Ledger Books
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              No more chasing debtors on the phone, balancing conflicting paper
              records, or carrying large bags of cash through traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <FileSpreadsheet
                    className="text-amber-600 dark:text-amber-400"
                    size={24}
                  />
                ),
                title: "1-Click PDF & Excel Reports",
                desc: "Export verified member contribution audit trails for general meetings and annual reports in one click.",
              },
              {
                icon: (
                  <Users2
                    className="text-amber-600 dark:text-amber-400"
                    size={24}
                  />
                ),
                title: "Automated Defaulter Safeguards",
                desc: "System sends automated gentle SMS & WhatsApp reminders 48 hours prior and charges backup cards if due.",
              },
              {
                icon: (
                  <Landmark
                    className="text-amber-600 dark:text-amber-400"
                    size={24}
                  />
                ),
                title: "Multi-Signature Approvals",
                desc: "President, Secretary, and Treasurer must each approve rotational lump-sum payouts via biometric auth.",
              },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-[#181B34] rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="mb-3">{feat.icon}</div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1.5">
                  {feat.title}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Common Inquiries
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Thrift & Cooperative Questions Answered
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

      {/* 6. Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-linear-to-r from-amber-950 via-[#92400E] to-[#D97706] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Digitize your community thrift society today
            </h2>
            <p className="text-sm sm:text-base text-amber-100/90 mt-2 font-normal">
              Free your association from manual book errors and cash collection
              security risks.
            </p>
          </div>
          <button
            onClick={() => onOpenApp("signup")}
            className="px-8 py-4 rounded-full bg-white hover:bg-amber-50 text-[#B45309] font-bold text-sm shrink-0 shadow-lg cursor-pointer transition-colors"
          >
            Create Society Account
          </button>
        </div>
      </section>
    </div>
  );
}
