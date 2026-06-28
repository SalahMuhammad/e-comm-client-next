'use client';

import { useActionState, useEffect, useState, useMemo } from 'react';
import { createUpdateMaintenance } from './actions';
import styles from '../invoice/form.module.css';   // reuse same CSS module
import { formatDateManual } from '@/utils/dateFormatter';
import { DynamicOptionsInput } from '@/components/inputs/index';
import { useTranslations } from 'next-intl';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import FieldError from '@/components/FieldError';
import { toast } from 'sonner';
import GenericFormShell from '@/components/GenericFormShell';
import { useRouter } from 'next/navigation';
import { NumberInput, DateInput } from '@/components/inputs';
import { getFormDefaultValue } from '@/utils/formDefaultValue';
import BarcodeScanner from '@/components/BarcodeScanner';
import BarcodeConfirmationModal from '@/components/BarcodeConfirmationModal';
import useBarcodeScanner from '@/components/custom hooks/useBarcodeScanner';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

// ─── Status badge helper ──────────────────────────────────────────────────────
const STATUS_STYLES = {
    pending:    'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300  border-amber-300  dark:border-amber-700',
    in_progress:'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300   border-blue-300   dark:border-blue-700',
    completed:  'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300  border-green-300  dark:border-green-700',
    cancelled:  'bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-300    border-red-300    dark:border-red-700',
};

// ─── Main component ───────────────────────────────────────────────────────────
const MaintenanceForm = ({ initialData = null }) => {
    const isEditMode = !!initialData?.id;

    const [parts, setParts]                     = useState(initialData?.parts || []);
    const [expandedParts, setExpandedParts]     = useState(new Set());
    const [selectedPart, setSelectedPart]       = useState(null);

    const handleGenericErrors   = useGenericResponseHandler();
    const [state, formAction, isPending] = useActionState(createUpdateMaintenance, { errors: {} });
    const tGlobal   = useTranslations();
    const t         = useTranslations('maintenance.form');
    const tScanner  = useTranslations('barcodeScanner');
    const router    = useRouter();

    // Barcode scanner for spare parts
    const {
        barcodeItem,
        showBarcodeConfirm,
        barcodeLoading,
        barcodeError,
        handleBarcodeScan,
        handleBarcodeConfirm,
        handleBarcodeCancel,
    } = useBarcodeScanner({
        tScanner,
        handleGenericErrors,
        onConfirm: (item) => addPart(item),
    });

    // ── Parts helpers ──────────────────────────────────────────────────────────
    const addPart = (item) => {
        const newPart = {
            id:             Date.now(),
            spare_part:     item.value  || '',
            spare_part_name:item.label  || '',
            quantity:       '1',
        };
        setParts((prev) => [...prev, newPart]);
    };

    const removePart = (partId) => {
        setParts((prev) => prev.filter((p) => p.id !== partId));
        setExpandedParts((prev) => { const s = new Set(prev); s.delete(partId); return s; });
    };

    const updatePart = (partId, field, value) => {
        setParts((prev) => prev.map((p) => p.id === partId ? { ...p, [field]: value } : p));
    };

    const togglePartExpanded = (partId) => {
        setExpandedParts((prev) => {
            const s = new Set(prev);
            s.has(partId) ? s.delete(partId) : s.add(partId);
            return s;
        });
    };

    // ── Options transformers ───────────────────────────────────────────────────
    const sparePartsLoadOptions = (res, callback) => {
        const options = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.name,
        }));
        callback(options);
    };

    // ── Error side-effect ──────────────────────────────────────────────────────
    useEffect(() => {
        if (state?.ok === false) {
            const partsError = state?.data?.parts;
            if (partsError && typeof partsError === 'object' && partsError.detail) {
                toast.error(partsError.detail);
            }
        }
    }, [state]);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            <GenericFormShell
                state={state}
                formAction={formAction}
                isPending={isPending}
                obj={initialData}
                t={tGlobal}
                customTitle={t('maintenance')}
                showIdField={false}
                onSuccess={(data) => {
                    if (data?.hashed_id) {
                        router.replace(`/maintenance/view/${data.hashed_id}`);
                    }
                }}
            >
                {/* Hidden fields */}
                {isEditMode && (
                    <>
                        <input type="hidden" name="id"        value={initialData.id} />
                        <input type="hidden" name="hashed_id" value={initialData.hashed_id} />
                    </>
                )}

                {/* ── Read-only ID badge (edit mode) ── */}
                {isEditMode && (
                    <NumberInput
                        placeholder={tGlobal('global.form.id')}
                        id="id_display"
                        value={initialData.id}
                        borderColor="border-green-500 dark:border-green-400 mt-2 mb-2"
                        labelColor="text-green-600 dark:text-green-400"
                        focusColor=""
                        focusLabelColor=""
                        name="_id_display"
                        readOnly
                        labelClass="z-20"
                    />
                )}

                {/* ── Status badge (edit mode only) ── */}
                {isEditMode && initialData?.status && (
                    <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[initialData.status] || STATUS_STYLES.pending}`}>
                            <WrenchScrewdriverIcon className="w-3.5 h-3.5" />
                            {t(`status.${initialData.status}`)}
                        </span>
                    </div>
                )}

                {/* ════════════════════════════════
                    CREATE-ONLY FIELDS
                ════════════════════════════════ */}
                {!isEditMode && (
                    <div className={styles.invoiceDetails}>
                        {/* Client */}
                        <div className={`mt-4 ${styles.formGroup}`}>
                            <DynamicOptionsInput
                                url="/api/buyer-supplier-party/?s="
                                label={t('client')}
                                name="client"
                                defaultValue={
                                    initialData?.client
                                        ? { value: initialData.client, label: initialData.client_name }
                                        : ''
                                }
                            />
                            <FieldError error={!state?.ok ? state?.data?.client : null} />
                        </div>

                        {/* Item */}
                        <div className={`mt-4 ${styles.formGroup}`}>
                            <DynamicOptionsInput
                                url="/api/items/?name="
                                label={t('item')}
                                name="item"
                                defaultValue={
                                    initialData?.item
                                        ? { value: initialData.item, label: initialData.item_name }
                                        : ''
                                }
                            />
                            <FieldError error={!state?.ok ? state?.data?.item : null} />
                        </div>

                        {/* Serial number */}
                        <div className={`mt-4 ${styles.formGroup}`}>
                            <label htmlFor="serial_number">{t('serialNumber')}</label>
                            <input
                                id="serial_number"
                                type="text"
                                name="serial_number"
                                defaultValue={getFormDefaultValue(state, initialData, 'serial_number', { defaultValue: '' })}
                                placeholder={t('serialNumber')}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            />
                            <FieldError error={!state?.ok ? state?.data?.serial_number : null} />
                        </div>

                        {/* Malfunctions */}
                        <div className={`mt-4 ${styles.formGroup}`}>
                            <label htmlFor="malfunctions">{t('malfunctions')}</label>
                            <textarea
                                id="malfunctions"
                                name="malfunctions"
                                rows={3}
                                defaultValue={getFormDefaultValue(state, initialData, 'malfunctions', { defaultValue: '' })}
                                placeholder={t('malfunctionsPlaceholder')}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            />
                            <FieldError error={!state?.ok ? state?.data?.malfunctions : null} />
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════
                    EDIT-ONLY FIELDS
                ════════════════════════════════ */}
                {isEditMode && (
                    <div className={styles.invoiceDetails}>
                        {/* Read-only info summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('client')}</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{initialData.client_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('item')}</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{initialData.item_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('serialNumber')}</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{initialData.serial_number || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('dateIn')}</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{initialData.date_in}</p>
                            </div>
                            {initialData.malfunctions && (
                                <div className="col-span-full">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{t('malfunctions')}</p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">{initialData.malfunctions}</p>
                                </div>
                            )}
                        </div>

                        {/* Date out — editable */}
                        <DateInput
                            id="date_out"
                            name="date_out"
                            label={t('dateOut')}
                            defaultValue={getFormDefaultValue(state, initialData, 'date_out', { defaultValue: formatDateManual(new Date()) })}
                            error={!state?.ok ? state?.data?.date_out : null}
                        />

                        {/* Notes */}
                        <div className={`mt-4 ${styles.formGroup}`}>
                            <label htmlFor="notes">{t('notes')}</label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                defaultValue={getFormDefaultValue(state, initialData, 'notes', { defaultValue: '' })}
                                placeholder={t('additionalNotes')}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            />
                            <FieldError error={!state?.ok ? state?.data?.notes : null} />
                        </div>
                    </div>
                )}

                {/* ════════════════════════════════
                    SPARE PARTS — both modes
                ════════════════════════════════ */}
                <div className={styles.itemsSection}>
                    <div className={styles.itemsHeader}>
                        <h3>{t('spareParts')}</h3>
                        {typeof state?.data?.parts?.[0] === 'string' && (
                            <FieldError error={!state?.ok ? state?.data?.parts : null} />
                        )}
                    </div>

                    {/* Add spare part row */}
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <DynamicOptionsInput
                                url="/api/spare-parts/?name="
                                label={t('addSparePart')}
                                customLoadOptions={sparePartsLoadOptions}
                                value={selectedPart}
                                onChange={(part) => {
                                    if (part) {
                                        addPart(part);
                                        setSelectedPart(null);
                                    }
                                }}
                            />
                        </div>
                        <BarcodeScanner
                            onScan={handleBarcodeScan}
                            onError={(error) => toast.error('Scanner error: ' + error.message)}
                            disabled={isPending}
                        />
                    </div>

                    {/* Parts list */}
                    <div className={styles.itemsList}>
                        {parts.map((part, index) => (
                            <div
                                key={part.id}
                                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
                                    state?.data?.parts?.[index] && !state?.ok
                                        ? 'border-2 border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900'
                                        : ''
                                }`}
                            >
                                {/* ── Summary row ── */}
                                <div
                                    className="flex flex-col gap-3 p-3 cursor-pointer bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-blue-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200 md:grid md:grid-cols-[40px_1fr_140px_40px] md:items-center md:gap-4 md:p-4"
                                    onClick={() => togglePartExpanded(part.id)}
                                >
                                    {/* Mobile delete */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePart(part.id); }}
                                        className="md:hidden absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                                    >
                                        ×
                                    </button>

                                    {/* Desktop delete */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePart(part.id); }}
                                        className="hidden md:flex md:items-center md:justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                                    >
                                        ×
                                    </button>

                                    {/* Part name */}
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base truncate">
                                            {part.spare_part_name || t('unknownPart')}
                                        </p>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-medium">{t('partId')}</span>{' '}
                                            <span className="text-gray-600 dark:text-gray-300">{part.spare_part || t('notSet')}</span>
                                        </div>
                                        <FieldError error={!state?.ok ? state?.data?.parts?.[index]?.spare_part : null} />
                                    </div>

                                    {/* Quantity badge */}
                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => updatePart(part.id, 'quantity', String(Math.max(1, parseInt(part.quantity || 1) - 1)))}
                                                className="px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-colors"
                                            >−</button>
                                            <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[2rem] text-center">
                                                {part.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updatePart(part.id, 'quantity', String(parseInt(part.quantity || 1) + 1))}
                                                className="px-2.5 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition-colors"
                                            >+</button>
                                        </div>
                                        <FieldError error={!state?.ok ? state?.data?.parts?.[index]?.quantity : null} />
                                    </div>

                                    {/* Expand arrow */}
                                    <div className="flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:pt-0">
                                        <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expandedParts.has(part.id) ? 'rotate-180' : 'rotate-0'}`}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {/* ── Expanded detail ── */}
                                {expandedParts.has(part.id) && (
                                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-slideDown">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('selectDifferentPart')}</label>
                                            <DynamicOptionsInput
                                                url="/api/spare-parts/?name="
                                                customLoadOptions={sparePartsLoadOptions}
                                                value={{ value: part.spare_part, label: part.spare_part_name }}
                                                onChange={(p) => {
                                                    if (p) {
                                                        setParts((prev) => prev.map((pp) =>
                                                            pp.id === part.id
                                                                ? { ...pp, spare_part: p.value, spare_part_name: p.label }
                                                                : pp
                                                        ));
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantity')}</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={part.quantity}
                                                onChange={(e) => updatePart(part.id, 'quantity', e.target.value)}
                                                onFocus={(e) => e.target.select()}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Hidden fields for form submission */}
                                <input type="hidden" name={`parts[${index}][spare_part]`} value={part.spare_part} />
                                <input type="hidden" name={`parts[${index}][quantity]`}    value={part.quantity} />
                            </div>
                        ))}

                        {parts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                                <WrenchScrewdriverIcon className="w-10 h-10 mb-2 opacity-50" />
                                <p className="text-sm">{t('noPartsYet')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes (create mode) */}
                {!isEditMode && (
                    <div className={styles.invoiceSummary}>
                        <div className={styles.formGroup}>
                            <label htmlFor="notes">{t('notes')}</label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows="3"
                                defaultValue={getFormDefaultValue(state, initialData, 'notes', { defaultValue: '' })}
                                placeholder={t('additionalNotes')}
                            />
                            <FieldError error={!state?.ok ? state?.data?.notes : null} />
                        </div>
                    </div>
                )}

            </GenericFormShell>

            <BarcodeConfirmationModal
                item={barcodeItem}
                isOpen={showBarcodeConfirm}
                onClose={handleBarcodeCancel}
                onConfirm={handleBarcodeConfirm}
                isLoading={barcodeLoading}
                error={barcodeError}
            />
        </>
    );
};

export default MaintenanceForm;
