'use client';
import AsyncSelect from 'react-select/async';
import { useState, useId } from 'react';
import { apiRequest } from '@/utils/api';
import { useTranslations } from 'next-intl';
import { PulsingDots } from './loaders';

const SearchableDropdown = ({ url, label, ...props }) => {
  const t = useTranslations("inputs.searchableDropdown");
  const selectId = useId();
  const [isFocused, setIsFocused] = useState(false);

  const loadOptions = (searchValue, callback) => {
    apiRequest(`${url}${searchValue}`, { method: 'GET' })
    .then((res) =>
      callback(
        res.results.map((obj) => ({
          value: obj.id,
          label: obj.name,
        }))
      )
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `2px solid ${state.isFocused ? '#2563eb' : '#d1d5db'}`, // blue-600 / gray-300
      borderRadius: 0,
      boxShadow: 'none',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      color: '#111827',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827',
    }),
    input: (provided) => ({
      ...provided,
      color: '#111827',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: 'oklch(98.5% .002 247.839)',
      // color: '#111827',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#e0e7ff' : '#fff',
      color: '#111827',
    }),

    // Dark mode
    ...(typeof window !== 'undefined' &&
      document.documentElement.classList.contains('dark')
      ? {
        control: (provided, state) => ({
          ...provided,
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: `2px solid ${state.isFocused ? '#3b82f6' : '#4b5563'}`, // blue-500 / gray-600
          borderRadius: 0,
          boxShadow: 'none',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
          color: '#fff',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#fff',
        }),
        input: (provided) => ({
          ...provided,
          color: '#fff',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#9ca3af',
        }),
        menu: (provided) => ({
            ...provided,
            background: '#1e2939', 
            border: "none", 
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? '#374151' : '#1f2937',
          color: '#f9fafb',
        }),
      }
      : {}),
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
      <div className="relative z-0 w-full mb-5 group">
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