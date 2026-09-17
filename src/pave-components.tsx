import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Wallet,
  PiggyBank,
  ShoppingBag,
  MessageCircle,
  Bell,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Send,
  Phone,
  Wifi,
  Zap,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  X,
  Upload,
  Camera,
  AlertCircle,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  MoreHorizontal,
  Paperclip,
  Smile,
  Mic,
  Settings,
  Shield,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Calendar,
  Gift,
  Award,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  BarChart2,
  Copy,
  QrCode,
  Landmark,
  Loader,
  Lock,
  Mail,
  MessageSquare,
  Hash,
  BookOpen,
  Package,
  Truck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Screen,
  MOCK_TRANSACTIONS,
  MOCK_SAVINGS,
  MOCK_PROGRAMS,
  MOCK_PRODUCTS,
  MOCK_MESSAGES,
  MOCK_CHAT,
  SPEND_DATA,
  PIE_DATA,
  fmt,
  pct,
} from "./pave-data";

// ─── Image Fallback ────────────────────────────────────────────────────────
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}

// ─── Reusable UI ────────────────────────────────────────────────────────────
export function PaveBtn({
  children,
  onClick,
  variant = "primary",
  full = true,
  small = false,
  disabled = false,
}: any) {
  const base = `rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer`;
  const sz = small
    ? "px-4 py-2 text-sm"
    : full
      ? "w-full py-4 text-base"
      : "px-6 py-3 text-base";
  const variants: any = {
    primary: "bg-[#3730A3] text-white hover:bg-[#312E81]",
    ghost:
      "bg-transparent text-[#3730A3] hover:bg-[#EEF2FF] dark:hover:bg-[#1E2140]",
    outline:
      "border-2 border-[#3730A3] text-[#3730A3] hover:bg-[#EEF2FF] dark:hover:bg-[#1E2140]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
    green: "bg-[#059669] text-white hover:bg-[#047857]",
    gold: "bg-[#D97706] text-white hover:bg-[#B45309]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sz} ${variants[variant]} font-medium`}
      style={{ fontFamily: "var(--font-family-display)" }}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  right,
}: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-[#374151] dark:text-gray-300 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            {icon}
          </div>
        )}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-xl py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors ${icon ? "pl-11 pr-4" : "px-4"} ${right || type === "password" ? "pr-12" : ""}`}
        />
        {type === "password" && (
          <button
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {right && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({ children, color = "indigo" }: any) {
  const colors: any = {
    indigo:
      "bg-[#EEF2FF] text-[#3730A3] dark:bg-[#312E81]/40 dark:text-[#A5B4FC]",
    green:
      "bg-[#ECFDF5] text-[#059669] dark:bg-[#065F46]/40 dark:text-[#6EE7B7]",
    gold: "bg-[#FFFBEB] text-[#D97706] dark:bg-[#78350F]/40 dark:text-[#FCD34D]",
    red: "bg-[#FEF2F2] text-[#DC2626] dark:bg-[#7F1D1D]/40 dark:text-[#FCA5A5]",
    gray: "bg-[#F3F4F6] text-[#6B7280] dark:bg-gray-800 dark:text-gray-300",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function ScreenHeader({ title, onBack, right }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#111327]/80 backdrop-blur-sm border-b border-black/5 dark:border-white/5">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-[#F1F3FB] dark:bg-[#1E2140] flex items-center justify-center text-gray-700 dark:text-gray-200 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft size={18} />
      </button>
      <h2
        className="text-base text-gray-900 dark:text-gray-100"
        style={{ fontFamily: "var(--font-family-display)", fontWeight: 600 }}
      >
        {title}
      </h2>
      <div className="w-9 h-9 flex items-center justify-center">
        {right || null}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 40, color = "#3730A3" }: any) {
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </div>
  );
}

// ─── Screens ────────────────────────────────────────────────────────────────

export function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-125"
      style={{
        background:
          "linear-gradient(145deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
          <span
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 800,
              fontSize: 36,
              color: "white",
            }}
          >
            P
          </span>
        </div>
        <div className="text-center">
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 800,
              fontSize: 32,
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            PAVE
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Your Path to Financial Freedom
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-white/50"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function OnboardingScreen({ onNext }: { onNext: () => void }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      icon: "💰",
      title: "Save Together, Grow Together",
      desc: "Join community savings groups managed by trusted admins and watch your money multiply.",
      color: "#3730A3",
    },
    {
      icon: "🛍️",
      title: "Save Now, Own It Later",
      desc: "Browse our marketplace and pay in installments — 50% secures your order, rest on delivery.",
      color: "#059669",
    },
    {
      icon: "🔐",
      title: "Bank-Level Security",
      desc: "Your money is protected with KYC verification, encryption, and real-time transaction alerts.",
      color: "#D97706",
    },
  ];
  const s = slides[slide];
  return (
    <div className="flex-1 flex flex-col min-h-125">
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 gap-8"
        style={{
          background: `linear-gradient(180deg, ${s.color}18 0%, transparent 60%)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6 text-center max-w-md"
          >
            <div
              className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-sm"
              style={{ background: `${s.color}15` }}
            >
              {s.icon}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontWeight: 700,
                  fontSize: 26,
                  color: "inherit",
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </h2>
              <p className="text-[#6B7280] dark:text-gray-400 mt-3 leading-relaxed text-sm">
                {s.desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 24 : 8,
                background: i === slide ? s.color : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 flex flex-col gap-3 max-w-md w-full mx-auto">
        {slide < slides.length - 1 ? (
          <>
            <PaveBtn onClick={() => setSlide(slide + 1)}>Continue</PaveBtn>
            <PaveBtn variant="ghost" onClick={onNext}>
              Skip
            </PaveBtn>
          </>
        ) : (
          <>
            <PaveBtn onClick={onNext}>Get Started</PaveBtn>
            <PaveBtn variant="ghost" onClick={onNext}>
              I already have an account
            </PaveBtn>
          </>
        )}
      </div>
    </div>
  );
}

export function LoginScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const doLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNav("home");
    }, 1200);
  };
  return (
    <div className="flex-1 flex flex-col overflow-y-auto max-w-md w-full mx-auto">
      <div className="px-6 pt-12 pb-6">
        <div className="w-14 h-14 bg-[#3730A3] rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-[#3730A3]/20">
          <span
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 800,
              fontSize: 22,
              color: "white",
            }}
          >
            P
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          Welcome back
        </h1>
        <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-1">
          Sign in to your PAVE account
        </p>
      </div>
      <div className="flex-1 px-6 flex flex-col gap-4">
        <Input
          label="Email or Username"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          icon={<Mail size={16} />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={pass}
          onChange={setPass}
          icon={<Lock size={16} />}
        />
        <button
          onClick={() => onNav("forgot-password")}
          className="text-right text-sm text-[#3730A3] dark:text-[#818CF8] font-medium"
        >
          Forgot password?
        </button>
        <div className="mt-2">
          <PaveBtn onClick={doLogin} disabled={loading}>
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </PaveBtn>
        </div>
        <div className="relative flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-gray-700" />
          <span className="text-xs text-[#9CA3AF]">or</span>
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-gray-700" />
        </div>
        <button
          onClick={() => onNav("accept-invitation")}
          className="w-full py-3.5 rounded-xl border-2 border-[#E5E7EB] dark:border-gray-700 hover:bg-[#F1F3FB] dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-[#374151] dark:text-gray-300"
        >
          <Hash size={16} /> Join with Invitation Code
        </button>
      </div>
      <div className="px-6 py-6 text-center text-sm text-[#6B7280] dark:text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={() => onNav("register")}
          className="text-[#3730A3] dark:text-[#818CF8] font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export function RegisterScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const set = (k: string) => (v: string) => setForm({ ...form, [k]: v });
  const doNext = () => {
    if (step === 1) setStep(2);
    else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onNav("kyc-welcome");
      }, 1200);
    }
  };
  return (
    <div className="flex-1 flex flex-col overflow-y-auto max-w-md w-full mx-auto">
      <div className="px-6 pt-10 pb-4">
        <button
          onClick={() => (step > 1 ? setStep(1) : onNav("login"))}
          className="w-9 h-9 rounded-full bg-[#F1F3FB] dark:bg-[#1E2140] flex items-center justify-center mb-6"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? "#3730A3" : "#E5E7EB" }}
            />
          ))}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          {step === 1 ? "Create Account" : "Set Password"}
        </h1>
        <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-1">
          {step === 1
            ? "Fill in your personal details"
            : "Choose a strong password"}
        </p>
      </div>
      <div className="flex-1 px-6 flex flex-col gap-4">
        {step === 1 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="Emeka"
                value={form.firstName}
                onChange={set("firstName")}
              />
              <Input
                label="Last Name"
                placeholder="Adeyemi"
                value={form.lastName}
                onChange={set("lastName")}
              />
            </div>
            <Input
              label="Email Address"
              placeholder="emeka@email.com"
              type="email"
              value={form.email}
              onChange={set("email")}
              icon={<Mail size={16} />}
            />
            <Input
              label="Phone Number"
              placeholder="+234 801 234 5678"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              icon={<Phone size={16} />}
            />
          </>
        ) : (
          <>
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={set("password")}
              icon={<Lock size={16} />}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              icon={<Lock size={16} />}
            />
            <div className="bg-[#F1F3FB] dark:bg-[#1E2140] rounded-xl p-4 flex flex-col gap-2">
              {["8+ characters", "One uppercase letter", "One number"].map(
                (r) => (
                  <div
                    key={r}
                    className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400"
                  >
                    <Check size={14} className="text-[#059669]" />
                    {r}
                  </div>
                ),
              )}
            </div>
          </>
        )}
        <div className="mt-2">
          <PaveBtn onClick={doNext} disabled={loading}>
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Creating account...
              </>
            ) : step === 1 ? (
              "Continue"
            ) : (
              "Create Account"
            )}
          </PaveBtn>
        </div>
      </div>
      <div className="px-6 py-4 text-center text-xs text-[#9CA3AF]">
        By creating an account you agree to our{" "}
        <span className="text-[#3730A3] dark:text-[#818CF8]">Terms</span> &{" "}
        <span className="text-[#3730A3] dark:text-[#818CF8]">
          Privacy Policy
        </span>
      </div>
    </div>
  );
}

export function ForgotPasswordScreen({
  onNav,
}: {
  onNav: (s: Screen) => void;
}) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Reset Password" onBack={() => onNav("login")} />
      <div className="flex-1 flex flex-col px-6 pt-8">
        {!sent ? (
          <>
            <div className="w-16 h-16 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl flex items-center justify-center mb-6">
              <Mail size={28} className="text-[#3730A3] dark:text-[#818CF8]" />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              Forgot Password?
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2 mb-8">
              No worries! Enter your email and we'll send a reset link.
            </p>
            <Input
              label="Email Address"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={setEmail}
              icon={<Mail size={16} />}
            />
            <div className="mt-6">
              <PaveBtn onClick={() => setSent(true)}>Send Reset Link</PaveBtn>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-20 h-20 bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-full flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-[#059669]" />
            </motion.div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              Check Your Email
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm">
              We sent a password reset link to{" "}
              <strong>{email || "your email"}</strong>
            </p>
            <div className="mt-4 flex flex-col gap-3 w-full">
              <PaveBtn onClick={() => onNav("login")}>Back to Login</PaveBtn>
              <PaveBtn variant="ghost" onClick={() => setSent(false)}>
                Resend Email
              </PaveBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AcceptInvitationScreen({
  onNav,
}: {
  onNav: (s: Screen) => void;
}) {
  const [code, setCode] = useState("");
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const verify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFound(true);
    }, 1000);
  };
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Join PAVE" onBack={() => onNav("login")} />
      <div className="flex-1 px-6 pt-8 flex flex-col">
        {!found ? (
          <>
            <div className="w-16 h-16 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl flex items-center justify-center mb-6">
              <Hash size={28} className="text-[#3730A3] dark:text-[#818CF8]" />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              Enter Invitation Code
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2 mb-8">
              Got an invite from your admin? Enter the code below to join.
            </p>
            <Input
              label="Invitation Code"
              placeholder="e.g. PAVE-2024-XK91"
              value={code}
              onChange={setCode}
              icon={<Hash size={16} />}
            />
            <div className="mt-4">
              <PaveBtn onClick={verify} disabled={loading || !code}>
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </PaveBtn>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center">
                <Check size={22} className="text-white" />
              </div>
              <div>
                <div className="text-xs text-[#059669] font-semibold">
                  Invitation Found!
                </div>
                <div className="font-semibold text-[#0D0F1C] dark:text-white">
                  Okonkwo Community Group
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111327] rounded-2xl border border-[#E5E7EB] dark:border-gray-800 p-5 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-gray-400">Admin</span>
                <span className="font-medium">Chibuike Okonkwo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-gray-400">
                  Group Type
                </span>
                <span className="font-medium">Community Thrift</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-gray-400">
                  Members
                </span>
                <span className="font-medium">24 members</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-gray-400">
                  Monthly Target
                </span>
                <span className="font-medium">₦50,000</span>
              </div>
            </div>
            <PaveBtn onClick={() => onNav("register")}>
              Accept & Register
            </PaveBtn>
            <PaveBtn variant="ghost" onClick={() => setFound(false)}>
              Use Different Code
            </PaveBtn>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function KYCWelcomeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-md"
          style={{ background: "linear-gradient(135deg, #EEF2FF, #C7D2FE)" }}
        >
          🔐
        </div>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            Verify Your Identity
          </h1>
          <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-3 leading-relaxed">
            We need to verify your identity to keep your account and funds
            secure. This takes about 3 minutes.
          </p>
        </div>
        <div className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] rounded-2xl p-5 flex flex-col gap-4">
          {[
            ["NIN Verification", "Your 11-digit National ID Number", "🪪"],
            ["ID Document", "Upload a valid government ID", "📄"],
            [
              "Selfie Check",
              "Take a quick selfie for facial recognition",
              "🤳",
            ],
          ].map(([t, d, ic]) => (
            <div key={t} className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xl shadow-sm">
                {ic}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                  {t}
                </div>
                <div className="text-xs text-[#9CA3AF]">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 flex flex-col gap-3">
        <PaveBtn onClick={() => onNav("kyc-nin")}>Start Verification</PaveBtn>
        <PaveBtn variant="ghost" onClick={() => onNav("home")}>
          Skip for now
        </PaveBtn>
      </div>
    </div>
  );
}

export function KYCNINScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const doVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNav("kyc-id-type");
    }, 1200);
  };
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader
        title="NIN Verification"
        onBack={() => onNav("kyc-welcome")}
      />
      <div className="flex-1 px-6 pt-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">1/3</span>
          </div>
          <p className="text-sm text-[#374151] dark:text-gray-300">
            Enter your 11-digit National Identification Number (NIN)
          </p>
        </div>
        <Input
          label="NIN"
          placeholder="12345678901"
          value={nin}
          onChange={setNin}
          icon={<Hash size={16} />}
        />
        <div className="bg-[#FFFBEB] dark:bg-[#78350F]/20 rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-xs text-[#92400E] dark:text-[#FCD34D]">
            Your NIN is securely encrypted and will only be used for identity
            verification purposes.
          </p>
        </div>
        <div className="mt-auto">
          <PaveBtn onClick={doVerify} disabled={nin.length !== 11 || loading}>
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Verifying NIN...
              </>
            ) : (
              "Verify NIN"
            )}
          </PaveBtn>
        </div>
      </div>
    </div>
  );
}

export function KYCIDTypeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selected, setSelected] = useState("");
  const types = [
    { id: "nin_card", label: "NIN Slip/Card", icon: "🪪" },
    { id: "pvc", label: "Voter's Card (PVC)", icon: "🗳️" },
    { id: "passport", label: "International Passport", icon: "📘" },
    { id: "drivers", label: "Driver's License", icon: "🚗" },
  ];
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Select ID Type" onBack={() => onNav("kyc-nin")} />
      <div className="flex-1 px-6 pt-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">2/3</span>
          </div>
          <p className="text-sm text-[#374151] dark:text-gray-300">
            Choose which government-issued ID you'll upload
          </p>
        </div>
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selected === t.id ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="flex-1 text-left font-medium text-[#0D0F1C] dark:text-gray-200 text-sm">
              {t.label}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === t.id ? "border-[#3730A3] bg-[#3730A3]" : "border-[#D1D5DB]"}`}
            >
              {selected === t.id && <Check size={12} className="text-white" />}
            </div>
          </button>
        ))}
        <div className="mt-auto pt-4">
          <PaveBtn onClick={() => onNav("kyc-id-upload")} disabled={!selected}>
            Continue
          </PaveBtn>
        </div>
      </div>
    </div>
  );
}

export function KYCIDUploadScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Upload ID" onBack={() => onNav("kyc-id-type")} />
      <div className="flex-1 px-6 pt-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">2/3</span>
          </div>
          <p className="text-sm text-[#374151] dark:text-gray-300">
            Upload clear photos of both sides of your ID
          </p>
        </div>
        {[
          ["Front Side", front, () => setFront(true)],
          ["Back Side", back, () => setBack(true)],
        ].map(([label, done, action]: any) => (
          <button
            key={label}
            onClick={action}
            className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all ${done ? "border-[#059669] bg-[#ECFDF5] dark:bg-[#065F46]/20" : "border-[#D1D5DB] dark:border-gray-700 bg-[#F9FAFB] dark:bg-[#161830] hover:bg-[#F1F3FB]"}`}
          >
            {done ? (
              <>
                <CheckCircle size={32} className="text-[#059669]" />
                <span className="text-sm font-medium text-[#059669]">
                  {label} uploaded ✓
                </span>
              </>
            ) : (
              <>
                <Upload size={28} className="text-[#9CA3AF]" />
                <span className="text-sm font-medium text-[#374151] dark:text-gray-300">
                  Upload {label}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  JPG, PNG up to 5MB
                </span>
              </>
            )}
          </button>
        ))}
        <div className="bg-[#FFFBEB] dark:bg-[#78350F]/20 rounded-xl p-4 flex gap-3">
          <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-xs text-[#92400E] dark:text-[#FCD34D]">
            Ensure the document is well-lit, not blurry, and all text is clearly
            visible.
          </p>
        </div>
        <div className="mt-auto">
          <PaveBtn
            onClick={() => onNav("kyc-selfie")}
            disabled={!front || !back}
          >
            Continue to Selfie
          </PaveBtn>
        </div>
      </div>
    </div>
  );
}

export function KYCSelfieScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [taken, setTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const doSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNav("kyc-pending");
    }, 1500);
  };
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader
        title="Selfie Verification"
        onBack={() => onNav("kyc-id-upload")}
      />
      <div className="flex-1 px-6 pt-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4 w-full">
          <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">3/3</span>
          </div>
          <p className="text-sm text-[#374151] dark:text-gray-300">
            Take a selfie to match your face with your ID
          </p>
        </div>
        <div
          className="w-56 h-56 rounded-full border-4 border-dashed flex items-center justify-center relative overflow-hidden"
          style={{
            borderColor: taken ? "#059669" : "#D1D5DB",
            background: taken ? "#ECFDF5" : "#F9FAFB",
          }}
        >
          {taken ? (
            <CheckCircle size={64} className="text-[#059669]" />
          ) : (
            <Camera size={48} className="text-[#9CA3AF]" />
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          {[
            "Remove glasses if wearing any",
            "Face the camera directly",
            "Make sure your face is well-lit",
          ].map((tip) => (
            <div
              key={tip}
              className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-gray-400"
            >
              <Check size={14} className="text-[#059669]" />
              {tip}
            </div>
          ))}
        </div>
        <div className="mt-auto w-full flex flex-col gap-3">
          {!taken ? (
            <PaveBtn onClick={() => setTaken(true)} variant="outline">
              <Camera size={18} />
              Take Selfie
            </PaveBtn>
          ) : (
            <PaveBtn variant="ghost" onClick={() => setTaken(false)}>
              Retake
            </PaveBtn>
          )}
          <PaveBtn onClick={doSubmit} disabled={!taken || loading}>
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Submitting KYC...
              </>
            ) : (
              "Submit for Review"
            )}
          </PaveBtn>
        </div>
      </div>
    </div>
  );
}

export function KYCPendingScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 max-w-md w-full mx-auto">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-6xl"
      >
        ⏳
      </motion.div>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          Under Review
        </h1>
        <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-3 leading-relaxed">
          Your KYC documents are being reviewed by your admin. This usually
          takes 1–24 hours.
        </p>
      </div>
      <div className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280] dark:text-gray-400">
            NIN Verification
          </span>
          <Badge color="green">Done</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280] dark:text-gray-400">ID Upload</span>
          <Badge color="green">Done</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280] dark:text-gray-400">
            Selfie Check
          </span>
          <Badge color="green">Done</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B7280] dark:text-gray-400">
            Admin Review
          </span>
          <Badge color="gold">Pending</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <PaveBtn onClick={() => onNav("home")}>Go to Dashboard</PaveBtn>
        <PaveBtn variant="ghost" onClick={() => onNav("kyc-approved")}>
          Preview Approved State
        </PaveBtn>
      </div>
    </div>
  );
}

export function KYCApprovedScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6 max-w-md w-full mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="w-28 h-28 rounded-full bg-[#ECFDF5] dark:bg-[#065F46]/30 flex items-center justify-center">
          <CheckCircle size={60} className="text-[#059669]" />
        </div>
      </motion.div>
      <div>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          Account Verified! 🎉
        </h1>
        <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-3 leading-relaxed">
          Your identity has been verified. You now have full access to all PAVE
          features.
        </p>
      </div>
      <div className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar name="Emeka Adeyemi" size={48} color="#3730A3" />
          <div className="text-left">
            <div className="font-semibold text-[#0D0F1C] dark:text-white">
              Emeka Adeyemi
            </div>
            <div className="text-xs text-[#6B7280] dark:text-gray-400">
              emeka@email.com • Member ID: PAV-20240614
            </div>
            <div className="mt-1">
              <Badge color="green">KYC Verified</Badge>
            </div>
          </div>
        </div>
      </div>
      <PaveBtn onClick={() => onNav("home")} variant="green">
        Start Using PAVE
      </PaveBtn>
    </div>
  );
}

export function HomeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [balVisible, setBalVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard?.writeText("90312048871");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickActions = [
    {
      icon: <ArrowUpRight size={20} />,
      label: "Transfer",
      color: "#3730A3",
      bg: "#EEF2FF",
      screen: "transfer",
    },
    {
      icon: <Zap size={20} />,
      label: "Bills",
      color: "#059669",
      bg: "#ECFDF5",
      screen: "bills",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime",
      color: "#D97706",
      bg: "#FFFBEB",
      screen: "airtime",
    },
    {
      icon: <Plus size={20} />,
      label: "Fund",
      color: "#7C3AED",
      bg: "#F5F3FF",
      screen: "fund-wallet",
    },
  ];
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
        }}
        className="px-6 pt-14 pb-8 rounded-b-3xl shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name="Emeka Adeyemi" size={40} color="#6366F1" />
            <div>
              <div className="text-white/60 text-xs">Good morning,</div>
              <div className="text-white font-semibold text-sm">Emeka 👋</div>
            </div>
          </div>
          <button
            onClick={() => onNav("notifications")}
            className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Bell size={18} className="text-white" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full" />
          </button>
        </div>
        <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/15">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/60 text-xs">Wallet Balance</span>
            <button onClick={() => setBalVisible(!balVisible)}>
              {balVisible ? (
                <EyeOff size={16} className="text-white/60" />
              ) : (
                <Eye size={16} className="text-white/60" />
              )}
            </button>
          </div>
          <div
            className="text-white mb-4"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 32,
              letterSpacing: "-0.5px",
            }}
          >
            {balVisible ? "₦247,500" : "₦ ••••••"}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/50 text-xs">Virtual Account</div>
              <div className="text-white/90 text-sm font-mono">
                9031 204 8871
              </div>
            </div>
            <button
              onClick={copyAccount}
              className="text-white/60 hover:text-white flex items-center gap-1 text-xs"
            >
              <Copy size={16} />
              {copied && <span className="text-green-300">Copied!</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#111327] rounded-2xl p-4 shadow-sm border border-[#F1F3FB] dark:border-gray-800">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => onNav(a.screen as Screen)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ background: a.bg, color: a.color }}
                >
                  {a.icon}
                </div>
                <span className="text-xs text-[#374151] dark:text-gray-300 font-medium">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Savings Summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              My Savings
            </h3>
            <button
              onClick={() => onNav("savings")}
              className="text-xs text-[#3730A3] dark:text-[#818CF8] font-medium"
            >
              View all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_SAVINGS.slice(0, 2).map((s) => (
              <button
                key={s.id}
                onClick={() => onNav("savings-detail")}
                className="bg-white dark:bg-[#111327] rounded-2xl p-4 border border-[#F1F3FB] dark:border-gray-800 shadow-sm text-left hover:border-[#C7D2FE] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                        {s.name}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">{s.freq}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                      {fmt(s.current)}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      of {fmt(s.goal)}
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F3FB] dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(s.current, s.goal)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-[#9CA3AF]">
                  <span>{pct(s.current, s.goal)}% reached</span>
                  <span>{s.daysLeft} days left</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spending Chart */}
        <div className="bg-white dark:bg-[#111327] rounded-2xl p-4 border border-[#F1F3FB] dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Weekly Spending
            </h3>
            <Badge color="indigo">June 2024</Badge>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={SPEND_DATA}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3730A3" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3730A3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: any) => `₦${Number(v).toLocaleString()}`}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3730A3"
                strokeWidth={2}
                fill="url(#spendGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Recent Activity
            </h3>
            <button
              onClick={() => onNav("transactions")}
              className="text-xs text-[#3730A3] dark:text-[#818CF8] font-medium"
            >
              See all
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_TRANSACTIONS.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#111327] rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB] dark:border-gray-800"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5] dark:bg-[#065F46]/20" : "bg-[#F9FAFB] dark:bg-gray-800"}`}
                >
                  {t.type === "credit" ? (
                    <ArrowDownLeft size={18} className="text-[#059669]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#0D0F1C] dark:text-white">
                    {t.desc}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">{t.date}</div>
                </div>
                <div
                  className={`text-sm font-semibold ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C] dark:text-white"}`}
                >
                  {t.type === "credit" ? "+" : "-"}
                  {fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [copied, setCopied] = useState(false);
  const copyAccount = () => {
    navigator.clipboard?.writeText("90312048871");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    {
      icon: <Plus size={20} />,
      label: "Fund Wallet",
      screen: "fund-wallet",
      color: "#3730A3",
      bg: "#EEF2FF",
    },
    {
      icon: <Send size={20} />,
      label: "Transfer",
      screen: "transfer",
      color: "#059669",
      bg: "#ECFDF5",
    },
    {
      icon: <Zap size={20} />,
      label: "Pay Bills",
      screen: "bills",
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      icon: <Phone size={20} />,
      label: "Airtime & Data",
      screen: "airtime",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      icon: <QrCode size={20} />,
      label: "QR Pay",
      screen: "wallet",
      color: "#DB2777",
      bg: "#FDF2F8",
    },
    {
      icon: <Landmark size={20} />,
      label: "Virtual Account",
      screen: "wallet",
      color: "#0891B2",
      bg: "#ECFEFF",
    },
  ];
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #059669 0%, #047857 100%)",
        }}
        className="px-6 pt-14 pb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-white font-semibold"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            My Wallet
          </h2>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <MoreHorizontal size={18} className="text-white" />
          </button>
        </div>
        <div className="text-white/70 text-sm mb-1">Available Balance</div>
        <div
          className="text-white mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 36,
          }}
        >
          ₦247,500.00
        </div>
        <button
          onClick={copyAccount}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-4 py-2.5 w-fit"
        >
          <Landmark size={14} className="text-white/70" />
          <span className="text-white/70 text-xs">PAVE/Wema: </span>
          <span className="text-white text-xs font-mono font-semibold">
            9031 204 8871
          </span>
          <Copy size={12} className="text-white/60" />
          {copied && (
            <span className="text-xs text-white bg-black/30 px-1.5 py-0.5 rounded">
              Copied!
            </span>
          )}
        </button>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-[#111327] rounded-2xl p-5 shadow-sm border border-[#F1F3FB] dark:border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => onNav(a.screen as Screen)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ background: a.bg, color: a.color }}
                >
                  {a.icon}
                </div>
                <span className="text-xs text-[#374151] dark:text-gray-300 font-medium text-center leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Money In",
              value: "₦165,000",
              icon: <ArrowDownLeft size={16} />,
              color: "#059669",
              bg: "#ECFDF5",
            },
            {
              label: "Money Out",
              value: "₦68,500",
              icon: <ArrowUpRight size={16} />,
              color: "#DC2626",
              bg: "#FEF2F2",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-[#111327] rounded-2xl p-4 border border-[#F1F3FB] dark:border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <span className="text-xs text-[#9CA3AF]">{s.label}</span>
              </div>
              <div
                className="font-semibold text-[#0D0F1C] dark:text-white"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-[#9CA3AF]">This month</div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="mb-6">
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Transaction History
          </h3>
          <div className="flex flex-col gap-2">
            {MOCK_TRANSACTIONS.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#111327] rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB] dark:border-gray-800"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5] dark:bg-[#065F46]/20" : "bg-[#F9FAFB] dark:bg-gray-800"}`}
                >
                  {t.type === "credit" ? (
                    <ArrowDownLeft size={18} className="text-[#059669]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0D0F1C] dark:text-white truncate">
                    {t.desc}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    {t.date} · {t.category}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C] dark:text-white"}`}
                >
                  {t.type === "credit" ? "+" : "-"}
                  {fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FundWalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const presets = ["5,000", "10,000", "20,000", "50,000", "100,000"];
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Fund Wallet" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151] dark:text-gray-300">
              Amount (₦)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 24,
              }}
            />
            <div className="flex flex-wrap gap-2 mt-1">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className="px-3 py-1.5 bg-[#EEF2FF] dark:bg-[#1E2140] text-[#3730A3] dark:text-[#818CF8] rounded-full text-xs font-medium hover:opacity-80"
                >
                  ₦{p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151] dark:text-gray-300">
              Payment Method
            </label>
            {[
              {
                id: "bank",
                label: "Bank Transfer",
                desc: "Transfer to virtual account",
                icon: <Landmark size={20} />,
              },
              {
                id: "card",
                label: "Debit Card",
                desc: "Pay with your card",
                icon: <CreditCard size={20} />,
              },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${method === m.id ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#F1F3FB] dark:bg-gray-800 flex items-center justify-center text-[#3730A3] dark:text-[#818CF8]">
                  {m.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                    {m.label}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">{m.desc}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-[#3730A3] bg-[#3730A3]" : "border-[#D1D5DB]"}`}
                >
                  {method === m.id && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
          {method === "bank" && (
            <div className="bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4">
              <div className="text-xs font-semibold text-[#3730A3] dark:text-[#818CF8] mb-3">
                Transfer to this account:
              </div>
              <div className="flex flex-col gap-2">
                {[
                  ["Bank", "Wema Bank"],
                  ["Account Name", "PAVE/Emeka Adeyemi"],
                  ["Account Number", "9031 204 8871"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-[#6B7280] dark:text-gray-400">
                      {k}
                    </span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto pt-2">
            <PaveBtn
              onClick={() => setSuccess(true)}
              disabled={!amount || !method}
            >
              Fund Wallet
            </PaveBtn>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              ₦{amount} Funded!
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
              Your wallet has been credited successfully.
            </p>
          </div>
          <PaveBtn onClick={() => onNav("wallet")}>Back to Wallet</PaveBtn>
        </div>
      )}
    </div>
  );
}

export function TransferScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [found, setFound] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const recents = [
    { name: "Chinwe Okonkwo", acct: "0123456789", bank: "GTBank" },
    { name: "Adewale Bello", acct: "0987654321", bank: "First Bank" },
  ];
  const lookup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFound(true);
    }, 1000);
  };
  const transfer = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader
        title="Send Money"
        onBack={() => (step > 1 ? setStep(step - 1) : onNav("wallet"))}
      />
      {success ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Transfer Successful!
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
              ₦{amount} sent to Chinwe Okonkwo
            </p>
          </div>
          <div className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] rounded-2xl p-4 text-sm flex flex-col gap-2">
            {[
              ["Recipient", "Chinwe Okonkwo"],
              ["Amount", `₦${amount}`],
              ["Fee", "₦0.00"],
              ["Reference", "TXN-2024061401"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#6B7280] dark:text-gray-400">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <PaveBtn onClick={() => onNav("wallet")}>Done</PaveBtn>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          {step === 1 && (
            <>
              <Input
                label="Account Number or Phone"
                placeholder="0123456789"
                value={recipient}
                onChange={setRecipient}
                icon={<Search size={16} />}
                right={
                  recipient.length >= 10 ? (
                    <button
                      onClick={lookup}
                      className="text-[#3730A3] dark:text-[#818CF8] text-xs font-semibold"
                    >
                      {loading ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        "Find"
                      )}
                    </button>
                  ) : null
                }
              />
              {found && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#ECFDF5] dark:bg-[#065F46]/20 rounded-2xl p-4 flex items-center gap-3"
                >
                  <Avatar name="Chinwe Okonkwo" size={44} color="#059669" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                      Chinwe Okonkwo
                    </div>
                    <div className="text-xs text-[#6B7280] dark:text-gray-400">
                      GTBank • 0123456789
                    </div>
                  </div>
                  <Check size={18} className="text-[#059669]" />
                </motion.div>
              )}
              <div>
                <div className="text-sm font-medium text-[#374151] dark:text-gray-300 mb-2">
                  Recent Transfers
                </div>
                {recents.map((r) => (
                  <button
                    key={r.acct}
                    onClick={() => {
                      setRecipient(r.acct);
                      setFound(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F1F3FB] dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar name={r.name} size={40} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-[#9CA3AF]">
                        {r.bank} • {r.acct}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#D1D5DB]" />
                  </button>
                ))}
              </div>
              <div className="mt-auto">
                <PaveBtn onClick={() => setStep(2)} disabled={!found}>
                  Continue
                </PaveBtn>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="bg-[#EEF2FF] dark:bg-[#1E2140] rounded-2xl p-4 flex items-center gap-3">
                <Avatar name="Chinwe Okonkwo" size={44} color="#3730A3" />
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">
                    Chinwe Okonkwo
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-gray-400">
                    GTBank • 0123456789
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Amount (₦)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 24,
                  }}
                />
              </div>
              <Input
                label="Add a note (optional)"
                placeholder="What's this for?"
                value={note}
                onChange={setNote}
                icon={<MessageSquare size={16} />}
              />
              {amount && (
                <div className="bg-[#F1F3FB] dark:bg-[#1E2140] rounded-xl p-3 text-sm flex justify-between">
                  <span className="text-[#6B7280] dark:text-gray-400">
                    New balance after transfer:
                  </span>
                  <span className="font-semibold">
                    ₦
                    {(
                      247500 - Number(amount.replace(/,/g, ""))
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="mt-auto">
                <PaveBtn onClick={transfer} disabled={!amount || loading}>
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Send ₦${amount || "0"}`
                  )}
                </PaveBtn>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function BillsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [selected, setSelected] = useState("");
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [meter, setMeter] = useState("");
  const bills = [
    { id: "electricity", label: "Electricity", icon: "⚡", color: "#D97706" },
    { id: "water", label: "Water", icon: "💧", color: "#0891B2" },
    { id: "tv", label: "Cable TV", icon: "📺", color: "#7C3AED" },
    { id: "internet", label: "Internet", icon: "🌐", color: "#059669" },
    { id: "school", label: "School Fees", icon: "🎓", color: "#3730A3" },
    { id: "govt", label: "Govt Fees", icon: "🏛️", color: "#374151" },
  ];
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Pay Bills" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            {bills.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${selected === b.id ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs font-medium text-[#374151] dark:text-gray-300">
                  {b.label}
                </span>
              </button>
            ))}
          </div>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              <Input
                label={
                  selected === "electricity"
                    ? "Meter Number"
                    : "Reference Number"
                }
                placeholder={
                  selected === "electricity"
                    ? "0123456789012"
                    : "Enter reference"
                }
                value={meter}
                onChange={setMeter}
                icon={<Hash size={16} />}
              />
              <Input
                label="Amount (₦)"
                placeholder="Enter amount"
                value={amount}
                onChange={setAmount}
                icon={<DollarSign size={16} />}
              />
              <PaveBtn
                onClick={() => setSuccess(true)}
                disabled={!meter || !amount}
              >
                Pay Now
              </PaveBtn>
            </motion.div>
          )}
          {!selected && (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <Zap size={40} className="text-[#E5E7EB] dark:text-gray-700" />
              <p className="text-[#9CA3AF] text-sm">
                Select a bill category above to continue
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Payment Successful!
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
              ₦{amount} bill payment completed
            </p>
          </div>
          <PaveBtn
            onClick={() => {
              setSuccess(false);
              setSelected("");
              setAmount("");
              setMeter("");
            }}
          >
            Pay Another Bill
          </PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("wallet")}>
            Back to Wallet
          </PaveBtn>
        </div>
      )}
    </div>
  );
}

export function AirtimeScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [tab, setTab] = useState<"airtime" | "data">("airtime");
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const networks = [
    { id: "mtn", label: "MTN", color: "#FBBF24", bg: "#FFFBEB" },
    { id: "airtel", label: "Airtel", color: "#DC2626", bg: "#FEF2F2" },
    { id: "glo", label: "Glo", color: "#059669", bg: "#ECFDF5" },
    { id: "9mobile", label: "9Mobile", color: "#059669", bg: "#ECFDF5" },
  ];
  const dataplans = [
    { label: "500MB", price: "₦200", validity: "1 day" },
    { label: "1GB", price: "₦500", validity: "7 days" },
    { label: "2GB", price: "₦1,000", validity: "30 days" },
    { label: "5GB", price: "₦2,000", validity: "30 days" },
    { label: "10GB", price: "₦3,500", validity: "30 days" },
  ];
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Airtime & Data" onBack={() => onNav("wallet")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="bg-[#F1F3FB] dark:bg-[#1E2140] p-1 rounded-xl flex">
            {(["airtime", "data"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white dark:bg-gray-800 text-[#0D0F1C] dark:text-white shadow-sm" : "text-[#9CA3AF]"}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {networks.map((n) => (
              <button
                key={n.id}
                onClick={() => setNetwork(n.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${network === n.id ? "border-[#3730A3]" : "border-[#E5E7EB] dark:border-gray-700"}`}
                style={{ background: n.bg }}
              >
                <span className="text-lg font-bold" style={{ color: n.color }}>
                  {n.label[0]}
                </span>
                <span className="text-xs" style={{ color: n.color }}>
                  {n.label}
                </span>
              </button>
            ))}
          </div>
          <Input
            label="Phone Number"
            placeholder="+234 801 234 5678"
            type="tel"
            value={phone}
            onChange={setPhone}
            icon={<Phone size={16} />}
          />
          {tab === "airtime" ? (
            <>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Amount
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₦0.00"
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["100", "200", "500", "1,000", "2,000"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAmount(a)}
                      className="px-3 py-1.5 bg-[#EEF2FF] dark:bg-[#1E2140] text-[#3730A3] dark:text-[#818CF8] rounded-full text-xs font-medium"
                    >
                      ₦{a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {dataplans.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAmount(p.price.replace("₦", ""))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${amount === p.price.replace("₦", "") ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-sm">{p.label}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      Valid for {p.validity}
                    </div>
                  </div>
                  <div className="font-semibold text-[#3730A3] dark:text-[#818CF8]">
                    {p.price}
                  </div>
                </button>
              ))}
            </div>
          )}
          <PaveBtn
            onClick={() => setSuccess(true)}
            disabled={!network || !phone || !amount}
          >
            Buy {tab === "airtime" ? "Airtime" : "Data"}
          </PaveBtn>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] dark:bg-[#065F46]/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Success! 🎉
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
              {tab === "airtime" ? `₦${amount} airtime` : `Data bundle`} sent to{" "}
              {phone}
            </p>
          </div>
          <PaveBtn
            onClick={() => {
              setSuccess(false);
              setAmount("");
              setPhone("");
            }}
          >
            Buy More
          </PaveBtn>
          <PaveBtn variant="ghost" onClick={() => onNav("wallet")}>
            Back to Wallet
          </PaveBtn>
        </div>
      )}
    </div>
  );
}

export function SavingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [tab, setTab] = useState<"personal" | "programs">("personal");
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
              ₦382,500
            </div>
            <div className="text-white/60 text-xs mt-1">Across 3 goals</div>
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
        <div className="bg-white dark:bg-[#111327] rounded-2xl shadow-sm overflow-hidden border border-[#F1F3FB] dark:border-gray-800">
          <div className="flex">
            {(["personal", "programs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3.5 text-sm font-medium transition-all ${tab === t ? "bg-[#3730A3] text-white" : "text-[#9CA3AF]"}`}
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
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] dark:border-gray-700 bg-[#EEF2FF] dark:bg-[#1E2140] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              <span className="text-[#3730A3] dark:text-[#818CF8] font-medium text-sm">
                Create New Savings Goal
              </span>
            </button>
            {MOCK_SAVINGS.map((s) => (
              <button
                key={s.id}
                onClick={() => onNav("savings-detail")}
                className="bg-white dark:bg-[#111327] rounded-2xl p-5 border border-[#F1F3FB] dark:border-gray-800 shadow-sm text-left hover:border-[#C7D2FE] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="font-semibold text-[#0D0F1C] dark:text-white">
                        {s.name}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        {s.freq} · {s.daysLeft} days left
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#0D0F1C] dark:text-white">
                      {fmt(s.current)}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {pct(s.current, s.goal)}%
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-[#F1F3FB] dark:bg-gray-800 rounded-full overflow-hidden">
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
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] dark:border-gray-700 bg-[#EEF2FF] dark:bg-[#1E2140] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3730A3] flex items-center justify-center">
                <Plus size={20} className="text-white" />
              </div>
              <span className="text-[#3730A3] dark:text-[#818CF8] font-medium text-sm">
                Join a Savings Program
              </span>
            </button>
            {MOCK_PROGRAMS.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#111327] rounded-2xl p-5 border border-[#F1F3FB] dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-[#0D0F1C] dark:text-white">
                      {p.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      by {p.admin} · {p.members} members
                    </div>
                  </div>
                  <Badge color="indigo">{p.freq}</Badge>
                </div>
                <div className="h-2 bg-[#F1F3FB] dark:bg-gray-800 rounded-full overflow-hidden mb-3">
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
                      <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#F1F3FB] dark:border-gray-800 flex items-center justify-between">
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
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
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
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
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
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Goal Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="e.g. New iPhone, Holiday Trip..."
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Target Amount (₦)
                </label>
                <input
                  value={form.goal}
                  onChange={(e) => set("goal")(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 24,
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-2">
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
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${form.type === t.id ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
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
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Deposit Amount per {form.freq || "Period"} (₦)
                </label>
                <input
                  value={form.amount}
                  onChange={(e) => set("amount")(e.target.value)}
                  placeholder="e.g. 5,000"
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-5 py-4 outline-none border border-transparent focus:border-[#3730A3] transition-colors"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-2">
                  Save Every
                </label>
                <div className="flex flex-wrap gap-2">
                  {freqs.map((f) => (
                    <button
                      key={f}
                      onClick={() => set("freq")(f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${form.freq === f ? "bg-[#3730A3] border-[#3730A3] text-white" : "border-[#E5E7EB] dark:border-gray-700 text-[#374151] dark:text-gray-300"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-2">
                  Preferred Time
                </label>
                <div className="flex flex-wrap gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => set("time")(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.time === t ? "bg-[#3730A3] border-[#3730A3] text-white" : "border-[#E5E7EB] dark:border-gray-700 text-[#374151] dark:text-gray-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {form.goal && form.amount && form.freq && (
                <div className="bg-[#EEF2FF] dark:bg-[#1E2140] rounded-xl p-4 text-sm">
                  <div className="font-semibold text-[#3730A3] dark:text-[#818CF8] mb-2">
                    📊 Projection
                  </div>
                  <div className="text-[#374151] dark:text-gray-300">
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
                <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-1.5">
                  Purpose / Motivation
                </label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => set("purpose")(e.target.value)}
                  placeholder="Why are you saving for this? Remind yourself..."
                  rows={4}
                  className="w-full bg-[#F1F3FB] dark:bg-[#1E2140] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors resize-none"
                />
              </div>
              <div className="bg-white dark:bg-[#111327] rounded-2xl border border-[#F1F3FB] dark:border-gray-800 p-5 flex flex-col gap-3">
                <div className="font-semibold text-[#0D0F1C] dark:text-white mb-1">
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
                    <span className="font-medium text-[#0D0F1C] dark:text-white">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <PaveBtn onClick={() => setSuccess(true)} variant="green">
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
  const s = MOCK_SAVINGS[0];
  const history = [
    { date: "Jun 14", amount: 7500, note: "Weekly deposit" },
    { date: "Jun 7", amount: 7500 },
    { date: "May 31", amount: 7500 },
    { date: "May 24", amount: 7500 },
  ];
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
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-4"
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
          <PaveBtn onClick={() => {}} full={false}>
            + Add Funds
          </PaveBtn>
          <PaveBtn onClick={() => {}} variant="outline" full={false}>
            Pause Goal
          </PaveBtn>
        </div>
        <div className="bg-white dark:bg-[#111327] rounded-2xl p-4 border border-[#F1F3FB] dark:border-gray-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Target", fmt(s.goal)],
              ["Deposited", fmt(s.current)],
              ["Remaining", fmt(s.goal - s.current)],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-[#9CA3AF]">{k}</div>
                <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                  {v}
                </div>
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
              className="flex items-center justify-between py-3 border-b border-[#F1F3FB] dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ECFDF5] dark:bg-[#065F46]/20 flex items-center justify-center">
                  <Check size={15} className="text-[#059669]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0D0F1C] dark:text-white">
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
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader title="Join a Program" onBack={() => onNav("savings")} />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-4">
          <p className="text-sm text-[#6B7280] dark:text-gray-400">
            Select an available savings program to join, managed by your invited
            admin.
          </p>
          {available.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${selected === p.id ? "border-[#3730A3] bg-[#EEF2FF] dark:bg-[#1E2140]" : "border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111327]"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-[#0D0F1C] dark:text-white">
                    {p.name}
                  </div>
                  <div className="text-xs text-[#9CA3AF]">
                    by {p.admin} · {p.members} members
                  </div>
                </div>
                <Badge color="indigo">{p.freq}</Badge>
              </div>
              <div className="flex justify-between text-sm mt-3">
                <span className="text-[#6B7280] dark:text-gray-400">
                  Your contribution
                </span>
                <span className="font-bold text-[#3730A3] dark:text-[#818CF8]">
                  {fmt(p.amount)}/{p.freq}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[#6B7280] dark:text-gray-400">
                  Group target
                </span>
                <span className="font-medium">{fmt(p.target)}</span>
              </div>
            </button>
          ))}
          <div className="mt-auto pt-2">
            <PaveBtn onClick={() => setSuccess(true)} disabled={!selected}>
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
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
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

export function MarketplaceScreen({
  onNav,
  setSelectedProduct,
}: {
  onNav: (s: Screen) => void;
  setSelectedProduct: (p: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Electronics", "Fashion", "Home", "Kitchen"];
  const filtered = MOCK_PRODUCTS.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #7C3AED 0%, #6D28D9 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <h2
          className="text-white mb-2"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
        >
          PAVE Marketplace
        </h2>
        <p className="text-white/70 text-sm mb-4">
          Save now, own it later. Pay 50% to secure.
        </p>
        <div className="bg-white/15 rounded-xl px-4 py-3 flex items-center gap-2 backdrop-blur-sm border border-white/20">
          <Search size={16} className="text-white/60" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
          />
        </div>
      </div>
      <div className="px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${category === c ? "bg-[#7C3AED] text-white" : "bg-white dark:bg-[#111327] text-[#374151] dark:text-gray-300 border border-[#E5E7EB] dark:border-gray-800"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <ShoppingBag
              size={40}
              className="text-[#E5E7EB] dark:text-gray-700"
            />
            <p className="text-[#9CA3AF] text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  onNav("product-detail");
                }}
                className="bg-white dark:bg-[#111327] rounded-2xl overflow-hidden border border-[#F1F3FB] dark:border-gray-800 shadow-sm text-left hover:border-[#7C3AED] transition-all"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#F1F3FB] dark:bg-gray-800">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/70 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {p.paid > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge color="indigo">Paying</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-[#9CA3AF] mb-1">
                    {p.category}
                  </div>
                  <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white leading-tight mb-2 line-clamp-2">
                    {p.name}
                  </div>
                  <div
                    className="font-bold text-[#0D0F1C] dark:text-white"
                    style={{
                      fontFamily: "var(--font-family-display)",
                      fontSize: 15,
                    }}
                  >
                    {fmt(p.price)}
                  </div>
                  <div className="text-xs text-[#7C3AED] dark:text-[#A78BFA]">
                    Start from {fmt(p.price / 2)}
                  </div>
                  {p.paid > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-[#F1F3FB] dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#7C3AED]"
                          style={{ width: `${pct(p.paid, p.price)}%` }}
                        />
                      </div>
                      <div className="text-xs text-[#9CA3AF] mt-1">
                        {pct(p.paid, p.price)}% paid
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductDetailScreen({
  onNav,
  product,
}: {
  onNav: (s: Screen) => void;
  product: any;
}) {
  const p = product || MOCK_PRODUCTS[0];
  const isPaying = p.paid > 0;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative">
        <ImageWithFallback
          src={p.image}
          alt={p.name}
          className="w-full aspect-4/3 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <button
          onClick={() => onNav("marketplace")}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md"
        >
          <ArrowLeft size={18} />
        </button>
        <button className="absolute top-12 right-4 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-md">
          <Heart size={18} className="text-[#DC2626]" />
        </button>
      </div>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge color="indigo">{p.category}</Badge>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-medium">{p.rating}</span>
              <span className="text-xs text-[#9CA3AF]">({p.reviews})</span>
            </div>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.3,
            }}
          >
            {p.name}
          </h2>
          <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
            {p.description}
          </p>
        </div>

        <div className="bg-[#F5F3FF] dark:bg-[#1E2140] rounded-2xl p-5 border border-[#DDD6FE] dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} className="text-[#7C3AED] dark:text-[#A78BFA]" />
            <span className="text-sm font-semibold text-[#7C3AED] dark:text-[#A78BFA]">
              Save-to-Own Plan
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ["Full Price", fmt(p.price)],
              ["50% to Secure (Pay Now)", fmt(p.price / 2)],
              ["Balance (on Delivery)", fmt(p.price / 2)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#6B7280] dark:text-gray-400">{k}</span>
                <span className="font-semibold text-[#0D0F1C] dark:text-white">
                  {v}
                </span>
              </div>
            ))}
          </div>
          {isPaying && (
            <div className="mt-3 pt-3 border-t border-[#DDD6FE] dark:border-gray-700">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#7C3AED] dark:text-[#A78BFA] font-medium">
                  Already Paid
                </span>
                <span className="font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                  {fmt(p.paid)}
                </span>
              </div>
              <div className="h-2 bg-[#DDD6FE] dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#7C3AED]"
                  style={{ width: `${pct(p.paid, p.price)}%` }}
                />
              </div>
              <div className="text-xs text-[#9CA3AF] mt-1">
                {pct(p.paid, p.price)}% of full price paid
              </div>
            </div>
          )}
        </div>

        {isPaying ? (
          <>
            <div className="bg-[#ECFDF5] dark:bg-[#065F46]/20 rounded-xl p-4 flex gap-3">
              <Truck size={16} className="text-[#059669] shrink-0 mt-0.5" />
              <div className="text-sm text-[#065F46] dark:text-[#6EE7B7]">
                You've reached 50%! Your order will ship soon. Continue paying
                the balance.
              </div>
            </div>
            <PaveBtn variant="green">Continue Paying Balance</PaveBtn>
          </>
        ) : (
          <PaveBtn onClick={() => onNav("payment-plan")}>
            Start Saving — {fmt(p.price / 2)} to Secure
          </PaveBtn>
        )}
        <PaveBtn variant="ghost" onClick={() => onNav("marketplace")}>
          Back to Marketplace
        </PaveBtn>
      </div>
    </div>
  );
}

export function PaymentPlanScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const p = MOCK_PRODUCTS[0];
  const [freq, setFreq] = useState("Weekly");
  const [success, setSuccess] = useState(false);
  const freqs = ["Daily", "Weekly", "Monthly"];
  const installment = {
    Daily: Math.ceil(p.price / 2 / 90),
    Weekly: Math.ceil(p.price / 2 / 13),
    Monthly: Math.ceil(p.price / 2 / 3),
  };
  return (
    <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
      <ScreenHeader
        title="Payment Plan"
        onBack={() => onNav("product-detail")}
      />
      {!success ? (
        <div className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-5">
          <div className="flex items-center gap-4 bg-[#F5F3FF] dark:bg-[#1E2140] rounded-2xl p-4">
            <ImageWithFallback
              src={p.image}
              alt={p.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <div className="font-semibold text-sm text-[#0D0F1C] dark:text-white">
                {p.name}
              </div>
              <div className="text-[#7C3AED] dark:text-[#A78BFA] font-semibold">
                {fmt(p.price)}
              </div>
              <div className="text-xs text-[#9CA3AF]">
                Pay {fmt(p.price / 2)} now to secure
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#374151] dark:text-gray-300 block mb-2">
              Payment Frequency
            </label>
            <div className="flex gap-2">
              {freqs.map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${freq === f ? "border-[#7C3AED] bg-[#F5F3FF] dark:bg-[#1E2140] text-[#7C3AED] dark:text-[#A78BFA]" : "border-[#E5E7EB] dark:border-gray-700 text-[#374151] dark:text-gray-300"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-[#111327] rounded-2xl border border-[#F1F3FB] dark:border-gray-800 p-5 flex flex-col gap-3">
            <div className="text-sm font-semibold text-[#0D0F1C] dark:text-white mb-1">
              Installment Breakdown
            </div>
            {[
              ["Total to Save (50%)", fmt(p.price / 2)],
              ["Installment Amount", fmt((installment as any)[freq])],
              ["Frequency", freq],
              [
                "Estimated Completion",
                freq === "Daily"
                  ? "~3 months"
                  : freq === "Weekly"
                    ? "~3 months"
                    : "~3 months",
              ],
              ["Balance on Delivery", fmt(p.price / 2)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-[#9CA3AF]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#FFFBEB] dark:bg-[#78350F]/20 rounded-xl p-4 flex gap-3">
            <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-xs text-[#92400E] dark:text-[#FCD34D]">
              Once you reach 50% of the full price, your product will be
              delivered. You continue paying the balance afterward.
            </p>
          </div>
          <PaveBtn onClick={() => setSuccess(true)} variant="gold">
            Start Saving Plan
          </PaveBtn>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="text-5xl"
          >
            🛍️
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Plan Activated!
            </h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-sm mt-2">
              Your payment plan for {p.name} is now active. Your first
              installment will be on{" "}
              {freq === "Daily"
                ? "tomorrow"
                : freq === "Weekly"
                  ? "next week"
                  : "next month"}
              .
            </p>
          </div>
          <PaveBtn onClick={() => onNav("savings")}>View in My Savings</PaveBtn>
        </div>
      )}
    </div>
  );
}

export function MessagesScreen({
  onNav,
  setActiveChat,
}: {
  onNav: (s: Screen) => void;
  setActiveChat: (c: any) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_MESSAGES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 pt-14 pb-4 bg-white dark:bg-[#111327] border-b border-[#F1F3FB] dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Messages
          </h2>
          <button
            onClick={() => onNav("chat")}
            className="w-9 h-9 rounded-full bg-[#EEF2FF] dark:bg-[#1E2140] flex items-center justify-center"
          >
            <Plus size={18} className="text-[#3730A3] dark:text-[#818CF8]" />
          </button>
        </div>
        <div className="bg-[#F1F3FB] dark:bg-[#1E2140] rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Search size={16} className="text-[#9CA3AF]" />
          <input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="flex-1">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setActiveChat(m);
              onNav(m.isGroup ? "group-chat" : "chat");
            }}
            className="w-full flex items-center gap-4 px-6 py-4 border-b border-[#F9FAFB] dark:border-gray-800 hover:bg-[#F9FAFB] dark:hover:bg-[#161830] transition-colors cursor-pointer text-left"
          >
            <div className="relative shrink-0">
              <Avatar
                name={m.name}
                size={48}
                color={m.isGroup ? "#7C3AED" : "#3730A3"}
              />
              {m.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#059669] rounded-full border-2 border-white dark:border-[#111327]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#0D0F1C] dark:text-white">
                    {m.name}
                  </span>
                  {m.isGroup && <Users size={12} className="text-[#9CA3AF]" />}
                </div>
                <span className="text-xs text-[#9CA3AF]">{m.time}</span>
              </div>
              <div className="text-sm text-[#9CA3AF] truncate mt-0.5">
                {m.lastMsg}
              </div>
            </div>
            {m.unread > 0 && (
              <div
                className="w-5 h-5 rounded-full bg-[#3730A3] flex items-center justify-center text-white shrink-0"
                style={{ fontSize: 11 }}
              >
                {m.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatScreen({
  onNav,
  chat,
}: {
  onNav: (s: Screen) => void;
  chat?: any;
}) {
  const c = chat || MOCK_MESSAGES[0];
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState(MOCK_CHAT);
  const send = () => {
    if (!msg.trim()) return;
    setMsgs([
      ...msgs,
      { id: String(Date.now()), from: "me", text: msg, time: "Now" },
    ]);
    setMsg("");
  };
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#111327] border-b border-[#F1F3FB] dark:border-gray-800">
        <button
          onClick={() => onNav("messages")}
          className="w-8 h-8 rounded-full bg-[#F1F3FB] dark:bg-gray-800 flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="relative">
          <Avatar name={c.name} size={38} color="#3730A3" />
          {c.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#059669] rounded-full border-2 border-white dark:border-[#111327]" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{c.name}</div>
          <div className="text-xs text-[#059669]">
            {c.online ? "Online" : "Last seen 2h ago"}
          </div>
        </div>
        <button>
          <MoreHorizontal size={20} className="text-[#9CA3AF]" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${m.from === "me" ? "bg-[#3730A3] text-white rounded-br-md" : "bg-white dark:bg-[#111327] text-[#0D0F1C] dark:text-white border border-[#F1F3FB] dark:border-gray-800 rounded-bl-md"}`}
            >
              {m.text}
              <div
                className={`text-xs mt-1 ${m.from === "me" ? "text-white/60" : "text-[#9CA3AF]"}`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 bg-white dark:bg-[#111327] border-t border-[#F1F3FB] dark:border-gray-800 flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-[#F1F3FB] dark:bg-gray-800 flex items-center justify-center text-[#9CA3AF]">
          <Paperclip size={16} />
        </button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 bg-[#F1F3FB] dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-4 py-2.5 text-sm outline-none"
        />
        <button className="w-9 h-9 rounded-full bg-[#F1F3FB] dark:bg-gray-800 flex items-center justify-center text-[#9CA3AF]">
          <Smile size={16} />
        </button>
        <button
          onClick={send}
          className="w-9 h-9 rounded-full bg-[#3730A3] flex items-center justify-center text-white"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export function NotificationsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const notifs = [
    {
      id: "1",
      icon: "💰",
      title: "Savings Reminder",
      body: "Your weekly iPhone goal deposit of ₦7,500 is due today.",
      time: "2m ago",
      color: "#3730A3",
      read: false,
    },
    {
      id: "2",
      icon: "✅",
      title: "KYC Approved",
      body: "Your identity has been verified successfully!",
      time: "1h ago",
      color: "#059669",
      read: false,
    },
    {
      id: "3",
      icon: "📦",
      title: "Product Update",
      body: "Great news! You've paid 50% toward Samsung Galaxy S25.",
      time: "3h ago",
      color: "#7C3AED",
      read: true,
    },
    {
      id: "4",
      icon: "💬",
      title: "New Message",
      body: "Chinwe Okonkwo sent you a message.",
      time: "5h ago",
      color: "#D97706",
      read: true,
    },
    {
      id: "5",
      icon: "🏦",
      title: "Wallet Credited",
      body: "₦50,000 has been added to your wallet.",
      time: "1d ago",
      color: "#059669",
      read: true,
    },
    {
      id: "6",
      icon: "📅",
      title: "Group Contribution Due",
      body: "PAVE Community Thrift contribution is due in 3 days.",
      time: "2d ago",
      color: "#3730A3",
      read: true,
    },
  ];
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 pt-14 pb-4 bg-white dark:bg-[#111327] border-b border-[#F1F3FB] dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2
            style={{
              fontFamily: "var(--font-family-display)",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Notifications
          </h2>
          <button className="text-sm text-[#3730A3] dark:text-[#818CF8] font-medium">
            Mark all read
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 flex flex-col gap-2">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${n.read ? "bg-white dark:bg-[#111327] border border-[#F1F3FB] dark:border-gray-800" : "bg-[#EEF2FF] dark:bg-[#1E2140] border border-[#C7D2FE] dark:border-indigo-900/50"}`}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl"
              style={{ background: `${n.color}15` }}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0D0F1C] dark:text-white">
                  {n.title}
                </span>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-[#3730A3] shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-0.5 leading-relaxed">
                {n.body}
              </p>
              <span className="text-xs text-[#9CA3AF] mt-1 block">
                {n.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Credit", "Debit", "Savings", "Bills"];
  const filtered = MOCK_TRANSACTIONS.filter(
    (t) =>
      filter === "All" ||
      (filter === "Credit" && t.type === "credit") ||
      (filter === "Debit" && t.type === "debit") ||
      (filter !== "Credit" &&
        filter !== "Debit" &&
        t.category === filter.toLowerCase()),
  );
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 pt-14 pb-4 bg-white dark:bg-[#111327] border-b border-[#F1F3FB] dark:border-gray-800">
        <h2
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 22,
          }}
          className="mb-4"
        >
          Transactions
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-[#3730A3] text-white" : "bg-[#F1F3FB] dark:bg-gray-800 text-[#374151] dark:text-gray-300"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <BarChart2
              size={40}
              className="text-[#E5E7EB] dark:text-gray-700"
            />
            <p className="text-[#9CA3AF] text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#111327] rounded-xl p-4 flex items-center gap-3 border border-[#F1F3FB] dark:border-gray-800"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${t.type === "credit" ? "bg-[#ECFDF5] dark:bg-[#065F46]/20" : "bg-[#F9FAFB] dark:bg-gray-800"}`}
                >
                  {t.type === "credit" ? (
                    <ArrowDownLeft size={18} className="text-[#059669]" />
                  ) : (
                    <ArrowUpRight size={18} className="text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#0D0F1C] dark:text-white">
                    {t.desc}
                  </div>
                  <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5">
                    {t.date}
                    <span>·</span>
                    {t.category}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-semibold ${t.type === "credit" ? "text-[#059669]" : "text-[#0D0F1C] dark:text-white"}`}
                  >
                    {t.type === "credit" ? "+" : "-"}
                    {fmt(t.amount)}
                  </div>
                  <Badge color="green">Success</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
        }}
        className="px-6 pt-14 pb-8 flex flex-col items-center"
      >
        <div className="relative mb-4">
          <Avatar name="Emeka Adeyemi" size={80} color="#6366F1" />
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
            <Camera size={12} className="text-[#3730A3]" />
          </button>
        </div>
        <h2
          className="text-white"
          style={{
            fontFamily: "var(--font-family-display)",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          Emeka Adeyemi
        </h2>
        <p className="text-white/70 text-sm">emeka@email.com</p>
        <div className="mt-3">
          <Badge color="green">✓ KYC Verified</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 w-full max-w-sm">
          {[
            ["Goals", "3"],
            ["Groups", "2"],
            ["Products", "1"],
          ].map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-white font-bold text-xl">{v}</div>
              <div className="text-white/60 text-xs">{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2 max-w-md mx-auto">
        {[
          {
            icon: <User size={18} />,
            label: "Personal Information",
            color: "#3730A3",
            bg: "#EEF2FF",
          },
          {
            icon: <Shield size={18} />,
            label: "KYC & Verification",
            color: "#059669",
            bg: "#ECFDF5",
          },
          {
            icon: <Landmark size={18} />,
            label: "Bank Accounts",
            color: "#D97706",
            bg: "#FFFBEB",
          },
          {
            icon: <Bell size={18} />,
            label: "Notifications",
            color: "#7C3AED",
            bg: "#F5F3FF",
          },
          {
            icon: <Lock size={18} />,
            label: "Security & Password",
            color: "#0891B2",
            bg: "#ECFEFF",
          },
          {
            icon: <HelpCircle size={18} />,
            label: "Help & Support",
            color: "#374151",
            bg: "#F3F4F6",
          },
          {
            icon: <BookOpen size={18} />,
            label: "Terms & Privacy",
            color: "#374151",
            bg: "#F3F4F6",
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => onNav("settings")}
            className="flex items-center gap-4 p-4 bg-white dark:bg-[#111327] rounded-xl border border-[#F1F3FB] dark:border-gray-800 hover:bg-[#F9FAFB] dark:hover:bg-gray-800 transition-colors"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <span className="flex-1 text-left text-sm font-medium text-[#0D0F1C] dark:text-gray-200">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-[#D1D5DB]" />
          </button>
        ))}
        <button
          onClick={() => onNav("login")}
          className="flex items-center gap-4 p-4 bg-[#FEF2F2] dark:bg-[#7F1D1D]/20 rounded-xl border border-[#FCA5A5] dark:border-[#7F1D1D] mt-2 hover:bg-[#FEE2E2] transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 flex items-center justify-center">
            <LogOut size={18} className="text-[#DC2626]" />
          </div>
          <span className="text-sm font-medium text-[#DC2626]">Sign Out</span>
        </button>
        <div className="h-4" />
      </div>
    </div>
  );
}

export function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [savingsReminder, setSavingsReminder] = useState(true);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto max-w-md w-full mx-auto">
      <ScreenHeader title="Settings" onBack={() => onNav("profile")} />
      <div className="flex-1 px-6 py-5 flex flex-col gap-4">
        {[
          {
            label: "Push Notifications",
            desc: "Get alerts for transactions & reminders",
            val: notifications,
            set: setNotifications,
          },
          {
            label: "Biometric Login",
            desc: "Use fingerprint or Face ID to login",
            val: biometric,
            set: setBiometric,
          },
          {
            label: "Savings Reminders",
            desc: "Get notified when deposits are due",
            val: savingsReminder,
            set: setSavingsReminder,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between p-4 bg-white dark:bg-[#111327] rounded-xl border border-[#F1F3FB] dark:border-gray-800"
          >
            <div>
              <div className="text-sm font-medium text-[#0D0F1C] dark:text-white">
                {s.label}
              </div>
              <div className="text-xs text-[#9CA3AF]">{s.desc}</div>
            </div>
            <button
              onClick={() => s.set(!s.val)}
              className={`relative w-11 h-6 rounded-full transition-colors ${s.val ? "bg-[#3730A3]" : "bg-[#D1D5DB] dark:bg-gray-700"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.val ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
        <div className="bg-white dark:bg-[#111327] rounded-xl border border-[#F1F3FB] dark:border-gray-800 overflow-hidden">
          {[
            ["Change PIN", "#3730A3"],
            ["Change Password", "#3730A3"],
            ["Two-Factor Auth", "#059669"],
            ["Active Sessions", "#374151"],
          ].map(([label, color]) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F9FAFB] dark:hover:bg-gray-800 border-b border-[#F9FAFB] dark:border-gray-800 last:border-0"
            >
              <span
                className="text-sm font-medium"
                style={{ color: color as string }}
              >
                {label}
              </span>
              <ChevronRight size={16} className="text-[#D1D5DB]" />
            </button>
          ))}
        </div>
        <div className="bg-[#F1F3FB] dark:bg-[#1E2140] rounded-xl p-3 text-center text-xs text-[#9CA3AF]">
          PAVE v2.0.1 · Member ID: PAV-20240614
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ───────────────────────────────────────────────────────
export const BOTTOM_NAV = [
  { screen: "home", icon: Home, label: "Home" },
  { screen: "wallet", icon: Wallet, label: "Wallet" },
  { screen: "savings", icon: PiggyBank, label: "Savings" },
  { screen: "marketplace", icon: ShoppingBag, label: "Shop" },
  { screen: "profile", icon: User, label: "Profile" },
];

// ─── Main Mobile App ────────────────────────────────────────────────────────
export function MobileApp({ isDark }: { isDark: boolean }) {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);

  const mainScreens = [
    "home",
    "wallet",
    "savings",
    "marketplace",
    "messages",
    "profile",
    "notifications",
    "transactions",
  ];
  const showNav = mainScreens.includes(screen);

  const nav = (s: Screen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onNext={() => nav("onboarding")} />;
      case "onboarding":
        return <OnboardingScreen onNext={() => nav("login")} />;
      case "login":
        return <LoginScreen onNav={nav} />;
      case "register":
        return <RegisterScreen onNav={nav} />;
      case "forgot-password":
        return <ForgotPasswordScreen onNav={nav} />;
      case "accept-invitation":
        return <AcceptInvitationScreen onNav={nav} />;
      case "kyc-welcome":
        return <KYCWelcomeScreen onNav={nav} />;
      case "kyc-nin":
        return <KYCNINScreen onNav={nav} />;
      case "kyc-id-type":
        return <KYCIDTypeScreen onNav={nav} />;
      case "kyc-id-upload":
        return <KYCIDUploadScreen onNav={nav} />;
      case "kyc-selfie":
        return <KYCSelfieScreen onNav={nav} />;
      case "kyc-pending":
        return <KYCPendingScreen onNav={nav} />;
      case "kyc-approved":
        return <KYCApprovedScreen onNav={nav} />;
      case "home":
        return <HomeScreen onNav={nav} />;
      case "wallet":
        return <WalletScreen onNav={nav} />;
      case "fund-wallet":
        return <FundWalletScreen onNav={nav} />;
      case "transfer":
        return <TransferScreen onNav={nav} />;
      case "bills":
        return <BillsScreen onNav={nav} />;
      case "airtime":
        return <AirtimeScreen onNav={nav} />;
      case "savings":
        return <SavingsScreen onNav={nav} />;
      case "create-savings":
        return <CreateSavingsScreen onNav={nav} />;
      case "savings-detail":
        return <SavingsDetailScreen onNav={nav} />;
      case "join-program":
        return <JoinProgramScreen onNav={nav} />;
      case "savings-programs":
        return <SavingsScreen onNav={nav} />;
      case "marketplace":
        return (
          <MarketplaceScreen
            onNav={nav}
            setSelectedProduct={setSelectedProduct}
          />
        );
      case "product-detail":
        return <ProductDetailScreen onNav={nav} product={selectedProduct} />;
      case "payment-plan":
        return <PaymentPlanScreen onNav={nav} />;
      case "messages":
        return <MessagesScreen onNav={nav} setActiveChat={setActiveChat} />;
      case "chat":
        return <ChatScreen onNav={nav} chat={activeChat} />;
      case "group-chat":
        return <ChatScreen onNav={nav} chat={activeChat} />;
      case "notifications":
        return <NotificationsScreen onNav={nav} />;
      case "transactions":
        return <TransactionsScreen onNav={nav} />;
      case "profile":
        return <ProfileScreen onNav={nav} />;
      case "settings":
        return <SettingsScreen onNav={nav} />;
      default:
        return <HomeScreen onNav={nav} />;
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        fontFamily: "var(--font-family-body)",
        background: "var(--background)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <div className="bg-white dark:bg-[#111327] border-t border-[#F1F3FB] dark:border-gray-800 shrink-0">
          <div className="flex">
            {BOTTOM_NAV.map((item) => {
              const active = screen === item.screen;
              return (
                <button
                  key={item.screen}
                  onClick={() => nav(item.screen as Screen)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors cursor-pointer"
                >
                  <item.icon
                    size={22}
                    style={{
                      color: active ? "#3730A3" : "#9CA3AF",
                      strokeWidth: active ? 2 : 1.5,
                    }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: active ? "#3730A3" : "#9CA3AF" }}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 rounded-full bg-[#3730A3] mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-4 bg-white dark:bg-[#111327]" />{" "}
          {/* home indicator space */}
        </div>
      )}

      {/* Screen Navigator Pill (dev aid) */}
      <div className="absolute bottom-20 right-2 z-50 flex flex-col gap-1">
        {screen !== "home" && (
          <button
            onClick={() => nav("home")}
            className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
          >
            ⌂ Home
          </button>
        )}
      </div>
    </div>
  );
}
