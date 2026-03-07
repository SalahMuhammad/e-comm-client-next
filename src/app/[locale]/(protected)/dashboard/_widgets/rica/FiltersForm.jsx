'use client';

import { DateInput, StaticOptionsInput } from '@/components/inputs';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function RICAFiltersForm({
    isOpen,
    onOpenChange,
    itemTransformar,
    oreItems,
    showNoDataAlert = false,
    onDismissAlert,
    onGenerate,
    isPending = false,
}) {
    const t = useTranslations('dashboard.widgets.rica');
    const [refilledItems, setRefilledItems] = useState([]);
    const [usedItems, setUsedItems] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate?.({ from, to, refilledItems, usedItems });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg min-h-[200px] flex flex-col max-h-[90vh] overflow-visible z-[100] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                        <Dialog.Title className="text-lg font-bold text-slate-800 dark:text-white">
                            {t('filtersTitle') || 'Filters'}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                <XMarkIcon className="w-5 h-5" />
                                <span className="sr-only">Close</span>
                            </button>
                        </Dialog.Close>
                    </div>

                    {showNoDataAlert && (
                        <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700/50 px-4 py-3.5 shadow-sm">
                            <div className="shrink-0 mt-0.5 p-1 rounded-full bg-amber-100 dark:bg-amber-800/40">
                                <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 leading-snug">
                                    {t('noDataTitle') || 'No results found'}
                                </p>
                                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5 leading-relaxed">
                                    {t('noDataHint') || 'No data matched your selected filters. Try adjusting the date range or item selection.'}
                                </p>
                            </div>
                            <button onClick={onDismissAlert} className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors" aria-label="Dismiss">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
                            <DateInput
                                name="RCA-date-range-from"
                                label={t('fromDate')}
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                            />
                            <DateInput
                                name="RCA-date-range-to"
                                label={t('toDate')}
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                            />
                            <StaticOptionsInput
                                label={t('refilledItems')}
                                options={itemTransformar?.results?.map(i => ({ value: i.item, label: i.empty }))}
                                isMulti
                                defaultValue={undefined}
                                onChange={(vals) => setRefilledItems(vals?.map(v => v.value) || [])}
                            />
                            <StaticOptionsInput
                                label={t('usedItems')}
                                options={oreItems?.results?.map(i => ({ value: i.item, label: i.item_name }))}
                                isMulti
                                defaultValue={undefined}
                                onChange={(vals) => setUsedItems(vals?.map(v => v.value) || [])}
                            />
                        </div>
                        <div className="mt-2as pt-4">
                            <button
                                type="submit" disabled={isPending}
                                className="w-full h-[48px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
                            >
                                {isPending ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('generate')}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default RICAFiltersForm;
