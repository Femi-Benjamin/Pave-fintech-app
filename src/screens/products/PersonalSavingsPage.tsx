import React, { useState } from "react";
import {
  Wallet,
  PiggyBank,
  Lock,
  Unlock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import personalHeroImg from "../../assets/images/personal_savings_hero_1791561136749.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function PersonalSavingsPage({ onOpenApp }: PageProps) {
  const [monthlyDeposit, setMonthlyDeposit] = useState(30000);
  const [months, setMonths] = useState(6);
  const [planType, setPlanType] = useState<"flex" | "lock">("lock");

  // 10.5% p.a. on Flex, 14.2% p.a. on Lockbox
  const annualRate = planType === "lock" ? 0.142 : 0.105;
  const totalPrincipal = monthlyDeposit * months;
  // Compounded estimate
  const totalInterest = Math.round(
    totalPrincipal * (annualRate * (months / 12)) * 0.58,
  );
  const totalMaturity = totalPrincipal + totalInterest;
  const bankInterest = Math.round(totalPrincipal * (0.015 * (months / 12)));

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-[#059669] dark:text-[#10B981] text-xs font-bold w-fit border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <PiggyBank size={14} />
              <span>Earn Up to 14.2% Per Annum</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Personal Savings Designed to Beat Inflation
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Take complete control of your financial destiny with automated vaults. 
              Save flexibly for daily peace of mind or lock funds away to protect against 
              impulsive spending—while earning daily interest dividends.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-[#059669]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Start Saving Today</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/70 dark:bg-transparent"
              >
                Manage My Vault
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>NDIC Insured Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span>Daily Interest Accrual</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Zero Maintenance Fees</span>
              </div>
            </div>
          </div>

          {/* Hero Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10">
              <img
                src={personalHeroImg}
                alt="Young professional monitoring personal savings progress on PAVE app"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  Emergency Vault · 85% Target Reached
                </div>
                <div className="text-xl font-bold">₦176,500 Accrued Balance</div>
                <div className="text-xs text-white/90">+₦2,430 Interest Earned this Month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Two Distinct Savings Modes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flex Vault */}
          <div className="bg-white dark:bg-[#121426] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-[#3730A3] dark:text-[#818CF8] flex items-center justify-center mb-6">
                <Unlock size={24} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                  Flex Vault
                </h3>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#3730A3] dark:text-[#818CF8] text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                  10.5% p.a.
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                Save on your own terms with unlimited free withdrawals anytime. Ideal for emergency funds, rent cushions, or liquid cash reserves.
              </p>

              <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-200 font-normal">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#3730A3] dark:text-[#818CF8] shrink-0" />
                  <span>Withdraw 24/7 without penal fees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#3730A3] dark:text-[#818CF8] shrink-0" />
                  <span>Interest credited to your wallet at midnight daily</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#3730A3] dark:text-[#818CF8] shrink-0" />
                  <span>Automated weekly or monthly standing orders</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenApp("signup")}
              className="mt-8 w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md transition-colors cursor-pointer text-center"
            >
              Start Flex Vault
            </button>
          </div>

          {/* Lockbox */}
          <div className="bg-white dark:bg-[#121426] rounded-3xl p-8 border border-emerald-300 dark:border-emerald-800 shadow-md ring-1 ring-emerald-500/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-[#059669] dark:text-[#10B981] flex items-center justify-center mb-6">
                <Lock size={24} />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                  Target Lockbox
                </h3>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#059669] dark:text-[#10B981] text-xs font-bold border border-emerald-300 dark:border-emerald-800/60">
                  14.2% p.a.
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                Commit funds for 30 to 365 days. Lock away temptation while your money compounds at top-tier institutional interest rates.
              </p>

              <ul className="space-y-3 text-sm text-slate-800 dark:text-slate-200 font-normal">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Highest guaranteed return in the fintech sector</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Upfront interest payout option available</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Strict lock prevents impulsive withdrawals</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenApp("signup")}
              className="mt-8 w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-colors cursor-pointer text-center"
            >
              Lock Funds for 14.2% Return
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Compound Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Yield Estimator
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Watch Your Money Outgrow Commercial Banks
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              Calculate projected earnings on your monthly personal deposits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Type toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Select Product Vault
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPlanType("lock")}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      planType === "lock"
                        ? "bg-emerald-50 dark:bg-emerald-950/70 border-[#059669] text-[#059669] dark:text-[#10B981] shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Lockbox (14.2% p.a.)
                  </button>
                  <button
                    onClick={() => setPlanType("flex")}
                    className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      planType === "flex"
                        ? "bg-indigo-50 dark:bg-indigo-950/70 border-[#3730A3] text-[#3730A3] dark:text-[#818CF8] shadow-xs"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    Flex Vault (10.5% p.a.)
                  </button>
                </div>
              </div>

              {/* Monthly Deposit Slider */}
              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Monthly Deposit
                  </label>
                  <span className="text-base font-extrabold text-[#059669] dark:text-[#10B981]">
                    ₦{monthlyDeposit.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={5000}
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full accent-[#059669] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>₦5,000/mo</span>
                  <span>₦100,000/mo</span>
                  <span>₦200,000/mo</span>
                </div>
              </div>

              {/* Duration Slider */}
              <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Duration
                  </label>
                  <span className="text-base font-extrabold text-[#059669] dark:text-[#10B981]">
                    {months} Months
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-[#059669] cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>1 Month</span>
                  <span>6 Months</span>
                  <span>12 Months</span>
                </div>
              </div>
            </div>

            {/* Calculations Output */}
            <div className="lg:col-span-5 bg-linear-to-br from-[#064E3B] to-[#059669] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
                  Projected Maturity Value
                </span>
                <div
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  ₦{totalMaturity.toLocaleString()}
                </div>

                <div className="space-y-3 border-t border-white/20 pt-4 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Total Capital Saved</span>
                    <span className="font-bold">₦{totalPrincipal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">PAVE Interest Earned</span>
                    <span className="font-bold text-emerald-300">+₦{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-200/80">
                    <span>Average Bank Interest</span>
                    <span>₦{bankInterest.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenApp("signup")}
                className="mt-6 w-full py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#064E3B] font-bold text-sm transition-colors cursor-pointer text-center shadow-md"
              >
                Start Earning ₦{totalInterest.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
