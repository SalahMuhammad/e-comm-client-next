'use client';

import { useLocale } from 'next-intl';

/**
 * LocalizedDate component - Formats dates according to the current locale
 * 
 * @param {Object} props
 * @param {string} props.date - ISO date string or Date object
 * @param {string} [props.format='short'] - Date format: 'short' (May 12, 2025), 'long' (May 12, 2025 at 3:45 PM), 'numeric' (05/12/2025)
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * // Short format (default)
 * <LocalizedDate date="2025-05-12" />
 * // Output: "May 12, 2025" (en) or "مايو 12, 2025" (ar)
 * 
 * // Long format with time
 * <LocalizedDate date="2025-05-12T15:45:00" format="long" />
 * // Output: "May 12, 2025 at 3:45 PM" (en) or "مايو 12, 2025 في 3:45 م" (ar)
 * 
 * // Numeric format
 * <LocalizedDate date="2025-05-12" format="numeric" />
 * // Output: "5/12/2025" (en) or "12/5/2025" (ar)
 */
export default function LocalizedDate({ date, format = 'short', className = '' }) {
    const locale = useLocale();

    if (!date) return '-';

    const dateObj = new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '-';

    // For Arabic, use Arabic date format with Gregorian calendar and Latin numerals (0-9)
    const localeForDate = locale === 'ar' ? 'ar-EG' : locale;

    let formattedDate;

    switch (format) {
        case 'long':
            // Long format with time: "May 12, 2025 at 3:45 PM"
            formattedDate = dateObj.toLocaleString(localeForDate, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                calendar: 'gregory',
                numberingSystem: 'latn',
            });
            break;

        case 'numeric':
            // Numeric format: "5/12/2025"
            formattedDate = dateObj.toLocaleDateString(localeForDate, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                calendar: 'gregory',
                numberingSystem: 'latn',
            });
            break;

        case 'short':
        default:
            // Short format: "May 12, 2025"
            formattedDate = dateObj.toLocaleDateString(localeForDate, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                calendar: 'gregory',
                numberingSystem: 'latn',
            });
            break;
    }

    return <span className={className}>{formattedDate}</span>;
}
