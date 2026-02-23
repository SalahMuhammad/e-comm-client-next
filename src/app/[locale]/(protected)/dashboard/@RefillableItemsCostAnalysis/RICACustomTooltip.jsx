const MultiPriceTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 min-w-[220px]">
            <p className="text-xs font-bold text-slate-400 uppercase mb-3 border-b pb-2">
                {new Date(label).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
            <div className="space-y-2">
                {payload.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                            ${entry.value.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiPriceTooltip
