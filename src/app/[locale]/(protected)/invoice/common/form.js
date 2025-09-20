'use client';

import { useActionState, useEffect, useState } from 'react';
import { createUpdateInv, getDefaultRepository } from './actions';
import styles from './form.module.css';
import { addDays, formatDateManual } from '@/utils/dateFormatter';
import SearchableDropdown from '@/components/SearchableDropdown';
import { useTranslations } from 'next-intl';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { getCookie } from '@/utils/cookieHandler';
import FieldError from '@/components/FieldError';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import Form from 'next/form';
import FormButton from "@/components/FormButton"
import { NumberInput } from '@/components/inputs';

const InvoiceForm = ({ type, initialData = null }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [items, setItems] = useState(initialData?.[typePrefix] || []);
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateInv, { errors: {} });
    const tGlobal = useTranslations();
    const t = useTranslations('invoice.form');

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
        const defaultRepo = await getDefaultRepository(getCookie('inv_d_repo'))

        const newItem = {
            id: Date.now(),
            description: '',
            quantity: '1.00',
            unit_price: item.price4 || 0,
            discount: '0.00',
            tax_rate: '0.00',
            item: item.value || '',
            item_name: item.label || '',
            repository: defaultRepo?.id || '0',
            repository_name: defaultRepo?.name || ''
        };
        setItems([...items, newItem]);
    };

    const removeItem = (itemId) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== itemId));
            const newExpanded = new Set(expandedItems);
            newExpanded.delete(itemId);
            setExpandedItems(newExpanded);
        }
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
            image: obj.images?.[0] || '',
        }));
        callback(options);
    }
    
    useEffect(() => {
        if (state?.ok === undefined) return
        if (handleGenericErrors(state)) return

        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
            if (state.data?.id) {
                 redirect(`/invoice/${type}/view/${state.data?.hashed_id}`)
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
                            <NumberInput placeholder={tGlobal("id")} id="id" value={state?.data?.id || initialData.id} borderColor="border-green-500 dark:border-green-400 mt-2 mb-2" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly labelClass='z-20' />
                            <input type='hidden' name='hashed_id' value={initialData.hashed_id} />
                        </>
                    )}  
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="issue_date">{t("issueDate")}</label>
                            <input
                                type="date"
                                id="issue_date"
                                name="issue_date"
                                defaultValue={state?.formData?.issue_date || initialData?.issue_date || formatDateManual(new Date())}
                                required
                            />
                            <FieldError error={state?.data?.issue_date} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="due_date">{t("dueDate")}</label>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                defaultValue={state?.formData?.due_date || initialData?.due_date || formatDateManual(addDays(14))}
                                required
                            />
                            <FieldError error={state?.data?.due_date} />
                        </div>
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`} >
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={t('owner')}
                            name="owner"
                            defaultValue={initialData?.owner ? { value: initialData?.owner, label: initialData?.owner_name } :  ''}
                            // required
                        />
                        <FieldError error={state?.data?.owner} />
                    </div>
                </div>

                <div className={styles.itemsSection}>
                    <div className={styles.itemsHeader}>
                        <h3>{t("items")}</h3>
                        {typeof state?.[typePrefix]?.[0] === 'string' && 
                            <FieldError error={state?.data?.[typePrefix]} />
                        }
                    </div>

                    <SearchableDropdown
                        url={'/api/items/?s='}
                        label={t("addItem")}
                        customLoadOptions={itemsLoadOptions}
                        value={selectedItem}
                        onChange={(item) => addItem(item)}
                    />

                    <div className={styles.itemsList}>
                        {items.map((item, index) => (
                            <div key={item.id} className={styles.itemCard}>
                                <div
                                    className={styles.itemHeader}
                                    onClick={() => toggleItemExpanded(item.id)}
                                >
                                    <div className={styles.itemActions}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeItem(item.id);
                                            }}
                                            className={styles.removeBtn}
                                            disabled={items.length === 1}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div className={styles.itemImage}>
                                        <div className={styles.placeholderImage}></div>
                                    </div>

                                    <div className={styles.itemMain}>
                                        <p className={styles.itemName}>
                                            {item.item_name || ''}
                                        </p>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemId}>{t("itemId")} {item.item || t("notSet")}</span>
                                        </div>
                                        <FieldError error={state?.data?.[typePrefix]?.[index]?.item} />
                                    </div>

                                    <div className={styles.itemQuantity}>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newQty = Math.max(0, parseFloat(item.quantity) - 1).toFixed(2);
                                                updateItem(item.id, 'quantity', newQty);
                                            }}
                                            className={styles.qtyBtn}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                            className={styles.qtyInput}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <FieldError error={state?.data?.items?.[index]?.quantity} />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newQty = (parseFloat(item.quantity) + 1).toFixed(2);
                                                updateItem(item.id, 'quantity', newQty);
                                            }}
                                            className={styles.qtyBtn}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className={styles.itemTotal}>
                                        ${calculateItemTotal(item)}
                                    </div>

                                    <div className={styles.expandIndicator}>
                                        <span className={expandedItems.has(item.id) ? styles.expanded : ''}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {expandedItems.has(item.id) && (
                                    <div className={styles.itemDetails}>
                                        <div className={styles.detailsRow}>
                                            <div className={styles.formGroup}>
                                                <label>{t("unitPrice")}</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={state?.data?.[typePrefix]?.[index]?.unit_price} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>{t("discount")}</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.discount}
                                                    onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={state?.data?.[typePrefix]?.[index]?.discount} />
                                            </div>
                                        </div>
                                        <div className={styles.detailsRow}>
                                            <div className={styles.formGroup}>
                                                <label>{t("taxRate")} (%)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={item.tax_rate}
                                                    onChange={(e) => updateItem(item.id, 'tax_rate', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={state?.data?.[typePrefix]?.[index]?.tax_rate} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>{t("description")}</label>
                                                <input
                                                    type="text"
                                                    placeholder={t("description")}
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                />
                                                <FieldError error={state?.data?.[typePrefix]?.[index]?.description} />
                                            </div>
                                        </div>
                                        <div className={styles.detailsRow}>
                                            <div className={styles.formGroup}>
                                            <label>{t("repository")}</label>
                                            <SearchableDropdown
                                                url={'/api/repositories/?s='}
                                                name={`items[${index}][repository]`}
                                                value={{value: item.repository, label: item.repository_name}}
                                                onChange={(repo) => {
                                                    setItems(items.map(iitem =>
                                                        iitem.id === item.id ? { ...iitem, repository_name: repo?.label || '', repository: repo?.value || '' } : iitem
                                                    ));}
                                                }
                                                placeholder={t("selectRepository")}
                                            />
                                            <FieldError error={state?.data?.[typePrefix]?.[index]?.repository} />
                                            </div>
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
                            defaultValue={initialData?.notes || ''}
                            placeholder={t("additionalNotes")}
                        />
                        <FieldError error={state?.data?.notes} />
                    </div>

                    <div className={styles.totalSection}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>{t("totalAmount")}</span>
                            <span className={styles.totalAmount}>${calculateTotal(items)}</span>
                        </div>
                    </div>

                    <input type="hidden" name="total_amount" value={calculateTotal(items)} />
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
