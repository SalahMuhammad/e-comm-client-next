'use client';
import AsyncSelect from 'react-select/async';
import { useState, useId, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { useTranslations } from 'next-intl';
import { PulsingDots } from './loaders';
import useGenericResponseHandler from './custom hooks/useGenericResponseHandler';


const SearchableDropdown = ({ url, label, customLoadOptions, ...props }) => {
  const handleResponse = useGenericResponseHandler()
  const t = useTranslations("inputs.searchableDropdown");
  const selectId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
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
      color: '#9ca3af',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: isDarkMode ? '#1e2939' : 'oklch(98.5% .002 247.839)',
      color: isDarkMode ? '#f9fafb' : '#111827',
      border: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode ? '#374151' : '#e0e7ff'
        : isDarkMode ? '#1f2937' : '#fff',
      color: isDarkMode ? '#f9fafb' : '#111827',
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };


  const NoOptionsMessage = () => (
    <div className="text-gray-500 dark:text-gray-400 text-sm w-full text-center py-2 bg-gray-50 dark:bg-gray-800 h-full">
      {t('noOptions')}
    </div>
  );

  const LoadingMessage = () => (
    <div className="text-gray-500 dark:text-gray-400 text-sm w-full text-center py-2 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 w-full h-full">
      {t('loading')} {<PulsingDots size='sm' />}
    </div>
  );

  return (
    <>
      <div 
        className="relative z-0 w-full mb-5 group"
        onClick={(e) => e.stopPropagation()}
    >
        <AsyncSelect
          instanceId={selectId}
          id={url}
          className="basic-single peer"
          isLoading={false}
          classNamePrefix="select"
          menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
          isDisabled={false}
          isClearable={true}
          isSearchable={true}
          loadOptions={loadOptions}
          styles={customStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

export default SearchableDropdown;