"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DatePicker({ value, onChange, onClose }) {
  const t = useTranslations();
  // Helper to parse ISO date string in local timezone (prevents off-by-one errors)
  const parseISOLocal = (isoString) => {
    if (!isoString) return null;
    const [year, month, day] = isoString.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const [currentDate, setCurrentDate] = useState(value ? (parseISOLocal(value) || new Date()) : new Date());
  const [selectedDate, setSelectedDate] = useState(value ? parseISOLocal(value) : null);

  useEffect(() => {
    if (value) {
      const d = parseISOLocal(value);
      if (d && !isNaN(d.getTime())) {
        setSelectedDate(d);
        setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  }, [value]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(index => t(`datePicker.months.${index}`));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    // Format to ISO string using local date components (not UTC)
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    onChange(formattedDate);
    onClose();
  };

  const isCurrentMonth = (date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const renderDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const weeks = Math.ceil(totalDays / 7);

    for (let i = 0; i < weeks * 7; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      days.push(
        <button
          key={i}
          type="button"
          onClick={() => isValidDay && handleDateSelect(dayNumber)}
          disabled={!isValidDay}
          className={`
            w-8 h-8 rounded-full text-sm flex items-center justify-center
            transition-all duration-200
            ${!isValidDay ? 'text-gray-300 dark:text-gray-600 cursor-default' :
              isSelected(dayNumber) ? 'bg-blue-600 text-white hover:bg-blue-700' :
                isToday(dayNumber) ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800' :
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {isValidDay ? dayNumber : ''}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
            {t(`datePicker.weekdays.${i}`)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            setSelectedDate(today);
            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
            // Format to ISO string using local date components (not UTC)
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const iso = `${yyyy}-${mm}-${dd}`;
            onChange(iso);
            onClose();
          }}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {t('datePicker.controls.today')}
        </button>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              onChange('');
              onClose();
            }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {t('datePicker.controls.clear')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {t('datePicker.controls.done')}
          </button>
        </div>
      </div>
    </div>
  );
}