import React, { useState } from "react";
import {
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  PieChart,
  Landmark,
  Coins,
  Sparkles,
  Clock,
  Bell,
  Check,
} from "lucide-react";

interface PageProps {
  onOpenApp: (action?: "login" | "signup") => void;
}

export default function InvestmentClanPage({ onOpenApp }: PageProps) {
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setJoinedWaitlist(true);
      setTimeout(() => setJoinedWaitlist(false), 4000);
      setWaitlistEmail("");
    }
  };

  const clans = [
    {
      title: "Commercial Real Estate Syndicate",
      yieldRate: "18.5% p.a. Projected",
      lock: "12 Months",
      risk: "Asset-Backed",
      desc: "Pool funds with verified clan members to co-invest in high-yield commercial warehouse and retail properties in Lekki and Ikeja.",
      min: "₦50,000",
      status: "Coming Soon",
    },
    {
      title: "Agro-Export Commodity Pool",
      yieldRate: "22.0% p.a. Projected",
      lock: "9 Months",
      risk: "Insured Contracts",
      desc: "Pre-finance cashew, sesame, and cocoa export fulfillment contracts with guaranteed buyer LC backing and Leadway insurance.",
      min: "₦100,000",
      status: "Coming Soon",
    },
    {
      title: "Fixed Income Treasury Vault",
      yieldRate: "16.8% p.a. Projected",
      lock: "6 Months",
      risk: "Federal Backed",
      desc: "Institutional Federal Government of Nigeria treasury bills and commercial paper backed by top tier-1 corporate entities.",
      min: "₦20,000",
      status: "Coming Soon",
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#0A0B14] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          {/* Prominent Coming Soon Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 shadow-xs flex items-center gap-1.5">
              <Clock size={13} />
              <span>Coming Soon</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60">
              Cooperative Asset Syndicates
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Investment Clan: Cooperative Asset Syndicates & Inflation-Hedged Wealth
          </h1>

          {/* Prominent Coming Soon Banner */}
          <div className="w-full mt-2 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm font-medium">
            🚀 <strong>Product Launch Notice:</strong> Investment Clans are currently undergoing final regulatory review with SEC-licensed asset managers. Register below to get first priority access to syndicate allocations.
          </div>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            Gain collective access to high-ticket, institutional-grade Nigerian 
            investments that are usually reserved for the ultra-wealthy. 
            Co-invest in real estate, insured agriculture, and high-yield treasury notes with bank-grade safety.
          </p>

          {/* Early Access Waitlist Form */}
          <form
            onSubmit={handleJoinWaitlist}
            className="w-full max-w-md flex flex-col sm:flex-row items-center gap-2.5 mt-2"
          >
            <input
              type="email"
              required
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-[#181B34] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-[#3730A3]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-2xl bg-[#3730A3] hover:bg-[#312E81] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Bell size={16} />
              <span>Get Notified</span>
            </button>
          </form>

          {joinedWaitlist && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>You have been added to the VIP Investment Clan waitlist!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              onClick={() => onOpenApp("signup")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Create PAVE Account Today</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onOpenApp("login")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm hover:bg-white dark:hover:bg-white/5 transition-colors cursor-pointer bg-white/60 dark:bg-transparent"
            >
              Sign In to Wallet
            </button>
          </div>
        </div>

        {/* Clans Grid - Solid Opaque High Contrast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {clans.map((c, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#121426] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold uppercase border border-amber-300 dark:border-amber-700/60">
                    {c.status}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-[#3730A3] dark:text-[#818CF8] text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/50">
                    {c.yieldRate}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                  {c.desc}
                </p>

                <div className="space-y-2 border-t border-slate-200 dark:border-white/10 pt-4 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Minimum Allocation:</span>
                    <strong className="text-slate-950 dark:text-slate-100 text-sm">{c.min}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tenure Lock:</span>
                    <strong className="text-slate-950 dark:text-slate-100 text-sm">{c.lock}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Profile:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400">{c.risk}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => onOpenApp("signup")}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Join Clan Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
