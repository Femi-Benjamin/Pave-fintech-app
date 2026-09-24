import React from "react";

export interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  layout?: "horizontal" | "vertical";
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Logo({
  size = "md",
  layout = "horizontal",
  variant = "default",
  showText = true,
  className = "",
  onClick,
}: LogoProps) {
  const isVertical = layout === "vertical";

  const textClasses = {
    xs: "text-lg",
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl",
    "2xl": "text-5xl sm:text-6xl md:text-7xl",
  };

  const iconContainerSizes = {
    xs: "w-7 h-7 rounded-lg",
    sm: "w-8 h-8 rounded-[10px]",
    md: "w-10 h-10 rounded-xl",
    lg: "w-14 h-14 rounded-[20px]",
    xl: "w-18 h-18 sm:w-20 sm:h-20 rounded-[24px]",
    "2xl": isVertical
      ? "w-24 h-24 sm:w-32 sm:h-32 rounded-3xl sm:rounded-[2rem]"
      : "w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl",
  };

  const gapClasses = isVertical
    ? "gap-4"
    : size === "2xl"
      ? "gap-5 sm:gap-6"
      : size === "xl"
        ? "gap-4 sm:gap-5"
        : size === "lg"
          ? "gap-3.5 sm:gap-4"
          : "gap-3";

  const textColorClass =
    variant === "light"
      ? "text-white"
      : variant === "dark"
        ? "text-[#0D0F1C]"
        : "text-[#0D0F1C] dark:text-white";

  const content = (
    <div
      className={`flex ${
        isVertical ? "flex-col items-center" : "flex-row items-center"
      } ${gapClasses} font-display font-extrabold tracking-tight ${className}`}
    >
      {/* Official PAVE Logo Mark */}
      <div
        className={`flex items-center justify-center ${iconContainerSizes[size]} relative shrink-0 overflow-hidden shadow-xs`}
      >
        <img
          src="/pave-logo.png"
          alt="PAVE"
          className="w-full h-full object-contain select-none"
        />
      </div>
      {showText && (
        <span
          className={`${textClasses[size]} tracking-tight ${textColorClass}`}
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          PAVE
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        className="hover:opacity-90 transition-all active:scale-[0.97] outline-none cursor-pointer"
      >
        {content}
      </button>
    );
  }

  return content;
}
