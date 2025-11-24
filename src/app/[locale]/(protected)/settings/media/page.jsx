'use client'

import React, { useState, useMemo, useEffect } from 'react';
import getMediaFiles from './actions';


const BASE_URL = process.env.API_URL || 'http://192.168.1.254:8000';
const MediaFileBrowser = () => {
    const [res, setRes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const data = res.data


    useEffect(() => {
        async function getData() {
            const res = await getMediaFiles()
            setRes(res)
        }

        getData()
    }, [])

    const getFileIcon = (fileName) => {
        if (fileName.endsWith('.sql')) return '🗄️';
        if (fileName.endsWith('.xlsx')) return '📊';
        if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
        if (fileName.endsWith('.svg')) return '📐';
        return '📄';
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const browserViewableTypes = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf'];
    const downloadableTypes = ['.sql', '.xlsx', '.json', '.csv', '.txt'];

    const canBrowse = (fileName) => {
        return browserViewableTypes.some(type => fileName.toLowerCase().endsWith(type));
    };

    const canDownload = (fileName) => {
        return downloadableTypes.some(type => fileName.toLowerCase().endsWith(type));
    };

    const handleBrowse = (fileName) => {
        window.open(`${BASE_URL}/${fileName}`, '_blank');
    };

    const handleDownload = (fileName) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/${fileName}`;
        link.download = fileName.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredAndSorted = useMemo(() => {
        let results = [];

        if (data) {
            Object.entries(data).forEach(([category, files]) => {
                if (selectedCategory !== 'all' && category !== selectedCategory) return;

                files.forEach(file => {
                    const fileName = file.file_name
                    if (searchTerm === '' || fileName.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push({ ...file, category, fileName });
                    }
                });
            });

            if (sortBy === 'name') {
                results.sort((a, b) => a.fileName.localeCompare(b.fileName));
            } else if (sortBy === 'size') {
                results.sort((a, b) => b.size - a.size);
            } else if (sortBy === 'category') {
                results.sort((a, b) => a.category.localeCompare(b.category));
            }
        }

        return results;
    }, [searchTerm, selectedCategory, sortBy]);

    const stats = {
        total: data && Object.values(data).reduce((sum, files) => sum + files.length, 0),
        filtered: filteredAndSorted.length,
        totalSize: data && Object.values(data).reduce((sum, files) => sum + files.reduce((s, f) => s + f.size, 0), 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Media File Browser</h1>
                    <p className="text-slate-400">Browse and filter your media files</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Total Files</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Filtered Results</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.filtered}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm">Total Size</p>
                        <p className="text-2xl font-bold text-green-400">{formatFileSize(stats.totalSize)}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-slate-700 rounded-lg p-6 mb-8 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-3 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="all">All Categories</option>
                                {data && Object.keys(data).map(cat => (
                                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ').replace('-', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="name">File Name</option>
                                <option value="size">File Size</option>
                                <option value="category">Category</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-2">
                    {filteredAndSorted.length === 0 ? (
                        <div className="bg-slate-700 rounded-lg p-12 text-center">
                            <p className="text-slate-400 text-lg">No files found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="bg-slate-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-800 border-b border-slate-600">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">File</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Category</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Size</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-600">
                                        {filteredAndSorted.map((file, idx) => (
                                            <tr key={idx} className="hover:bg-slate-600 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-lg">{getFileIcon(file.file_name)}</span>
                                                        <span className="text-white font-medium truncate">{file.fileName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {categoryIcons[file.category]}
                                                        <span className="text-slate-300 text-sm">{file.category.replace(/_/g, ' ').replace('-', ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-slate-300 font-medium">{formatFileSize(file.size)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {canBrowse(file.fileName) && (
                                                            <button
                                                                onClick={() => handleBrowse(file.file_name)}
                                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-1"
                                                                title="View in browser"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View
                                                            </button>
                                                        )}
                                                        {canDownload(file.fileName) && (
                                                            <button
                                                                onClick={() => handleDownload(file.file_name)}
                                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-1"
                                                                title="Download file"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                                Download
                                                            </button>
                                                        )}
                                                        {!canBrowse(file.fileName) && !canDownload(file.fileName) && (
                                                            <span className="text-slate-400 text-sm">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-400 text-sm">
                    <p>Showing {filteredAndSorted.length} of {stats.total} files</p>
                </div>
            </div>
        </div>
    );
};

export default MediaFileBrowser;


const categoryIcons = {
    "items-images": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    "expenses-docs": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    "items_as_xlsx": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
    "payment_proofs": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    "logo": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
        </svg>
    ),
    "db_backup": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
    ),
    "tmp": (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3H4v2h16V7h-3z" />
        </svg>
    )
};
