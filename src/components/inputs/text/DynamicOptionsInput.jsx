'use client';
import AsyncSelect from 'react-select/async';
import { useState, useId, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { useTranslations } from 'next-intl';
import { PulsingDots } from '@/components/loaders';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';


const DynamicOptionsInput = ({ url, label, customLoadOptions, ...props }) => {
  const handleResponse = useGenericResponseHandler()
  const t = useTranslations("inputs.searchableDropdown");
  const selectId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    // initialize from current document class (fixes default dark mode not applied)
    setIsDarkMode(document.documentElement.classList.contains('dark'))

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);



  const loadOptions = async (searchValue, callback) => {
    const res = await apiRequest(`${url}${searchValue}`, { method: 'GET' })

    if (handleResponse(res)) return;

    if (customLoadOptions) {
      return customLoadOptions(res?.data, callback);
    }

    callback(
      res?.data.results.map((obj) => ({
        value: obj.id,
        label: obj.name,
      }))
    )
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `2px solid ${state.isFocused
        ? isDarkMode ? '#3b82f6' : '#2563eb'
        : isDarkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: 0,
      boxShadow: 'none',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      color: isDarkMode ? '#fff' : '#111827',
      minHeight: '2.5rem',
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
      zIndex: 9999,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      boxShadow: isDarkMode ? '0 8px 24px rgba(2,6,23,0.6)' : '0 8px 24px rgba(16,24,40,0.08)',
      borderRadius: '0.375rem',
      border: '1px solid ' + (isDarkMode ? '#1f2937' : '#e5e7eb'),
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode ? '#1f2937' : '#eef2ff'
        : 'transparent',
      color: isDarkMode ? '#f9fafb' : '#111827',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
    }),
    dropdownIndicator: (provided) => ({ ...provided, color: isDarkMode ? '#9ca3af' : '#6b7280' }),
    indicatorSeparator: (provided) => ({ ...provided, backgroundColor: 'transparent' }),
    noOptionsMessage: (provided) => ({ ...provided, color: isDarkMode ? '#9ca3af' : '#6b7280', padding: '0.5rem 1rem' }),
    valueContainer: (provided) => ({ ...provided, padding: '0.25rem 0.5rem' }),
  };


  const NoOptionsMessage = () => (
    <div className="text-sm w-full text-center py-2 h-full" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
      {t('noOptions')}
    </div>
  );

  const LoadingMessage = () => (
    <div className="text-sm w-full text-center py-2 flex items-center justify-center gap-2 h-full" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
      {t('loading')} {<PulsingDots size='sm' />}
    </div>
  );

  return (
    <>
      <div
        className={`relative w-full mb-3 group ${isMenuOpen ? 'z-50' : 'z-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <AsyncSelect
          instanceId={selectId}
          id={url}
          className="basic-single peer"
          isLoading={false}
          classNamePrefix="select"
          isDisabled={false}
          isClearable={true}
          isSearchable={true}
          loadOptions={loadOptions}
          styles={customStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
          components={{ NoOptionsMessage }}
          loadingMessage={LoadingMessage}
          placeholder={t("searchPlaceholder")}
          {...props}
        />
        <label
          htmlFor={url}
          className={`
            absolute text-sm duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0]
            ${isFocused ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
            peer-focus:scale-75 peer-focus:-translate-y-6
          `}
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default DynamicOptionsInput;