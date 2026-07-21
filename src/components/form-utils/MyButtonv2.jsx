"use client";

import { PulsingDots } from "../loaders";


const variantConfig = {
    primary: {
        base: "bg-blue-600 text-white dark:bg-blue-500",
        hoverFill: "bg-blue-700 dark:bg-blue-400",
        ring: "focus:ring-blue-500",
    },
    secondary: {
        base: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
        hoverFill: "bg-gray-300 dark:bg-gray-600",
        ring: "focus:ring-gray-400",
    },
    danger: {
        base: "bg-red-600 text-white dark:bg-red-500",
        hoverFill: "bg-red-700 dark:bg-red-400",
        ring: "focus:ring-red-500",
    },
    success: {
        base: "bg-emerald-600 text-white dark:bg-emerald-500",
        hoverFill: "bg-emerald-700 dark:bg-emerald-400",
        ring: "focus:ring-emerald-500",
    },
};

export default function MyButtonv2({
    type = "button",
    onClick = () => { },
    disabled = false,
    isLoading = false,
    children,
    className = "",
    variant = "primary",
    size = "md",
}) {
    const baseStyles =
        "group relative overflow-hidden inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 z-10";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm min-w-[100px]",
        md: "px-5 py-2 text-base min-w-[120px]",
        lg: "px-6 py-3 text-lg min-w-[140px]",
    };

    // Get the active configuration based on the variant
    const config = variantConfig[variant] || variantConfig.primary;

    const loadingStyles = isLoading ? "opacity-60 scale-[0.98] cursor-wait" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${config.base}
        ${config.ring}
        ${loadingStyles}
        ${disabled || isLoading ? "cursor-not-allowed" : "hover:shadow-md"}
        ${className}
      `}
        >
            {/* Left-to-right fill effect */}
            <span
                className={`
          absolute inset-0 z-0 transition-transform duration-300 ease-out transform origin-left
          ${config.hoverFill}
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
