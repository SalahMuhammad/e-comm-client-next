"use client";

import { useState } from "react";


export default function NumberInputV2({ error = "", appearance  = {}, ...props }) {
    // style
    const {
        textColor           = dTextColor,
        borderColor         = dBorderColor,
        focusColor          = dFocusColor,
        labelColor          = dLabelColor,
        focusLabelColor     = dFocusLabelColor,
        errorColor          = dErrorColor,
        containerCSSClasses = "",
        labelCSSClass       = "",
        icon                = null,
    } = appearance;
    // input props
    const {
        id          = "",
        min         = 0,
        placeholder = "",
        onChange    = () => { },
        onBlur      = () => { },
        ...restInputProps
    } = props
    const hasError = Boolean(error);
    const [isFocused, setIsFocused] = useState(false);


    return (
        <div className={`relative w-full mb-1 ${containerCSSClasses}`}>
            <Iconn 
                icon={icon} 
                isFocused={isFocused} 
                containerColor={hasError 
                    ? errorColor 
                    : isFocused 
                        ? focusColor 
                        : null
                }
            />

            <input
                id={id}
                type="number"
                min={min}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur(e);
                }}
                onFocus={() => setIsFocused(true)}
                className={`
                    block w-full py-2.5 ${icon ? "pr-12" : "pr-2"} 
                    pl-2 text-sm bg-transparent border-0 border-b-2
                    ${textColor} 
                    ${hasError
                        ? `border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400`
                        : `${borderColor} ${focusColor}`
                    }
                    appearance-none focus:outline-none focus:ring-0 peer
                `}
                {...restInputProps}
            />

            <label
                htmlFor={id}
                className={`absolute text-sm duration-300 transform -translate-y-6 
                        translate-x-2 scale-75 top-3 z-10 origin-[0] 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                        peer-focus:scale-75 peer-focus:-translate-y-8 ${labelCSSClass}
                        ${hasError 
                            // ? `peer-focus:${errorColor} ${errorColor}` 
                            ? `peer-focus:${errorColor}` 
                            : `${labelColor} ${focusLabelColor}
                        `}
                `}
            >
                {placeholder}
            </label>

            {hasError && (
                <div className="min-h-[1.25rem] mt-1">
                    <p className={`text-sm ${errorColor}`}>{error}</p>
                </div>
            )}
        </div>
    );
}

const dTextColor = "text-gray-900 dark:text-white";
const dBorderColor = "border-gray-300 dark:border-gray-600";
const dFocusColor = "focus:border-blue-600 dark:focus:border-blue-500";
const dLabelColor = "text-gray-500 dark:text-gray-400";
const dFocusLabelColor = "peer-focus:text-blue-600 peer-focus:dark:text-blue-500";
const dErrorColor = "text-red-500 dark:text-red-400";

const Iconn = ({ icon, containerColor }) => {
     // Determine icon color
    let iconColorClass = containerColor || "text-gray-400 dark:text-gray-300";


    return icon && (
        <div className={`absolute top-2.5 right-3 flex 
                        items-center pointer-events-none ${iconColorClass}
            `}
        >
            {icon}
        </div>
    )
}
