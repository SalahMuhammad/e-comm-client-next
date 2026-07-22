"use client";

import { useState } from "react";



export default function BooleanInput({ error = "", appearance = {}, ...props }) {
    const {
        textColor = "text-gray-900 dark:text-white",
        borderColor = "border-gray-300 dark:border-gray-600",
        focusColor = "focus:ring-blue-600 dark:focus:ring-blue-500",
        labelColor = "text-gray-700 dark:text-gray-300",
        errorColor = "text-red-500 dark:text-red-400",
        icon = null,
    } = appearance;

    // Input props
    const {
        id = "",
        className = "mb-[1.25rem]",
        placeholder = "",
        onBlur = () => { },
        ...restInputProps
    } = props;

    const hasError = Boolean(error);
    const [isFocused, setIsFocused] = useState(false);

    // Determine icon color
    let iconColorClass = "text-gray-400 dark:text-gray-300";
    if (hasError) iconColorClass = errorColor;
    else if (isFocused) iconColorClass = focusColor;

    return (
        <div className={`relative w-full mb-1 ${className}`}>
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                    {icon && (
                        <div className={`flex items-center pointer-events-none ${iconColorClass}`}>
                            {icon}
                        </div>
                    )}
                    <label
                        htmlFor={id}
                        className={`text-sm cursor-pointer ${textColor} ${labelColor}`}
                    >
                        {placeholder}
                    </label>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id={id}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur(e);
                        }}
                        onFocus={() => setIsFocused(true)}
                        className="sr-only peer"
                        {...restInputProps}
                    />
                    <div className={`
                        w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                        ${hasError
                            ? "peer-focus:ring-red-500 dark:peer-focus:ring-red-400"
                            : "peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800"
                        } 
                        rounded-full peer dark:bg-gray-700 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                        peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500
                    `}></div>
                </label>
            </div>

            {hasError && (
                <div className="min-h-[1.25rem] mt-1">
                    <p className={`text-sm ${errorColor}`}>{error}</p>
                </div>
            )}
        </div>
    );
}
