import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet,
  PiggyBank,
  Users,
  Shield,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
  TrendingUp,
  Play,
  Star,
  Clock,
  Sliders,
  BadgeCheck,
  Lock,
  PlusCircle,
  Sparkles,
  Zap,
  Building2,
  Check,
  Download,
  Smartphone,
  X,
  QrCode,
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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const faqs = [
    {
      question: "Is my money safe with PAVE?",
      answer:
        "Absolutely. PAVE uses AES 256-bit bank-grade encryption and partners with NDIC-insured financial institutions regulated by the Central Bank of Nigeria. Your funds are held securely with deposit protection up to ₦5,000,000.",
    },
    {
      question: "What is KYC and why is it required?",
      answer:
        "KYC (Know Your Customer) verification confirms your identity using your BVN and NIN. This protects the entire community from fraud and ensures regulatory compliance before you can participate in thrift circles or make withdrawals.",
    },
    {
      question: "Can I withdraw my savings anytime?",
      answer:
        "Yes. Flexible savings can be withdrawn at any time directly to your verified commercial bank account. Fixed Lockbox savings have an agreed lock period to help you resist spending temptation, earning up to 14.2% p.a.",
    },
    {
      question: "How does Thrift (Ajo/Esusu) work?",
      answer:
        "You join or create a verified circle with trusted friends or community peers. Members contribute a fixed sum on a recurring schedule (weekly or monthly). Each cycle, one member receives the collected lump sum on their assigned rotational payout date.",
    },
    {
      question: "What happens if a circle member misses a contribution?",
      answer:
        "PAVE implements automated wallet debits, mandatory KYC tiering, and escrow safeguards to prevent default. If an account has insufficient funds, automated backup cards are charged and penalty fees apply, protecting all participants.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "You can fund your PAVE wallet instantly via Nigerian debit/credit cards (Mastercard, Visa, Verve), instant bank transfers via your dedicated virtual account (Wema Bank), or USSD.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0B14] flex flex-col justify-between antialiased font-sans text-slate-900 dark:text-slate-100 overflow-x-clip selection:bg-[#E0E7FF] selection:text-[#3730A3] transition-colors duration-300 relative">
      {/* Background Ambient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80 dark:opacity-25">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 18% 18%, rgba(99, 81, 247, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 85% 25%, rgba(139, 92, 246, 0.07) 0%, transparent 40%),
              radial-gradient(circle at 50% 85%, rgba(59, 130, 246, 0.05) 0%, transparent 45%),
              radial-gradient(${isDark ? "rgba(255, 255, 255, 0.07)" : "#cbd5e1"} 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 100% 100%, 28px 28px",
          }}
        />
      </div>

      {/* Illuminated Grid Hover Effect - Dark Mode (Subtle Ambient Glimmer) */}
      {isDark && (
        <div
          ref={gridRef}
          className="fixed inset-0 z-0 pointer-events-none opacity-60 transition-opacity duration-300"
          style={{
            backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.20) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            WebkitMaskImage: `radial-gradient(340px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 10%, rgba(0,0,0,0.35) 40%, transparent 70%)`,
            maskImage: `radial-gradient(340px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 10%, rgba(0,0,0,0.35) 40%, transparent 70%)`,
          }}
        />
      )}

      {/* MAIN HEADER (STICKY / FIXED GLASS NAVIGATION) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/10 dark:bg-[#0A0B14]/85 border-slate-200/80 dark:border-white/15 shadow-xs dark:shadow-black/40"
            : "bg-white/10 dark:bg-[#0A0B14]/65 border-slate-200/50 dark:border-white/10 shadow-xs"
        }`}
        style={{
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
        }}
        data-purpose="site-navigation-bar"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer"
          >
            <Logo size="md" />
          </div>

          {/* Center Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-tight"
          >
            <button
              onClick={() => scrollToSection("products")}
              className="hover:text-[#4F39F6] dark:hover:text-[#818CF8] transition-colors py-1 cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("thrift")}
              className="hover:text-[#4F39F6] dark:hover:text-[#818CF8] transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
            >
              How Thrift Works
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                Ajo
              </span>
            </button>
            <button
              onClick={() => scrollToSection("yields")}
              className="hover:text-[#4F39F6] dark:hover:text-[#818CF8] transition-colors py-1 cursor-pointer"
            >
              Rates & Yields
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-[#4F39F6] dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100/60 dark:hover:bg-white/5 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Get started Primary CTA */}
            <button
              onClick={() => onNavigate("signup")}
              className="relative group inline-flex items-center justify-center text-sm font-bold text-white px-5 sm:px-6 py-2.5 rounded-full bg-linear-to-r from-[#2B217A] via-[#4F39F6] to-[#6351F7] shadow-md shadow-[#4F39F6]/20 hover:shadow-lg hover:shadow-[#4F39F6]/35 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F39F6] cursor-pointer"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navigation bar */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />

      {/* MAIN CONTENT WRAPPER */}
      <main className="grow relative z-10">
        {/* HERO SPLIT SECTION */}
        <section
          className="relative pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 overflow-hidden"
          data-purpose="hero-split-section"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* LEFT COLUMN: Value Proposition & Conversion */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 flex flex-col items-start text-left z-10"
              >
                {/* Live Trust Chip Pill */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-[#372BAA] dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>⚡ Over ₦1.2M+ Saved & Distributed in Ajo/Esusu</span>
                </div>

                {/* Bold Editorial Headline with Highlighting */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.85rem] font-black tracking-tight text-slate-950 dark:text-white leading-[1.12] mb-6"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Modern Wealth Building,{" "}
                  <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-[#2B217A] via-[#4F39F6] to-[#8B5CF6] dark:from-[#A5B4FC] dark:via-[#818CF8] dark:to-[#C084FC]">
                    Rooted in Community.
                  </span>
                </h1>

                {/* Sub-copy Description */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
                  The high-yield digital wallet that unifies automated personal
                  savings with disciplined, trustless thrift contributions
                  (Ajo/Esusu). Enjoy guaranteed rotational payouts, zero default
                  risk, and NDIC/CBN-compliant security.
                </p>

                {/* Interactive CTA Group */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                  {/* Primary Action Button */}
                  <button
                    onClick={() => onNavigate("signup")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white bg-linear-to-r from-[#2B217A] via-[#372BAA] to-[#4F39F6] hover:from-[#1E1656] hover:to-[#372BAA] shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span>Start Saving in 2 Mins</span>
                    <TrendingUp size={18} />
                  </button>

                  {/* Secondary Video Trigger Button */}
                  <button
                    onClick={() => {
                      scrollToSection("thrift");
                      setIsVideoModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full text-sm font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F39F6] dark:text-[#818CF8]">
                      <Play size={13} className="ml-0.5 fill-current" />
                    </span>
                    <span>Watch How Thrift Works</span>
                  </button>
                </div>

                {/* Social Proof Strip */}
                <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 w-full flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {/* User Avatars Stack */}
                  {/* <div className="flex items-center -space-x-2.5">
                    <img
                      alt="Pave Saver 1"
                      className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    />
                    <img
                      alt="Pave Saver 2"
                      className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    />
                    <img
                      alt="Pave Saver 3"
                      className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                    />
                    <img
                      alt="Pave Saver 4"
                      className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                      referrerPolicy="no-referrer"
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                    />
                    <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-indigo-600 ring-2 ring-white dark:ring-slate-900 text-[11px] font-bold text-white flex items-center justify-center">
                      +45k
                    </div>
                  </div> */}
                  {/* <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={15}
                          className="fill-current text-amber-400"
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                        4.9/5.0
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      Trusted by 45,000+ disciplined savers & thrift circles
                    </p>
                  </div> */}
                </div>
              </motion.div>

              {/* RIGHT COLUMN: High-Fidelity App Mockup & Interactive Thrift Interface */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-6 relative flex justify-center lg:justify-end"
              >
                {/* Ambient Glow Behind Cards */}
                {/* <div className="absolute -top-10 right-0 w-80 h-80 bg-[#6351F7]/20 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="absolute -bottom-8 left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl pointer-events-none -z-10" /> */}

                <div className="relative w-full max-w-lg">
                  {/* MAIN WALLET CARD (Dark Modern FinTech Card) */}
                  <div className="relative bg-linear-to-br from-slate-950 via-slate-900 to-[#0E0E1A] p-7 sm:p-8 rounded-3xl text-white shadow-2xl border border-slate-800/80 overflow-hidden">
                    {/* Card Background Subtle Geometric Ring */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 border border-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -top-6 -right-6 w-36 h-36 border border-white/10 rounded-full pointer-events-none" />

                    {/* Top Row: Card Title & Bank Tier Pill */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          PAVE Vault Balance
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
                        Tier 3 Verified
                      </span>
                    </div>

                    {/* Balance Display */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight"
                          style={{ fontFamily: "var(--font-family-display)" }}
                        >
                          ₦4,850,000.00
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <TrendingUp size={13} className="mr-0.5" /> +14.2%
                          p.a.
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Interest accrued daily • Compounding monthly
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/90 mb-6">
                      <button
                        onClick={() => onNavigate("signup")}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                        type="button"
                      >
                        <PlusCircle
                          size={20}
                          className="text-indigo-400 mb-1 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          Deposit
                        </span>
                      </button>
                      <button
                        onClick={() => onNavigate("signup")}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                        type="button"
                      >
                        <Lock
                          size={20}
                          className="text-amber-400 mb-1 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          Lock Savings
                        </span>
                      </button>
                      <button
                        onClick={() => onNavigate("signup")}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                        type="button"
                      >
                        <Users
                          size={20}
                          className="text-emerald-400 mb-1 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs font-semibold text-slate-200">
                          Thrift Pool
                        </span>
                      </button>
                    </div>

                    {/* Live Thrift Circle Mini Progress */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-slate-300 font-medium">
                          Lekki Tech Savers Circle (Ajo)
                        </span>
                        <span className="text-emerald-400 font-bold">
                          Month 3 of 10
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-[#6351F7] to-emerald-400 h-full rounded-full transition-all duration-1000"
                          style={{ width: "72%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FLOATING CARD 1: Thrift Status Pill / Next Payout Card */}
                  <div className="animate-float-slow absolute -bottom-7 -left-3 sm:-left-8 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-white/10 flex items-center gap-4 max-w-xs sm:max-w-sm z-20">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                      <Wallet size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                          Next Payout
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Slot #3
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        ₦1,200,000 incoming
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400 shrink-0" />{" "}
                        in 4 days • 10 members paid
                      </p>
                    </div>
                  </div>

                  {/* FLOATING CARD 2: Micro-Metrics Card (Round-ups Active) */}
                  <div className="animate-float-delayed hidden sm:flex absolute -top-6 -right-6 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/80 dark:border-white/10 items-center gap-3.5 z-20">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4F39F6] dark:text-[#818CF8] flex items-center justify-center">
                      <PiggyBank size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Auto Round-ups Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        +₦34,200 saved this week
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURE VALUE PILLARS */}
        <section
          className="max-w-7xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28"
          data-purpose="value-pillars"
        >
          <div className="text-center max-w-3xl mx-auto my-14">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4F39F6] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/40">
              Engineered for Discipline
            </span>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-slate-950 dark:text-white mt-4 tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Everything you need to multiply and protect your capital.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pillar 1: Automated Discipline */}
            <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#818CF8]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4F39F6] dark:text-[#818CF8] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#4F39F6] group-hover:text-white transition-all duration-300 shadow-xs">
                  <Sliders size={24} />
                </div>
                <h3
                  className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Automated Discipline
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Remove the temptation to spend. Configure customizable
                  automated debit rules, strict target lockboxes, and daily
                  micro-deposits that turn small change into monumental wealth.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[#4F39F6] dark:text-[#818CF8]">
                <span>Smart Rules • Strict Locks</span>
                <CheckCircle2 size={18} />
              </div>
            </div>

            {/* Pillar 2: Modern Ajo / Esusu Pools */}
            <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                Popular
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <Users size={24} />
                </div>
                <h3
                  className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Modern Ajo / Esusu Pools
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  The tradition you know, digitized for safety. Verified circles
                  with automated collection and programmatic rotational payouts.
                  Zero default risk, zero awkward reminders, zero social drama.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Automated Rotation • Trustless</span>
                <BadgeCheck size={18} />
              </div>
            </div>

            {/* Pillar 3: Institutional Grade Safety */}
            <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-xs">
                  <ShieldCheck size={24} />
                </div>
                <h3
                  className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Institutional Grade Safety
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  Sleep soundly knowing your funds are held in NDIC-insured
                  partner banks, regulated under CBN framework, and fortified by
                  AES 256-bit bank-grade encryption and biometric
                  authentication.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>NDIC Insured • CBN Compliant</span>
                <Lock size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM FEATURE TICKER / MARQUEE */}
        <div
          className="w-full border-y border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md overflow-hidden py-4 relative"
          data-purpose="feature-ticker"
        >
          {/* Edge shadow / gradient fade masks for smooth seamless transitions */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 bg-linear-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent z-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 bg-linear-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 dark:to-transparent z-10"
            aria-hidden="true"
          />

          <div className="relative w-full overflow-hidden">
            <div className="flex whitespace-nowrap items-center text-xs font-extrabold tracking-widest uppercase animate-marquee-continuous">
              {[1, 2, 3, 4].map((repeat) => (
                <div key={repeat} className="flex items-center shrink-0">
                  {/* Item 1: Building Financial Discipline with rocket icon and mint dot */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0" />
                    <span className="inline-flex items-center gap-2 text-slate-950 dark:text-white font-black tracking-wider">
                      <span
                        className="text-base"
                        role="img"
                        aria-label="rocket"
                      >
                        🚀
                      </span>
                      <span>BUILDING FINANCIAL DISCIPLINE</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 2: Automated Savings with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      <span
                        className="text-base"
                        role="img"
                        aria-label="lightning"
                      >
                        ⚡
                      </span>
                      <span>AUTOMATED SAVINGS</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 3: Community Thrift with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      <span
                        className="text-base"
                        role="img"
                        aria-label="community"
                      >
                        👥
                      </span>
                      <span>COMMUNITY THRIFT</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 4: CBN Regulated Partners with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-[#372BAA] dark:text-indigo-300 font-bold tracking-wider">
                      <span
                        className="text-base"
                        role="img"
                        aria-label="shield"
                      >
                        🛡️
                      </span>
                      <span>CBN REGULATED PARTNERS</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 5: Up to 14.2% Annual Returns with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
                      <span className="text-base" role="img" aria-label="chart">
                        📈
                      </span>
                      <span>UP TO 14.2% ANNUAL RETURNS</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 6: NDIC Insured with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      <span className="text-base" role="img" aria-label="lock">
                        🔒
                      </span>
                      <span>NDIC INSURED UP TO ₦5M</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>

                  {/* Item 7: 256-Bit Encryption with icon */}
                  <div className="flex items-center gap-3 px-4 shrink-0">
                    <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold tracking-wider">
                      <span className="text-base" role="img" aria-label="key">
                        🔐
                      </span>
                      <span>256-BIT ENCRYPTION</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-light mx-2 select-none">
                      /
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: SMART SAVINGS DEEP-DIVE (#products) */}
        <motion.section
          id="products"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="w-full px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden relative z-10 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text */}
            <div className="w-full max-w-xl">
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-[#372BAA] dark:text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-xs">
                Smart Savings Plans
              </div>
              <h2
                className="text-4xl md:text-5xl font-extrabold text-slate-950 dark:text-white mb-6 tracking-tight leading-[1.15]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Save for What Matters Most
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
                Whether it's building a 6-month emergency buffer, saving for a
                tech gadget, or planning your dream holiday, PAVE helps you
                reach your financial milestones faster with automated recurring
                transfers.
              </p>

              <ul className="space-y-4 mb-10 w-full">
                {[
                  "Flexible Wallet Savings — withdraw whenever unexpected needs arise",
                  "Strict Fixed Lockbox — lock funds for 30–365 days with premium compound yield",
                  "Zero hidden maintenance fees or deceptive SMS charges",
                  "Automated recurring debits directly from your linked account",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-base"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-[#4F39F6] dark:text-[#818CF8] shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate("signup")}
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center cursor-pointer"
              >
                Start Saving Today
              </button>
            </div>

            {/* Right Column: Liquid Glass Interactive Card */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-lg bg-linear-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#E0E7FF] dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 flex items-center justify-center border-2 border-indigo-200/90 dark:border-white/10 shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="w-full bg-white dark:bg-[#111327] rounded-2xl p-7 md:p-8 shadow-md border border-slate-100 dark:border-white/10 relative overflow-hidden z-10">
                  <div className="flex justify-between items-end mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                        Emergency Safety Net
                      </div>
                      <div
                        className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white"
                        style={{ fontFamily: "var(--font-family-display)" }}
                      >
                        ₦385,000
                      </div>
                    </div>
                    <div className="text-[#4F39F6] dark:text-indigo-400 text-2xl md:text-3xl font-extrabold">
                      77%
                    </div>
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                    <span>Target: ₦500,000</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      +₦14,200 accrued interest
                    </span>
                  </div>

                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-white/5">
                    <div
                      className="h-full bg-linear-to-r from-[#4F39F6] to-emerald-400 rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: "77%" }}
                    />
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#4F39F6]" /> Auto-saving
                      ₦25,000 every Friday
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      5 weeks left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION: THRIFT (AJO/ESUSU) DEEP-DIVE (#thrift) */}
        <motion.section
          id="thrift"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="w-full px-6 py-20 md:py-28 max-w-7xl mx-auto overflow-hidden relative z-10 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Visual Circular Matrix Card */}
            <div className="w-full flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="w-full max-w-lg bg-linear-to-br from-[#ECFDF5] via-[#F0FDF4] to-[#D1FAE5] dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900/50 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 flex items-center justify-center border-2 border-emerald-300/80 dark:border-white/10 shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="w-full bg-white dark:bg-[#111327] rounded-2xl p-7 md:p-8 shadow-md border border-slate-100 dark:border-white/10 relative overflow-hidden z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/30">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4
                        className="font-bold text-lg text-slate-900 dark:text-white tracking-tight"
                        style={{ fontFamily: "var(--font-family-display)" }}
                      >
                        Lagos Founders Thrift Circle
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Monthly Rotation • ₦50,000 / member
                      </p>
                    </div>
                  </div>

                  {/* Progress Matrix */}
                  <div className="grid grid-cols-6 gap-2.5 my-6">
                    {/* 4 Completed Cycles */}
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={`comp-${i}`}
                        className="h-10 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 shadow-xs flex items-center justify-center text-white text-[11px] font-bold"
                      >
                        ✓
                      </div>
                    ))}
                    {/* Active Cycle */}
                    <div className="h-10 rounded-xl bg-[#4F39F6] text-white flex items-center justify-center text-[10px] font-extrabold animate-pulse ring-2 ring-[#4F39F6]/50">
                      NOW
                    </div>
                    {/* 7 Remaining Cycles */}
                    {[6, 7, 8, 9, 10, 11, 12].map((i) => (
                      <div
                        key={`rem-${i}`}
                        className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-white/5 flex items-center justify-center text-slate-400 text-xs"
                      >
                        #{i}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs md:text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>5 of 12 rotations completed</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Total Pooled: ₦3,000,000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Text & Features */}
            <div className="w-full max-w-xl order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
                Cultural Heritage, Digitized
              </div>
              <h2
                className="text-4xl md:text-5xl font-extrabold text-slate-950 dark:text-white mb-6 tracking-tight leading-[1.15]"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Grow Together with Ajo & Esusu
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
                Generations of Nigerians have built capital through communal
                rotational thrift. PAVE removes the default risk, manual
                record-keeping, and awkward follow-ups by automating debits and
                programmatic escrow payouts.
              </p>

              <ul className="space-y-4 mb-10 w-full">
                {[
                  "Verified participant KYC ensures 100% genuine identity",
                  "Automated wallet deductions prevent forgotten dues",
                  "Transparent live calendar tracking each member's collection turn",
                  "Instant lump-sum payout directly into your available balance",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-base"
                  >
                    <CheckCircle2
                      size={20}
                      className="text-emerald-500 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate("signup")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center cursor-pointer"
              >
                Join a Thrift Circle
              </button>
            </div>
          </div>
        </motion.section>

        {/* SECTION: RATES & YIELDS COMPARISON (#yields) */}
        <section
          id="yields"
          className="w-full px-6 py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-white/10 relative z-10 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#4F39F6] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/40">
                Transparent Returns
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-3 tracking-tight"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Why Savers Earn Significantly More on PAVE
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
                Traditional commercial banks offer meager returns that fail to
                outpace inflation. PAVE redistributes institutional money market
                yields directly to your wallet.
              </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Traditional Bank Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Traditional Banks
                  </div>
                  <div
                    className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 mb-4"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    1.5% — 3.5%{" "}
                    <span className="text-sm font-normal text-slate-400">
                      p.a.
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">✕</span> Monthly
                      maintenance and card maintenance fees
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">✕</span>{" "}
                      Unnecessary SMS notification charges
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">✕</span> Heavy
                      penalties for withdrawing savings early
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">✕</span> No
                      automated community thrift structures
                    </li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                  Standard savings accounts in Nigeria
                </div>
              </div>

              {/* PAVE Card */}
              <div className="bg-linear-to-br from-[#1E1B4B] via-[#2B217A] to-[#4F39F6] text-white p-8 rounded-3xl border-2 border-indigo-400/50 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Up to 4x Better
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
                    PAVE Smart Yield Engine
                  </div>
                  <div
                    className="text-4xl font-extrabold text-white mb-4"
                    style={{ fontFamily: "var(--font-family-display)" }}
                  >
                    10.5% — 14.2%{" "}
                    <span className="text-sm font-normal text-indigo-200">
                      p.a.
                    </span>
                  </div>
                  <ul className="space-y-3 text-sm text-indigo-100">
                    <li className="flex items-center gap-2">
                      <Check className="text-emerald-400 w-4 h-4 shrink-0" />{" "}
                      Zero account maintenance or sign-up fees
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-emerald-400 w-4 h-4 shrink-0" />{" "}
                      Daily interest calculation with monthly compounding
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-emerald-400 w-4 h-4 shrink-0" />{" "}
                      Flexible anytime withdrawals on emergency funds
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-emerald-400 w-4 h-4 shrink-0" />{" "}
                      Built-in rotational Ajo circles with zero default risk
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate("signup")}
                  className="mt-8 bg-white text-[#2B217A] hover:bg-slate-100 font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer text-center"
                >
                  Start Earning Higher Rates
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SECURITY & COMPLIANCE (#security) */}
        <section
          id="security"
          className="w-full px-6 py-20 md:py-28 max-w-7xl mx-auto relative z-10 scroll-mt-24"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-12 md:p-16 border border-slate-200/90 dark:border-white/10 shadow-sm">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                Security by Architecture
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-3 tracking-tight"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Your Financial Security is Non-Negotiable
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-3 text-base">
                PAVE employs the highest cryptographic standards and partners
                with regulated financial institutions so you can build wealth
                with total confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: 256-Bit Bank Encryption */}
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/15 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100/90 dark:border-indigo-800/50 text-[#4F39F6] dark:text-[#818CF8] flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <Lock size={26} strokeWidth={2.2} />
                </div>
                <h4 className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white mb-3 tracking-tight">
                  256-Bit Bank Encryption
                </h4>
                <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  All traffic, payment credentials, and biometric
                  authentications are encrypted with end-to-end TLS 1.3 and
                  AES-256 protocols.
                </p>
              </div>

              {/* Card 2: NDIC Deposit Insurance */}
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/15 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100/90 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <Building2 size={26} strokeWidth={2.2} />
                </div>
                <h4 className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white mb-3 tracking-tight">
                  NDIC Deposit Insurance
                </h4>
                <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  Deposits are held in custody by CBN-licensed partner
                  commercial banks (Wema Bank PLC) and insured by the Nigeria
                  Deposit Insurance Corporation.
                </p>
              </div>

              {/* Card 3: Verified KYC Community */}
              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/15 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-amber-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-100/90 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldCheck size={26} strokeWidth={2.2} />
                </div>
                <h4 className="font-extrabold text-lg sm:text-xl text-slate-950 dark:text-white mb-3 tracking-tight">
                  Verified KYC Community
                </h4>
                <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  Strict BVN/NIN identity screening prevents bad actors,
                  impersonation, and defaults across all community thrift
                  circles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS (#faqs) */}
        <section
          id="faqs"
          className="w-full px-6 py-20 md:py-28 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-white/10 relative z-10 scroll-mt-24"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#4F39F6] dark:text-[#818CF8] bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/40">
                Got Questions?
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-3 tracking-tight"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-base">
                Everything you need to know about PAVE savings, interest yields,
                and thrift rotations.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-base sm:text-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 transition-transform duration-300 shrink-0 ml-4 ${
                        openFaq === index ? "rotate-180 text-[#4F39F6]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal border-t border-slate-100 dark:border-slate-800 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HIGH CONVERSION FINAL CTA */}
        <section className="w-full px-6 py-20 md:py-28 z-10 relative">
          <div className="max-w-5xl mx-auto relative">
            {/* Ambient atmospheric glow */}
            <div className="absolute -inset-3 bg-linear-to-r from-sky-400/15 via-indigo-500/10 to-purple-500/15 dark:from-sky-500/10 dark:via-indigo-600/15 dark:to-violet-600/15 rounded-[3.2rem] blur-2xl -z-10 pointer-events-none" />

            {/* Main Card: Soft Celestial Ice-Blue to Lavender Gradient (Light) & Atmospheric Cosmic Indigo (Dark) */}
            <div className="w-full relative rounded-3xl sm:rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-14 md:p-16 text-center shadow-xl shadow-indigo-950/5 dark:shadow-2xl border border-[#E0E7FF]/90 dark:border-indigo-500/30 overflow-hidden transition-all duration-300 bg-linear-to-br from-[#EEF5FF] via-[#F8FAFF] to-[#F5F3FF] dark:bg-linear-to-br dark:from-[#0E122A] dark:via-[#121430] dark:to-[#181335]">
              {/* Internal subtle glow accents */}
              {/* <div
                className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-linear-to-br from-[#DCEBFF] to-transparent dark:from-sky-500/15 pointer-events-none blur-2xl"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -right-24 w-88 h-88 rounded-full bg-linear-to-tl from-[#EDE9FE] to-transparent dark:from-violet-500/15 pointer-events-none blur-2xl"
                aria-hidden="true"
              /> */}

              <div className="relative z-10">
                {/* Community Trust Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-indigo-200/70 dark:border-white/15 text-[#3730A3] dark:text-indigo-200 text-xs font-semibold mb-6 shadow-xs">
                  <Sparkles
                    size={14}
                    className="text-[#4F39F6] dark:text-indigo-300"
                  />
                  <span>Join Over 45,000+ Disciplined Savers Today</span>
                </div>

                {/* Heading */}
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-950 dark:text-white mb-4 tracking-tight leading-[1.15]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Ready to Start Your Financial Journey?
                </h2>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-base sm:text-lg mb-8 font-normal leading-relaxed">
                  Join thousands of Nigerians building wealth with PAVE. Take
                  control of your money with automated high-yield savings and
                  disciplined community thrift contributions.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Create Pave Account CTA */}
                  <button
                    onClick={() => onNavigate("signup")}
                    className="w-full sm:w-auto bg-[#312E81] hover:bg-[#282568] dark:bg-[#4F39F6] dark:hover:bg-[#432BD8] text-white font-bold py-4 px-10 rounded-full text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-950/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center cursor-pointer"
                  >
                    <span>Create Pave Account</span>
                    <ArrowRight size={18} className="ml-2" />
                  </button>

                  {/* Download Pave App CTA */}
                  <button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full sm:w-auto bg-white/90 hover:bg-white text-slate-800 border border-indigo-200/80 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2 active:scale-95 backdrop-blur-md"
                  >
                    <Download
                      size={16}
                      className="text-[#3730A3] dark:text-slate-300"
                    />
                    <span>Download Pave App</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0E0E1A] z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Logo size="md" className="mb-6 justify-start" />
              <p className="text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                Building financial discipline through automated high-yield
                savings and digitized cultural community contributions
                (Ajo/Esusu).
              </p>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-extrabold text-slate-950 dark:text-white mb-6 uppercase tracking-widest text-xs">
                Product
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <button
                    onClick={() => scrollToSection("products")}
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Wallet & Savings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("thrift")}
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Thrift (Ajo)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("yields")}
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Rates & Yields
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("security")}
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Security & Compliance
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-extrabold text-slate-950 dark:text-white mb-6 uppercase tracking-widest text-xs">
                Company
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a
                    href="#about"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    About PAVE
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    FinTech Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Support Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="font-extrabold text-slate-950 dark:text-white mb-6 uppercase tracking-widest text-xs">
                Legal
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a
                    href="#privacy"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#security"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    NDIC Protection
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="text-slate-800 hover:text-[#4F39F6] dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <div>
              © {new Date().getFullYear()} PAVE TECHNOLOGIES LTD. ALL RIGHTS
              RESERVED.
            </div>
            <div>
              LICENSED PARTNER BANK INTEGRATION & CBN FRAMEWORK COMPLIANT
            </div>
          </div>
        </div>
      </footer>

      {/* DOWNLOAD PAVE APP MODAL */}
      <AnimatePresence>
        {isDownloadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDownloadModalOpen(false);
                setDownloadSuccess(null);
              }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#111227] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsDownloadModalOpen(false);
                  setDownloadSuccess(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-[#4F39F6] dark:text-indigo-400 mb-4 shadow-xs">
                  <Smartphone size={28} />
                </div>
                <h3
                  className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Download Pave App
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Automate high-yield savings and manage your Ajo thrift pools
                  on the go.
                </p>
              </div>

              {/* QR Code Section */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 shrink-0 bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shadow-xs">
                  <QrCode
                    size={78}
                    className="text-slate-900 dark:text-white"
                  />
                  <span className="text-[9px] font-bold text-[#4F39F6] tracking-tight mt-0.5">
                    SCAN ME
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4F39F6] dark:text-indigo-400 block mb-1">
                    Instant Camera Scan
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Point your smartphone camera at the QR code to install
                    directly on iOS or Android.
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.origin);
                      setDownloadSuccess(
                        "App download link copied to clipboard!",
                      );
                      setTimeout(() => setDownloadSuccess(null), 3000);
                    }}
                    className="mt-2.5 text-xs font-bold text-[#4F39F6] hover:text-[#432BD8] dark:text-indigo-400 dark:hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Copy download link</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* App Store / Google Play Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Apple App Store Button */}
                <button
                  onClick={() => {
                    setDownloadSuccess(
                      "Redirecting to Apple App Store (TestFlight Preview)...",
                    );
                    setTimeout(() => setDownloadSuccess(null), 3500);
                  }}
                  className="group flex items-center justify-center gap-3.5 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 dark:bg-[#0B0E23] dark:hover:bg-[#121636] dark:text-white dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6 fill-slate-950 dark:fill-white shrink-0 group-hover:scale-105 transition-transform"
                    viewBox="0 0 170 170"
                  >
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14-5.87-9.08-10.37-19.12-13.5-30.1-3.13-11.03-4.7-21.2-4.7-30.5 0-14.18 3.52-25.77 10.56-34.78 7.04-9 15.86-13.62 26.47-13.87 4.79 0 10.22 1.25 16.29 3.75 6.06 2.5 10.15 3.78 12.26 3.84 1.74 0 6.01-1.34 12.82-4.02 6.81-2.68 12.44-3.9 16.89-3.66 12.63.74 22.84 5.38 30.63 13.92-11.03 6.67-16.42 15.79-16.18 27.35.24 9.08 3.75 16.74 10.53 22.97 6.78 6.23 14.88 9.77 24.31 10.63-2.07 6.1-4.47 12.28-7.22 18.55zM119.22 31.84c0-7.39 2.66-14.19 7.97-20.41 5.32-6.22 11.89-10.3 19.72-12.23.47 2.12.71 4.25.71 6.38 0 7.39-2.77 14.32-8.32 20.79-5.55 6.47-12.21 10.39-19.98 11.75-.14-1.98-.1-4.07-.1-6.28z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mb-0.5">
                      Download on
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                      Apple App Store
                    </span>
                  </div>
                </button>

                {/* Google Play Store Button */}
                <button
                  onClick={() => {
                    setDownloadSuccess(
                      "Redirecting to Google Play Store (Early Access)...",
                    );
                    setTimeout(() => setDownloadSuccess(null), 3500);
                  }}
                  className="group flex items-center justify-center gap-3.5 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 dark:bg-[#0B0E23] dark:hover:bg-[#121636] dark:text-white dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6 shrink-0 group-hover:scale-105 transition-transform"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M3.6 1.8l10.8 10.2-10.8 10.2c-.4-.4-.6-1-.6-1.7V3.5c0-.7.2-1.3.6-1.7z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M17.8 8.6L14.4 12l3.4 3.4 3.9-2.2c1.1-.6 1.1-1.7 0-2.3l-3.9-2.3z"
                    />
                    <path
                      fill="#34A853"
                      d="M14.4 12L3.6 22.2c.4.4 1.1.5 1.8.1l12.4-7.1L14.4 12z"
                    />
                    <path
                      fill="#EA4335"
                      d="M14.4 12l3.4-3.4L5.4 1.5c-.7-.4-1.4-.3-1.8.1L14.4 12z"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none mb-0.5">
                      Get it on
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                      Google Play Store
                    </span>
                  </div>
                </button>
              </div>

              {/* Notification Toast */}
              {downloadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-2"
                >
                  <Check
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span>{downloadSuccess}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
