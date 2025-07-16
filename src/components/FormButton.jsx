"use client";

import { PulsingDots } from "./loaders";

export default function FormButton({
  type = "button",
  onClick = () => {},
  disabled = false,
  isLoading = false,
  children,
  className = "",
  variant = "primary", // 'primary' | 'secondary' | 'danger'
  size = "md", // 'sm' | 'md' | 'lg'
  textColor,
  bgColor,
  hoverBgColor,
}) {
  const baseStyles =
    "group relative overflow-hidden inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 z-10";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm min-w-[100px]",
    md: "px-5 py-2 text-base min-w-[120px]",
    lg: "px-6 py-3 text-lg min-w-[140px]",
  };

  const variantStyles = {
    primary: "text-black focus:ring-blue-400",
    secondary: "text-black focus:ring-gray-400",
    danger: "text-black focus:ring-red-400",
  };

  const variantBg = {
    primary: "bg-blue-100",
    secondary: "bg-gray-100",
    danger: "bg-red-100",
  };

  const loadingStyles = isLoading ? "opacity-60 scale-[0.98] cursor-wait" : "";
  const textClass = textColor ?? variantStyles[variant];
  const baseBg = bgColor ?? variantBg[variant];
  const hoverFill = hoverBgColor ?? "bg-blue-200";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${textClass}
        ${baseBg}
        ${loadingStyles}
        ${disabled || isLoading ? "cursor-not-allowed" : "hover:shadow-md"}
        ${className}
      `}
    >
      {/* Left-to-right fill effect */}
      <span
        className={`
          absolute inset-0 z-0 transition-transform duration-300 ease-out transform origin-left
          ${hoverFill}
          scale-x-0 group-hover:scale-x-100
        `}
      />

      {/* Content */}
      <div className="flex items-center justify-center gap-2 z-10 w-full relative">
        {isLoading ? (
          <PulsingDots className="w-5 h-5" size="lg" />
        ) : (
          <span>{children}</span>
        )}
      </div>
    </button>
  );
}
