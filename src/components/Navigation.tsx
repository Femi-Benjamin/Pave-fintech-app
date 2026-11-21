import React from "react";
import {
  Home,
  Wallet,
  PiggyBank,
  ShoppingBag,
  MessageCircle,
  User,
  Target,
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
  { screen: "savings" as Screen, icon: Target, label: "Savings" },
  { screen: "group-savings" as Screen, icon: PiggyBank, label: "Ajo" },
  { screen: "marketplace" as Screen, icon: ShoppingBag, label: "Shop" },
  { screen: "messages" as Screen, icon: MessageCircle, label: "Messages" },
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
    "PAVEPADI Member";
  const memberStatus = authUser?.isKycVerified
    ? "KYC Verified"
    : authUser?.kycStatus
      ? `KYC ${authUser.kycStatus}`
      : authUser?.isVerified
        ? "Verified Account"
        : "Account Member";
  const memberStatusColor = authUser?.isKycVerified
    ? "#047857"
    : authUser?.kycStatus?.toLowerCase() === "pending"
      ? "#B45309"
      : "#047857";

  const navItems = [
    { screen: "home" as Screen, icon: Home, label: "Home" },
    { screen: "wallet" as Screen, icon: Wallet, label: "Wallet" },
    { screen: "savings" as Screen, icon: Target, label: "Savings" },
    { screen: "group-savings" as Screen, icon: PiggyBank, label: "Ajo" },
    {
      screen: "marketplace" as Screen,
      icon: ShoppingBag,
      label: "Marketplace",
    },
    { screen: "messages" as Screen, icon: MessageCircle, label: "Messages" },
    { screen: "profile" as Screen, icon: User, label: "Profile" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E2E6F3] shadow-[1px_0_12px_rgba(55,48,163,0.04)] p-6 justify-between shrink-0 min-h-screen sticky top-0 h-screen">
      <div>
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <NetworkStatusBarIcon />
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#047857] bg-[#ECFDF5] ring-1 ring-inset ring-[#A7F3D0] px-2 py-0.5 rounded-full">
              Web
            </span>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active =
              screen === item.screen ||
              (item.screen === "savings" &&
                ["create-saving", "savings-detail"].includes(screen)) ||
              (item.screen === "group-savings" &&
                ["create-group-saving", "group-saving-detail"].includes(screen)) ||
              (item.screen === "wallet" &&
                ["fund-wallet", "transfer", "bills", "airtime", "transactions"].includes(screen)) ||
              (item.screen === "marketplace" &&
                ["product-detail", "cart", "checkout", "payment-plan"].includes(screen)) ||
              (item.screen === "messages" && ["chat", "group-chat"].includes(screen)) ||
              (item.screen === "profile" && ["settings"].includes(screen));
            return (
              <button
                key={item.screen}
                onClick={() => onNav(item.screen)}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#3730A3] text-white shadow-md shadow-[#3730A3]/25"
                    : "text-[#374151] hover:text-[#312E81] hover:bg-[#EEF2FF] hover:translate-x-0.5"
                }`}
              >
                <item.icon size={20} className="transition-transform duration-200 group-hover:scale-110" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-[#E2E6F3] flex flex-col gap-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F8FF] border border-[#E2E6F3]">
          <Avatar
            name={fullName}
            size={38}
            color="#6366F1"
            src={(authUser as any)?.image || (authUser as any)?.face || (authUser as any)?.profileImage}
          />
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-[#0D0F1C] truncate">
              {fullName}
            </div>
            <div
              className="text-xs font-semibold"
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
