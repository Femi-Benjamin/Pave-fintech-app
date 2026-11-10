import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Clock, Copy, X, XCircle } from "lucide-react";
import { buildTransactionReceipt } from "../utils/transactionReceipt";

const STATUS_STYLE = {
  success: { label: "Successful", icon: Check, bg: "from-[#10B981] to-[#059669]", pill: "bg-[#ECFDF5] text-[#047857]" },
  pending: { label: "Pending", icon: Clock, bg: "from-amber-400 to-amber-600", pill: "bg-amber-100 text-amber-800" },
  failed: { label: "Failed", icon: XCircle, bg: "from-[#F87171] to-[#DC2626]", pill: "bg-[#FEE2E2] text-[#B91C1C]" },
} as const;

export function TransactionReceipt({
  record,
  onClose,
}: {
  record: Record<string, unknown> | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const receipt = record ? buildTransactionReceipt(record) : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const style = receipt ? STATUS_STYLE[receipt.status] : null;
  const Icon = style?.icon;

  return (
    <AnimatePresence>
      {receipt && style && Icon && (
        <motion.div
          key="receipt"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 lg:items-center lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Transaction details"
            className="flex max-h-[90dvh] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-2xl lg:rounded-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="text-sm font-semibold text-[#0D0F1C]">Transaction details</span>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F3FB] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-5">
              <div className="flex flex-col items-center pt-4 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${style.bg} shadow-lg`}
                >
                  <Icon size={30} className="text-white" strokeWidth={2.6} />
                </motion.div>
                <div
                  className="mt-3 text-[#0D0F1C]"
                  style={{ fontFamily: "var(--font-family-display)", fontWeight: 800, fontSize: 30 }}
                >
                  {receipt.direction === "credit" ? "+" : "-"}₦
                  {receipt.amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="mt-1 text-sm text-[#374151]">{receipt.title}</p>
                <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${style.pill}`}>
                  {style.label}
                </span>
              </div>

              <div className="mt-5 flex flex-col divide-y divide-[#F1F3FB] rounded-2xl bg-[#F8F9FD] px-4">
                {receipt.rows.map((r) => (
                  <div key={r.label} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <span className="text-[#6B7280]">{r.label}</span>
                    <span className="min-w-0 break-words text-right font-semibold text-[#0D0F1C]">{r.value}</span>
                  </div>
                ))}
                {receipt.reference && (
                  <button
                    type="button"
                    onClick={() => copy(receipt.reference!)}
                    aria-label="Copy reference"
                    className="flex items-center justify-between gap-3 py-3 text-left text-sm cursor-pointer"
                  >
                    <span className="min-w-0">
                      <span className="block text-[#6B7280]">Reference</span>
                      <span className="block truncate font-semibold text-[#0D0F1C]">{receipt.reference}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3730A3] shadow-sm">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 w-full rounded-2xl bg-[#3730A3] py-3.5 text-sm font-semibold text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
