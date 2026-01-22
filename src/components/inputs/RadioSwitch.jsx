"use client";

import { useState } from 'react';

/**
 * RadioSwitch - A segmented control / toggle switch component
 * @param {Array} options - Array of {value, label} objects
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {string} label - Optional label above the switch
 * @param {string} name - Form field name
 */
export default function RadioSwitch({
    options = [],
    value,
    onChange,
    label = '',
    name = '',
    className = ''
}) {
    const selectedIndex = options.findIndex(opt => opt.value === value);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <div className="relative inline-flex w-full bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                {/* Sliding indicator */}
                <div
                    className="absolute top-1 bottom-1 bg-white dark:bg-gray-800 rounded-md shadow-md transition-all duration-300 ease-in-out"
                    style={{
                        left: `${(selectedIndex * 100) / options.length + 0.25}%`,
                        width: `calc(${100 / options.length}% - 0.5rem)`
                    }}
                />

                {/* Options */}
                {options.map((option, index) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
                            relative z-10 flex-1 px-4 py-2.5 text-sm font-medium rounded-md
                            transition-colors duration-200
                            ${value === option.value
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }
                        `}
                    >
                        {option.label}
                    </button>
                ))}

                {/* Hidden input for form submission */}
                {name && <input type="hidden" name={name} value={value} />}
            </div>
        </div>
    );
}
