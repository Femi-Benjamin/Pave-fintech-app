import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Users,
  Wallet,
  RotateCw,
  // Send,
  Smartphone,
  Zap,
  TrendingUp,
  ShieldCheck,
  Building,
  HeartHandshake,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";

export type ProductPageId =
  | "home"
  | "rotating-savings"
  | "personal-savings"
  | "thrift-contributions"
  // | "send-and-receive-money"
  | "airtime-and-data"
  | "utility-bills"
  | "about-us"
  | "our-story"
  | "our-team";

interface ProductNavbarProps {
  currentPage: ProductPageId;
  onNavigatePage: (page: ProductPageId) => void;
  onOpenApp: (action?: "login" | "signup") => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function ProductNavbar({
  currentPage,
  onNavigatePage,
  onOpenApp,
  isDark,
  onToggleTheme,
}: ProductNavbarProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPage = (page: ProductPageId) => {
    setIsProductsOpen(false);
    setIsMobileMenuOpen(false);
    onNavigatePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/30 dark:bg-[#0A0B14]/30 border-slate-200/80 dark:border-white/10 shadow-sm"
          : "bg-white/30 dark:bg-[#0A0B14]/30 border-slate-200/40 dark:border-white/5"
      }`}
      style={{
        WebkitBackdropFilter: "blur(20px)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleSelectPage("home")}
          className="cursor-pointer flex items-center gap-2 select-none"
        >
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Public Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {/* Products Mega Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              onMouseEnter={() => setIsProductsOpen(true)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                isProductsOpen ||
                [
                  "rotating-savings",
                  "personal-savings",
                  "thrift-contributions",
                  // "send-and-receive-money",
                  "airtime-and-data",
                  "utility-bills",
                ].includes(currentPage)
                  ? "text-[#3730A3] dark:text-[#818CF8] bg-indigo-50/70 dark:bg-indigo-950/40"
                  : "hover:text-[#3730A3] dark:hover:text-[#818CF8]"
              }`}
            >
              <span>Products</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isProductsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Ajo.money inspired Mega Dropdown Card */}
            {isProductsOpen && (
              <div
                onMouseLeave={() => setIsProductsOpen(false)}
                className="absolute top-full left-0 -ml-16 mt-2 w-195 bg-white dark:bg-[#111327] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 p-6 grid grid-cols-12 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Column 1: Savings and Credit (4 cols) */}
                <div className="col-span-4 flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                    Savings and Credit
                  </span>

                  <button
                    onClick={() => handleSelectPage("rotating-savings")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#3730A3] dark:text-[#818CF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#3730A3] dark:group-hover:text-[#818CF8] transition-colors">
                        Rotating group savings
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Automated Ajo/Esusu circles with guaranteed rotational
                        payouts.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectPage("personal-savings")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#059669] dark:group-hover:text-[#10B981] transition-colors">
                        Personal savings
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Flexible vaults & high-yield lockboxes up to 14.2% p.a.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectPage("thrift-contributions")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-[#D97706] dark:text-[#F59E0B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <RotateCw size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#D97706] dark:group-hover:text-[#F59E0B] transition-colors">
                        Thrift contribution
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Traditional daily and weekly cooperative contributions
                        with zero default risk.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Column 2: Wallet (4 cols) */}
                <div className="col-span-4 flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                    Wallet
                  </span>

                  {/*
                  <button
                    onClick={() => handleSelectPage("send-and-receive-money")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Send size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors">
                        Send and receive money
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Zero-fee P2P transfers & dedicated Wema Bank virtual
                        accounts.
                      </p>
                    </div>
                  </button>
                  */}

                  <button
                    onClick={() => handleSelectPage("airtime-and-data")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                        Airtime and data
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Instant recharge across MTN, Airtel, Glo, 9mobile with
                        3% cashback.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectPage("utility-bills")}
                    className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#E11D48] dark:text-[#FB7185] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Zap size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E11D48] dark:group-hover:text-[#FB7185] transition-colors">
                        Utility bills
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        Instant electricity NEPA tokens and DStv/GOtv renewals.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Column 3: Company (4 cols) */}
                <div className="col-span-4 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Company
                    </span>
                    <div className="mt-2 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <button
                        onClick={() => handleSelectPage("about-us")}
                        className="text-left py-1 hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                      >
                        About PAVEPADI
                      </button>
                      <button
                        onClick={() => handleSelectPage("our-story")}
                        className="text-left py-1 hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                      >
                        Our Story & Security
                      </button>
                      <button
                        onClick={() => handleSelectPage("our-team")}
                        className="text-left py-1 hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
                      >
                        Our Leadership Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Links */}
          <button
            onClick={() => handleSelectPage("rotating-savings")}
            className="hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors py-1 cursor-pointer"
          >
            Ajo Circles
          </button>
          <button
            onClick={() => handleSelectPage("about-us")}
            className="hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors py-1 cursor-pointer"
          >
            Company
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle (Desktop Only) */}
          <button
            onClick={onToggleTheme}
            className="hidden lg:flex p-2 text-slate-500 hover:text-[#3730A3] dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer items-center justify-center"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Sign In Secondary Link */}
          <button
            onClick={() => onOpenApp("login")}
            className="hidden sm:inline-flex text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#3730A3] dark:hover:text-[#818CF8] transition-colors px-3 py-2 cursor-pointer"
          >
            Sign In
          </button>

          {/* Get Started Primary CTA */}
          <button
            onClick={() => onOpenApp("signup")}
            className="relative group inline-flex items-center justify-center text-sm font-bold text-white px-5 sm:px-6 py-2.5 rounded-full bg-linear-to-r from-[#1E1B4B] via-[#3730A3] to-[#4F39F6] shadow-md shadow-[#3730A3]/25 hover:shadow-md hover:shadow-[#3730A3]/40 hover:-translate-y-0.1 transition-all duration-200 cursor-pointer"
          >
            <span>Get Started</span>
            {/* <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" /> */}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1.5" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-[#3730A3] rounded-lg cursor-pointer"
            aria-label="Open navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F6FC] dark:bg-[#111327] border-b border-slate-200 dark:border-white/10 px-6 sm:px-8 py-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Appearance
            </span>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/15 transition-all cursor-pointer border border-slate-200 dark:border-white/10"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun size={15} className="text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon
                    size={15}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Products: Savings & Credit
          </div>
          <button
            onClick={() => handleSelectPage("rotating-savings")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-indigo-200 dark:hover:border-indigo-400/30 hover:text-[#3730A3]"
          >
            <Users size={18} className="text-[#3730A3]" /> Rotating group
            savings
          </button>
          <button
            onClick={() => handleSelectPage("personal-savings")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-emerald-200 dark:hover:border-emerald-400/30 hover:text-[#059669]"
          >
            <Wallet size={18} className="text-[#059669]" /> Personal savings
          </button>
          <button
            onClick={() => handleSelectPage("thrift-contributions")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-amber-200 dark:hover:border-amber-400/30 hover:text-[#D97706]"
          >
            <RotateCw size={18} className="text-[#D97706]" /> Thrift
            contribution
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Products: Wallet & Payments
          </div>
          {/*
          <button
            onClick={() => handleSelectPage("send-and-receive-money")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-purple-200 dark:hover:border-purple-400/30 hover:text-[#7C3AED]"
          >
            <Send size={18} className="text-[#7C3AED]" /> Send and receive money
          </button>
          */}
          <button
            onClick={() => handleSelectPage("airtime-and-data")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-blue-200 dark:hover:border-blue-400/30 hover:text-[#2563EB]"
          >
            <Smartphone size={18} className="text-[#2563EB]" /> Airtime and data
          </button>
          <button
            onClick={() => handleSelectPage("utility-bills")}
            className="flex items-center gap-3 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2.5 text-left text-sm font-bold text-slate-900 dark:text-white hover:border-rose-200 dark:hover:border-rose-400/30 hover:text-[#E11D48]"
          >
            <Zap size={18} className="text-[#E11D48]" /> Utility bills
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleSelectPage("about-us")}
              className="text-left text-sm font-medium text-slate-600 dark:text-slate-300 py-1"
            >
              About PAVEPADI
            </button>
            <button
              onClick={() => handleSelectPage("our-story")}
              className="text-left text-sm font-medium text-slate-600 dark:text-slate-300 py-1"
            >
              Our Story & Security
            </button>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => onOpenApp("login")}
              className="w-full py-3 rounded-xl border border-slate-300 dark:border-white/20 text-center font-bold text-sm"
            >
              Sign In to Wallet
            </button>
            <button
              onClick={() => onOpenApp("signup")}
              className="w-full py-3 rounded-xl bg-[#3730A3] text-white text-center font-bold text-sm"
            >
              Open Free Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
