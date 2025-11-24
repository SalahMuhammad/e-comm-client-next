'use client'

import { apiRequest } from '@/utils/api';
import Link from 'next/link';
import { useState } from 'react';


function page() {
    const [isLoading, setIsLoading] = useState(false);

    
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Database Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Management</h1>
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                        <button
                            onClick={() => handleDownload(`api/services/create-db-backup/`)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                     text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Creatae Database Backup'}
                        </button>
                        <button
                            onClick={() => handleDownload(`api/services/create-db-backup/?data-only=1`)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                     text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Creatae Database Backup (Data Only)'}
                        </button>
                    </div>
                </div>

                {/* Warehouse Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Warehouse Management</h1>
                    <button
                        onClick={() => handleDownload(`api/services/create-items-as-xlsx/`)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Create Items list as xlsx'}
                    </button>
                </div>

                {/* Warehouse Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse</h1>
                    <Link
                        href={'/settings/media'}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent 
                                 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        disabled={isLoading}
                    >
                        Media
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page