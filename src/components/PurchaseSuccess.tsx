import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Check, Clock, Copy } from "lucide-react";
import { PaveBtn } from "./UI";

export interface SuccessRow {
  label: string;
  value: string;
}

interface PurchaseSuccessProps {
  /** "pending" is for payments that are submitted but not yet confirmed. */
  variant?: "success" | "pending";
  title?: string;
  message?: string;
  /** Amount in naira, counted up on screen. */
  amount?: number;
  rows: SuccessRow[];
  reference?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const CONFETTI_COLORS = ["#3730A3", "#7C3AED", "#10B981", "#FBBF24", "#F472B6", "#38BDF8"];

// Deterministic burst so renders are stable.
const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 2) * 0.2;
  const dist = 78 + (i % 3) * 22;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 6 + (i % 3) * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    round: i % 3 !== 0,
    delay: 0.35 + (i % 6) * 0.02,
  };
});

function CountUp({ value, reduced }: { value: number; reduced: boolean }) {
  const mv = useMotionValue(reduced ? value : 0);
  const text = useTransform(mv, (v) =>
    `₦${Math.round(v).toLocaleString("en-NG")}`,
  );
  useEffect(() => {
    if (reduced) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 1.1, delay: 0.5, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduced, mv]);
  return <motion.span>{text}</motion.span>;
}

export function PurchaseSuccess({
  variant = "success",
  title = "Payment successful",
  message,
  amount,
  rows,
  reference,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: PurchaseSuccessProps) {
  const pending = variant === "pending";
  const reduced = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);

  const copyReference = async () => {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45, ease: "easeOut" as const },
        };

  return (
    <div className={`relative flex-1 overflow-y-auto scrollbar-hide bg-gradient-to-b ${pending ? "from-[#FFFBEB]" : "from-[#EEF2FF]"} via-[#F8F9FD] to-white`}>
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 pb-6 pt-4 sm:pt-10">
        {/* Animated badge */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {!reduced &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                className={`absolute h-24 w-24 rounded-full border-2 ${pending ? "border-amber-400/50" : "border-[#10B981]/40"}`}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{
                  duration: 1.6,
                  delay: 0.3 + i * 0.35,
                  repeat: 1,
                  ease: "easeOut",
                }}
              />
            ))}
          {!reduced &&
            !pending &&
            CONFETTI.map((c, i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{
                  width: c.size,
                  height: c.size,
                  background: c.color,
                  borderRadius: c.round ? "9999px" : 2,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
                animate={{
                  x: c.x,
                  y: [0, c.y, c.y + 18],
                  opacity: [0, 1, 0],
                  scale: 1,
                  rotate: 180,
                }}
                transition={{ duration: 1.3, delay: c.delay, ease: "easeOut" }}
              />
            ))}
          <motion.div
            initial={reduced ? false : { scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className={`flex h-24 w-24 items-center justify-center rounded-full ${pending ? "bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_18px_40px_-10px_rgba(217,119,6,0.55)]" : "bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_18px_40px_-10px_rgba(5,150,105,0.55)]"}`}
          >
            {pending ? (
              <Clock size={44} className="text-white" strokeWidth={2.2} />
            ) : (
            <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none">
              <motion.path
                d="M14 27 l9 9 l16 -18"
                stroke="white"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            )}
          </motion.div>
        </div>

        {pending && (
          <motion.span
            {...fade(0.4)}
            className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800"
          >
            Pending
          </motion.span>
        )}
        <motion.h2
          {...fade(0.45)}
          className="mt-1 text-center text-[#0D0F1C]"
          style={{ fontFamily: "var(--font-family-display)", fontWeight: 700, fontSize: 24 }}
        >
          {title}
        </motion.h2>
        {message && (
          <motion.p {...fade(0.55)} className="mt-2 text-center text-sm text-[#6B7280]">
            {message}
          </motion.p>
        )}
        {typeof amount === "number" && (
          <motion.div
            {...fade(0.6)}
            className="mt-3 text-[#3730A3]"
            style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 36 }}
          >
            <CountUp value={amount} reduced={reduced} />
          </motion.div>
        )}

        {/* Receipt */}
        <motion.div
          {...fade(0.75)}
          className="mt-4 w-full overflow-hidden rounded-3xl border border-[#E8EBFA] bg-white shadow-[0_20px_50px_-24px_rgba(55,48,163,0.35)]"
        >
          <div className="flex flex-col divide-y divide-[#F1F3FB] px-5">
            {rows.map((r, i) => (
              <motion.div
                key={r.label}
                initial={reduced ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.07 }}
                className="flex items-start justify-between gap-4 py-2.5 text-sm"
              >
                <span className="text-[#6B7280]">{r.label}</span>
                <span className="text-right font-semibold text-[#0D0F1C] break-words min-w-0">
                  {r.value}
                </span>
              </motion.div>
            ))}
          </div>
          {reference && (
            <>
              <div className="relative">
                <div className="mx-5 border-t-2 border-dashed border-[#E5E7EB]" />
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#F4F6FD]" />
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#F4F6FD]" />
              </div>
              <button
                type="button"
                onClick={copyReference}
                className="flex w-full items-center justify-between gap-3 bg-[#F8F9FD] px-5 py-3 text-left cursor-pointer"
                aria-label="Copy reference"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-[#6B7280]">Reference</span>
                  <span className="block truncate text-sm font-semibold text-[#0D0F1C]">
                    {reference}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3730A3] shadow-sm">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </>
          )}
        </motion.div>

        <motion.div {...fade(1.0)} className="mt-4 grid w-full grid-cols-2 gap-3">
          <PaveBtn onClick={onPrimary}>{primaryLabel}</PaveBtn>
          {secondaryLabel && onSecondary && (
            <PaveBtn variant="ghost" onClick={onSecondary}>
              {secondaryLabel}
            </PaveBtn>
          )}
        </motion.div>
      </div>
    </div>
  );
}
