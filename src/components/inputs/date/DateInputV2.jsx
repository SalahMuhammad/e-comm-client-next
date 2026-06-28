"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate, toISODate } from "./dateV2Utils";
import DatePicker from "./DatePicker";


export default function DateInput({ error = "", appearance = {}, ...props }) {
    // --- Appearance & Props ---
    const {
        textColor       = "text-gray-900 dark:text-white",
        borderColor     = "border-gray-300 dark:border-gray-600",
        focusColor      = "focus:border-blue-600 dark:focus:border-blue-500",
        labelColor      = "text-gray-500 dark:text-gray-400",
        focusLabelColor = "peer-focus:text-blue-600 peer-focus:dark:text-blue-500",
        errorColor      = "text-red-500 dark:text-red-400",
    } = appearance;

    const { 
        id = "date-input", 
        className = "mb-[1.25rem]", 
        value,
        defaultValue = "",
        onChange = () => { },
        onBlur = () => { },
        label = "Select date",
        required = false,
        ...rest 
    } = props;

    // --- State & Setup ---
    const t = useTranslations();
    const locale = useLocale();
    const currentLocale = locale === 'ar' ? 'ar-EG' : 'en-US';
    const actualLabel = label === "Select date" ? t('datePicker.controls.selectDate') : label;

    const [internalISO, setInternalISO] = useState(value ?? defaultValue ?? "");
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef(null);

    // Sync internal state with controlled value
    useEffect(() => { if (value !== undefined) setInternalISO(value || ""); }, [value]);

    // Format the display text based on focus state
    useEffect(() => {
        if (isFocused) {
            // Show editable format (MM/DD/YYYY) when typing
            if (internalISO) {
                const [y, m, d] = internalISO.split('-');
                setInputValue(`${parseInt(m)}/${parseInt(d)}/${y}`);
            }
        } else {
            // Show pretty format (e.g., October 12, 2023) when blurred
            setInputValue(formatDate(internalISO, currentLocale));
        }
    }, [internalISO, isFocused, currentLocale]);

    // --- Handlers ---
    const commitValue = (val) => {
        const iso = toISODate(val);
        const finalISO = iso || (val === "" ? "" : internalISO); // Revert if invalid
        setInternalISO(finalISO);
        if (finalISO !== internalISO) {
            onChange({ target: { value: finalISO, name: props.name } });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") { commitValue(inputValue); setShowPicker(false); e.currentTarget.blur(); }
        if (e.key === "Escape") { setShowPicker(false); e.currentTarget.blur(); }
    };

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                if (showPicker || isFocused) {
                    setShowPicker(false);
                    setIsFocused(false);
                    commitValue(inputValue);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [inputValue, internalISO, showPicker, isFocused]);

    const hasError = Boolean(error);

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            <input type="hidden" name={props.name} value={internalISO} />
            
            <div className="relative">
                <input
                    {...rest}
                    id={id}
                    type="text"
                    value={inputValue}
                    placeholder=" " // Required for floating label logic
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => { onBlur(e); /* commit handled by clickOutside or Enter */ }}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={() => setShowPicker(true)}
                    autoComplete="off"
                    className={`
                        block w-full py-2.5 pr-12 pl-2 text-sm bg-transparent border-0 border-b-2
                        ${textColor}
                        ${hasError 
                            ? `border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400` 
                            : `${borderColor} ${focusColor}`
                        }
                        appearance-none focus:outline-none focus:ring-0 peer cursor-pointer
                    `}
                />

                <label
                    htmlFor={id}
                    className={`absolute text-sm duration-300 transform -translate-y-6 
                        scale-75 top-3 origin-[0] peer-placeholder-shown:scale-100 
                        peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6
                        ${hasError ? `${errorColor} peer-focus:${errorColor}` : `${labelColor} ${focusLabelColor}`}
                    `}
                >
                    {actualLabel} {required && <span className="text-red-500">*</span>}
                </label>

                {/* Icon Button */}
                <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className={`absolute top-2.5 right-3 flex items-center transition-colors
                        ${hasError ? errorColor : isFocused ? "text-blue-600" : "text-gray-400"}
                    `}
                >
                    <CalendarIcon />
                </button>
            </div>

            {/* DatePicker Dropdown */}
            {showPicker && (
                <div className="absolute z-[60] mt-1 right-0 animate-in fade-in zoom-in duration-200">
                    <div className="shadow-2xl rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-2">
                        <DatePicker 
                            value={internalISO} 
                            onChange={(iso) => {
                                setInternalISO(iso);
                                onChange({ target: { value: iso, name: props.name } });
                                setShowPicker(false);
                                setIsFocused(false);
                            }} 
                            onClose={() => setShowPicker(false)} 
                        />
                    </div>
                </div>
            )}

            {/* Error Message */}
            <div className="min-h-[1.25rem] mt-1">
                {hasError && <p className={`text-sm ${errorColor} flex items-center gap-1`}>
                    <span className="h-1 w-1 rounded-full bg-current" /> {error}
                </p>}
            </div>
        </div>
    );
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v12.75A1.5 1.5 0 004.5 21z" />
    </svg>
);
