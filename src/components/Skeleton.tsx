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

export function CoreScreenSkeleton() {
  return (
    <div
      className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-pulse"
      role="status"
      aria-label="Loading screen"
    >
      <span className="sr-only">Loading screen</span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 sm:h-8 w-44 sm:w-64 rounded-md" />
          <Skeleton className="h-4 w-32 sm:w-48 rounded-md" />
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-3xl bg-[#3730A3] p-6 sm:p-8">
            <Skeleton dark className="h-4 w-36 rounded-md mb-4" />
            <Skeleton dark className="h-10 w-56 sm:w-72 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-5 border border-[#F1F3FB]"
              >
                <Skeleton className="h-5 w-32 rounded-md mb-4" />
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#F1F3FB]">
            <Skeleton className="h-5 w-40 rounded-md mb-5" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/3 rounded-md mb-2" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 border border-[#F1F3FB]">
            <Skeleton className="h-5 w-36 rounded-md mb-5" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
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
