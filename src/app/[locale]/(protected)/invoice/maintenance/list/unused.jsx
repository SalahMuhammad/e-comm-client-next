const totalPages = Math.ceil(total / pageSize);

{/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="max-w-7xl mx-auto px-4 mt-8 flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('showing', { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, total), total })}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                        p === page
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            )}