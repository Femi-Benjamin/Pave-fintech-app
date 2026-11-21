import React, { useEffect, useId, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export function PaveBtn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  full = true,
  small = false,
  disabled = false,
}: any) {
  const base = `rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3730A3]`;
  const sz = small
    ? "px-4 py-2 text-sm"
    : full
      ? "w-full py-4 text-base"
      : "px-6 py-3 text-base";
  const variants: any = {
    primary:
      "bg-[#3730A3] text-white shadow-md shadow-[#3730A3]/25 hover:bg-[#312E81] hover:shadow-lg hover:shadow-[#3730A3]/30 hover:-translate-y-px disabled:shadow-none disabled:hover:translate-y-0",
    ghost: "bg-[#EEF0F8] text-[#312E81] hover:bg-[#E0E7FF]",
    outline: "border-2 border-[#3730A3] text-[#312E81] hover:bg-[#EEF2FF]",
    secondary:
      "bg-[#EEF2FF] text-[#312E81] border border-[#A5B4FC] hover:bg-[#E0E7FF]",
    danger:
      "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/20 hover:bg-[#B91C1C] hover:-translate-y-px",
    green:
      "bg-[#047857] text-white shadow-md shadow-[#047857]/20 hover:bg-[#065F46] hover:-translate-y-px",
    gold: "bg-[#B45309] text-white shadow-md shadow-[#B45309]/20 hover:bg-[#92400E] hover:-translate-y-px",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sz} ${variants[variant]} font-medium`}
      style={{ fontFamily: "var(--font-family-display)" }}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  right,
}: any) {
  const [show, setShow] = useState(false);
  const inputId = useId();
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm text-[#1F2937] font-semibold"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full bg-[#F1F3FB] text-[#0D0F1C] rounded-xl py-3.5 text-[15px] outline-none border border-[#D5DAEE] hover:border-[#A5B4FC] focus:border-[#3730A3] focus:bg-white focus:ring-4 focus:ring-[#3730A3]/15 transition-all duration-200 ${icon ? "pl-11 pr-4" : "px-4"} ${right || type === "password" ? "pr-12" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#3730A3] transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {right && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({ children, color = "indigo" }: any) {
  const colors: any = {
    indigo: "bg-[#EEF2FF] text-[#312E81] ring-1 ring-inset ring-[#C7D2FE]",
    green: "bg-[#ECFDF5] text-[#047857] ring-1 ring-inset ring-[#A7F3D0]",
    gold: "bg-[#FFFBEB] text-[#92400E] ring-1 ring-inset ring-[#FDE68A]",
    red: "bg-[#FEF2F2] text-[#B91C1C] ring-1 ring-inset ring-[#FECACA]",
    gray: "bg-[#F3F4F6] text-[#374151] ring-1 ring-inset ring-[#E5E7EB]",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export function ScreenHeader({ title, onBack, right }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-[#E2E6F3] sticky top-0 z-20">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="w-10 h-10 rounded-full bg-[#EEF2FF] border border-[#A5B4FC] text-[#312E81] flex items-center justify-center cursor-pointer hover:bg-[#E0E7FF] hover:-translate-x-0.5 active:scale-95 transition-all duration-200"
      >
        <ArrowLeft size={18} />
      </button>
      <h2
        className="text-lg text-[#0D0F1C]"
        style={{ fontFamily: "var(--font-family-display)", fontWeight: 700 }}
      >
        {title}
      </h2>
      <div className="w-9 h-9 flex items-center justify-center">
        {right || null}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 40, color = "#3730A3", src }: any) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [src]);
  const initials = name
    ? name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "P";

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        onError={() => setHasError(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-semibold text-sm"
      style={{ width: size, height: size, background: color }}
    >
      {initials}
    </div>
  );
}

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error" className="w-10 h-10 opacity-40" />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
}
