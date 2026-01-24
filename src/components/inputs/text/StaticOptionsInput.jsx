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
            className="relative z-0 w-full my-7 group"
            onClick={(e) => e.stopPropagation()}
        >
            <Select
                instanceId={selectId}
                options={options}
                defaultValue={options[0]}
                styles={customStyles}
                {...props}
            />
            <label
                htmlFor={selectId}
                className={`
                    absolute text-sm duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0]
                    text-blue-600 dark:text-blue-500
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75 peer-focus:-translate-y-6
                `}
            >{label}</label>
        </div>
    )
}

export default StaticOptionsInput
