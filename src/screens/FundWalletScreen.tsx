import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  ExternalLink,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { PaveBtn, ScreenHeader } from "../components/UI";
import { Screen, fmt } from "../pave-data";
import { getApiErrorMessage } from "../api/auth";
import {
  useFundWalletMutation,
  useWalletBalanceQuery,
} from "../hooks/usePaveApi";
import { formatAmountInput, parseAmountInput } from "../utils/amountInput";

const PRESETS = [5000, 10000, 20000, 50000, 100000];

const STEPS = [
  "Enter the amount you want to add",
  "Pay securely on the Paystack page",
  "Your balance updates automatically",
];

export function FundWalletScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [amount, setAmount] = useState("");
  const fundingMutation = useFundWalletMutation();
  const balanceQuery = useWalletBalanceQuery();

  const value = parseAmountInput(amount);
  const rawBalance = balanceQuery.data
    ? Number(balanceQuery.data.balance)
    : NaN;
  const balance = Number.isFinite(rawBalance) ? rawBalance : null;
  const isPending = fundingMutation.isPending;

  const handleFund = () => {
    if (value > 0 && !isPending) {
      fundingMutation.mutate({ amount: String(value) });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <ScreenHeader title="Fund Wallet" onBack={() => onNav("wallet")} />

      {!fundingMutation.isSuccess ? (
        <>
          <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6 flex flex-col gap-5 w-full max-w-xl mx-auto">
            {/* Balance hero */}
            <div
              className="relative overflow-hidden rounded-3xl p-5 text-white shadow-lg"
              style={{
                background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
              }}
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
              <div className="absolute -right-2 top-16 h-20 w-20 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-2 text-xs text-white/70">
                <Wallet size={14} />
                Current balance
              </div>
              <p
                className="relative mt-1 text-3xl"
                style={{
                  fontFamily: "var(--font-family-display)",
                  fontWeight: 700,
                }}
              >
                {balance === null ? "₦ ---" : fmt(balance)}
              </p>
              {value > 0 && balance !== null && (
                <p className="relative mt-3 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs">
                  After funding: {fmt(balance + value)}
                </p>
              )}
            </div>

            {/* Amount entry */}
            <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#F1F3FB]">
              <label
                htmlFor="fund-amount"
                className="text-sm font-medium text-[#374151]"
              >
                How much do you want to add?
              </label>
              <div className="mt-3 flex items-center gap-2 rounded-2xl border-2 border-transparent bg-[#F1F3FB] px-4 py-3 transition-colors focus-within:border-[#3730A3] focus-within:bg-white">
                <span
                  className="text-2xl text-[#6B7280]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  ₦
                </span>
                <input
                  id="fund-amount"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => setAmount(formatAmountInput(e.target.value))}
                  placeholder="0"
                  className="w-full min-w-0 bg-transparent outline-none text-[#0D0F1C] placeholder:text-[#C0C4D6]"
                  style={{
                    fontFamily: "var(--font-family-display)",
                    fontWeight: 700,
                    fontSize: 30,
                  }}
                />
              </div>

              <p className="mt-4 text-xs font-medium text-[#6B7280]">
                Quick amounts
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {PRESETS.map((p) => {
                  const active = value === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(formatAmountInput(String(p)))}
                      aria-pressed={active}
                      className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition-all cursor-pointer active:scale-95 ${
                        active
                          ? "border-[#3730A3] bg-[#3730A3] text-white shadow-sm"
                          : "border-[#E0E7FF] bg-[#EEF2FF] text-[#3730A3] hover:bg-[#E0E7FF]"
                      }`}
                    >
                      {fmt(p)}
                    </button>
                  );
                })}
              </div>
            </div>

            {fundingMutation.isError && (
              <p
                role="alert"
                className="rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] px-4 py-3 text-sm text-[#B91C1C]"
              >
                {getApiErrorMessage(
                  fundingMutation.error,
                  "Unable to start wallet funding.",
                )}
              </p>
            )}

            {/* Action */}
            <div>
              {isPending && (
                <div className="mb-3" role="status" aria-live="polite">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7F6]">
                    <motion.div
                      className="h-full w-1/3 rounded-full bg-linear-to-r from-[#3730A3] to-[#6366F1]"
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-center text-xs text-[#6B7280]">
                    Creating your secure payment link...
                  </p>
                </div>
              )}
              <PaveBtn onClick={handleFund} disabled={value <= 0 || isPending}>
                <Lock size={16} />
                {isPending
                  ? "Preparing payment..."
                  : value > 0
                    ? `Fund ${fmt(value)}`
                    : "Enter an amount"}
              </PaveBtn>
            </div>

            {/* How it works */}
            <div className="rounded-3xl bg-white p-5 shadow-xs border border-[#F1F3FB]">
              <p className="text-sm font-semibold text-[#0D0F1C]">
                How it works
              </p>
              <ol className="mt-3 flex flex-col gap-3">
                {STEPS.map((text, i) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-xs font-bold text-[#3730A3]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#4B5563]">{text}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] px-3 py-2 text-xs text-[#047857]">
                <ShieldCheck size={16} className="shrink-0" />
                Payments are processed securely by Paystack. We never see your
                card details.
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center gap-6 w-full max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center"
          >
            <CheckCircle size={52} className="text-[#059669]" />
          </motion.div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              Complete your {fmt(value)} funding
            </h2>
            <p className="text-[#6B7280] text-sm mt-2">
              {fundingMutation.data.message}
            </p>
            <p className="text-[#6B7280] text-xs mt-3">
              Your balance updates automatically once the payment is confirmed.
            </p>
          </div>
          {fundingMutation.data.paystackLink && (
            <a
              href={fundingMutation.data.paystackLink}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-5 py-4 text-center text-sm font-semibold text-white"
            >
              Continue to payment
              <ExternalLink size={16} />
            </a>
          )}
          <PaveBtn variant="ghost" onClick={() => onNav("wallet")}>
            Back to Wallet
          </PaveBtn>
        </div>
      )}
    </div>
  );
}
