import React, { useState } from "react";
import {
  Smartphone,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Signal,
  RotateCw,
  Gift,
  Clock,
  Check,
  Building2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import airtimeHeroImg from "../../assets/images/airtime_data_hero_1791561848661.jpg";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function AirtimeDataPage({ onOpenApp }: PageProps) {
  const [network, setNetwork] = useState<"mtn" | "airtel" | "glo" | "9mobile">("mtn");
  const [mode, setMode] = useState<"airtime" | "data">("data");
  const [phone, setPhone] = useState("0814 892 4510");
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(2);
  const [airtimeAmount, setAirtimeAmount] = useState(2000);
  const [monthlySpend, setMonthlySpend] = useState(20000);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const annualSpend = monthlySpend * 12;
  const annualCashback = Math.round(annualSpend * 0.03); // 3% cashback

  const networks = [
    { id: "mtn", name: "MTN Nigeria", color: "#FBBF24", cash: "3% Cashback" },
    { id: "airtel", name: "Airtel", color: "#EF4444", cash: "3% Cashback" },
    { id: "glo", name: "Globacom", color: "#10B981", cash: "3% Cashback" },
    { id: "9mobile", name: "9mobile", color: "#059669", cash: "3% Cashback" },
  ];

  const dataPlans = [
    { title: "1.5 GB", validity: "30 Days", price: 1200, bonus: "+₦36 Back" },
    { title: "3.5 GB", validity: "30 Days", price: 2000, bonus: "+₦60 Back" },
    { title: "10 GB", validity: "30 Days", price: 3500, bonus: "+₦105 Back" },
  ];

  const currentPrice = mode === "data" ? (dataPlans[selectedPlanIndex]?.price ?? 3500) : airtimeAmount;
  const currentCashback = Math.round(currentPrice * 0.03);

  const handleSimulateRecharge = () => {
    setSimulatedSuccess(true);
    setTimeout(() => setSimulatedSuccess(false), 4000);
  };

  const faqs = [
    {
      q: "How does the 3% cashback work?",
      a: "Every time you purchase airtime or mobile data through PAVE, 3% of the total purchase value is instantly credited into your digital savings vault. There are no limits or coupon codes required.",
    },
    {
      q: "Does PAVE charge extra convenience or SMS fees?",
      a: "Never. Unlike traditional commercial banks that charge ₦6.98 or ₦10 per airtime top-up session, PAVE is 100% free with zero hidden bank surcharges.",
    },
    {
      q: "Can I schedule automated data renewals before my plan expires?",
      a: "Yes! You can toggle Auto-Renew on any data bundle. PAVE will verify your balance and renew your bundle 2 hours before expiration, ensuring you never experience midnight outages.",
    },
    {
      q: "Can businesses recharge corporate team lines in bulk?",
      a: "Yes, our SME Corporate portal allows you to upload a spreadsheet of employee phone numbers and disburse monthly data allowances with unified billing and tax receipts.",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold w-fit border border-blue-200 dark:border-blue-800/60 shadow-xs">
              <Smartphone size={14} />
              <span>Instant VTU & 3% Continuous Cashback</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Airtime & High-Speed Data with Instant Rewards
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              Never get disconnected during critical meetings, zoom calls, or midnight family emergencies. 
              Top up MTN, Airtel, Glo, and 9mobile in under 5 seconds with zero bank surcharges 
              and pocket guaranteed 3% instant cashback straight into your PAVE savings vault.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenApp("signup")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Recharge with Cashback</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onOpenApp("login")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-white/5 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-colors cursor-pointer bg-white/70 dark:bg-transparent"
              >
                Sign In to Top Up
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" />
                <span>3% Instant Wallet Cashback</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span>Zero Bank Top-Up Surcharges</span>
              </div>
              <div className="flex items-center gap-2">
                <Signal size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>All 4 Nigerian Networks</span>
              </div>
            </div>
          </div>

          {/* Photography Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 aspect-16/10">
              <img
                src={airtimeHeroImg}
                alt="Young Nigerian woman in creative workspace recharging high speed mobile data on PAVE"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                  5G Ultra Bundle Active
                </div>
                <div className="text-xl font-bold">10GB 30-Day Monthly Top-Up</div>
                <div className="text-xs text-white/90">+₦105 Instant Cashback Credited to Vault in 1.4s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Quick Recharge Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
              Interactive Top-Up Simulator
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Experience 2-Second Recharge with Guaranteed Cashback
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2">
              Try our instant simulator to see how quick and cost-effective mobile top-ups are on PAVE.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Configuration Controls (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Operator Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Select Mobile Network
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {networks.map((net) => (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setNetwork(net.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        network === net.id
                          ? "bg-blue-50 dark:bg-blue-950/60 border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs"
                          : "bg-slate-50 dark:bg-[#181B34] border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: net.color }}
                        />
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                          3% Back
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-950 dark:text-white">
                        {net.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Airtime vs Data Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Top-Up Category
                </label>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => setMode("data")}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "data"
                        ? "bg-white dark:bg-[#1A1D36] text-[#2563EB] dark:text-[#60A5FA] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    Data Bundles
                  </button>
                  <button
                    onClick={() => setMode("airtime")}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "airtime"
                        ? "bg-white dark:bg-[#1A1D36] text-[#2563EB] dark:text-[#60A5FA] shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    }`}
                  >
                    Airtime Recharge
                  </button>
                </div>
              </div>

              {/* Recipient Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="080 1234 5678"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:border-[#2563EB]"
                  />
                  <div className="absolute right-3.5 top-3 flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/50 px-2 py-1 rounded-lg">
                    <Signal size={13} />
                    <span>Auto-Detected {network.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Data Packages OR Airtime Amount */}
              {mode === "data" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Select Data Plan
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {dataPlans.map((dp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPlanIndex(idx)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedPlanIndex === idx
                            ? "bg-blue-50 dark:bg-blue-950/70 border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs"
                            : "bg-white dark:bg-[#181B34] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="text-base font-extrabold text-slate-950 dark:text-white">
                          {dp.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          {dp.validity}
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-950 dark:text-white">₦{dp.price.toLocaleString()}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{dp.bonus}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-[#181B34] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Airtime Recharge Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAirtimeAmount(amt)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          airtimeAmount === amt
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-[#121426] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        ₦{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Checkout Preview & Cashback Summary (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-[#181B34] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recharge Summary
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                    Active Promotion
                  </span>
                </div>

                <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-white/10 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Recipient:</span>
                    <span className="font-mono font-bold text-slate-950 dark:text-white">{phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Carrier:</span>
                    <span className="font-bold text-slate-950 dark:text-white capitalize">{network} Nigeria</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Product:</span>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {mode === "data" ? `${dataPlans[selectedPlanIndex].title} (${dataPlans[selectedPlanIndex].validity})` : `₦${airtimeAmount.toLocaleString()} Airtime`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Bank Surcharge:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₦0.00 (Zero Fee)
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/10">
                    <span className="text-base font-bold text-slate-950 dark:text-white">Amount to Pay:</span>
                    <span className="text-xl font-black text-slate-950 dark:text-white">
                      ₦{currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Cashback Reward Highlight Card */}
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                      Instant 3% Cashback
                    </div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 font-normal">
                      Paid straight into your digital savings vault
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    +₦{currentCashback.toLocaleString()}
                  </span>
                </div>

                {simulatedSuccess && (
                  <div className="mt-5 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400" />
                      <strong className="text-sm">Recharge Delivered in 1.8s!</strong>
                    </div>
                    <p className="text-xs">
                      Reference: PAVE-VTU-{Math.floor(Math.random() * 899999 + 100000)} · Network SMS delivered to {phone}.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSimulateRecharge}
                  className="w-full py-3.5 px-6 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Test Instant Recharge (Simulate)
                </button>
                <button
                  type="button"
                  onClick={() => onOpenApp("signup")}
                  className="w-full py-3 px-6 rounded-full bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-slate-100 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Create Account for Real Cashback
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Cashback Annual Savings Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-linear-to-r from-[#172554] via-[#1E40AF] to-[#2563EB] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              The Math of 3% Cashback
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold mt-1 mb-4"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              How Much Do You Lose to Commercial Banks Every Year?
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-6 font-normal">
              Most Nigerians spend between ₦15,000 and ₦50,000 every month on data and voice minutes. 
              On standard banking apps, you pay extra convenience charges and earn ₦0 back. 
              On PAVE, every recharge passively funds your year-end holiday or savings goal.
            </p>

            <button
              onClick={() => onOpenApp("signup")}
              className="px-7 py-3.5 rounded-full bg-white text-[#172554] font-bold text-sm hover:bg-blue-50 transition-colors cursor-pointer shadow-lg"
            >
              Start Earning Cashback Today
            </button>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/80 font-medium">Your Monthly Telecom Budget</span>
              <span className="text-base font-extrabold text-white">₦{monthlySpend.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2500}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="w-full accent-white cursor-pointer mb-6"
            />

            <div className="space-y-3 text-sm border-t border-white/15 pt-4">
              <div className="flex justify-between">
                <span className="text-blue-100">Annual Telecommunications Spend:</span>
                <span className="font-bold">₦{annualSpend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Commercial Bank Cashback:</span>
                <span className="font-mono text-rose-300">₦0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="font-bold text-emerald-300">Your Guaranteed PAVE Cashback:</span>
                <span className="font-black text-xl text-emerald-300">
                  +₦{annualCashback.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Airtime & Data Answers
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1.5"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Frequently Asked Telecom Questions
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
