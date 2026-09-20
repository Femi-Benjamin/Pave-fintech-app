import React from "react";

export function Skeleton({
  className = "",
  dark = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${
        dark ? "bg-white/15" : "bg-[#E5E7EB]/70"
      } ${className}`}
      {...props}
    />
  );
}

export function HomeScreenSkeleton() {
  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
      {/* Top Welcome Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full lg:hidden" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 sm:h-8 w-56 sm:w-72 rounded-md" />
            <Skeleton className="h-4 w-44 sm:w-80 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Main Grid: 2 columns on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Balance + Quick Actions + Savings + Recent Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Wallet Balance Card Skeleton */}
          <div
            style={{
              background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
            }}
            className="p-6 sm:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton dark className="h-4 w-36 rounded-md" />
              <Skeleton dark className="w-6 h-6 rounded-full" />
            </div>
            <Skeleton dark className="h-10 w-60 sm:w-72 rounded-xl mb-6" />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Skeleton dark className="w-4 h-4 rounded-full" />
                <Skeleton dark className="h-3 w-44 rounded-md" />
              </div>
              <Skeleton dark className="h-6 w-28 rounded-full" />
            </div>
          </div>

          {/* Quick Actions Grid Skeleton */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <Skeleton className="h-3.5 w-36 rounded-md mb-4" />
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2.5 p-2">
                  <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* My Savings Section Skeleton */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-[#F7F8FF] rounded-2xl p-4 border border-[#F1F3FB] flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-24 rounded-md" />
                        <Skeleton className="h-2.5 w-16 rounded-md" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Skeleton className="h-3.5 w-20 rounded-md" />
                      <Skeleton className="h-2.5 w-14 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity List Skeleton */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3.5 w-24 rounded-md" />
            </div>
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl flex items-center justify-between border border-transparent"
                >
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-32 sm:w-48 rounded-md" />
                      <Skeleton className="h-2.5 w-24 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16 sm:w-20 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Weekly Spending Chart Skeleton */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
              {[40, 75, 55, 90, 65, 80, 50].map((heightPct, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#E5E7EB]/80 rounded-t-md"
                    style={{ height: `${heightPct}%` }}
                  />
                  <Skeleton className="h-2.5 w-6 rounded-xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Community Thrift Summary Card Skeleton */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#F1F3FB]">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="p-4 rounded-xl bg-[#F7F8FF] border border-[#F1F3FB] mb-4 flex flex-col gap-2.5">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-2.5 w-48 rounded-md" />
              <div className="mt-2 flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* BNPL Promo Banner Skeleton */}
          <div
            className="rounded-2xl p-5 shadow-md flex flex-col gap-2.5"
            style={{
              background: "linear-gradient(145deg, #3730A3 0%, #1E1B4B 100%)",
            }}
          >
            <Skeleton dark className="h-3 w-28 rounded-md" />
            <Skeleton dark className="h-5 w-44 rounded-md" />
            <Skeleton dark className="h-3 w-full rounded-md" />
            <Skeleton dark className="h-3 w-3/4 rounded-md mb-2" />
            <Skeleton dark className="h-9 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletScreenSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      {/* Header Emerald Banner Skeleton */}
      <div
        style={{
          background: "linear-gradient(145deg, #059669 0%, #047857 100%)",
        }}
        className="px-6 pt-14 pb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <Skeleton dark className="h-6 w-28 rounded-md" />
          <Skeleton dark className="w-9 h-9 rounded-full" />
        </div>
        <Skeleton dark className="h-3.5 w-32 rounded-md mb-2" />
        <Skeleton dark className="h-10 w-52 rounded-xl mb-3" />
        <Skeleton dark className="h-8 w-52 rounded-xl" />
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-6">
        {/* Actions Grid Skeleton */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F1F3FB]">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-1">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-[#F1F3FB] flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-2.5 w-16 rounded-md" />
            </div>
          ))}
        </div>

        {/* Transactions History Skeleton */}
        <div className="mb-6 flex flex-col gap-3">
          <Skeleton className="h-4 w-36 rounded-md" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 flex items-center justify-between gap-3 border border-[#F1F3FB]"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-32 sm:w-48 rounded-md" />
                    <Skeleton className="h-2.5 w-20 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SavingsScreenSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      {/* Amber Header Skeleton */}
      <div
        style={{
          background: "linear-gradient(145deg, #D97706 0%, #B45309 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <Skeleton dark className="h-7 w-32 rounded-md mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm border border-white/20 flex flex-col gap-1.5"
            >
              <Skeleton dark className="h-3 w-20 rounded-md" />
              <Skeleton dark className="h-6 w-28 rounded-md" />
              <Skeleton dark className="h-2.5 w-24 rounded-md mt-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 -mt-4 flex flex-col gap-5">
        {/* Tab switch skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-1.5 border border-[#F1F3FB] flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>

        {/* Goals cards skeleton */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#F1F3FB] flex flex-col gap-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-2xl" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceScreenSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      {/* Violet Header Skeleton */}
      <div
        style={{
          background: "linear-gradient(145deg, #7C3AED 0%, #6D28D9 100%)",
        }}
        className="px-6 pt-14 pb-8"
      >
        <Skeleton dark className="h-7 w-48 rounded-md mb-2" />
        <Skeleton dark className="h-4 w-64 rounded-md mb-4" />
        <Skeleton dark className="h-11 w-full rounded-xl" />
      </div>

      {/* Categories horizontal scroll skeleton */}
      <div className="px-4 -mt-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0 bg-white shadow-xs" />
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="px-4 grid grid-cols-2 gap-3 pb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-3 border border-[#F1F3FB] flex flex-col gap-2.5 shadow-xs"
          >
            <Skeleton className="w-full aspect-square rounded-xl" />
            <Skeleton className="h-3.5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-6 w-full rounded-lg mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessagesScreenSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto animate-pulse">
      {/* Messages Header Skeleton */}
      <div className="px-6 pt-14 pb-4 bg-white border-b border-[#F1F3FB]">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-32 rounded-md" />
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Messages List Skeleton */}
      <div className="flex-1 bg-white">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-6 py-4 border-b border-[#F9FAFB]"
          >
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
              <Skeleton className="h-3 w-3/4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileScreenSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto animate-pulse">
      {/* Indigo Header Profile Skeleton */}
      <div
        style={{
          background: "linear-gradient(145deg, #1E1B4B 0%, #3730A3 100%)",
        }}
        className="px-6 pt-14 pb-8 flex flex-col items-center"
      >
        <Skeleton dark className="w-20 h-20 rounded-full mb-4" />
        <Skeleton dark className="h-6 w-40 rounded-md mb-1.5" />
        <Skeleton dark className="h-3.5 w-32 rounded-md mb-3" />
        <Skeleton dark className="h-6 w-28 rounded-full mb-6" />

        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton dark className="h-6 w-10 rounded-md" />
              <Skeleton dark className="h-3 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile menu rows skeleton */}
      <div className="px-6 py-5 flex flex-col gap-2.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#F1F3FB]"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="w-4 h-4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
