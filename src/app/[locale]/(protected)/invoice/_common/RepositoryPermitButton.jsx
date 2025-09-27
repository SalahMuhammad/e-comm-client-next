'use client'

import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { changeRepositoryPermit } from './actions';
import { useTranslations } from 'next-intl';

function RepositoryPermitButton({ id, type, permitValue, width='120px' }) {
    const handleResponse = useGenericResponseHandler()
    const [permit, setpermit] = useState(permitValue);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("permitButton")

    const toggleRepositoryPermit = async () => {
        setIsLoading(true);
        const res = await changeRepositoryPermit(id, type)
        setIsLoading(false);
        
        if (handleResponse(res)) return;
        if (res.status === 200) setpermit(prev => !prev);
    };

    return (
        <button
            onClick={toggleRepositoryPermit}
            disabled={isLoading}
            aria-pressed={permit}
            title={permit ? t("delivered") : t("notDelivered")}
            style={{ width }}
            className={`
                relative group flex items-center justify-center
                min-w-[40px] h-10 md:h-9
                px-3 md:px-4 py-2
                rounded-full
                transition-all duration-300 ease-out
                ${permit 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                ${permit 
                    ? 'focus-visible:ring-emerald-500/50' 
                    : 'focus-visible:ring-red-500/50'
                }
            `}
        >
            {/* Loading spinner */}
            {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            
            {/* Icon */}
            {!isLoading && (
                <span className="flex items-center gap-2">
                    <span className="relative">
                        {permit ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5 transition-all duration-300 scale-100 group-hover:scale-0" />
                                <CheckIcon className="absolute inset-0 w-5 h-5 transition-all duration-300 scale-0 group-hover:scale-100" />
                            </>
                        ) : (
                            <>
                                <XCircleIcon className="w-5 h-5 transition-all duration-300 scale-100 group-hover:scale-0" />
                                <XMarkIcon className="absolute inset-0 w-5 h-5 transition-all duration-300 scale-0 group-hover:scale-100" />
                            </>
                        )}
                    </span>
                    <span className="text-sm font-medium">
                        {permit ? t('delivered') : t("notDelivered")}
                    </span>
                </span>
            )}
        </button>
    );
}

export default RepositoryPermitButton
