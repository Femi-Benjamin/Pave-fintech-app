import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  Check,
  CheckCircle,
  Hash,
  Loader,
} from "lucide-react";
import Logo from "../components/Logo";
import { PaveBtn, Input } from "../components/UI";
import { Screen } from "../pave-data";
import {
  completeRegistration,
  forgotPassword,
  getAuthErrorMessage,
  login,
  resetPassword,
} from "../api/auth";
import { useLocalStore } from "../hooks/useLocalStore";

export function SplashScreen({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);
  return (
    <div
      onClick={onNext}
      className="flex-1 w-full h-screen max-h-screen flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden px-6"
      style={{
        background:
          "linear-gradient(145deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)",
      }}
      title="Tap anywhere to continue"
    >
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="flex flex-col items-center gap-4 relative z-10"
      >
        <Logo size="2xl" layout="horizontal" variant="light" />
        <p className="text-white/80 text-sm sm:text-base mt-2 font-normal text-center">
          Your Path to Financial Freedom
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 flex flex-col items-center gap-4 relative z-10"
      >
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-2.5 h-2.5 rounded-full bg-white/60"
            />
          ))}
        </div>
        <span className="text-white/40 text-xs font-mono tracking-wider uppercase mt-2">
          Click anywhere to continue
        </span>
      </motion.div>
    </div>
  );
}

export function SlideOnboardingScreen({
  onNext,
}: {
  onNext: (target?: "login" | "register") => void;
}) {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      icon: "💰",
      title: "Save Together, Grow Together",
      desc: "Join community savings groups managed by trusted admins and watch your money multiply with collective discipline.",
      color: "#3730A3",
      tag: "Thrift & Cooperatives",
    },
    {
      icon: "🛍️",
      title: "Save Now, Own It Later",
      desc: "Browse our marketplace and pay in flexible installments — 50% secures your order, and the rest on delivery.",
      color: "#059669",
      tag: "BNPL Marketplace",
    },
    {
      icon: "🔐",
      title: "Bank-Level Security",
      desc: "Your money is protected with automated KYC verification, bank-grade encryption, and real-time transaction alerts.",
      color: "#D97706",
      tag: "Licensed & Protected",
    },
  ];

  const s = slides[slide];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setDirection(1);
      setSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (slide > 0) {
      setDirection(-1);
      setSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (newIndex: number) => {
    if (newIndex === slide) return;
    setDirection(newIndex > slide ? 1 : -1);
    setSlide(newIndex);
  };

  // Touch Swipe Gesture Handler (for mobile & tablet screen swiping)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null && touchStartY.current !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX.current;
      const diffY = currentY - touchStartY.current;
      // Capture horizontal swipes and avoid interfering with purely vertical scrolls
      if (Math.abs(diffX) > Math.abs(diffY)) {
        touchDeltaX.current = diffX;
      }
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 35) {
      if (touchDeltaX.current < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
  };

  // Horizontal Wheel / Trackpad Scroll
  const lastWheelTime = useRef<number>(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;
    if (Math.abs(e.deltaX) > 25 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      lastWheelTime.current = now;
      if (e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
      opacity: 0,
      scale: 0.88,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : dir < 0 ? 100 : 0,
      opacity: 0,
      scale: 0.88,
    }),
  };

  const textVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : dir < 0 ? -60 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : dir < 0 ? 60 : 0,
      opacity: 0,
    }),
  };

  return (
    <div
      className="flex-1 w-full h-screen max-h-screen flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden select-none"
      style={{ background: "#F7F8FF" }}
      onWheel={handleWheel}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-4xl shadow-2xl border border-[#F1F3FB] overflow-hidden flex flex-col md:flex-row h-full max-h-[calc(100vh-24px)] lg:max-h-190 touch-pan-y"
      >
        {/* Top / Left Half: Interactive Draggable Card & Visual Showcase */}
        <div
          className="md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col items-center justify-between relative overflow-hidden transition-colors duration-500 h-full"
          style={{
            background: `linear-gradient(145deg, ${s.color}15 0%, ${s.color}30 100%)`,
          }}
        >
          {/* Header Bar */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/70 backdrop-blur-sm text-[#374151] shadow-xs">
              0{slide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Draggable Card Showcase with directional slide animation */}
          <div className="my-auto py-2 z-10 w-full flex flex-col items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.22 },
                  scale: { duration: 0.22 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -35 || (velocity.x < -200 && offset.x < -10)) {
                    handleNext();
                  } else if (
                    offset.x > 35 ||
                    (velocity.x > 200 && offset.x > 10)
                  ) {
                    handlePrev();
                  }
                }}
                className="flex flex-col items-center gap-4 text-center cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div
                  className="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-2xl sm:rounded-3xl flex items-center justify-center text-6xl sm:text-7xl lg:text-8xl shadow-xl border-2 border-white/70 transition-transform duration-300 hover:scale-105 active:scale-95"
                  style={{ background: "white" }}
                >
                  {s.icon}
                </div>
                <span
                  className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xs transition-colors duration-300"
                  style={{ background: `${s.color}25`, color: s.color }}
                >
                  {s.tag}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 py-1 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="h-2.5 rounded-full transition-all duration-300 cursor-pointer p-1 -m-1"
                style={{
                  width: i === slide ? 32 : 9,
                  background: i === slide ? s.color : "#D1D5DB",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Ambient decorative blur */}
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-500"
            style={{ background: s.color }}
          />
        </div>

        {/* Bottom / Right Half: Step Text & Navigation Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full bg-white">
          <div className="flex justify-between items-center text-xs sm:text-sm text-[#9CA3AF] font-bold uppercase tracking-wider">
            <span>
              Step {slide + 1} of {slides.length}
            </span>
            <button
              onClick={() => onNext()}
              className="hover:text-[#3730A3] transition-colors cursor-pointer text-sm font-semibold"
            >
              Skip
            </button>
          </div>

          <div className="my-auto py-4 sm:py-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D0F1C] tracking-tight leading-[1.15]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  {s.title}
                </h2>
                <p
                  className="text-[#6B7280] mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed"
                  style={{ fontFamily: "var(--font-family-body)" }}
                >
                  {s.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-[#F1F3FB]">
            {slide < slides.length - 1 ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <PaveBtn onClick={handleNext}>Continue</PaveBtn>
                </div>
                <div className="sm:w-auto">
                  <PaveBtn variant="ghost" onClick={() => onNext()}>
                    Skip
                  </PaveBtn>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <PaveBtn onClick={() => onNext("register")}>
                    Get Started
                  </PaveBtn>
                </div>
                <div className="sm:w-auto">
                  <PaveBtn variant="ghost" onClick={() => onNext("login")}>
                    Sign In
                  </PaveBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthBrandPanel({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="hidden md:flex md:w-1/2 p-6 sm:p-8 lg:p-10 flex-col justify-between relative overflow-hidden text-white h-full"
      style={{
        background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
      }}
    >
      <div className="relative z-10">
        <div className="mb-6">
          <Logo size="md" variant="light" />
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.15]"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          {title}
        </h2>
        <p className="text-white/80 text-sm sm:text-base mt-3 leading-relaxed font-normal">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {[
            "CBN Licensed & Bank-Grade Security",
            "Automated Individual & Cooperative Thrift",
            "Flexible BNPL Marketplace Installments",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90 font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center shrink-0 shadow-xs">
                <Check size={12} className="text-white" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
        <span>Trusted by 20,000+ Nigerians</span>
        <span className="font-bold text-white text-xs sm:text-sm">
          ₦2.4B+ Saved
        </span>
      </div>

      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

export function LoginScreen({
  onNav,
  onBackToWebsite,
}: {
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const { setAuthUser } = useLocalStore();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const user = response.user ?? {
        email: email.trim(),
        firstName: "",
        lastName: "",
      };

      localStorage.setItem("pave_token", response.token!);
      setAuthUser(user);
      onNav("kyc-welcome");
    },
    onError: (err: any) => {
      setError(
        getAuthErrorMessage(
          err,
          "Unable to sign in right now. Please try again.",
        ),
      );
    },
  });

  const doLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    loginMutation.mutate({ email: email.trim(), password: pass });
  };

  return (
    <div
      className="flex-1 w-full h-screen max-h-screen flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden"
      style={{ background: "#F7F8FF" }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-4xl shadow-2xl border border-[#F1F3FB] overflow-hidden flex flex-col md:flex-row h-full max-h-[calc(100vh-24px)] lg:max-h-190">
        <AuthBrandPanel
          title="Welcome Back to PAVE"
          subtitle="Access your virtual account, savings circles, and installment orders seamlessly."
        />

        <div className="flex-1 md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full overflow-y-auto scrollbar-hide">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="md:hidden">
                <Logo size="sm" />
              </div>
              {onBackToWebsite && (
                <button
                  onClick={onBackToWebsite}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-[#3730A3] font-bold cursor-pointer hover:underline ml-auto"
                >
                  <ArrowLeft size={16} /> Back to Website
                </button>
              )}
            </div>

            <div className="mb-4 sm:mb-6">
              <h1
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontWeight: 700,
                }}
                className="text-2xl sm:text-3xl text-[#0D0F1C]"
              >
                Welcome back
              </h1>
              <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
                Sign in to your PAVE account to continue
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-3.5">
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
                className="text-right text-xs sm:text-sm text-[#3730A3] font-semibold hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}
              <div className="mt-1">
                <PaveBtn onClick={doLogin} disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? (
                    <>
                      <Loader size={16} className="animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </PaveBtn>
              </div>
              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#E5E7EB]" />
                <span className="text-[11px] text-[#9CA3AF] uppercase font-bold tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
              </div>
              <button
                onClick={() => onNav("accept-invitation")}
                className="w-full py-3 rounded-xl border-2 border-[#E5E7EB] flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#374151] cursor-pointer hover:bg-[#F1F3FB] transition-colors"
              >
                <Hash size={16} /> Join with Invitation Code
              </button>
            </div>
          </div>

          <div className="pt-4 text-center text-xs sm:text-sm text-[#6B7280]">
            Don't have an account?{" "}
            <button
              onClick={() => onNav("register")}
              className="text-[#3730A3] font-bold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterScreen({
  onNav,
  onBackToWebsite,
}: {
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const completeRegistrationMutation = useMutation({
    mutationFn: completeRegistration,
  });

  const set = (k: string) => (v: string) => setForm({ ...form, [k]: v });

  const doNext = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setError("Please complete your name, email, and phone number.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await completeRegistrationMutation.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phone.trim(),
      });

      onNav("login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "We could not create your account. Please try again.",
      );
    }
  };

  return (
    <div
      className="flex-1 w-full h-screen max-h-screen flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden"
      style={{ background: "#F7F8FF" }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-4xl shadow-2xl border border-[#F1F3FB] overflow-hidden flex flex-col md:flex-row h-full max-h-[calc(100vh-24px)] lg:max-h-190">
        <AuthBrandPanel
          title="Start Building Wealth Today"
          subtitle="Join Nigeria's smart cooperative community with automated savings and verified accountability."
        />

        <div className="flex-1 md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full overflow-y-auto scrollbar-hide">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button
                onClick={() => onNav("login")}
                className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer hover:bg-[#EEF2FF] transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="md:hidden">
                <Logo size="sm" />
              </div>
              {onBackToWebsite && (
                <button
                  onClick={onBackToWebsite}
                  className="text-xs sm:text-sm text-[#3730A3] font-bold cursor-pointer hover:underline"
                >
                  Back to Website
                </button>
              )}
            </div>

            <h1
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
              }}
              className="text-2xl sm:text-3xl text-[#0D0F1C]"
            >
              Create Account
            </h1>
            <p className="text-[#6B7280] text-xs sm:text-sm mt-1 mb-3 sm:mb-4">
              Fill in your personal details and create a secure password.
            </p>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <Input
                  label="First Name"
                  placeholder="Joe"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
                <Input
                  label="Last Name"
                  placeholder="Adetemi"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </div>
              <Input
                label="Email Address"
                placeholder="joe@email.com"
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
              <div className="bg-[#F1F3FB] rounded-xl p-3 flex flex-col gap-1.5">
                {[
                  "8+ characters",
                  "One uppercase letter",
                  "One number",
                ].map((r) => (
                  <div
                    key={r}
                    className="flex items-center gap-2 text-xs text-[#6B7280]"
                  >
                    <Check size={12} className="text-[#059669]" />
                    {r}
                  </div>
                ))}
              </div>
              <div className="mt-1">
                <PaveBtn
                  onClick={doNext}
                  disabled={completeRegistrationMutation.isPending}
                >
                  {completeRegistrationMutation.isPending ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </PaveBtn>
              </div>
            </div>
          </div>

          <div className="pt-3 text-center text-xs sm:text-sm text-[#6B7280]">
            Already have an account?{" "}
            <button
              onClick={() => onNav("login")}
              className="text-[#3730A3] font-bold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
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
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
  });
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
  });

  const handleSendReset = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");

    try {
      await forgotPasswordMutation.mutateAsync(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "We could not send the reset link right now.",
      );
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken.trim()) {
      setError("Please enter the reset token from your email.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await resetPasswordMutation.mutateAsync({
        token: resetToken.trim(),
        password: newPassword,
      });
      setSent(false);
      setEmail("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      onNav("login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "The reset code is invalid or expired. Please try again.",
      );
    }
  };

  return (
    <div
      className="flex-1 w-full h-screen max-h-screen flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      style={{ background: "#F7F8FF" }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#F1F3FB] p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#F1F3FB] mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNav("login")}
              className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer hover:bg-[#EEF2FF] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h2
              className="text-lg sm:text-xl font-bold text-[#0D0F1C]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Reset Password
            </h2>
          </div>
          <Logo size="sm" />
        </div>

        <div className="flex-1 flex flex-col">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {!sent ? (
            <>
              <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-4">
                <Mail size={24} className="text-[#3730A3]" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                Forgot Password?
              </h2>
              <p className="text-[#6B7280] text-xs sm:text-sm mt-1 mb-4">
                Enter your registered email and we’ll send a secure reset link.
              </p>
              <Input
                label="Email Address"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={setEmail}
                icon={<Mail size={16} />}
              />
              <div className="mt-4">
                <PaveBtn
                  onClick={handleSendReset}
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? (
                    <>
                      <Loader size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </PaveBtn>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col gap-4 py-2">
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={36} className="text-[#059669]" />
                </motion.div>
                <h2
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  Check Your Email
                </h2>
                <p className="text-[#6B7280] text-xs sm:text-sm">
                  We sent a reset token to{" "}
                  <strong>{email || "your email"}</strong>.
                </p>
              </div>

              <Input
                label="Reset Token"
                placeholder="Paste the token from your email"
                value={resetToken}
                onChange={setResetToken}
                icon={<Hash size={16} />}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={setNewPassword}
                icon={<Lock size={16} />}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                icon={<Lock size={16} />}
              />

              <div className="mt-2 flex flex-col gap-2 w-full">
                <PaveBtn
                  onClick={handleResetPassword}
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader size={16} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </PaveBtn>
                <PaveBtn variant="ghost" onClick={() => setSent(false)}>
                  Resend Email
                </PaveBtn>
              </div>
            </div>
          )}
        </div>
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
    }, 1200);
  };
  return (
    <div
      className="flex-1 w-full h-screen max-h-screen flex items-center justify-center p-3 sm:p-5 overflow-hidden"
      style={{ background: "#F7F8FF" }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#F1F3FB] p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#F1F3FB] mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNav("login")}
              className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer hover:bg-[#EEF2FF] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h2
              className="text-lg sm:text-xl font-bold text-[#0D0F1C]"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Join PAVE
            </h2>
          </div>
          <Logo size="sm" />
        </div>

        <div className="flex-1 flex flex-col">
          {!found ? (
            <>
              <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-6">
                <Hash size={28} className="text-[#3730A3]" />
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
              <p className="text-[#6B7280] text-sm mt-2 mb-6">
                Got an invite from your thrift group admin? Enter the code below
                to join.
              </p>
              <Input
                label="Invitation Code"
                placeholder="e.g. PAVE-2024-XK91"
                value={code}
                onChange={setCode}
                icon={<Hash size={16} />}
              />
              <div className="mt-6">
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
              <div className="bg-[#ECFDF5] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#059669] flex items-center justify-center">
                  <Check size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-[#059669] font-semibold">
                    Invitation Found!
                  </div>
                  <div className="font-semibold text-[#0D0F1C]">
                    Okonkwo Community Group
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Admin</span>
                  <span className="font-medium">Chibuike Okonkwo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Group Type</span>
                  <span className="font-medium">Community Thrift</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Members</span>
                  <span className="font-medium">24 members</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Monthly Target</span>
                  <span className="font-medium">₦50,000</span>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-3">
                <PaveBtn onClick={() => onNav("register")}>
                  Accept & Register
                </PaveBtn>
                <PaveBtn variant="ghost" onClick={() => setFound(false)}>
                  Use Different Code
                </PaveBtn>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
