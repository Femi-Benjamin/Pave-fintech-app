import React from "react";
import {
  Home,
  Wallet,
  PiggyBank,
  ShoppingBag,
  MessageCircle,
  User,
  ArrowLeft,
} from "lucide-react";
import Logo from "./Logo";
import { Avatar } from "./UI";
import { Screen } from "../pave-data";
import { NetworkStatusBarIcon } from "./NetworkStatus";
import { useLocalStore } from "../hooks/useLocalStore";

export const BOTTOM_NAV = [
  { screen: "home" as Screen, icon: Home, label: "Home" },
  { screen: "wallet" as Screen, icon: Wallet, label: "Wallet" },
  { screen: "savings" as Screen, icon: PiggyBank, label: "Savings" },
  { screen: "marketplace" as Screen, icon: ShoppingBag, label: "Shop" },
  { screen: "profile" as Screen, icon: User, label: "Profile" },
];

export function DesktopSidebar({
  screen,
  onNav,
  onBackToWebsite,
}: {
  screen: Screen;
  onNav: (s: Screen) => void;
  onBackToWebsite?: () => void;
}) {
  const { authUser } = useLocalStore();
  const fullName =
    [authUser?.firstName, authUser?.lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ") ||
    authUser?.fullName?.trim() ||
    "PAVE Member";
  const memberStatus = authUser?.isKycVerified
    ? "KYC Verified"
    : authUser?.kycStatus
      ? `KYC ${authUser.kycStatus}`
      : authUser?.isVerified
        ? "Verified Account"
        : "Account Member";
  const memberStatusColor = authUser?.isKycVerified
    ? "#059669"
    : authUser?.kycStatus?.toLowerCase() === "pending"
      ? "#D97706"
      : "#059669";

  const navItems = [
    { screen: "home" as Screen, icon: Home, label: "Home" },
    { screen: "wallet" as Screen, icon: Wallet, label: "Wallet" },
    { screen: "savings" as Screen, icon: PiggyBank, label: "Savings & Goals" },
    {
      screen: "marketplace" as Screen,
      icon: ShoppingBag,
      label: "Marketplace",
    },
    { screen: "messages" as Screen, icon: MessageCircle, label: "Messages" },
    { screen: "profile" as Screen, icon: User, label: "Profile" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F1F3FB] p-6 justify-between shrink-0 min-h-screen sticky top-0 h-screen">
      <div>
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <NetworkStatusBarIcon />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
              Web
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = screen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => onNav(item.screen)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  active
                    ? "bg-[#3730A3] text-white shadow-md shadow-[#3730A3]/20"
                    : "text-[#6B7280] hover:text-[#0D0F1C] hover:bg-[#F1F3FB]"
                }`}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#F1F3FB] flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F8FF] border border-[#F1F3FB]">
          <Avatar name={fullName} size={38} color="#6366F1" />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold text-[#0D0F1C] truncate">
              {fullName}
            </div>
            <div
              className="text-[10px] font-semibold"
              style={{ color: memberStatusColor }}
            >
              {memberStatus}
            </div>
          </div>
        </div>
        {/* {onBackToWebsite && (
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#3730A3] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Website
          </button>
        )} */}
      </div>
    </aside>
  );
}
