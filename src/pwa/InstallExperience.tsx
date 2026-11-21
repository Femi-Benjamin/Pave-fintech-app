import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePwa } from "./PwaProvider";
import { useLocalStore } from "../hooks/useLocalStore";
const KEY = "pave_pwa_install_dismissed_at",
  COOLDOWN = 30 * 24 * 60 * 60 * 1000;
function instructions() {
  const ua = navigator.userAgent;
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (ios) return "In Safari, tap Share, then choose Add to Home Screen.";
  if (/SamsungBrowser/i.test(ua))
    return "Open the browser menu and choose Add page to, then Home screen.";
  if (/Android/i.test(ua))
    return "Open your browser menu and choose Install app or Add to Home screen.";
  return "In your browser menu, choose Install PAVEPADI or Install this site as an app.";
}
export function InstallAppButton() {
  const { installed, canPrompt, promptInstall } = usePwa();
  const [help, setHelp] = useState(false);
  const click = async () => {
    if (installed) return;
    if (canPrompt) {
      await promptInstall();
      return;
    }
    setHelp((v) => !v);
  };
  return (
    <section className="rounded-xl border border-[#E9E7F8] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#0D0F1C]">PAVEPADI app</h3>
          <p className="mt-1 text-xs text-[#4B5563]">
            {installed
              ? "PAVEPADI is installed on this device."
              : "Install PAVEPADI for quick access from your home screen."}
          </p>
        </div>
        {!installed && (
          <button
            type="button"
            onClick={click}
            className="shrink-0 rounded-lg bg-[#3730A3] px-3 py-2 text-xs font-semibold text-white"
          >
            {canPrompt ? "Install App" : "How to install"}
          </button>
        )}
      </div>
      {help && (
        <div
          className="mt-3 rounded-lg bg-[#F7F8FF] p-3 text-xs text-[#4B5563]"
          role="status"
        >
          {instructions()}
        </div>
      )}
    </section>
  );
}
export function InstallExperience() {
  const { installed, canPrompt, promptInstall } = usePwa();
  const { isAuthenticated } = useLocalStore();
  const [visible, setVisible] = useState(false),
    [help, setHelp] = useState(false);
  useEffect(() => {
    if (installed || !isAuthenticated) return;
    try {
      const d = Number(localStorage.getItem(KEY) || 0);
      if (d && Date.now() - d < COOLDOWN) return;
    } catch {}
    const t = window.setTimeout(() => setVisible(true), 12000);
    return () => window.clearTimeout(t);
  }, [installed, isAuthenticated]);
  if (installed || !isAuthenticated || !visible) return null;
  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
  };
  const click = async () => {
    if (canPrompt) {
      await promptInstall();
      dismiss();
    } else setHelp(true);
  };
  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-[#E9E7F8] bg-white p-4 shadow-xl sm:left-auto sm:right-6"
      aria-label="Install PAVEPADI"
    >
      <img
        src="/icons/pave-192.png"
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#111827]">
          Take PAVEPADI with you
        </p>
        <p className="mt-1 text-xs text-[#4B5563]">
          Install the app for convenient access from your home screen.
        </p>
        {help && (
          <p className="mt-2 text-xs text-[#4B5563]" role="status">
            {instructions()}
          </p>
        )}
        <button
          type="button"
          onClick={click}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#3730A3] px-3 py-2 text-xs font-semibold text-white"
        >
          <Download size={14} />
          {canPrompt ? "Install App" : "How to install"}
        </button>
      </div>
      <button
        type="button"
        aria-label="Dismiss install invitation"
        onClick={dismiss}
        className="rounded-lg p-1 text-[#4B5563]"
      >
        <X size={18} />
      </button>
    </aside>
  );
}

export function ServiceWorkerUpdateNotice() {
  const { updateAvailable, updateApp, dismissUpdate } = usePwa();
  const { isAuthenticated } = useLocalStore();
  if (!updateAvailable) return null;
  return (
    <aside
      className="fixed bottom-4 left-4 right-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-[#E9E7F8] bg-white p-4 shadow-xl"
      role="status"
      aria-label="PAVEPADI update available"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#111827]">
          PAVEPADI update ready
        </p>
        <p className="mt-1 text-xs text-[#4B5563]">
          {isAuthenticated
            ? "A new version is available. Finish any active financial operation before updating."
            : "A new version of PAVEPADI is available."}
        </p>
        <button
          type="button"
          onClick={updateApp}
          className="mt-3 rounded-lg bg-[#3730A3] px-3 py-2 text-xs font-semibold text-white"
        >
          Update App
        </button>
      </div>
      <button
        type="button"
        aria-label="Dismiss update notice"
        onClick={dismissUpdate}
        className="rounded-lg p-1 text-[#4B5563]"
      >
        <X size={18} />
      </button>
    </aside>
  );
}
