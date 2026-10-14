import React from "react";
import { motion } from "framer-motion";

interface PaveLoadingStateProps {
  title?: string;
  subtitle?: string;
  variant?: "card" | "full" | "group" | "savings";
}

export function PaveLoadingState({
  title = "Loading...",
  subtitle = "Please wait while we securely retrieve your data",
  variant = "full",
}: PaveLoadingStateProps) {
  if (variant === "card") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col gap-3 rounded-2xl border border-[#F1F3FB] bg-white p-5 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-md bg-[#E2E8F0]" />
          <div className="h-4 w-12 rounded-md bg-[#E2E8F0]" />
        </div>
        <div className="h-8 w-44 rounded-lg bg-[#E2E8F0]" />
        <div className="h-2 w-full rounded-full bg-[#F1F5F9]" />
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col overflow-hidden bg-[#F7F8FF]"
    >
      {/* Top Banner Skeleton */}
      <div
        className="px-6 pt-12 pb-10"
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #312E81 100%)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />
          <div className="h-6 w-36 rounded-md bg-white/20 animate-pulse" />
        </div>
        <div className="h-4 w-28 rounded-md bg-white/15 mb-3 animate-pulse" />
        <div className="h-10 w-52 rounded-xl bg-white/25 mb-4 animate-pulse" />

        {/* Progress bar skeleton */}
        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex justify-between mb-2">
            <div className="h-3 w-20 rounded-md bg-white/20 animate-pulse" />
            <div className="h-3 w-16 rounded-md bg-white/20 animate-pulse" />
          </div>
          <div className="h-3 w-full rounded-full bg-white/15 overflow-hidden">
            <motion.div
              className="h-full bg-white/30 rounded-full"
              initial={{ width: "30%" }}
              animate={{ width: ["30%", "75%", "30%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Body content shimmer cards */}
      <div className="px-6 -mt-4 pb-12 flex flex-col gap-4">
        {/* Status indicator badge */}
        <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-[#EEF2FF] bg-white p-4 shadow-xs">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4F46E5] opacity-35" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#1E1B4B]">{title}</span>
            <span className="text-[11px] text-[#6B7280]">{subtitle}</span>
          </div>
        </div>

        {/* Action button skeletons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 rounded-xl bg-white border border-[#E2E8F0] animate-pulse" />
          <div className="h-12 rounded-xl bg-white border border-[#E2E8F0] animate-pulse" />
        </div>

        {/* Detail rows skeleton */}
        <div className="rounded-2xl border border-[#F1F3FB] bg-white p-5 flex flex-col gap-3 shadow-xs">
          <div className="h-4 w-32 rounded-md bg-[#E2E8F0] mb-2 animate-pulse" />
          <div className="flex justify-between py-2 border-b border-[#F1F3FB]">
            <div className="h-3 w-24 rounded-md bg-[#F1F5F9] animate-pulse" />
            <div className="h-3 w-20 rounded-md bg-[#E2E8F0] animate-pulse" />
          </div>
          <div className="flex justify-between py-2 border-b border-[#F1F3FB]">
            <div className="h-3 w-28 rounded-md bg-[#F1F5F9] animate-pulse" />
            <div className="h-3 w-24 rounded-md bg-[#E2E8F0] animate-pulse" />
          </div>
          <div className="flex justify-between py-2">
            <div className="h-3 w-20 rounded-md bg-[#F1F5F9] animate-pulse" />
            <div className="h-3 w-16 rounded-md bg-[#E2E8F0] animate-pulse" />
          </div>
        </div>

        {/* Member/Transactions list skeleton */}
        <div className="rounded-2xl border border-[#F1F3FB] bg-white p-5 flex flex-col gap-3 shadow-xs">
          <div className="h-4 w-36 rounded-md bg-[#E2E8F0] mb-1 animate-pulse" />
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 border-b border-[#F1F3FB] last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#E2E8F0] animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-28 rounded-md bg-[#E2E8F0] animate-pulse" />
                  <div className="h-2.5 w-16 rounded-md bg-[#F1F5F9] animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-14 rounded-md bg-[#E2E8F0] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
