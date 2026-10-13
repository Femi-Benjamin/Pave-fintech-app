import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import OnboardingLandingScreen from "./components/OnboardingScreen";
import { DesktopSidebar, BOTTOM_NAV } from "./components/Navigation";
import { Screen } from "./pave-data";
import { StoreProvider } from "./hooks/useLocalStore";
import { NetworkStatusToast } from "./components/NetworkStatus";
import { CoreScreenSkeleton } from "./components/Skeleton";

const SplashScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.SplashScreen,
  })),
);
const SlideOnboardingScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.SlideOnboardingScreen,
  })),
);
const LoginScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.LoginScreen,
  })),
);
const RegisterScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.RegisterScreen,
  })),
);
const ForgotPasswordScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.ForgotPasswordScreen,
  })),
);
const AcceptInvitationScreen = lazy(() =>
  import("./screens/AuthScreens").then((screens) => ({
    default: screens.AcceptInvitationScreen,
  })),
);

const KYCWelcomeScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCWelcomeScreen,
  })),
);
const KYCNINScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCNINScreen,
  })),
);
const KYCIDTypeScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCIDTypeScreen,
  })),
);
const KYCIDUploadScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCIDUploadScreen,
  })),
);
const KYCSelfieScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCSelfieScreen,
  })),
);
const KYCPendingScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCPendingScreen,
  })),
);
const KYCApprovedScreen = lazy(() =>
  import("./screens/KYCScreens").then((screens) => ({
    default: screens.KYCApprovedScreen,
  })),
);

const HomeScreen = lazy(() =>
  import("./screens/HomeScreen").then((screens) => ({
    default: screens.HomeScreen,
  })),
);
const WalletScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.WalletScreen,
  })),
);
const FundWalletScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.FundWalletScreen,
  })),
);
const TransferScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.TransferScreen,
  })),
);
const BillsScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.BillsScreen,
  })),
);
const AirtimeScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.AirtimeScreen,
  })),
);
const TransactionsScreen = lazy(() =>
  import("./screens/WalletScreens").then((screens) => ({
    default: screens.TransactionsScreen,
  })),
);
const GroupSavingsScreen = lazy(() =>
  import("./screens/GroupSaving").then((screens) => ({
    default: screens.GroupSavingsScreen,
  })),
);
const CreateGroupSavingScreen = lazy(() =>
  import("./screens/GroupSaving").then((screens) => ({
    default: screens.CreateGroupSavingScreen,
  })),
);
const PersonalSavingsScreen = lazy(() =>
  import("./screens/SavingsScreens").then((screens) => ({
    default: screens.PersonalSavingsScreen,
  })),
);
const CreateSavingScreen = lazy(() =>
  import("./screens/SavingsScreens").then((screens) => ({
    default: screens.CreateSavingScreen,
  })),
);
const SavingsDetailScreen = lazy(() =>
  import("./screens/SavingsScreens").then((screens) => ({
    default: screens.SavingsDetailScreen,
  })),
);
const GroupSavingDetailScreen = lazy(() =>
  import("./screens/GroupSaving").then((screens) => ({
    default: screens.GroupSavingDetailScreen,
  })),
);
const MarketplaceScreen = lazy(() =>
  import("./screens/MarketplaceScreens").then((screens) => ({
    default: screens.MarketplaceScreen,
  })),
);
const ProductDetailScreen = lazy(() =>
  import("./screens/MarketplaceScreens").then((screens) => ({
    default: screens.ProductDetailScreen,
  })),
);
const PaymentPlanScreen = lazy(() =>
  import("./screens/MarketplaceScreens").then((screens) => ({
    default: screens.PaymentPlanScreen,
  })),
);
const MessagesScreen = lazy(() =>
  import("./screens/MessagesScreens").then((screens) => ({
    default: screens.MessagesScreen,
  })),
);
const ChatScreen = lazy(() =>
  import("./screens/MessagesScreens").then((screens) => ({
    default: screens.ChatScreen,
  })),
);
const NotificationsScreen = lazy(() =>
  import("./screens/MessagesScreens").then((screens) => ({
    default: screens.NotificationsScreen,
  })),
);
const ProfileScreen = lazy(() =>
  import("./screens/ProfileScreens").then((screens) => ({
    default: screens.ProfileScreen,
  })),
);
const SettingsScreen = lazy(() =>
  import("./screens/ProfileScreens").then((screens) => ({
    default: screens.SettingsScreen,
  })),
);

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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void Promise.all([
        import("./screens/HomeScreen"),
        import("./screens/WalletScreens"),
        import("./screens/GroupSaving"),
        import("./screens/SavingsScreens"),
        import("./screens/MarketplaceScreens"),
        import("./screens/MessagesScreens"),
        import("./screens/ProfileScreens"),
      ]).catch((error: unknown) => {
        console.error("Unable to preload primary app screens.", error);
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (targetAuth === "login") {
      setScreen("login");
    } else if (initialScreen) {
      setScreen(initialScreen);
    }
  }, [initialScreen, targetAuth]);

  const mainScreens: Screen[] = [
    "home",
    "wallet",
    "savings",
    "group-savings",
    "marketplace",
    "messages",
    "profile",
    "notifications",
    "transactions",
    "settings",
  ];
  const showNav = mainScreens.includes(screen);
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
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`flex-1 flex flex-col ${!showNav ? "min-h-full" : ""}`}
          >
            <Suspense
              fallback={
                ["home", "wallet", "group-savings", "savings", "create-saving", "savings-detail", "marketplace", "messages", "profile"].includes(screen)
                  ? <CoreScreenSkeleton />
                  : (
                    <div
                      className="flex flex-1 items-center justify-center text-sm text-[#6B7280]"
                      role="status"
                    >
                      Loading...
                    </div>
                  )
              }
            >
              {renderScreen()}
            </Suspense>
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
                const active =
                  screen === item.screen ||
                  (item.screen === "savings" &&
                    ["create-saving", "savings-detail"].includes(screen));
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
  const [queryClient] = useState(() => new QueryClient());
  const hasSession =
    typeof window !== "undefined" && !!localStorage.getItem("pave_token");
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
