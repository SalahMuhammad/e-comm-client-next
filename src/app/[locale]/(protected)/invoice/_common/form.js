'use client';

import { useActionState, useEffect, useState, useMemo } from 'react';
import { createUpdateInv, getDefaultRepository } from './actions';
import styles from './form.module.css';
import { addDays, formatDateManual } from '@/utils/dateFormatter';
import { DynamicOptionsInput } from "@/components/inputs/index"
import { useTranslations } from 'next-intl';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import FieldError from '@/components/FieldError';
import { toast } from 'sonner';
import Form from 'next/form';
import FormButton from "@/components/FormButton"
import { useRouter } from "next/navigation";
import ItemPreviewModal from '@/components/ItemPreviewModal';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ImageView from '@/components/ImageView';
import { NumberInput, QuantityInput, DateInput, RadioSwitch } from '@/components/inputs';
import { getFormDefaultValue } from '@/utils/formDefaultValue';

const InvoiceForm = ({ type, initialData = null }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [viewImages, setViewImages] = useState([]);
    const [viewImageStartIndex, setViewImageStartIndex] = useState(0);
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [items, setItems] = useState(initialData?.[typePrefix] || []);
    // Initialize payment type based on whether there's an owner in initialData
    const [paymentType, setPaymentType] = useState(initialData?.owner ? 'client' : 'cash');
    const [addPaymentWithInvoice, setAddPaymentWithInvoice] = useState(false);

    // Check if this is edit mode or refund mode
    const isEditMode = initialData?.id || type.includes('refund');
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateInv, { errors: {} });
    const tGlobal = useTranslations();
    const t = useTranslations('invoice.form');
    const router = useRouter();

    // Calculate total amount reactively
    const totalAmount = useMemo(() => {
        return parseFloat(calculateTotal(items));
    }, [items]);

    const isPaymentDisabled = totalAmount === 0;

    const toggleItemExpanded = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const addItem = async (item) => {
        const defaultRepo = await getDefaultRepository('')

        const newItem = {
            id: Date.now(),
            description: '',
            quantity: '1.00',
            unit_price: item.p4 || 0,
            discount: '0.00',
            tax_rate: '0.00',
            item: item.value || '',
            item_name: item.label || '',
            item_images: item.images || [],
            repository: defaultRepo?.id || '0',
            repository_name: defaultRepo?.name || ''
        };
        setItems([...items, newItem]);
    };

    const removeItem = (itemId) => {
        setItems(items.filter(item => item.id !== itemId));
        const newExpanded = new Set(expandedItems);
        newExpanded.delete(itemId);
        setExpandedItems(newExpanded);
    };

    const updateItem = (itemId, field, value) => {
        setItems(items.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    };

    const itemsLoadOptions = (res, callback) => {
        const options = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.name,
            p4: obj.price4,
            images: obj.images || [],
        }));
        callback(options);
    }

    const handleAccountTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.hashed_id,
            label: obj.account_type_name + ' / ' + obj.account_name,
        }))
        callback(data)
    }

    const defaultPaymentMethod = state.formData?.business_account || initialData?.business_account ? {
        value: state.formData?.business_account || initialData?.business_account,
        label: state.formData?.payment_method_name || initialData?.payment_method_name
    } : undefined

    useEffect(() => {
        if (state?.ok === undefined) return
        if (handleGenericErrors(state)) return

        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
            if (state.data?.id) {
                router.replace(`/invoice/${type}/view/${state.data?.hashed_id}`)
            }
        } else {
            const itemsError = state?.data?.[typePrefix];
            if (itemsError && typeof itemsError === 'object' && itemsError.detail) {
                toast.error(itemsError.detail);
            }
        }
    }, [state])

    return (
        <div className={styles.invoiceContainer}>
            <Form
                // action={action}
                action={formAction}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{t("invoice")}</h2>
                    <input type="hidden" name="type" value={type} />

                    {type.includes('refund') && (
                        <input type="hidden" name="original_invoice" defaultValue={initialData?.id} />
                    )}
                </div>

                <div className={styles.invoiceDetails}>
                    {initialData?.id && (
                        <>
                            <NumberInput placeholder={tGlobal("global.form.id")} id="id" value={state?.data?.id || initialData.id} borderColor="border-green-500 dark:border-green-400 mt-2 mb-2" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly labelClass='z-20' />
                            <input type='hidden' name='hashed_id' value={initialData.hashed_id} />
                        </>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <DateInput
                            id="issue_date"
                            name="issue_date"
                            label={t("issueDate")}
                            defaultValue={state?.formData?.issue_date || initialData?.issue_date || formatDateManual(new Date())}
                            required
                            error={!state?.ok ? state?.data?.issue_date : null}
                        />
                        <DateInput
                            id="due_date"
                            name="due_date"
                            label={t("dueDate")}
                            defaultValue={state?.formData?.due_date || initialData?.due_date || formatDateManual(addDays(14))}
                            error={!state?.ok ? state?.data?.due_date : null}
                        />
                    </div>

                    {/* Payment Type Selector */}
                    <div className="mt-4 relative z-10">
                        <RadioSwitch
                            label={t('paymentType')}
                            name="payment_type_selector"
                            options={[
                                { value: 'client', label: t('client') },
                                { value: 'cash', label: t('cash') }
                            ]}
                            value={paymentType}
                            onChange={setPaymentType}
                        />

                    </div>

                    {/* Client mode: Show owner + optional payment dropdown */}
                    {paymentType === 'client' && (
                        <>
                            <div className={`mt-8 ${styles.formGroup}`}>
                                <DynamicOptionsInput
                                    url={'/api/buyer-supplier-party/?s='}
                                    label={t('owner')}
                                    name="owner"
                                    defaultValue={initialData?.owner ? { value: initialData?.owner, label: initialData?.owner_name } : ''}
                                />
                                <FieldError error={!state?.ok ? state?.data?.owner : null} />
                            </div>

                            {/* Checkbox: Add payments - only show in create mode */}
                            {!isEditMode && (
                                <div className="mt-1">
                                    <label className={`flex items-center gap-3 ${isPaymentDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={addPaymentWithInvoice}
                                            onChange={(e) => setAddPaymentWithInvoice(e.target.checked)}
                                            disabled={isPaymentDisabled}
                                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('addPayment')}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </>
                    )}

                    {/* If cash mode in edit and owner exists, send empty string (converted to null in actions.js) */}
                    {isEditMode && paymentType === 'cash' && initialData?.owner && (
                        <input type="hidden" name="owner" value="" />
                    )}

                    {/* Show warning only in create mode when payment is disabled */}
                    {!isEditMode && isPaymentDisabled && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span>{t('paymentDisabledZeroAmount')}</span>
                        </div>
                    )}

                    {/* Payment fields - only show in create mode, for Cash OR (Client + yes selected) when payment not disabled */}
                    {!isEditMode && (paymentType === 'cash' || (paymentType === 'client' && addPaymentWithInvoice)) && !isPaymentDisabled && (
                        <>
                            {/* Payment Amount - only for client mode, full width */}
                            {paymentType === 'client' && (
                                <div className="mt-6">
                                    <NumberInput
                                        label={t('paymentAmount')}
                                        name="payment_amount"
                                        placeholder={t('paymentAmount')}
                                        onFocus={(e) => e.target.select()}
                                        defaultValue={getFormDefaultValue(state, initialData, 'payment_amount', { defaultValue: '0.00' })}
                                    />
                                </div>
                            )}

                            {/* Payment Account - full width */}
                            <div className={paymentType === 'cash' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-8' : 'mt-4'}>
                                <DynamicOptionsInput
                                    url={'/api/finance/account-vault/?is_active=true&account_name='}
                                    label={tGlobal('finance.fields.paymentMethod')}
                                    name="payment_account"
                                    customLoadOptions={handleAccountTransformer}
                                    defaultValue={defaultPaymentMethod}
                                />

                                {/* Disabled amount for cash - server will calculate */}
                                {paymentType === 'cash' && (
                                    <NumberInput
                                        label={t('paymentAmount')}
                                        name="payment_amount_display"
                                        placeholder={t('paymentAmount')}
                                        disabled
                                        value=""
                                        borderColor="border-green-500 dark:border-green-400"
                                        labelColor="text-green-600 dark:text-green-400"
                                    />
                                )}
                            </div>

                            {/* Payment Notes - full width */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('paymentNotes')}</label>
                                <textarea
                                    name="payment_notes"
                                    rows={3}
                                    defaultValue={getFormDefaultValue(state, initialData, 'payment_notes', { defaultValue: '' })}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder={t('paymentNotes')}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.itemsSection}>
                    <div className={styles.itemsHeader}>
                        <h3>{t("items")}</h3>
                        {typeof state?.[typePrefix]?.[0] === 'string' &&
                            <FieldError error={!state?.ok ? state?.data?.[typePrefix] : null} />
                        }
                    </div>

                    <DynamicOptionsInput
                        url={'/api/items/?name='}
                        label={t("addItem")}
                        customLoadOptions={itemsLoadOptions}
                        value={selectedItem}
                        onChange={(item) => {
                            setPreviewItem(item);
                            setShowPreview(true);
                        }}
                    />

                    <ItemPreviewModal
                        item={previewItem}
                        isOpen={showPreview}
                        onClose={() => {
                            setShowPreview(false);
                            setPreviewItem(null);
                        }}
                        onConfirm={addItem}
                        onImageClick={(images, index) => {
                            setViewImages(images);
                            setViewImageStartIndex(index);
                        }}
                    />

                    <div className={styles.itemsList}>
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${state?.data?.[typePrefix]?.[index] && !state?.ok ? "border-2 border-red-500 dark:border-red-400 ring-2 ring-red-200 dark:ring-red-900" : null}`}
                            >
                                <div
                                    className="flex flex-col gap-3 p-3 cursor-pointer bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 hover:from-blue-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200 md:grid md:grid-cols-[40px_80px_1fr_140px_100px_40px] md:items-center md:gap-4 md:p-4"
                                    onClick={() => toggleItemExpanded(item.id)}
                                >
                                    {/* Mobile-only delete button - positioned on the right */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                        }}
                                        className="md:hidden absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-bold flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                                        title={t("removeItem")}
                                    >
                                        ×
                                    </button>

                                    {/* Desktop-only delete button - in grid */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                        }}
                                        className="hidden md:flex md:items-center md:justify-center w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                                        title={t("removeItem")}
                                    >
                                        ×
                                    </button>

                                    <div className="flex items-center justify-center shrink-0">
                                        {item.item_images?.[0]?.img ? (
                                            <img
                                                src={item.item_images[0].img}
                                                alt={item.item_name}
                                                className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setViewImages(item.item_images);
                                                    setViewImageStartIndex(0);
                                                }}
                                            />
                                        ) : (
                                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                                <PhotoIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base line-clamp-2 md:truncate">
                                            {item.item_name || ''}
                                        </p>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-medium">{t("itemId")}</span> <span className="text-gray-600 dark:text-gray-300">{item.item || t("notSet")}</span>
                                        </div>
                                        <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.item : null} />
                                    </div>

                                    <div className="flex items-center justify-between gap-3 md:contents">
                                        <div className="flex items-center flex-1 md:flex-initial" onClick={(e) => e.stopPropagation()}>
                                            <div className="w-full max-w-[160px] md:max-w-none">
                                                <QuantityInput
                                                    value={item.quantity}
                                                    onChange={(newQty) => updateItem(item.id, 'quantity', newQty)}
                                                    min={0}
                                                    step={1}
                                                    className=""
                                                />
                                                <FieldError error={!state?.ok ? state?.data?.items?.[index]?.quantity : null} />
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                                ${calculateItemTotal(item)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand indicator - centered on mobile, right column on desktop */}
                                    <div className="flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:pt-0">
                                        <span className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expandedItems.has(item.id) ? 'rotate-180' : 'rotate-0'}`}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {expandedItems.has(item.id) && (
                                    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 space-y-4 animate-slideDown">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("unitPrice")}</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="0.00"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                />
                                                <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.unit_price : null} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("discount")}</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.discount}
                                                    onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="0.00"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                />
                                                <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.discount : null} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("taxRate")} (%)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={item.tax_rate}
                                                    onChange={(e) => updateItem(item.id, 'tax_rate', e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="0.00"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                />
                                                <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.tax_rate : null} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("description")}</label>
                                                <input
                                                    type="text"
                                                    placeholder={t("description")}
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                                />
                                                <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.description : null} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("repository")}</label>
                                            <DynamicOptionsInput
                                                url={'/api/repositories/?s='}
                                                name={`items[${index}][repository]`}
                                                value={{ value: item.repository, label: item.repository_name }}
                                                onChange={(repo) => {
                                                    setItems(items.map(iitem =>
                                                        iitem.id === item.id ? { ...iitem, repository_name: repo?.label || '', repository: repo?.value || '' } : iitem
                                                    ));
                                                }
                                                }
                                                placeholder={t("selectRepository")}
                                            />
                                            <FieldError error={!state?.ok ? state?.data?.[typePrefix]?.[index]?.repository : null} />
                                        </div>
                                    </div>
                                )}

                                {/* Hidden fields for form submission */}
                                <input type="hidden" name={`items[${index}][description]`} value={item.description} />
                                <input type="hidden" name={`items[${index}][quantity]`} value={item.quantity} />
                                <input type="hidden" name={`items[${index}][unit_price]`} value={item.unit_price} />
                                <input type="hidden" name={`items[${index}][discount]`} value={item.discount} />
                                <input type="hidden" name={`items[${index}][tax_rate]`} value={item.tax_rate} />
                                <input type="hidden" name={`items[${index}][item]`} value={item.item} />
                                <input type="hidden" name={`items[${index}][repository]`} value={item.repository} />
                                <input type="hidden" name={`items[${index}][total]`} value={calculateItemTotal(item)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.invoiceSummary}>
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">{t("notes")}</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            defaultValue={getFormDefaultValue(state, initialData, 'notes', { defaultValue: '' })}
                            placeholder={t("additionalNotes")}
                        />
                        <FieldError error={!state?.ok ? state?.data?.notes : null} />
                    </div>

                    <div className={styles.totalSection}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>{t("totalAmount")}</span>
                            <span className={styles.totalAmount}>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <input type="hidden" name="total_amount" value={totalAmount.toFixed(2)} />
                </div>

                <div className={styles.formActions}>
                    <FormButton
                        type="submit"
                        variant={initialData?.id ? "secondary" : "primary"}
                        size="md"
                        bgColor={initialData?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                        hoverBgColor={initialData?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                        textColor="text-white dark:text-gray-100"
                        className="w-full"
                        isLoading={isPending}
                    >
                        {initialData?.id ? tGlobal("global.form.edit") : tGlobal("global.form.submit")}
                    </FormButton>
                </div>
            </Form>

            <ImageView
                images={viewImages}
                onClose={() => {
                    setViewImages([]);
                    setViewImageStartIndex(0);
                }}
                startIndex={viewImageStartIndex}
            />
        </div>
    );
};

export default InvoiceForm;


const calculateItemTotal = (item) => {
    const unitPrice = parseFloat(item.unit_price || 0);
    const quantity = parseFloat(item.quantity || 0);
    const discount = parseFloat(item.discount || 0);
    const taxRate = parseFloat(item.tax_rate || 0);

    const subtotal = (unitPrice * quantity) - discount;
    const tax = subtotal * (taxRate / 100);
    return (subtotal + tax).toFixed(2);
};

const calculateTotal = (items) => {
    return items.reduce((total, item) => {
        return total + parseFloat(calculateItemTotal(item));
    }, 0).toFixed(2);
};
