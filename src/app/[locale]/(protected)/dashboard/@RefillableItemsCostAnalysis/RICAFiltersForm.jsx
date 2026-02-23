'use client';

import { DateInput, StaticOptionsInput } from '@/components/inputs'
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react'


function RICAFiltersForm({ searchParams, itemTransformar, oreItems }) {
    const [refilledItems, setRefilledItems] = useState(searchParams.get('RCA-refilled')?.split(',') || []);
    const [usedItems, setUsedItems] = useState(searchParams.get('RCA-used')?.split(',') || []);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    const handleApplyFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        const formData = new FormData(e.currentTarget);
        const from = formData.get('RCA-date-range-from');
        const to = formData.get('RCA-date-range-to');

        if (from) params.set('RCA-date-range-from', from);
        else params.delete('RCA-date-range-from')

        if (to) params.set('RCA-date-range-to', to);
        else params.delete('RCA-date-range-to')

        if (refilledItems.length) params.set('RCA-refilled', refilledItems.join(','));
        else params.delete('RCA-refilled');

        if (usedItems.length) params.set('RCA-used', usedItems.join(','));
        else params.delete('RCA-used');

        startTransition(() => {
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <form onSubmit={handleApplyFilters} className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-8">
            {/* <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"> */}
            <div className="grid grid-cols-2 gap-4 items-end">

                {/* Dates */}
                <DateInput
                    name="RCA-date-range-from"
                    label="From Date"
                    defaultValue={searchParams.get('data-range-from') || ''}
                />
                <DateInput
                    name="RCA-date-range-to"
                    label="To Date"
                    defaultValue={searchParams.get('data-range-to') || ''}
                />

                {/* Multi-Selects */}
                <StaticOptionsInput
                    label="Refilled Items"
                    options={itemTransformar?.results.map(i => ({ value: i.item, label: i.empty }))}
                    isMulti
                    onChange={(vals) => setRefilledItems(vals.map(v => v.value))}
                    defaultValue={itemTransformar?.results.filter(opt => refilledItems.includes(opt.item)).map(i => ({ value: i.item, label: i.empty }))}
                />

                <StaticOptionsInput
                    label="Used Items"
                    options={oreItems?.results.map(i => ({ value: i.item, label: i.item_name }))}
                    isMulti={true}
                    onChange={(vals) => setUsedItems(vals.map(v => v.value))}
                    defaultValue={oreItems?.results.filter(opt => usedItems.includes(opt.item)).map(i => ({ value: i.item, label: i.item_name }))}
                />

                {/* Action Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-[52px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    {isPending ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "Generate"
                    )}
                </button>
            </div>
        </form>
    )
}

export default RICAFiltersForm
