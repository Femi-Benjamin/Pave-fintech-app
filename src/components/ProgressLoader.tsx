import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

/** Eases toward 92% while loading; the bar is removed once the content is ready. */
function useSimulatedProgress() {
  const [progress, setProgress] = useState(6);
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => p + (92 - p) * 0.07);
    }, 120);
    return () => window.clearInterval(id);
  }, []);
  return progress;
}

export function ProgressLoader({
  title = "Loading",
  subtitle = "Just a moment, this won't take long",
  fullPage = true,
}: {
  title?: string;
  subtitle?: string;
  fullPage?: boolean;
}) {
  const progress = useSimulatedProgress();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSlow(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-1 items-center justify-center px-8 ${
        fullPage ? "min-h-[70vh]" : "py-10"
      }`}
    >
      <div className="w-full max-w-xs text-center">
        <p
          className="text-base text-[#0D0F1C]"
          style={{ fontFamily: "var(--font-family-display)", fontWeight: 600 }}
        >
          {title}
        </p>
        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#E5E7F6]"
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-[#3730A3] to-[#6366F1]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          {slow
            ? "Taking a little longer than usual. Please check your connection."
            : subtitle}
        </p>
      </div>
    </div>
  );
}

export default ProgressLoader;
