// components/FilterButtons.jsx

import React from 'react';
// ⚠️ Import the correct hooks for Next.js 13+ App Router
import { useRouter, useSearchParams } from 'next/navigation';

// Assume statusMap is defined elsewhere, e.g.:
// const statusMap = {
//     '1': { label: 'Pending' },
//     '2': { label: 'In Progress' },
//     '3': { label: 'Review' },
//     '4': { label: 'Complete' },
// };

function FilterButtons({ statusMap }) {
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
        <div className="flex gap-3 mb-6 flex-wrap">
            {['all', '1', '2', '3', '4'].map(status => {
                const label = status === 'all' ? 'All' : statusMap[status].label;
                return (
                    <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        // Compare against currentStatus from the URL
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

// ⚠️ Important: Hooks like useRouter and useSearchParams only work in Client Components.
// You must include the following directive at the top of the file:
// 'use client'; 
// (or ensure this component is rendered within a client component)

export default FilterButtons;