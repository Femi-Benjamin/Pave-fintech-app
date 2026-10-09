import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Calendar,
  Zap,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import rotatingHeroImg from "../../assets/images/rotating_savings_hero_1791561125967.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function RotatingSavingsPage({ onOpenApp }: PageProps) {
  const [members, setMembers] = useState(10);
  const [amount, setAmount] = useState(50000);
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("monthly");

  const totalPot = members * amount;
  const cycleDurationWeeks = frequency === "weekly" ? members : members * 4.33;

  const faqs = [
    {
      q: "What happens if a member fails or refuses to pay their turn?",
      a: "PAVE eliminates informal default risk. Before joining any circle, all members undergo mandatory Tier-2 BVN/NIN identity verification and link a debit card with automated fallback authorization. If a debit fails, PAVE's escrow backup reserve ensures payouts occur on time while penalizing the defaulter's credit rating.",
    },
    {
      q: "How is the payout collection order determined?",
      a: "When creating a circle, the group admin can either configure a pre-agreed custom rotation schedule or enable PAVE's transparent cryptographic randomizer which assigns rotation turns fairly before the first deposit cycle begins.",
    },
    {
      q: "Are there any hidden fees or interest charges?",
      a: "None. PAVE Ajo circles have 0% interest. You receive 100% of the pooled lump-sum with zero processing deductions.",
    },
    {
      q: "Can I create a private circle just for my family or coworkers?",
      a: "Yes! You can generate an encrypted 6-character private invite link and distribute it strictly to your trusted colleagues, family members, or alumni association.",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#3730A3] dark:text-[#818CF8] text-xs font-bold w-fit border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
              <Users size={14} />
              <span>Digital Esusu · Ajo · Adashe Network</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Rotating Group Savings Powered by Smart Escrow
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Save with friends, family, or verified colleagues without the anxiety of 
              defaults. Everyone contributes periodically, and each member takes turns 
              receiving the entire lump-sum pot—guaranteed by PAVE's automated banking protocol.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#3730A3] hover:bg-[#312E81] text-white font-bold text-sm shadow-lg shadow-[#3730A3]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Start an Ajo Circle</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/70 dark:bg-transparent"
              >
                Join with Invite Code
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>CBN Licensed Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>Automated Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Default-Free Protocol</span>
              </div>
            </div>
          </div>

          {/* Hero Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10">
              <img
                src={rotatingHeroImg}
                alt="Nigerian professionals participating in modern Ajo group savings circle"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  Lagos Tech Cooperative Circle
                </div>
                <div className="text-xl font-bold">₦500,000 Weekly Lump-Sum Payout</div>
                <div className="text-xs text-white/90">10 Verified Members · Turn 4 Disbursed Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Payout Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Simulator
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Calculate Your Ajo Circle Payout
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              See exactly how much lump-sum capital you access and how your circle rotates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders Control (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Member count */}
              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Number of Members in Circle
                  </label>
                  <span className="text-base font-extrabold text-[#3730A3] dark:text-[#818CF8]">
                    {members} participants
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="w-full accent-[#3730A3] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>3 members</span>
                  <span>10 members</span>
                  <span>25 members</span>
                </div>
              </div>

              {/* Amount per person */}
              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Contribution Per Member
                  </label>
                  <span className="text-base font-extrabold text-[#3730A3] dark:text-[#818CF8]">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={250000}
                  step={5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-[#3730A3] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>₦5,000</span>
                  <span>₦100,000</span>
                  <span>₦250,000</span>
                </div>
              </div>

              {/* Frequency selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Contribution Frequency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFrequency("weekly")}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      frequency === "weekly"
                        ? "bg-indigo-50 dark:bg-indigo-950/70 border-[#3730A3] text-[#3730A3] dark:text-[#818CF8] shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Weekly Rotation
                  </button>
                  <button
                    onClick={() => setFrequency("monthly")}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      frequency === "monthly"
                        ? "bg-indigo-50 dark:bg-indigo-950/70 border-[#3730A3] text-[#3730A3] dark:text-[#818CF8] shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Monthly Rotation
                  </button>
                </div>
              </div>
            </div>

            {/* Result Box (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1E1B4B] to-[#3730A3] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-200">
                  Your Lump-Sum Payout
                </span>
                <div
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  ₦{totalPot.toLocaleString()}
                </div>
                <p className="text-sm text-indigo-100/90 leading-relaxed mb-6 font-normal">
                  Every round, one member collects this entire pot with zero loan interest or collateral requirements.
                </p>

                <div className="space-y-3 border-t border-white/20 pt-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Total Rounds</span>
                    <span className="font-bold">{members} Rounds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Turn Cycle</span>
                    <span className="font-bold capitalize">{frequency} Payout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">Approx. Duration</span>
                    <span className="font-bold">
                      {Math.round(cycleDurationWeeks)} {frequency === "weekly" ? "weeks" : "months"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenApp("signup")}
                className="mt-6 w-full py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-[#3730A3] font-bold text-sm text-center transition-colors cursor-pointer shadow-md"
              >
                Launch This Circle Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why PAVE Rotating Savings beats informal paper Ajo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Traditional Esusu vs. PAVE Smart Circles
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
            Why thousands of Nigerians trust PAVE over manual cash collectors and unverified WhatsApp groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-900/60 shadow-sm">
            <div className="text-red-600 dark:text-red-400 font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-xs font-bold">✕</span>
              Informal / Manual Ajo
            </div>
            <ul className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300 font-normal">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Risk of a member collecting Turn 1 and disappearing or refusing to pay subsequent rounds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Manual cash collection or constant bank transfer screenshot arguments on WhatsApp.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span>No legal identity verification or credit accountability.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">•</span>
                <span>Late payouts because individual members forget their due dates.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-8 border border-emerald-300 dark:border-emerald-800 shadow-md ring-1 ring-emerald-500/20">
            <div className="text-emerald-700 dark:text-emerald-400 font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs font-bold">✓</span>
              PAVE Rotating Savings Circle
            </div>
            <ul className="space-y-3.5 text-sm text-slate-800 dark:text-slate-200 font-normal">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Automated Wallet & Card Debits:</strong> funds are securely collected directly on the schedule.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Mandatory KYC Verification:</strong> every member is verified with valid BVN and National NIN.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Smart Escrow Protocol:</strong> automated backup payment charging prevents defaults.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Guaranteed Payout Date:</strong> your lump sum arrives like clockwork into your verified bank account.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white text-center mb-8"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
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
