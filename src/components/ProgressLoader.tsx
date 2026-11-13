import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export function ProgressLoader({
  title = "Loading",
  subtitle = "Just a moment, this won't take long",
  fullPage = true,
}: {
  title?: string;
  subtitle?: string;
  fullPage?: boolean;
}) {
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
          aria-valuetext="Loading"
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-linear-to-r from-[#3730A3] to-[#6366F1]"
            animate={{ x: ["-110%", "310%"] }}
            transition={{ duration: 1.35, ease: "easeInOut", repeat: Infinity }}
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
