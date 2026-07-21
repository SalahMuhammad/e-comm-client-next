'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import MaintenanceCard from './MaintenanceCard';
import { WrenchScrewdriverIcon, PlusIcon } from '@heroicons/react/24/outline';


// ─── Main list component ───────────────────────────────────────────────────────
const MaintenanceList = ({ initialData = { results: [], count: 0 }, pageSize = 20 }) => {
    const router        = useRouter();
    const t             = useTranslations('maintenance.list');

    const records = initialData.results;
    const [loading, setLoading] = useState(false);
    

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
            {/* ── List ── */}
            <div className="max-w-7xl mx-auto px-4 pt-6 space-y-3">
                {loading ? (
                    /* Skeleton */
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                                </div>
                                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            </div>
                        </div>
                    ))
                ) : records?.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
                        <WrenchScrewdriverIcon className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">{t('empty')}</p>
                        <p className="text-sm mt-1">{t('emptyHint')}</p>
                        <button
                            onClick={() => router.push('/invoice/maintenance/form')}
                            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200"
                        >
                            <PlusIcon className="w-4 h-4" />
                            {t('new')}
                        </button>
                    </div>
                ) : (
                    records?.map((record) => (
                        <MaintenanceCard
                            key={record._hashed_id}
                            record={record}
                            onClick={() => router.push(`/invoice/maintenance/view/${record._hashed_id}`)}
                            onEdit={() => router.push(`/invoice/maintenance/form/${record._hashed_id}`)}
                            t={t}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MaintenanceList;

// ─── Individual card ───────────────────────────────────────────────────────────

