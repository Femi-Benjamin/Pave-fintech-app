import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Camera,
  User,
  Shield,
  Landmark,
  Bell,
  Lock,
  HelpCircle,
  BookOpen,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Avatar, Badge, ScreenHeader } from "../components/UI";
import { Screen } from "../pave-data";
import { useLocalStore } from "../hooks/useLocalStore";
import { ProfileScreenSkeleton } from "../components/Skeleton";

export function ProfileScreen({
  onNav,
  onBackToWebsite,
}: {
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const { savings, programs, products, authUser, logout } = useLocalStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const payingProductsCount = products.filter((p) => p.paid > 0).length;
  const fullName =
    [authUser?.firstName, authUser?.lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ") ||
    authUser?.fullName?.trim() ||
    "PAVE Member";
  const email = authUser?.email?.trim() || "Email not available";
  const kycStatus = authUser?.kycStatus?.toLowerCase();
  const isKycVerified = kycStatus
    ? kycStatus === "approved" || kycStatus === "verified"
    : authUser?.isKycVerified ?? authUser?.isVerified ?? false;
  const verificationLabel = kycStatus
    ? `KYC ${kycStatus.charAt(0).toUpperCase()}${kycStatus.slice(1)}`
    : isKycVerified
      ? "KYC Verified"
      : "KYC Pending";

  if (isLoading) {
    return <ProfileScreenSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 overflow-y-auto"
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
        }}
        className="px-6 pt-14 pb-8 flex flex-col items-center"
      >
        <div className="relative mb-4">
          <Avatar name={fullName} size={80} color="#6366F1" />
          <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer">
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
          {fullName}
        </h2>
        <p className="text-white/70 text-sm">{email}</p>
        <div className="mt-3">
          <Badge color={isKycVerified ? "green" : "gold"}>
            {verificationLabel}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 w-full">
          {[
            ["Goals", String(savings.length)],
            ["Groups", String(programs.length)],
            ["Products", String(payingProductsCount || 1)],
          ].map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-white font-bold text-xl">{v}</div>
              <div className="text-white/60 text-xs">{k}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-2">
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
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#F1F3FB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: item.bg, color: item.color }}
            >
              {item.icon}
            </div>
            <span className="flex-1 text-left text-sm font-medium text-[#0D0F1C]">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-[#D1D5DB]" />
          </button>
        ))}
        <button
          onClick={() => {
            logout();
            if (onBackToWebsite) onBackToWebsite();
            else onNav("login");
          }}
          className="flex items-center gap-4 p-4 bg-[#FEF2F2] rounded-xl border border-[#FCA5A5] mt-2 hover:bg-[#FEE2E2] transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
            <LogOut size={18} className="text-[#DC2626]" />
          </div>
          <span className="text-sm font-medium text-[#DC2626]">Sign Out</span>
        </button>
        <div className="h-4" />
      </div>
    </motion.div>
  );
}

export function SettingsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [savingsReminder, setSavingsReminder] = useState(true);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
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
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#F1F3FB]"
          >
            <div>
              <div className="text-sm font-medium text-[#0D0F1C]">
                {s.label}
              </div>
              <div className="text-xs text-[#9CA3AF]">{s.desc}</div>
            </div>
            <button
              onClick={() => s.set(!s.val)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${s.val ? "bg-[#3730A3]" : "bg-[#D1D5DB]"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${s.val ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
        <div className="bg-white rounded-xl border border-[#F1F3FB] overflow-hidden">
          {[
            ["Change PIN", "#3730A3"],
            ["Change Password", "#3730A3"],
            ["Two-Factor Auth", "#059669"],
            ["Active Sessions", "#374151"],
          ].map(([label, color]) => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F9FAFB] border-b border-[#F9FAFB] last:border-0 cursor-pointer"
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
        <div className="bg-[#F1F3FB] rounded-xl p-3 text-center text-xs text-[#9CA3AF]">
          PAVE v2.0.1 · Member ID: PAV-20240614
        </div>
      </div>
    </div>
  );
}
