import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };
type PwaContextValue = {
  installed: boolean;
  canPrompt: boolean;
  promptInstall: () => Promise<boolean>;
  updateAvailable: boolean;
  updateApp: () => void;
  dismissUpdate: () => void;
};
const PwaContext = createContext<PwaContextValue | null>(null);
const UPDATE_DISMISSED_KEY = "pave_sw_update_dismissed_at";
const UPDATE_DISMISSAL_MS = 24 * 60 * 60 * 1000;
const getInstalled = () => typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches === true || (navigator as Navigator & { standalone?: boolean }).standalone === true);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [installed, setInstalled] = useState(getInstalled);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const waitingWorker = useRef<ServiceWorker | null>(null);
  const updateRequested = useRef(false);
  const reloadedForUpdate = useRef(false);

  useEffect(() => {
    const before = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    const media = window.matchMedia?.("(display-mode: standalone)");
    const onDisplay = () => setInstalled(getInstalled());
    window.addEventListener("beforeinstallprompt", before);
    window.addEventListener("appinstalled", onInstalled);
    media?.addEventListener?.("change", onDisplay);

    let registration: ServiceWorkerRegistration | undefined;
    let timer = 0;
    const exposeWaiting = () => {
      waitingWorker.current = registration?.waiting ?? null;
      setUpdateAvailable(Boolean(waitingWorker.current));
    };
    const onStateChange = () => {
      if (registration?.installing?.state === "installed" && navigator.serviceWorker.controller) exposeWaiting();
    };
    const onUpdateFound = () => registration?.installing?.addEventListener("statechange", onStateChange);
    const onControllerChange = () => {
      if (!updateRequested.current || reloadedForUpdate.current) return;
      reloadedForUpdate.current = true;
      window.location.reload();
    };
    const onFocus = () => { if (document.visibilityState === "visible") void registration?.update().catch(() => undefined); };

    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      navigator.serviceWorker.register("/service-worker.js", { scope: "/", updateViaCache: "none" }).then((result) => {
        registration = result;
        exposeWaiting();
        registration.addEventListener("updatefound", onUpdateFound);
        void registration.update().catch(() => undefined);
        timer = window.setInterval(() => { void registration?.update().catch(() => undefined); }, 21600000);
      }).catch(() => undefined);
      document.addEventListener("visibilitychange", onFocus);
    }
    try {
      const dismissedAt = Number(localStorage.getItem(UPDATE_DISMISSED_KEY) || 0);
      setUpdateDismissed(Boolean(dismissedAt && Date.now() - dismissedAt < UPDATE_DISMISSAL_MS));
    } catch { /* storage may be unavailable */ }

    return () => {
      window.removeEventListener("beforeinstallprompt", before);
      window.removeEventListener("appinstalled", onInstalled);
      media?.removeEventListener?.("change", onDisplay);
      document.removeEventListener("visibilitychange", onFocus);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
      registration?.removeEventListener("updatefound", onUpdateFound);
      window.clearInterval(timer);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    const current = installPrompt;
    setInstallPrompt(null);
    try { await current.prompt(); const choice = await current.userChoice; if (choice.outcome === "accepted") setInstalled(true); return choice.outcome === "accepted"; }
    catch { return false; }
  }, [installPrompt]);

  const updateApp = useCallback(() => {
    const waiting = waitingWorker.current;
    if (!waiting || !window.confirm("Updating PAVEPADI reloads this app. Finish any transfer, payment, or savings action first. Update now?")) return;
    updateRequested.current = true;
    waiting.postMessage({ type: "SKIP_WAITING" });
  }, []);
  const dismissUpdate = useCallback(() => {
    setUpdateDismissed(true);
    try { localStorage.setItem(UPDATE_DISMISSED_KEY, String(Date.now())); } catch { /* storage may be unavailable */ }
  }, []);

  const value = useMemo(() => ({ installed, canPrompt: Boolean(installPrompt), promptInstall, updateAvailable: updateAvailable && !updateDismissed, updateApp, dismissUpdate }), [installed, installPrompt, promptInstall, updateAvailable, updateDismissed, updateApp, dismissUpdate]);
  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa() {
  const value = useContext(PwaContext);
  if (!value) throw new Error("usePwa must be used within PwaProvider");
  return value;
}
