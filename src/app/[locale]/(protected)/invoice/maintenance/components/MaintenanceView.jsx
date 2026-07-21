'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
    WrenchScrewdriverIcon,
    PencilSquareIcon,
    ArrowLeftIcon,
    CalendarIcon,
    UserIcon,
    CubeIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StatusBadge } from './utility';
import AuditInfo from '@/components/AuditInfo_old_name_tooltip3';
import AuditInfoAsToolTip from '@/components/AuditInfoAsToolTip';
import { apiRequest } from '@/utils/api';
import { deleteTransaction, maintenanceRedirect } from '../actions';
import NotifyV2 from '@/components/sonner_actions/NotifyV2';

// ─── Field display helper ──────────────────────────────────────────────────────
const InfoField = ({ icon: Icon, label, value, mono = false }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{label}</span>
        </div>
        <p className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${mono ? 'font-mono' : ''}`}>
            {value || '—'}
        </p>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const MaintenanceView = ({ data }) => {
    const router = useRouter();
    const t = useTranslations('maintenance.view');
    const [closing, setClosing] = useState(false);


    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <WrenchScrewdriverIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">{t('notFound')}</p>
                <button
                    onClick={() => router.push('/maintenance')}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('backToList')}
                </button>
            </div>
        );
    }

    const isOpen = !data.date_out;

    // ── Quick status transition (optional convenience action) ──────────────────
    const handleQuickClose = async () => {
        setClosing(true);
        try {
            const res = await apiRequest(`/api/maintenance/${data._hashed_id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date_out: new Date().toISOString().split('T')[0],
                    // parts: data.parts.map((p) => ({ spare_part: p.spare_part, quantity: p.quantity })),
                }),
            });
        if (!res.ok) throw new Error();
            toast.success(t('closedSuccess'));
            router.refresh();
        } catch {
            toast.error(t('closeError'));
        } finally {
            setClosing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">

            {/* ── Top bar ── */}
            <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/invoice/maintenance/list')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        {t('backToList')}
                    </button>

                    <div className="flex items-center gap-8">
                        <NotifyV2
                            variant='action'
                            action={() => deleteTransaction(data._hashed_id)}
                            onResponse={(result, error) => { if (!error) maintenanceRedirect() }}
                        />
                        {isOpen && (
                            <button
                                onClick={handleQuickClose}
                                disabled={closing}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                {closing ? t('closing') : t('markClosed')}
                            </button>
                        )}
                        <button
                            onClick={() => router.push(`/invoice/maintenance/form/${data._hashed_id}`)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                            {t('edit')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">

                {/* ── Header card ── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {t('recordNumber', { id: data._hashed_id })}
                                    </h1>
                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                                        {data.serial_number}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{data.item_name}</p>
                            </div>
                        </div>
                        <StatusBadge status={data.status} large />
                    </div>

                    {/* Info grid */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                        <InfoField icon={UserIcon} label={t('client')} value={data._client_name} />
                        <InfoField icon={CubeIcon} label={t('item')} value={data._item_name} />
                        <InfoField label={t('serialNumber')} value={data.serial_number} mono />
                        <InfoField icon={UserIcon} label={t('handledBy')} value={data._maintained_by_name} />
                        <InfoField icon={CalendarIcon} label={t('dateIn')} value={data.date_in} />
                        <InfoField icon={CalendarIcon} label={t('maintenanceDate')} value={data.maintenance_date} />
                        <InfoField icon={CalendarIcon} label={t('dateOut')} value={data.date_out} />
                        <InfoField icon={ClockIcon} label={t('duration')} value={
                            data.date_out
                                ? `${Math.max(1, Math.round((new Date(data.date_out) - new Date(data.date_in)) / 86400000))} ${t('days')}`
                                : t('stillOpen')
                        } />
                    </div>
                </div>

                {/* ── Malfunctions ── */}
                {data.malfunctions && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <DocumentTextIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('malfunctions')}</h2>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {data.malfunctions}
                        </p>
                    </div>
                )}

                {/* ── Spare parts ── */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('spareParts')}</h2>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {data.parts?.length || 0}
                        </span>
                    </div>

                    {data.parts && data.parts.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {data.parts.map((part, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {part._spare_part_name || `#${part.spare_part}`}
                                            </p>
                                            <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-900/40 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                × {part.quantity}
                                            </span>

                                        </div>
                                    </div>
                                    {/* <p className="text-xs text-gray-400 dark:text-gray-500"> */}
                                        <AuditInfoAsToolTip data={part?._audit_info} />
                                    {/* </p> */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500">
                            <WrenchScrewdriverIcon className="w-8 h-8 mb-2 opacity-40" />
                            <p className="text-sm">{t('noParts')}</p>
                        </div>
                    )}
                </div>

                {/* ── Notes ── */}
                {data.notes && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <DocumentTextIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('notes')}</h2>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {data.notes}
                        </p>
                    </div>
                )}

                <AuditInfo {...data._audit_info} flex_direction='flex-row' />
            </div>
        </div>
    );
};

export default MaintenanceView;
