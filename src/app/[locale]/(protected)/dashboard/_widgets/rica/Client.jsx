'use client';

import { useMemo, useState, useTransition } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import getRandomColor from '@/utils/getRandomColor';
import TimeLineRangeSlider from '@/components/dashboard/charts/TimeLineRangeSlider';
import CustomTooltip from './CustomTooltip';
import RICAFiltersForm from './FiltersForm';
import { useTranslations } from 'next-intl';
import { ChartBarSquareIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { getRICAData } from './actions';

export default function RICAClient({ itemTransformar, oreItems }) {
    const t = useTranslations('dashboard.widgets.rica');
    const [timeStart, setTimeStart] = useState(0);
    const [timeWindowSize, setTimeWindowSize] = useState(100);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [showNoDataAlert, setShowNoDataAlert] = useState(false);
    const [data, setData] = useState(null); // null = not yet generated; [] = generated but empty
    const [isPending, startTransition] = useTransition();

    const handleGenerate = ({ from, to, refilledItems, usedItems }) => {
        setShowNoDataAlert(false);
        startTransition(async () => {
            const params = `?from=${from || ''}&to=${to || ''}&refilled=${refilledItems.join(',')}&used=${usedItems.join(',')}`;
            const res = await getRICAData(params);
            const result = res?.data || [];
            setData(result);
            if (result.length === 0) {
                setShowNoDataAlert(true);
                // keep dialog open
            } else {
                setFiltersOpen(false);
            }
        });
    };

    const { chartData, itemNames } = useMemo(() => {
        if (!data?.length) return { chartData: [], itemNames: [] };
        const groupedByDate = data.reduce((acc, cur) => {
            if (!acc[cur.date]) acc[cur.date] = { date: cur.date };
            const key = `${cur.refilled_item_name}__values`;
            if (!acc[cur.date][key]) acc[cur.date][key] = [];
            acc[cur.date][key].push(cur.calculated_price);
            return acc;
        }, {});
        Object.values(groupedByDate).forEach(entry => {
            Object.keys(entry).forEach(key => {
                if (key.endsWith('__values')) {
                    const base = key.replace('__values', '');
                    entry[base] = entry[key].reduce((a, b) => a + b, 0) / entry[key].length;
                    delete entry[key];
                }
            });
        });
        const sorted = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
        const s = Math.floor((sorted.length * timeStart) / 100);
        const e = Math.floor((sorted.length * (timeStart + timeWindowSize)) / 100);
        return {
            chartData: sorted.slice(s, Math.max(s + 1, e)),
            itemNames: Array.from(new Set(data.map(d => d.refilled_item_name))),
        };
    }, [data, timeStart, timeWindowSize]);

    const priceStats = useMemo(() => {
        if (!data?.length) return [];
        return itemNames.map(name => {
            const prices = data.filter(d => d.refilled_item_name === name).map(d => d.calculated_price);
            return { name, avg: prices.reduce((a, b) => a + b, 0) / prices.length, max: Math.max(...prices) };
        }).sort((a, b) => b.avg - a.avg);
    }, [data, itemNames]);

    const hasData = data !== null && data.length > 0;
    const isEmptyResult = data !== null && data.length === 0;

    return (
        <div className="w-full h-full flex flex-col">
            {/* Widget header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-700/50 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 shadow-sm">
                        <ChartBarSquareIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('title')}</h3>
                </div>
                <button
                    onClick={() => setFiltersOpen(true)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors ring-1 ring-gray-200/50 dark:ring-gray-700/50 shadow-sm"
                    title={t('filter') || 'Filters'}
                >
                    <FunnelIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
            </div>

            {/* Controlled filter dialog */}
            <RICAFiltersForm
                isOpen={filtersOpen}
                onOpenChange={(open) => { setFiltersOpen(open); if (!open) setShowNoDataAlert(false); }}
                itemTransformar={itemTransformar}
                oreItems={oreItems}
                showNoDataAlert={showNoDataAlert}
                onDismissAlert={() => setShowNoDataAlert(false)}
                onGenerate={handleGenerate}
                isPending={isPending}
            />

            <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {/* Loading shimmer */}
                {isPending && !hasData && (
                    <div className="flex items-center justify-center h-full min-h-[200px]">
                        <div className="h-8 w-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                )}

                {/* Waiting for first generate */}
                {!isPending && data === null && (
                    <div className="flex w-full h-full min-h-[300px] flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4 shadow-sm">
                        <div className="w-16 h-16 mb-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-inner">
                            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {t('filtersTitle') || 'No Filters Applied'}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                            {t('applyFiltersHint')}
                        </p>
                        <button
                            onClick={() => setFiltersOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                        >
                            <FunnelIcon className="w-5 h-5 text-blue-100" />
                            {t('openFilters') || 'Open Filters'}
                        </button>
                    </div>
                )}

                {/* Empty result */}
                {!isPending && isEmptyResult && (
                    <div className="flex w-full h-full min-h-[300px] flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4 shadow-sm">
                        <div className="w-16 h-16 mb-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30 shadow-inner">
                            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {t('noDataTitle') || 'No Results Found'}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                            {t('noData')}
                        </p>
                        <button
                            onClick={() => { setFiltersOpen(true); setShowNoDataAlert(true); }}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
                        >
                            <FunnelIcon className="w-5 h-5 text-blue-100" />
                            {t('openFilters') || 'Open Filters'}
                        </button>
                    </div>
                )}

                {/* Chart */}
                {hasData && (<>
                    <div className="h-[320px] w-full mb-6 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    tickFormatter={(t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px' }} />
                                {itemNames.map((name, i) => (
                                    <Line key={name} name={name} type="monotone" dataKey={name}
                                        stroke={getRandomColor(i)} strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} connectNulls />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6">
                        <div className="flex justify-between items-center mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{t('historicalRange')}</span>
                            <span>{Math.round(timeWindowSize)}% {t('window')}</span>
                        </div>
                        <div className="space-y-5">
                            <TimeLineRangeSlider value={timeStart} timeWindowSize={timeWindowSize}
                                min={0} max={100 - timeWindowSize}
                                onChange={(e) => setTimeStart(Number(e.target.value))}
                                showProgress progressStart={timeStart} progressEnd={timeStart + timeWindowSize} />
                            <TimeLineRangeSlider timeWindowSize={timeWindowSize} min={5} max={100}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setTimeWindowSize(Math.max(10, Math.min(100, val)));
                                    setTimeStart(prev => Math.min(prev, 100 - val));
                                }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {priceStats.slice(0, 4).map((stat, i) => (
                            <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-blue-600 shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">{stat.name}</span>
                                <div className="flex items-end gap-1.5 mt-1">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">${stat.avg.toFixed(2)}</span>
                                    <span className="text-xs text-slate-400 mb-0.5">{t('avgPrice')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>)}
            </div>
        </div>
    );
}
