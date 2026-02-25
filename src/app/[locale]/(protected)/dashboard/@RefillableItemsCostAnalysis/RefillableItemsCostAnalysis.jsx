'use client';

import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useSearchParams } from 'next/navigation';
import getRandomColor from '../../../../../utils/getRandomColor';
import TimeLineRangeSlider from '../../../../../components/dashboard/charts/TimeLineRangeSlider';
import MultiPriceTooltip from './RICACustomTooltip';
import RICAFiltersForm from './RICAFiltersForm';


export default function RefillableCostAnalysis({ data = [], itemTransformar, oreItems }) {
    const searchParams = useSearchParams();
    const [timeStart, setTimeStart] = useState(0);
    const [timeWindowSize, setTimeWindowSize] = useState(100);
   

    const { chartData, itemNames } = useMemo(() => {
        if (!data.length) return { chartData: [], itemNames: [] };

        // Group by Date
        const groupedByDate = data.reduce((acc, current) => {
            const date = current.date;
            if (!acc[date]) acc[date] = { date };

            const key = `${current.refilled_item_name}__values`;
            if (!acc[date][key]) {
                acc[date][key] = [];
            }

            acc[date][key].push(current.calculated_price);

            return acc;
        }, {});

        // get item calculated_prices avg
        Object.values(groupedByDate).forEach(entry => {
            Object.keys(entry).forEach(key => {
                if (key.endsWith('__values')) {
                    const baseName = key.replace('__values', '');
                    const values = entry[key];
                    entry[baseName] = values.reduce((a, b) => a + b, 0) / values.length; // avg
                    delete entry[key];
                }
            });
        });

        const sortedDates = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Slice based on timeline sliders
        const startIdx = Math.floor((sortedDates.length * timeStart) / 100);
        const endIdx = Math.floor((sortedDates.length * (timeStart + timeWindowSize)) / 100);
        const slicedData = sortedDates.slice(startIdx, Math.max(startIdx + 1, endIdx));

        // Get unique item names present in the current data set
        const names = Array.from(new Set(data.map(d => d.refilled_item_name)));

        return { chartData: slicedData, itemNames: names };
    }, [data, timeStart, timeWindowSize]);

    // Comparison Stats
    const priceStats = useMemo(() => {
        if (!data.length) return [];
        return itemNames.map(name => {
            const prices = data.filter(d => d.refilled_item_name === name).map(d => d.calculated_price);
            return {
                name,
                avg: prices.reduce((a, b) => a + b, 0) / prices.length,
                max: Math.max(...prices)
            };
        }).sort((a, b) => b.avg - a.avg);
    }, [data, itemNames]);


    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">RItems Unit Price Comparison</h2>
                <p className="text-sm text-slate-500">Comparing calculated price trends across RItems</p>
            </div>

            <RICAFiltersForm 
                searchParams={searchParams} 
                itemTransformar={itemTransformar} 
                oreItems={oreItems} 
            />

            {((searchParams.get('RCA-refilled') ||
                searchParams.get('RCA-used') ||
                searchParams.get('RCA-date-range-from') ||
                searchParams.get('RCA-date-range-to')) && 
                data?.length > 0) && (
                    <>
                        {/* Line Chart */}
                        <div className="h-[400px] w-full mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        tickFormatter={(t) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip content={<MultiPriceTooltip />} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                                    {itemNames.map((name, index) => (
                                        <Line
                                            key={name}
                                            name={name}
                                            type="monotone"
                                            dataKey={name}
                                            stroke={getRandomColor(index)}
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                            activeDot={{ r: 6 }}
                                            connectNulls // Handles dates where some items don't have data
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Timeline Zoom (From your previous logic) */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl mb-8">
                            <div className="flex justify-between items-center mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Historical Range</span>
                                <span>{Math.round(timeWindowSize)}% Window</span>
                            </div>
                            <div className="space-y-6">
                                <TimeLineRangeSlider
                                    value={timeStart}
                                    timeWindowSize={timeWindowSize}
                                    min={0}
                                    max={100 - timeWindowSize}
                                    onChange={(e) => setTimeStart(Number(e.target.value))}
                                    showProgress={true}
                                    progressStart={timeStart}
                                    progressEnd={timeStart + timeWindowSize}
                                />
                                <TimeLineRangeSlider
                                    timeWindowSize={timeWindowSize}
                                    min={5} max={100}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setTimeWindowSize(Math.max(10, Math.min(100, val)));
                                        setTimeStart(prev => Math.min(prev, 100 - val));
                                    }}
                                />
                            </div>
                        </div>

                        {/* Comparison Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {priceStats.slice(0, 4).map((stat, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border-l-4 border-l-indigo-500 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">{stat.name}</span>
                                    <div className="flex items-end gap-2 mt-1">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">${stat.avg.toFixed(2)}</span>
                                        <span className="text-xs text-slate-400 mb-1">avg price</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
        </div>
    );
}
