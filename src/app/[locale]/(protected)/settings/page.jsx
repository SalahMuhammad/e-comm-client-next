'use client'

import { apiRequest } from '@/utils/api';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DatabaseManager from './_common/DatabaseManager';

function page() {
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('settings');


    // Function to handle file downloads
    const handleDownload = async (url) => {
        setIsLoading(true);

        try {
            const response = await apiRequest(url);

            if (response.ok) {
                alert('done...')
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Database Section */}
                <DatabaseManager />

                {/* Warehouse Section */}
                <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('warehouse.title')}</h1>
                    <button
                        onClick={() => handleDownload(`api/services/create-items-as-xlsx/`)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                                 dark:bg-indigo-700 dark:hover:bg-indigo-800
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                 dark:focus:ring-offset-gray-800
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        disabled={isLoading}
                    >
                        {isLoading ? t('database.processing') : t('warehouse.createItemsXlsx')}
                    </button>
                </div>

                {/* Browse Section */}
                <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('browse.title')}</h1>
                    <Link
                        href={'/settings/media'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                                 dark:bg-indigo-700 dark:hover:bg-indigo-800
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                 dark:focus:ring-offset-gray-800
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                        {t('browse.media')}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page