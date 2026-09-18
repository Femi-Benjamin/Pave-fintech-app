import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline, setWasOffline };
}

export function NetworkStatusToast() {
  const { isOnline, wasOffline, setWasOffline } = useNetworkStatus();
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, setWasOffline]);

  const handleCheckConnection = () => {
    if (typeof navigator !== "undefined") {
      if (navigator.onLine) {
        setShowRestored(true);
        setTimeout(() => setShowRestored(false), 3000);
      }
    }
  };

  return (
    <div className="fixed top-3 left-0 right-0 z-50 pointer-events-none flex justify-center px-4">
      <AnimatePresence mode="wait">
        {!isOnline && (
          <motion.div
            key="offline-toast"
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto bg-[#1F2937]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-red-500/30 max-w-sm w-full sm:w-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <WifiOff size={16} className="text-red-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">You're offline</div>
              <div className="text-[11px] text-gray-300 truncate">
                Viewing cached data. Sync will resume online.
              </div>
            </div>
            <button
              onClick={handleCheckConnection}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-medium transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </motion.div>
        )}

        {isOnline && showRestored && (
          <motion.div
            key="online-toast"
            initial={{ y: -30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto bg-[#065F46]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 max-w-sm w-full sm:w-auto"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-400/20 flex items-center justify-center shrink-0">
              <Wifi size={15} className="text-emerald-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white">Back online</div>
              <div className="text-[11px] text-emerald-100">
                Connected to network
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NetworkStatusBarIcon({ className = "" }: { className?: string }) {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      title="You are currently offline"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 ${className}`}
    >
      <WifiOff size={12} className="animate-pulse shrink-0" />
      <span>Offline</span>
    </div>
  );
}
