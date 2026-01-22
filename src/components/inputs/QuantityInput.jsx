"use client";
import { useTranslations } from 'next-intl';

export default function QuantityInput({
    value = "0.00",
    onChange = () => { },
    onIncrement,
    onDecrement,
    min = 0,
    max,
    step = 1,
    label,
    error = "",
    disabled = false,
    className = "",
    name,
    id,
    placeholder = "0.00",
    showButtons = true,
    ...props
}) {
    const t = useTranslations('inputs.quantity');

    const handleFocus = (e) => {
        // Auto-select all text on focus for easy replacement
        e.target.select();
    };

    const handleIncrement = () => {
        if (onIncrement) {
            onIncrement();
        } else {
            const newValue = (parseFloat(value || 0) + parseFloat(step)).toFixed(2);
            if (!max || parseFloat(newValue) <= max) {
                onChange(newValue);
            }
        }
    };

    const handleDecrement = () => {
        if (onDecrement) {
            onDecrement();
        } else {
            const newValue = Math.max(min, parseFloat(value || 0) - parseFloat(step)).toFixed(2);
            onChange(newValue);
        }
    };

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}

            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-1 py-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 dark:focus-within:ring-blue-400 dark:focus-within:border-blue-400 transition-all">
                {showButtons && (
                    <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={disabled || (min !== undefined && parseFloat(value) <= min)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 w-7 h-7 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium transition-colors"
                        aria-label={t('decrement')}
                    >
                        -
                    </button>
                )}

                <input
                    type="number"
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 text-center border-none bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...props}
                />

                {showButtons && (
                    <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={disabled || (max !== undefined && parseFloat(value) >= max)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600 w-7 h-7 rounded flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium transition-colors"
                        aria-label={t('increment')}
                    >
                        +
                    </button>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}
