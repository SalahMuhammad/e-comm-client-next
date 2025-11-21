'use client'

import { useEffect, useState } from "react";
import { useTranslations } from "use-intl"


function ToolTip2({ obj, className=""}) {
    const t = useTranslations('toolTip');
    const [mounted, setMounted] = useState(false);
    const [show, setShow] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={`relative inline-block ${className}`}>
            <p
                className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                <button type="button">
                    <svg className="w-4 h-4 ms-2 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                    {/* <span className="sr-only">Show information</span> */}
                </button>
            </p>
            {show && (
                <div
                    role="tooltip"
                    className="absolute px-1.5 py-1.5 right-0 mt-2 z-10 inline-block min-w-max text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-100 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                >
                    {obj.created_at == undefined ? null : (
                        <>
                            <span>{t('createdAt')}: <strong>{new Date(obj.created_at).toString().split(' GMT')[0]}</strong></span>
                            <hr />
                            <span>{t('createdBy')}: <strong>{obj.created_by}</strong></span>
                            <hr />
                            <span>{t('lastUpdatedAt')}: <strong>{new Date(obj.last_updated_at).toString().split(' GMT')[0]}</strong></span>
                            <hr />
                            <span>{t('lastUpdatedBy')}: <strong>{obj.last_updated_by}</strong></span>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ToolTip2
