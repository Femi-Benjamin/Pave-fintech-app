import React, { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OnboardingLandingScreen from "./components/OnboardingScreen";
import { DesktopSidebar, BOTTOM_NAV } from "./components/Navigation";
import { Screen } from "./pave-data";
import { StoreProvider, useLocalStore } from "./hooks/useLocalStore";
import { NetworkStatusToast } from "./components/NetworkStatus";
import { getToken, isTokenValid, subscribeToAuthLogout } from "./lib/authStorage";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
  GroupSavingsScreen,
  CreateGroupSavingScreen,
  GroupSavingDetailScreen,
} from "./screens/GroupSaving";
import {
  PersonalSavingsScreen,
  CreateSavingScreen,
  SavingsDetailScreen,
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
  const [selectedSavingId, setSelectedSavingId] = useState("");
  const [selectedGroupSavingId, setSelectedGroupSavingId] = useState("");
  const [ajoSuccessNotice, setAjoSuccessNotice] = useState("");
  const [savingsSuccessNotice, setSavingsSuccessNotice] = useState("");
  const [activeChat, setActiveChat] = useState<any>(null);
  const [kycNin, setKycNin] = useState("");
  const { isAuthenticated, isAuthLoading } = useLocalStore();

  useEffect(() => {
    const unsub = subscribeToAuthLogout(() => {
      setScreen("login");
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (targetAuth === "login") {
      setScreen("login");
    } else if (initialScreen) {
      setScreen(initialScreen);
    }
  }, [initialScreen, targetAuth]);

  const authOrIntroScreens: Screen[] = [
    "splash",
    "onboarding",
    "login",
    "register",
    "forgot-password",
    "accept-invitation",
    "kyc-welcome",
    "kyc-nin",
    "kyc-id-type",
    "kyc-id-upload",
    "kyc-selfie",
    "kyc-pending",
    "kyc-approved",
  ];
  const showNav = !authOrIntroScreens.includes(screen);
  const isFixedIntroScreen =
    screen === "onboarding" || screen === "login" || screen === "register";

  const nav = (s: Screen) => setScreen(s);
  const dismissAjoSuccessNotice = useCallback(
    () => setAjoSuccessNotice(""),
    [],
  );

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
        return (
          <KYCNINScreen
            onNav={nav}
            nin={kycNin}
            onNinChange={setKycNin}
          />
        );
      case "kyc-id-type":
        return <KYCIDTypeScreen onNav={nav} />;
      case "kyc-id-upload":
        return <KYCIDUploadScreen onNav={nav} nin={kycNin} />;
      case "kyc-selfie":
        return <KYCSelfieScreen onNav={nav} />;
      case "kyc-pending":
        return <KYCPendingScreen onNav={nav} />;
      case "kyc-approved":
        return <KYCApprovedScreen onNav={nav} />;
      case "home":
        return (
          <HomeScreen
            onNav={nav}
            onSelectGroup={setSelectedGroupSavingId}
            onSelectSaving={setSelectedSavingId}
          />
        );
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
        return (
          <PersonalSavingsScreen
            onNav={nav}
            onSelectSaving={setSelectedSavingId}
            successNotice={savingsSuccessNotice}
            onDismissSuccess={() => setSavingsSuccessNotice("")}
          />
        );
      case "create-saving":
        return (
          <CreateSavingScreen
            onNav={nav}
            onCreated={(message) => setSavingsSuccessNotice(message)}
          />
        );
      case "group-savings":
        return (
          <GroupSavingsScreen
            onNav={nav}
            onSelectGroup={setSelectedGroupSavingId}
            successNotice={ajoSuccessNotice}
            onDismissSuccess={dismissAjoSuccessNotice}
          />
        );
      case "create-group-saving":
        return (
          <CreateGroupSavingScreen
            onNav={nav}
            onCreated={() =>
              setAjoSuccessNotice("AJO Group Created Successfully")
            }
          />
        );
      case "savings-detail":
        return (
          <SavingsDetailScreen
            onNav={nav}
            savingId={selectedSavingId}
          />
        );
      case "group-saving-detail":
        return (
          <GroupSavingDetailScreen
            onNav={nav}
            groupId={selectedGroupSavingId}
          />
        );
      case "join-program":
        return (
          <GroupSavingsScreen
            onNav={nav}
            onSelectGroup={setSelectedGroupSavingId}
            successNotice={ajoSuccessNotice}
            onDismissSuccess={dismissAjoSuccessNotice}
          />
        );
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
        return <PaymentPlanScreen onNav={nav} product={selectedProduct} />;
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
        return (
          <HomeScreen
            onNav={nav}
            onSelectGroup={setSelectedGroupSavingId}
            onSelectSaving={setSelectedSavingId}
          />
        );
    }
  };

  return (
    <div
      className={`flex w-full ${showNav ? "min-h-screen" : isFixedIntroScreen ? "h-dvh max-h-dvh overflow-hidden" : "h-screen max-h-screen overflow-hidden"} bg-[#F7F8FF]`}
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
        className={`flex-1 flex flex-col min-w-0 ${showNav ? "min-h-screen overflow-y-auto pb-22 lg:pb-0" : isFixedIntroScreen ? "h-dvh max-h-dvh overflow-hidden" : "h-screen max-h-screen overflow-y-auto"} relative`}
      >
        <div
          className={`flex-1 flex flex-col ${!showNav ? "min-h-full" : ""}`}
        >
          {authOrIntroScreens.includes(screen) ? (
            renderScreen()
          ) : (
            <ProtectedRoute onNav={nav} currentScreen={screen}>
              {renderScreen()}
            </ProtectedRoute>
          )}
        </div>

        {/* Mobile Bottom Navigation (sticky/fixed to viewport bottom on mobile < lg) */}
        {showNav && (
          <nav
            aria-label="Bottom Navigation"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#F1F3FB] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
          >
            <div className="flex max-w-md mx-auto">
              {BOTTOM_NAV.map((item) => {
                const active =
                  screen === item.screen ||
                  (item.screen === "savings" &&
                    ["create-saving", "savings-detail"].includes(screen)) ||
                  (item.screen === "group-savings" &&
                    ["create-group-saving", "group-saving-detail"].includes(screen)) ||
                  (item.screen === "wallet" &&
                    ["fund-wallet", "transfer", "bills", "airtime", "transactions"].includes(screen)) ||
                  (item.screen === "marketplace" &&
                    ["product-detail", "cart", "checkout", "payment-plan"].includes(screen));
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
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 3, // 3 minutes staleTime prevents aggressive refetching and flicker when switching between nav tabs
            gcTime: 1000 * 60 * 15,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  const hasSession = Boolean(getToken() && isTokenValid(getToken()));
  const [view, setView] = useState<"onboarding" | "app">(
    hasSession ? "app" : "onboarding",
  );
  const [targetAuth, setTargetAuth] = useState<"login" | "register">(
    "register",
  );

  const handleNavigateFromOnboarding = (screen: "signup" | "login") => {
    setTargetAuth(screen === "signup" ? "register" : "login");
    setView("app");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <NetworkStatusToast />
        {view === "onboarding" ? (
          /* 1. OnboardingScreen.tsx is the first thing seen */
          <OnboardingLandingScreen onNavigate={handleNavigateFromOnboarding} />
        ) : (
          /* Full Desktop/Laptop Web Application (with mobile responsiveness) */
          <div className="w-full bg-[#F7F8FF] dark:bg-[#0A0B18] flex flex-col transition-colors">
            <MobileApp
              initialScreen={hasSession ? "home" : targetAuth === "login" ? "login" : "splash"}
              targetAuth={targetAuth}
              onBackToWebsite={() => setView("onboarding")}
            />
          </div>
        )}
      </StoreProvider>
    </QueryClientProvider>
  );
}
