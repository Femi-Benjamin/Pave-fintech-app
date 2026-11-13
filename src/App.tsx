import React, { Suspense, lazy, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const OnboardingLandingScreen = lazy(() => import("./components/OnboardingScreen"));
const loadWalletScreens = () => import("./screens/WalletScreens");
const loadMarketplaceScreens = () => import("./screens/MarketplaceScreens");
import { DesktopSidebar, BOTTOM_NAV } from "./components/Navigation";
import { Screen, KNOWN_SCREENS } from "./pave-data";
import { StoreProvider, useLocalStore } from "./hooks/useLocalStore";
import { NetworkStatusToast } from "./components/NetworkStatus";
import { getToken, isReturningUser, isTokenValid, subscribeToAuthLogout } from "./lib/authStorage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProgressLoader } from "./components/ProgressLoader";
import { loadingLabelFor } from "./utils/loadingLabels";
import { resolveRestoredMainScreen } from "./utils/navigation";

import {
  SplashScreen,
  SlideOnboardingScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  AcceptInvitationScreen,
} from "./screens/AuthScreens";
const KYCWelcomeScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCWelcomeScreen })));
const KYCNINScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCNINScreen })));
const KYCIDTypeScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCIDTypeScreen })));
const KYCIDUploadScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCIDUploadScreen })));
const KYCSelfieScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCSelfieScreen })));
const KYCPendingScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCPendingScreen })));
const KYCApprovedScreen = lazy(() => import("./screens/KYCScreens").then((m) => ({ default: m.KYCApprovedScreen })));
import { HomeScreen } from "./screens/HomeScreen";
const WalletScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.WalletScreen })));
const FundWalletScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.FundWalletScreen })));
const TransferScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.TransferScreen })));
const BillsScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.BillsScreen })));
const AirtimeScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.AirtimeScreen })));
const TransactionsScreen = lazy(() => loadWalletScreens().then((m) => ({ default: m.TransactionsScreen })));
const GroupSavingsScreen = lazy(() => import("./screens/GroupSaving").then((m) => ({ default: m.GroupSavingsScreen })));
const CreateGroupSavingScreen = lazy(() => import("./screens/GroupSaving").then((m) => ({ default: m.CreateGroupSavingScreen })));
const GroupSavingDetailScreen = lazy(() => import("./screens/GroupSaving").then((m) => ({ default: m.GroupSavingDetailScreen })));
const PersonalSavingsScreen = lazy(() => import("./screens/SavingsScreens").then((m) => ({ default: m.PersonalSavingsScreen })));
const CreateSavingScreen = lazy(() => import("./screens/SavingsScreens").then((m) => ({ default: m.CreateSavingScreen })));
const SavingsDetailScreen = lazy(() => import("./screens/SavingsScreens").then((m) => ({ default: m.SavingsDetailScreen })));
const MarketplaceScreen = lazy(() => loadMarketplaceScreens().then((m) => ({ default: m.MarketplaceScreen })));
const ProductDetailScreen = lazy(() => loadMarketplaceScreens().then((m) => ({ default: m.ProductDetailScreen })));
const PaymentPlanScreen = lazy(() => loadMarketplaceScreens().then((m) => ({ default: m.PaymentPlanScreen })));
const PurchaseDetailScreen = lazy(() => loadMarketplaceScreens().then((m) => ({ default: m.PurchaseDetailScreen })));
const MessagesWorkspace = lazy(() => import("./screens/MessagesScreens").then((m) => ({ default: m.MessagesWorkspace })));
const NotificationsScreen = lazy(() => import("./screens/MessagesScreens").then((m) => ({ default: m.NotificationsScreen })));
const ProfileScreen = lazy(() => import("./screens/ProfileScreens").then((m) => ({ default: m.ProfileScreen })));
const SettingsScreen = lazy(() => import("./screens/ProfileScreens").then((m) => ({ default: m.SettingsScreen })));

function ScreenFallback({ screen }: { screen?: Screen }) {
  const { title, subtitle } = loadingLabelFor(screen);
  return <ProgressLoader title={title} subtitle={subtitle} />;
}

// Screens a signed-in user should never land on via the back button.
const SIGNED_OUT_ONLY_SCREENS: Screen[] = [
  "splash",
  "onboarding",
  "login",
  "register",
  "forgot-password",
  "otp-verify",
  "accept-invitation",
];
const PUBLIC_SCREENS: Screen[] = SIGNED_OUT_ONLY_SCREENS;
// Bottom-nav destinations: switching between them replaces the history entry
// so back goes to Home rather than stepping through every tab visited.
const MAIN_TAB_SCREENS: Screen[] = [
  "wallet",
  "savings",
  "group-savings",
  "marketplace",
  "messages",
  "profile",
];

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
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [selectedSavingId, setSelectedSavingId] = useState("");
  const [selectedGroupSavingId, setSelectedGroupSavingId] = useState("");
  const [productReturnScreen, setProductReturnScreen] = useState<Screen>("marketplace");
  const [ajoSuccessNotice, setAjoSuccessNotice] = useState("");
  const [savingsSuccessNotice, setSavingsSuccessNotice] = useState("");
  const [activeChat, setActiveChat] = useState<any>(null);
  const [kycNin, setKycNin] = useState("");
  const { isAuthenticated, isAuthLoading } = useLocalStore();

  // Warm the feature bundles after the first paint so lazy loading
  // does not introduce a noticeable delay when users open Wallet or Marketplace.
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const preload = () => {
      if (cancelled) return;
      // Preload only the two highest-traffic areas. Other feature bundles
      // load on demand, avoiding unnecessary network contention on mobile.
      void Promise.all([loadWalletScreens(), loadMarketplaceScreens()]).catch(
        () => {
          // React.lazy retries the import when the user opens that screen.
        },
      );
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(preload, { timeout: 1800 })
      : window.setTimeout(preload, 700);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [isAuthenticated]);

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
  const showNav =
    !authOrIntroScreens.includes(screen) &&
    screen !== "chat" &&
    screen !== "group-chat";
  // Chat screens hide the phone bottom nav, but desktop keeps its sidebar
  const isChatScreen = screen === "chat" || screen === "group-chat";
  const isFixedIntroScreen =
    screen === "onboarding" || screen === "login" || screen === "register";

  // ─── Browser / phone back-button support ──────────────────────────────────
  // Screens are state based, so the browser has no history of them. We mirror
  // every screen change into the History API so the phone's back button or
  // swipe-back walks through the app's screens instead of leaving the site.
  const screenRef = useRef<Screen>(screen);
  const stackRef = useRef<Screen[]>([screen]);
  const idxRef = useRef(0);
  const guardRef = useRef({
    isAuthenticated,
    isAuthLoading,
    selectedProduct,
    selectedPurchaseId,
    selectedSavingId,
    selectedGroupSavingId,
    activeChat,
  });
  guardRef.current = {
    isAuthenticated,
    isAuthLoading,
    selectedProduct,
    selectedPurchaseId,
    selectedSavingId,
    selectedGroupSavingId,
    activeChat,
  };

  // Keep history in step when the screen is changed from somewhere other than
  // nav() (initial screen, forced logout, ...).
  useEffect(() => {
    if (isAuthenticated && MAIN_TAB_SCREENS.includes(screen)) {
      try { sessionStorage.setItem("pave_last_main_screen", screen); } catch {}
    }
    screenRef.current = screen;
    const idx = idxRef.current;
    if (stackRef.current[idx] !== screen) {
      stackRef.current[idx] = screen;
      try {
        window.history.replaceState({ idx, screen }, "");
      } catch {
        /* history unavailable */
      }
    }
  }, [screen]);

  useEffect(() => {
    try {
      window.history.replaceState({ idx: 0, screen: screenRef.current }, "");
    } catch {
      /* history unavailable */
    }
    idxRef.current = 0;
    stackRef.current = [screenRef.current];

    const onPop = (e: PopStateEvent) => {
      const st = e.state as { idx?: number; screen?: Screen } | null;
      if (!st || typeof st.idx !== "number") return;
      const g = guardRef.current;
      let target = (stackRef.current[st.idx] ?? st.screen) as Screen | undefined;
      if (!target || !KNOWN_SCREENS.includes(target)) target = "home";

      if (!g.isAuthLoading) {
        if (g.isAuthenticated && SIGNED_OUT_ONLY_SCREENS.includes(target)) {
          target = "home";
        } else if (
          !g.isAuthenticated &&
          !PUBLIC_SCREENS.includes(target) &&
          !target.startsWith("kyc-")
        ) {
          target = "login";
        }
      }
      // Detail screens need data that is lost on reload — fall back to home.
      const missingData =
        (target === "product-detail" && !g.selectedProduct) ||
        (target === "payment-plan" && !g.selectedProduct) ||
        (target === "purchase-detail" && !g.selectedPurchaseId) ||
        (target === "savings-detail" && !g.selectedSavingId) ||
        (target === "group-saving-detail" && !g.selectedGroupSavingId) ||
        ((target === "chat" || target === "group-chat") && !g.activeChat);
      if (missingData) target = "home";

      idxRef.current = st.idx;
      stackRef.current[st.idx] = target;
      if (target !== st.screen) {
        try {
          window.history.replaceState({ idx: st.idx, screen: target }, "");
        } catch {
          /* ignore */
        }
      }
      setScreen(target);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const nav = (s: Screen) => {
    const cur = screenRef.current;
    if (s === cur) return;
    const idx = idxRef.current;
    const stack = stackRef.current;

    // Going "back" in the UI = going back in history, so the phone's back
    // button never replays a screen the user just left.
    if (idx > 0 && stack[idx - 1] === s) {
      window.history.back();
      return;
    }

    const replace =
      (MAIN_TAB_SCREENS.includes(cur) && MAIN_TAB_SCREENS.includes(s)) ||
      (PUBLIC_SCREENS.includes(cur) && !PUBLIC_SCREENS.includes(s));

    try {
      if (replace) {
        stack[idx] = s;
        window.history.replaceState({ idx, screen: s }, "");
      } else {
        stackRef.current = stack.slice(0, idx + 1).concat(s);
        idxRef.current = idx + 1;
        window.history.pushState({ idx: idx + 1, screen: s }, "");
      }
    } catch {
      /* history unavailable — still change the screen */
    }
    screenRef.current = s;
    setScreen(s);
  };
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
            onSelectProduct={setSelectedProduct}
            onSetReturnScreen={setProductReturnScreen}
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
            setSelectedPurchaseId={setSelectedPurchaseId}
            onSetReturnScreen={setProductReturnScreen}
          />
        );
      case "product-detail":
        return (
          <ProductDetailScreen
            onNav={nav}
            product={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            returnScreen={productReturnScreen}
          />
        );
      case "payment-plan":
        return (
          <PaymentPlanScreen
            onNav={nav}
            product={selectedProduct}
            setSelectedPurchaseId={setSelectedPurchaseId}
          />
        );
      case "purchase-detail":
        return (
          <PurchaseDetailScreen
            onNav={nav}
            purchaseId={selectedPurchaseId}
          />
        );
      case "messages":
      case "chat":
      case "group-chat":
        return (
          <MessagesWorkspace
            screen={screen}
            onNav={nav}
            chat={activeChat}
            setActiveChat={setActiveChat}
          />
        );
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
      {(showNav || isChatScreen) && (
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
          <Suspense fallback={<ScreenFallback screen={screen} />}>
            {authOrIntroScreens.includes(screen) ? (
              renderScreen()
            ) : (
              <ProtectedRoute onNav={nav} currentScreen={screen}>
                {renderScreen()}
              </ProtectedRoute>
            )}
          </Suspense>
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
                    ["product-detail", "cart", "checkout", "payment-plan", "purchase-detail"].includes(screen)) ||
                  (item.screen === "messages" &&
                    ["messages", "chat", "group-chat"].includes(screen));
                return (
                  <button
                    key={item.screen}
                    onClick={() => nav(item.screen)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors cursor-pointer select-none active:scale-95"
                  >
                    <item.icon
                      size={20}
                      style={{
                        color: active ? "#3730A3" : "#9CA3AF",
                        strokeWidth: active ? 2.2 : 1.6,
                      }}
                    />
                    <span
                      className="text-[10px] sm:text-xs font-semibold"
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
  const restoredScreen = (() => {
    if (!hasSession || typeof window === "undefined") return "home" as Screen;
    try {
      return resolveRestoredMainScreen(
        sessionStorage.getItem("pave_last_main_screen"),
        hasSession,
      );
    } catch {
      return "home" as Screen;
    }
  })();
  // Anyone who has signed in on this browser before goes straight to Login
  // (not the marketing website) when they come back or get logged out.
  const returning = useMemo(() => isReturningUser(), []);
  const [view, setView] = useState<"onboarding" | "app">(
    hasSession || returning ? "app" : "onboarding",
  );
  const [targetAuth, setTargetAuth] = useState<"login" | "register">(
    // A signed-in user must never be forced onto Login (e.g. on reload).
    returning && !hasSession ? "login" : "register",
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
          <Suspense fallback={<ScreenFallback />}>
            <OnboardingLandingScreen onNavigate={handleNavigateFromOnboarding} />
          </Suspense>
        ) : (
          /* Full Desktop/Laptop Web Application (with mobile responsiveness) */
          <div className="w-full bg-[#F7F8FF] dark:bg-[#0A0B18] flex flex-col transition-colors">
            <MobileApp
              initialScreen={hasSession ? restoredScreen : targetAuth === "login" ? "login" : "splash"}
              targetAuth={targetAuth}
              onBackToWebsite={() => setView("onboarding")}
            />
          </div>
        )}
      </StoreProvider>
    </QueryClientProvider>
  );
}
