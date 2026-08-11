'use client';

import { httpDelete, httpRequest } from '@/utils/HTTPMethods';
import React, { useState, useEffect, useCallback } from 'react';

export default function RequestLogManager() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [urlSearch, setUrlSearch] = useState('');
    const [activeLog, setActiveLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Logs List
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const query = selectedMethod ? `?method=${selectedMethod.toLowerCase()}` : '';
            const res = await httpRequest(`/api/services/logs/${query}`)
            if (!res.ok) throw new Error('Failed to fetch logs');
            const data = await res.data;
            setLogs(data);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [selectedMethod]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // Fetch Single Log Details
    const handleViewLog = async (method, filename) => {
        try {
            const res = await httpRequest(`/api/services/logs/${method.toLowerCase()}/${filename}/`);
            if (!res.ok) throw new Error('Failed to load log details');
            const data = await res.data;
            setActiveLog(data);
            setIsModalOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    // Delete Single Log
    const handleDeleteLog = async (method, filename, e) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

        try {
            const res = await httpDelete(`/api/services/logs/${method.toLowerCase()}/${filename}/`, {
                method: 'DELETE',
            });
            if (!res.ok && res.status !== 204) throw new Error('Failed to delete log file');
            setLogs(logs.filter((log) => log.filename !== filename));
        } catch (err) {
            alert(err.message);
        }
    };

    // Bulk Delete
    const handleBulkDelete = async () => {
        const confirmMsg = urlSearch
            ? `Delete all logs matching URL query "${urlSearch}"?`
            : selectedMethod
                ? `Delete all logs under method ${selectedMethod.toUpperCase()}?`
                : 'WARNING: This will delete ALL logs! Are you sure?';

        if (!confirm(confirmMsg)) return;

        try {
            let endpoint = '/api/services/logs/?';
            const params = new URLSearchParams();
            if (urlSearch) params.append('url_contains', urlSearch);
            if (selectedMethod) params.append('method', selectedMethod);

            const res = await httpDelete(endpoint + params.toString(), {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Bulk deletion failed');

            const result = await res.data;
            alert(`Success! Deleted ${result.deleted_count} logs.`);
            fetchLogs();
        } catch (err) {
            alert(err.message);
        }
    };

    // Method Badge Color Utility
    const getMethodBadgeColor = (method) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'POST': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
            case 'PUT':
            case 'PATCH': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'DELETE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Request System Logs</h2>
                    <p className="text-sm text-slate-400 mt-1">Monitor, inspect, and manage API mutation lifecycles.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Method Filter Dropdown */}
                    <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Methods</option>
                        <option value="get">GET</option>
                        <option value="post">POST</option>
                        <option value="put">PUT</option>
                        <option value="patch">PATCH</option>
                        <option value="delete">DELETE</option>
                    </select>

                    {/* URL Search Input */}
                    <input
                        type="text"
                        placeholder="Filter by URL path..."
                        value={urlSearch}
                        onChange={(e) => setUrlSearch(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:w-64"
                    />

                    {/* Bulk Delete Action */}
                    <button
                        onClick={handleBulkDelete}
                        className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        Bulk Delete Filtered
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
                    {error}
                </div>
            )}

            {/* Logs Table / List */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                            <th className="p-4">Method</th>
                            <th className="p-4">Filename / Timestamp</th>
                            <th className="p-4">Size</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">Loading system logs...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">No logs found matching criteria.</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.filename}
                                    onClick={() => handleViewLog(log.method, log.filename)}
                                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                                >
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getMethodBadgeColor(log.method)}`}>
                                            {log.method}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-slate-300 text-xs">{log.filename}</td>
                                    <td className="p-4 text-slate-400 text-xs">{(log.size_bytes / 1024).toFixed(2)} KB</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={(e) => handleDeleteLog(log.method, log.filename, e)}
                                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-500/10 transition-colors"
                                            title="Delete Log"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Detailed JSON Inspection */}
            {isModalOpen && activeLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/40">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Log Inspection</h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{activeLog.url}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950/50">
                            <pre className="text-indigo-300 whitespace-pre-wrap break-all">
                                {JSON.stringify(activeLog, null, 2)}
                            </pre>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/40 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
