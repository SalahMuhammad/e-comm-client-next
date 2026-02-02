'use client'

import { useId, useState, useEffect } from 'react';
import Select from 'react-select'

const StaticOptionsInput = ({ options, label, ...props }) => {
    const selectId = useId();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        setIsDarkMode(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${state.isFocused ? isDarkMode ? '#3b82f6' : '#2563eb' : isDarkMode ? '#4b5563' : '#d1d5db'}`,
            borderRadius: 0,
            boxShadow: 'none',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            minHeight: '2.5rem',
            color: isDarkMode ? '#fff' : '#111827',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: isDarkMode ? '#fff' : '#111827',
        }),
        input: (provided) => ({
            ...provided,
            color: isDarkMode ? '#fff' : '#111827',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: isDarkMode ? '#9ca3af' : '#6b7280',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            boxShadow: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? isDarkMode ? '#374151' : '#f3f4f6'
                : isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
            },
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '0.25rem',
        }),
    };

    return (
        <div
            className="w-full mb-4"
            onClick={(e) => e.stopPropagation()}
        >
            <label
                htmlFor={selectId}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                {label}
            </label>
            <Select
                instanceId={selectId}
                options={options}
                defaultValue={options[0]}
                styles={customStyles}
                formatOptionLabel={(data, meta) => {
                    if (data.note && meta.context === 'menu') {
                        return (
                            <div className="flex flex-col">
                                <span>{data.label}</span>
                                <span className="text-xs opacity-70">{data.note}</span>
                            </div>
                        );
                    }
                    return data.label;
                }}
                {...props}
            />
        </div>
    )
}

export default StaticOptionsInput
