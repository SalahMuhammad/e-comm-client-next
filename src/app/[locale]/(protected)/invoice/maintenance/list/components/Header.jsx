'use client';

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
    WrenchScrewdriverIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import { STATUS_CONFIG } from './utilit';


// ─── Status filter tabs ────────────────────────────────────────────────────────
const ALL_STATUSES = ['all', 'pending', 'in_progress', 'completed', 'cancelled'];

function Header() {
    const t             = useTranslations('maintenance.list');
    const searchParams  = useSearchParams();
    // const [total,   setTotal]   = useState(initialData.count);
    const [total,   setTotal]   = useState(11);

    const [search,      setSearch]      = useState(searchParams.get('q')       || '');
    const [statusFilter,setStatusFilter]= useState(searchParams.get('status')  || 'all');
    const [page,        setPage]        = useState(Number(searchParams.get('page') || 1));


    // ── Search handler (debounced reset to page 1) ─────────────────────────────
    const handleSearch = (val) => {
        setSearch(val);
        setPage(1);
    };

    const handleStatusFilter = (s) => {
        setStatusFilter(s);
        setPage(1);
    };


    return (
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                {/* Title */}
                <div className="flex items-center gap-2">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {total}
                    </span>
                </div>

                {/* Search + New button */}
                <div className="flex gap-3 flex-1 md:max-w-lg">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm"
                        />
                    </div>
                    <button
                        onClick={() => router.push('/maintenance/create')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                    >
                        <PlusIcon className="w-4 h-4" />
                        {t('new')}
                    </button>
                </div>
            </div>

            {/* ── Status filter tabs ── */}
            <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-1 overflow-x-auto">
                {ALL_STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const active = statusFilter === s;
                    return (
                        <button
                            key={s}
                            onClick={() => handleStatusFilter(s)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${active
                                    ? s === 'all'
                                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                                        : cfg.badge
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                            {s === 'all' ? t('all') : cfg.label}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default Header
