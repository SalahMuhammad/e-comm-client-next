'use client';

import React from 'react';

/**
 * StatCard — reusable metric card for KPI widgets.
 * Props:
 *  - title: string
 *  - value: string | number
 *  - subtitle: string (optional)
 *  - icon: ReactNode
 *  - gradient: Tailwind gradient classes (e.g. "from-emerald-500 to-teal-600")
 *  - isLoading: bool
 */
export default function StatCard({ title, value, subtitle, icon, gradient = 'from-blue-500 to-indigo-600', isLoading = false }) {
    return (
        <div className="relative flex flex-col h-full w-full overflow-hidden rounded-xl">
            {/* Background gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 dark:opacity-20 rounded-xl`} />

            <div className="relative flex flex-col h-full p-5 gap-3">
                {/* Top row: icon + title */}
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                        {title}
                    </p>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <span className="text-white w-5 h-5">
                            {icon}
                        </span>
                    </div>
                </div>

                {/* Value */}
                <div className="flex-1 flex flex-col justify-center">
                    {isLoading ? (
                        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                            {value ?? '—'}
                        </p>
                    )}
                    {subtitle && !isLoading && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Decorative bottom accent bar */}
                <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${gradient} opacity-60`} />
            </div>
        </div>
    );
}
