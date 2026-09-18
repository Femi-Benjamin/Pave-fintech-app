import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import OnboardingLandingScreen from "./components/OnboardingScreen";
import { DesktopSidebar, BOTTOM_NAV } from "./components/Navigation";
import { Screen } from "./pave-data";
import { StoreProvider } from "./hooks/useLocalStore";

// Modular Screens
import {
  SplashScreen,
  SlideOnboardingScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  AcceptInvitationScreen,
} from "./screens/AuthScreens";

import {
  KYCWelcomeScreen,
  KYCNINScreen,
  KYCIDTypeScreen,
  KYCIDUploadScreen,
  KYCSelfieScreen,
  KYCPendingScreen,
  KYCApprovedScreen,
} from "./screens/KYCScreens";

import { HomeScreen } from "./screens/HomeScreen";

import {
  WalletScreen,
  FundWalletScreen,
  TransferScreen,
  BillsScreen,
  AirtimeScreen,
  TransactionsScreen,
} from "./screens/WalletScreens";

import {
  SavingsScreen,
  CreateSavingsScreen,
  SavingsDetailScreen,
  JoinProgramScreen,
} from "./screens/SavingsScreens";

import {
  MarketplaceScreen,
  ProductDetailScreen,
  PaymentPlanScreen,
} from "./screens/MarketplaceScreens";

import {
  MessagesScreen,
  ChatScreen,
  NotificationsScreen,
} from "./screens/MessagesScreens";

import {
  ProfileScreen,
  SettingsScreen,
} from "./screens/ProfileScreens";

// ─── Main Web App (Full Desktop & Responsive Mobile Layout) ──────────────────
function MobileApp({
  initialScreen = "splash",
  targetAuth = "register",
  onBackToWebsite,
}: {
  initialScreen?: Screen;
  targetAuth?: "login" | "register";
  onBackToWebsite?: () => void;
}) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    if (initialScreen) {
      setScreen(initialScreen);
    }
  }, [initialScreen]);

  const mainScreens: Screen[] = [
    "home",
    "wallet",
    "savings",
    "marketplace",
    "messages",
    "profile",
    "notifications",
    "transactions",
    "settings",
  ];
  const showNav = mainScreens.includes(screen);

  const nav = (s: Screen) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <SplashScreen onNext={() => nav("onboarding")} />;
      case "onboarding":
        return (
          <SlideOnboardingScreen
            onNext={(t) => nav(t || targetAuth || "register")}
          />
        );
      case "login":
        return <LoginScreen onNav={nav} onBackToWebsite={onBackToWebsite} />;
      case "register":
        return <RegisterScreen onNav={nav} onBackToWebsite={onBackToWebsite} />;
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
        return (
          <PaymentPlanScreen onNav={nav} product={selectedProduct} />
        );
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
        return <ProfileScreen onNav={nav} onBackToWebsite={onBackToWebsite} />;
      case "settings":
        return <SettingsScreen onNav={nav} />;
      default:
        return <HomeScreen onNav={nav} />;
    }
  };

  return (
    <div
      className={`flex w-full ${showNav ? "min-h-screen" : "h-screen max-h-screen overflow-hidden"} bg-[#F7F8FF]`}
      style={{ fontFamily: "var(--font-family-body)" }}
    >
      {/* Desktop Sidebar (visible on large screens for authenticated main app) */}
      {showNav && (
        <DesktopSidebar
          screen={screen}
          onNav={nav}
          onBackToWebsite={onBackToWebsite}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${showNav ? "min-h-screen overflow-y-auto pb-22 lg:pb-0" : "h-screen max-h-screen overflow-hidden"} relative`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex-1 flex flex-col ${!showNav ? "h-full overflow-hidden" : ""}`}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Bottom Navigation (sticky/fixed to viewport bottom on mobile < lg) */}
        {showNav && (
          <nav
            aria-label="Bottom Navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#F1F3FB] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="flex max-w-md mx-auto">
              {BOTTOM_NAV.map((item) => {
                const active = screen === item.screen;
                return (
                  <button
                    key={item.screen}
                    onClick={() => nav(item.screen)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors cursor-pointer select-none active:scale-95"
                  >
                    <item.icon
                      size={22}
                      style={{
                        color: active ? "#3730A3" : "#9CA3AF",
                        strokeWidth: active ? 2.2 : 1.6,
                      }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: active ? "#3730A3" : "#9CA3AF" }}
                    >
                      {item.label}
                    </span>
                    {active ? (
                      <div className="w-1 h-1 rounded-full bg-[#3730A3] mt-0.5" />
                    ) : (
                      <div className="w-1 h-1 rounded-full mt-0.5 opacity-0" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="h-[env(safe-area-inset-bottom,4px)] bg-transparent" />
          </nav>
        )}
      </div>
    </div>
  );
}

// ─── Web Application Root ───────────────────────────────────────────────────
export default function App() {
  // Sequence: OnboardingLandingScreen → Splash → Onboarding → Auth → KYC → Home
  const [view, setView] = useState<"onboarding" | "app">("onboarding");
  const [targetAuth, setTargetAuth] = useState<"login" | "register">(
    "register",
  );

  const handleNavigateFromOnboarding = (screen: "signup" | "login") => {
    setTargetAuth(screen === "signup" ? "register" : "login");
    setView("app");
  };

  return (
    <StoreProvider>
      {view === "onboarding" ? (
        /* 1. OnboardingScreen.tsx is the first thing seen */
        <OnboardingLandingScreen onNavigate={handleNavigateFromOnboarding} />
      ) : (
        /* Full Desktop/Laptop Web Application (with mobile responsiveness) */
        <div className="w-full bg-[#F7F8FF] dark:bg-[#0A0B18] flex flex-col transition-colors">
          <MobileApp
            initialScreen="splash"
            targetAuth={targetAuth}
            onBackToWebsite={() => setView("onboarding")}
          />
        </div>
      )}
    </StoreProvider>
  );
}
