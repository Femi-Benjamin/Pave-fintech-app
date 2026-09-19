import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet,
  PiggyBank,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import Logo from "./Logo";

interface OnboardingScreenProps {
  onNavigate: (screen: "signup" | "login") => void;
}

export default function OnboardingScreen({
  onNavigate,
}: OnboardingScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!isDark) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        gridRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        gridRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDark]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const faqs = [
    {
      question: "Is my money safe with PAVE?",
      answer:
        "Absolutely. PAVE uses bank-grade encryption and is licensed by the Central Bank of Nigeria. Your funds are held securely and insured.",
    },
    {
      question: "What is KYC and why is it required?",
      answer:
        "KYC (Know Your Customer) verification confirms your identity using your BVN and NIN. This protects you from fraud and is required by regulation before you can make transactions.",
    },
    {
      question: "Can I withdraw my savings anytime?",
      answer:
        "Flexible savings can be withdrawn anytime. Fixed savings have a lock period, and early withdrawal incurs a small penalty.",
    },
    {
      question: "How does Thrift (Ajo) work?",
      answer:
        "You contribute a fixed amount at regular intervals (daily, weekly, or monthly). After a set period, you receive your total contributions. Missing contributions may incur penalties.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "You can fund your wallet via debit/credit card, bank transfer, or USSD. Withdrawals are sent directly to your verified bank account.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F7] in-[.dark]:bg-background flex flex-col antialiased font-sans text-on-background overflow-x-hidden scrollbar-hide transition-colors duration-300">
      {/* Background Dot Graphic - refined soft visibility */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] in-[.dark]:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-size-[24px_24px] opacity-30 in-[.dark]:opacity-25"></div>

      {/* Illuminated Grid Hover Effect - Dark Mode Only & 0 React Re-renders */}
      {isDark && (
        <div
          ref={gridRef}
          className="fixed inset-0 z-0 pointer-events-none opacity-100 transition-opacity duration-0"
          style={{
            backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.65) 1.25px, transparent 1.25px)`,
            backgroundSize: "24px 24px",
            WebkitMaskImage: `radial-gradient(420px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 15%, rgba(0,0,0,0.5) 45%, transparent 75%)`,
            maskImage: `radial-gradient(420px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 15%, rgba(0,0,0,0.5) 45%, transparent 75%)`,
          }}
        />
      )}

      {/* Top Brand/Nav */}
      <header className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/50"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => onNavigate("signup")}
            className="bg-primary hover:bg-primary/90 text-on-primary font-semibold py-2 px-5 rounded-full opacity-90 transition-all text-sm shadow-md hover:shadow-lg active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 py-5 flex flex-col items-center text-center max-w-5xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-display font-extrabold text-on-background mb-8 leading-[1.05] tracking-tight"
        >
          Save Smarter.
          <br />
          Grow Together.
          <br />
          <span className="text-primary opacity-90">Build Wealth.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 font-light leading-relaxed"
        >
          PAVE is your digital wallet for savings and traditional thrift
          contributions (Ajo/Esusu). Build financial discipline with automated
          savings and community-powered growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigate("signup")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-on-primary font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
          >
            Get Started Free
          </button>
          <button
            type="button"
            className="w-full sm:w-auto bg-transparent hover:bg-surface-variant/30 text-on-background font-bold py-4 px-10 rounded-full border-2 border-on-background uppercase tracking-wider text-sm transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            Download the Pave App
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-on-surface-variant font-medium uppercase tracking-widest"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> Bank-grade
            Security
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> CBN Licensed
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> 24/7 Support
          </span>
        </motion.div>
      </section>

      {/* Minimal Clean Ticker Marquee */}
      <div className="w-full max-w-full min-w-0 overflow-hidden relative z-10 border-y border-slate-200/80 in-[.dark]:border-white/10 bg-white/40 in-[.dark]:bg-surface/30 backdrop-blur-xs py-3 mt-4">
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 inset-y-0 w-12 md:w-32 z-10 pointer-events-none bg-linear-to-r from-[#F1F3F7] in-[.dark]:from-background to-transparent" />
        <div className="absolute right-0 inset-y-0 w-12 md:w-32 z-10 pointer-events-none bg-linear-to-l from-[#F1F3F7] in-[.dark]:from-background to-transparent" />

        <div className="animate-marquee-slow flex items-center">
          {[0, 1].map((trackIdx) => (
            <div
              key={`min-track-${trackIdx}`}
              className="flex items-center shrink-0"
              aria-hidden={trackIdx === 1 ? "true" : undefined}
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`min-${trackIdx}-${idx}`}
                  className="flex items-center gap-5 md:gap-7 px-3 md:px-4 select-none whitespace-nowrap"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.22em] text-slate-900 in-[.dark]:text-slate-100 flex items-center gap-2 shrink-0">
                    <span>🚀</span> BUILDING FINANCIAL DISCIPLINE
                  </span>
                  <span className="text-slate-300 in-[.dark]:text-slate-700 text-xs shrink-0">
                    /
                  </span>
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] md:tracking-[0.2em] text-slate-500 in-[.dark]:text-slate-400 shrink-0">
                    AUTOMATED SAVINGS
                  </span>
                  <span className="text-slate-300 in-[.dark]:text-slate-700 text-xs shrink-0">
                    /
                  </span>
                  <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] md:tracking-[0.2em] text-slate-500 in-[.dark]:text-slate-400 shrink-0">
                    COMMUNITY THRIFT
                  </span>
                  <span className="text-slate-300 in-[.dark]:text-slate-700 text-xs shrink-0">
                    /
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-full min-w-0 px-4 sm:px-6 py-16 md:py-24 bg-slate-50/70 in-[.dark]:bg-surface/50 z-10 relative border-y border-slate-200/60 in-[.dark]:border-outline-variant/30 backdrop-blur-sm overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-20 px-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white mb-4 sm:mb-6 tracking-tight text-center wrap-break-words">
              Everything You Need to Save & Grow
            </h2>
            <p className="text-slate-600 in-[.dark]:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-normal text-center leading-relaxed">
              From your digital wallet to traditional thrift contributions, PAVE
              has all the tools you need to build lasting financial habits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Wallet,
                title: "Digital Wallet",
                desc: "Fund your wallet instantly via card, USSD, or bank transfer. Withdraw anytime.",
                color: "text-primary",
                bgGradient: "from-blue-50/60 via-white/80 to-indigo-50/40",
              },
              {
                icon: PiggyBank,
                title: "Smart Savings",
                desc: "Create flexible or fixed savings plans with automated deposits and competitive interest.",
                color: "text-purple-600 in-[.dark]:text-purple-400",
                bgGradient: "from-purple-50/60 via-white/80 to-pink-50/40",
              },
              {
                icon: Users,
                title: "Thrift (Ajo/Esusu)",
                desc: "Join or create traditional contribution groups. Build wealth together with your community.",
                color: "text-emerald-600 in-[.dark]:text-emerald-400",
                bgGradient: "from-emerald-50/60 via-white/80 to-teal-50/40",
              },
              {
                icon: Shield,
                title: "Secure & Verified",
                desc: "Bank-grade encryption with mandatory KYC verification for complete peace of mind.",
                color: "text-indigo-600 in-[.dark]:text-indigo-400",
                bgGradient: "from-sky-50/60 via-white/80 to-blue-50/40",
              },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className="bg-white/85 in-[.dark]:bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-white/90 in-[.dark]:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-slate-100/40 via-transparent to-transparent in-[.dark]:from-white/5 rounded-bl-full pointer-events-none" />
                <div
                  className={`${feature.color} mb-6 relative z-10 p-3 rounded-xl bg-slate-50 in-[.dark]:bg-slate-800/60 inline-block border border-slate-100 in-[.dark]:border-white/5 shadow-xs`}
                >
                  <feature.icon size={32} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 in-[.dark]:text-white mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-600 in-[.dark]:text-slate-400 text-sm leading-relaxed font-normal relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Feature Split 1 - Savings */}
      <motion.section
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-900 in-[.dark]:bg-purple-950/60 in-[.dark]:border-purple-800/40 in-[.dark]:text-purple-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-xs">
              Savings
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white mb-6 tracking-tight leading-[1.15]">
              Save for What Matters Most
            </h2>
            <p className="text-lg md:text-xl text-slate-700 in-[.dark]:text-slate-300 mb-8 leading-relaxed font-normal">
              Whether it's an emergency fund, a new car, or your dream vacation,
              PAVE helps you reach your goals faster with smart automated
              savings.
            </p>

            <ul className="space-y-4 mb-10 w-full">
              {[
                "Flexible savings - withdraw anytime",
                "Fixed savings with higher interest rates",
                "Auto-debit from your wallet",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-800 in-[.dark]:text-slate-200 font-medium text-base"
                >
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onNavigate("signup")}
              className="bg-slate-900 hover:bg-slate-800 text-white in-[.dark]:bg-white in-[.dark]:text-slate-900 in-[.dark]:hover:bg-slate-100 font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center"
            >
              Start Saving Today
            </button>
          </motion.div>

          {/* Right Column: Liquid Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.3 } }}
              className="w-full max-w-lg min-h-87.5 bg-linear-to-br from-[#E0E7FF] via-[#EEF2FF] to-[#DCE4FF] in-[.dark]:from-indigo-950/40 in-[.dark]:via-purple-950/20 in-[.dark]:to-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center border-2 border-indigo-200/90 in-[.dark]:border-white/10 shadow-[0_20px_45px_-8px_rgba(99,102,241,0.22),inset_0_1px_3px_rgba(255,255,255,0.95)] hover:shadow-[0_25px_55px_-5px_rgba(99,102,241,0.28)] transition-all duration-500 relative overflow-hidden"
            >
              {/* Ambient Flare */}
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-indigo-400/40 to-purple-400/20 in-[.dark]:from-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Inner Floating Card */}
              <div className="w-full bg-white in-[.dark]:bg-[#181d24] rounded-2xl p-7 md:p-9 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.1),0_4px_12px_-2px_rgba(15,23,42,0.06)] border border-slate-100/90 in-[.dark]:border-white/10 relative overflow-hidden z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white in-[.dark]:via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-100 in-[.dark]:border-slate-800/80">
                  <div>
                    <div className="text-slate-500 in-[.dark]:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                      Emergency Fund
                    </div>
                    <div className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white">
                      ₦185,000
                    </div>
                  </div>
                  <div className="text-primary in-[.dark]:text-indigo-400 text-2xl md:text-3xl font-extrabold">
                    37%
                  </div>
                </div>

                {/* Subtitle */}
                <div className="text-slate-600 in-[.dark]:text-slate-400 text-sm font-semibold mb-3">
                  Goal: ₦500,000
                </div>

                {/* Progress Bar with Liquid Glow */}
                <div className="h-4 w-full bg-[#F1F5F9] in-[.dark]:bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-200/50 in-[.dark]:border-white/5">
                  <div className="h-full bg-linear-to-r from-primary to-indigo-500 rounded-full w-[37%] transition-all duration-500 shadow-sm shadow-primary/25"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Split 2 - Thrift (Ajo/Esusu) */}
      <motion.section
        initial={{ opacity: 0, y: 45 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Liquid Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.3 } }}
              className="w-full max-w-lg min-h-87.5 bg-linear-to-br from-[#D1FAE5] via-[#E6F9F0] to-[#BAF7D5] in-[.dark]:from-emerald-950/40 in-[.dark]:via-teal-950/20 in-[.dark]:to-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex items-center justify-center border-2 border-emerald-300/80 in-[.dark]:border-white/10 shadow-[0_20px_45px_-8px_rgba(16,185,129,0.22),inset_0_1px_3px_rgba(255,255,255,0.95)] hover:shadow-[0_25px_55px_-5px_rgba(16,185,129,0.28)] transition-all duration-500 relative overflow-hidden"
            >
              {/* Ambient Flare */}
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-linear-to-br from-emerald-400/40 to-teal-400/20 in-[.dark]:from-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Inner Floating Card */}
              <div className="w-full bg-white in-[.dark]:bg-[#181d24] rounded-2xl p-7 md:p-9 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.1),0_4px_12px_-2px_rgba(15,23,42,0.06)] border border-slate-100/90 in-[.dark]:border-white/10 relative overflow-hidden z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white in-[.dark]:via-white/20 to-transparent" />

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 in-[.dark]:bg-emerald-900/40 text-emerald-600 in-[.dark]:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100/60 in-[.dark]:border-emerald-800/30">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 in-[.dark]:text-white tracking-tight">
                      Community Weekly Savings
                    </h4>
                    <p className="text-sm text-slate-600 in-[.dark]:text-slate-400 font-medium mt-0.5">
                      Weekly • ₦5,000/contribution
                    </p>
                  </div>
                </div>

                {/* Progress Grid */}
                <div className="grid grid-cols-6 gap-2.5 my-6">
                  {/* Row 1: 3 completed (liquid green), 3 upcoming (alabaster) */}
                  <div className="h-9 md:h-10 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 shadow-xs shadow-emerald-500/20" />
                  <div className="h-9 md:h-10 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 shadow-xs shadow-emerald-500/20" />
                  <div className="h-9 md:h-10 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 shadow-xs shadow-emerald-500/20" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />

                  {/* Row 2: 6 upcoming (alabaster) */}
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                  <div className="h-9 md:h-10 rounded-xl bg-[#F1F5F9] in-[.dark]:bg-slate-800/80 border border-slate-200/50 in-[.dark]:border-white/5" />
                </div>

                {/* Footer text */}
                <p className="text-xs md:text-sm text-slate-500 in-[.dark]:text-slate-400 font-medium">
                  3 of 24 contributions made
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Text & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl order-1 lg:order-2"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200/80 text-emerald-900 in-[.dark]:bg-emerald-950/60 in-[.dark]:border-emerald-800/40 in-[.dark]:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
              Thrift (Ajo/Esusu)
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white mb-6 tracking-tight leading-[1.15]">
              Grow Together with Community Savings
            </h2>
            <p className="text-lg md:text-xl text-slate-700 in-[.dark]:text-slate-300 mb-8 leading-relaxed font-normal">
              Experience the power of traditional thrift contributions,
              digitized. Regular contributions build discipline while the
              community keeps you accountable.
            </p>

            <ul className="space-y-4 mb-10 w-full">
              {[
                "Daily, weekly, or monthly contributions",
                "Automatic wallet deductions",
                "Track your contribution calendar",
                "Penalties for missed contributions",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-800 in-[.dark]:text-slate-200 font-medium text-base"
                >
                  <CheckCircle2 size={20} className="text-[#10B981] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onNavigate("signup")}
              className="bg-[#10B981] hover:bg-[#0ea372] text-white font-semibold py-4 px-8 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center"
            >
              Join a Thrift Group
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-6 py-24 bg-slate-50/70 in-[.dark]:bg-surface/50 z-10 relative border-y border-slate-200/60 in-[.dark]:border-outline-variant/30 backdrop-blur-sm"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 in-[.dark]:text-slate-300 text-lg font-normal">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white/85 in-[.dark]:bg-slate-900/60 backdrop-blur-md border border-slate-200/70 in-[.dark]:border-white/10 rounded-2xl overflow-hidden hover:border-slate-300 in-[.dark]:hover:border-white/20 shadow-xs transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 in-[.dark]:text-white text-lg"
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    className={`text-slate-500 in-[.dark]:text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-slate-600 in-[.dark]:text-slate-300 text-base leading-relaxed font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 py-24 md:py-32 z-10 relative mb-8"
      >
        <div className="max-w-4xl mx-auto relative px-2">
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-2 bg-linear-to-r from-purple-200/60 via-indigo-100/50 to-blue-200/60 in-[.dark]:from-indigo-950/40 in-[.dark]:via-purple-950/30 in-[.dark]:to-slate-900/40 rounded-[3rem] blur-xl -z-10 pointer-events-none opacity-70 in-[.dark]:opacity-50" />

          {/* Card: Clean Offwhite in Light Mode vs Low-Glare in Dark Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-[#F1F5F9] in-[.dark]:bg-linear-to-br in-[.dark]:from-[#111625] in-[.dark]:via-[#161d2f] in-[.dark]:to-[#0d121f] text-slate-900 in-[.dark]:text-white rounded-3xl md:rounded-[3rem] p-8 sm:p-12 md:p-18 text-center relative shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08)] in-[.dark]:shadow-xl in-[.dark]:shadow-black/30 border-2 border-slate-300/80 in-[.dark]:border-white/10 overflow-hidden"
          >
            {/* Subtle soft flares inside */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-200/40 in-[.dark]:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-200/40 in-[.dark]:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300 in-[.dark]:via-white/15 to-transparent" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 in-[.dark]:text-white mb-4 sm:mb-6 tracking-tight leading-[1.15] relative z-10">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-slate-600 in-[.dark]:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg mb-8 md:mb-10 font-normal leading-relaxed relative z-10 px-2">
              Join thousands of Nigerians building wealth with PAVE. Create your
              free account in minutes.
            </p>

            <button
              onClick={() => onNavigate("signup")}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-9 rounded-full uppercase tracking-wider text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center relative z-10 border border-primary/20 in-[.dark]:border-white/10 cursor-pointer"
            >
              Create Free Account <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-outline-variant/50 bg-surface z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Logo size="md" className="mb-6 justify-start" />
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                Building financial discipline through smart savings and cultural
                community contributions.
              </p>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">
                Product
              </h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Wallet
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Savings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Thrift (Ajo)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">
                Company
              </h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-bold text-on-surface mb-6 uppercase tracking-widest text-sm">
                Legal
              </h4>
              <ul className="space-y-4 text-sm text-on-surface-variant font-light">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant uppercase tracking-widest">
            <div>© {new Date().getFullYear()} PAVE. All rights reserved.</div>
            <div>Licensed by the Central Bank of Nigeria</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
