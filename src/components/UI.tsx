import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export function PaveBtn({
  children,
  onClick,
  variant = "primary",
  full = true,
  small = false,
  disabled = false,
}: any) {
  const base = `rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer`;
  const sz = small
    ? "px-4 py-2 text-sm"
    : full
      ? "w-full py-4 text-base"
      : "px-6 py-3 text-base";
  const variants: any = {
    primary: "bg-[#3730A3] text-white hover:bg-[#312E81]",
    ghost: "bg-transparent text-[#3730A3] hover:bg-[#EEF2FF]",
    outline: "border-2 border-[#3730A3] text-[#3730A3] hover:bg-[#EEF2FF]",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
    green: "bg-[#059669] text-white hover:bg-[#047857]",
    gold: "bg-[#D97706] text-white hover:bg-[#B45309]",
  };
  return (
    <button
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
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-[#374151] font-medium">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            {icon}
          </div>
        )}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full bg-[#F1F3FB] rounded-xl py-3.5 text-sm outline-none border border-transparent focus:border-[#3730A3] transition-colors ${icon ? "pl-11 pr-4" : "px-4"} ${right || type === "password" ? "pr-12" : ""}`}
        />
        {type === "password" && (
          <button
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
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
    indigo: "bg-[#EEF2FF] text-[#3730A3]",
    green: "bg-[#ECFDF5] text-[#059669]",
    gold: "bg-[#FFFBEB] text-[#D97706]",
    red: "bg-[#FEF2F2] text-[#DC2626]",
    gray: "bg-[#F3F4F6] text-[#6B7280]",
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
    <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-black/5">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-[#F1F3FB] flex items-center justify-center cursor-pointer"
      >
        <ArrowLeft size={18} />
      </button>
      <h2
        className="text-base"
        style={{ fontFamily: "var(--font-family-display)", fontWeight: 600 }}
      >
        {title}
      </h2>
      <div className="w-9 h-9 flex items-center justify-center">
        {right || null}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 40, color = "#3730A3" }: any) {
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
