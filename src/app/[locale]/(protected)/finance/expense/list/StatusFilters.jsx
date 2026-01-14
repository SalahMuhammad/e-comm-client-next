'use client';

// components/FilterButtons.jsx

import React from 'react';
// ⚠️ Import the correct hooks for Next.js 13+ App Router
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

// Assume statusMap is defined elsewhere, e.g.:
// const statusMap = {
//     '1': { label: 'Pending' },
//     '2': { label: 'In Progress' },
//     '3': { label: 'Review' },
//     '4': { label: 'Complete' },
// };

function FilterButtons({ statusMap, allLabel = 'All', createLink }) {
    // 1. Get the router object
    const router = useRouter();
    // 2. Get the current search parameters object
    const searchParams = useSearchParams();

    // Get the current status from the 'status' query parameter. 
    // Defaults to 'all' if the parameter is not present.
    const currentStatus = searchParams.get('status') || 'all';

    // Function to handle the button click and update the URL query string
    const handleStatusChange = (newStatus) => {
        // Create a new URLSearchParams object from the current ones
        // This is a standard Web API object used to manage query parameters
        const params = new URLSearchParams(searchParams.toString());

        if (newStatus === 'all') {
            // Remove the 'status' parameter entirely if 'all' is selected
            params.delete('status');
        } else {
            // Set or update the 'status' parameter
            params.set('status', newStatus);
        }

        // Use router.push() to navigate and update the URL.
        // The path will be the current path, and the query string is built from the params object.
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            {/* Mobile: Dropdown Select */}
            <div className="lg:hidden w-full sm:w-auto">
                <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    <option value="all">{allLabel}</option>
                    {['1', '2', '3', '4'].map(status => (
                        <option key={status} value={status}>
                            {statusMap[status]?.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Desktop: Button Group */}
            <div className="hidden lg:flex gap-3 flex-wrap">
                {['all', '1', '2', '3', '4'].map(status => {
                    const label = status === 'all' ? allLabel : statusMap[status]?.label;
                    return (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentStatus === status
                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {createLink && (
                <Link
                    href={createLink.href}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>{createLink.label}</span>
                </Link>
            )}
        </div>
    );
}

// ⚠️ Important: Hooks like useRouter and useSearchParams only work in Client Components.
// You must include the following directive at the top of the file:
// 'use client'; 
// (or ensure this component is rendered within a client component)

export default FilterButtons;