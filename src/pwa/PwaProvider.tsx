import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createUpdateManager } from "./updateManager";
import type { ContainerLike } from "./updateManager";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

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

const getInstalled = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches === true ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [installed, setInstalled] = useState(getInstalled);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  );
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const manager = useRef<ReturnType<typeof createUpdateManager> | null>(null);

  useEffect(() => {
    const before = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    const media = window.matchMedia?.("(display-mode: standalone)");
    const onDisplay = () => setInstalled(getInstalled());
    window.addEventListener("beforeinstallprompt", before);
    window.addEventListener("appinstalled", onInstalled);
    media?.addEventListener?.("change", onDisplay);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        manager.current?.checkForUpdate();
      }
    };
    if (
      "serviceWorker" in navigator &&
      (location.protocol === "https:" || location.hostname === "localhost")
    ) {
      manager.current = createUpdateManager({
        container: navigator.serviceWorker as unknown as ContainerLike,
        reload: () => window.location.reload(),
        confirm: (message) => window.confirm(message),
        onUpdateAvailable: setUpdateAvailable,
      });
      void manager.current.start();
      document.addEventListener("visibilitychange", onVisible);
    }
    try {
      const dismissedAt = Number(
        localStorage.getItem(UPDATE_DISMISSED_KEY) || 0,
      );
      setUpdateDismissed(
        Boolean(dismissedAt && Date.now() - dismissedAt < UPDATE_DISMISSAL_MS),
      );
    } catch {
      /* storage may be unavailable */
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", before);
      window.removeEventListener("appinstalled", onInstalled);
      media?.removeEventListener?.("change", onDisplay);
      document.removeEventListener("visibilitychange", onVisible);
      manager.current?.dispose();
      manager.current = null;
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    const current = installPrompt;
    setInstallPrompt(null);
    try {
      await current.prompt();
      const choice = await current.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      return choice.outcome === "accepted";
    } catch {
      return false;
    }
  }, [installPrompt]);

  const updateApp = useCallback(() => {
    manager.current?.requestUpdate();
  }, []);

  const dismissUpdate = useCallback(() => {
    setUpdateDismissed(true);
    try {
      localStorage.setItem(UPDATE_DISMISSED_KEY, String(Date.now()));
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const value = useMemo(
    () => ({
      installed,
      canPrompt: Boolean(installPrompt),
      promptInstall,
      updateAvailable: updateAvailable && !updateDismissed,
      updateApp,
      dismissUpdate,
    }),
    [
      installed,
      installPrompt,
      promptInstall,
      updateAvailable,
      updateDismissed,
      updateApp,
      dismissUpdate,
    ],
  );
  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa() {
  const value = useContext(PwaContext);
  if (!value) throw new Error("usePwa must be used within PwaProvider");
  return value;
}
