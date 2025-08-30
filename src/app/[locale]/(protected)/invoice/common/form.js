'use client';

import { useState } from 'react';
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


const InvoiceForm = ({ type, initialData = null }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const typePrefix = type.includes('sales') ? 's_invoice_items' : 'p_invoice_items';
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [items, setItems] = useState(initialData?.[typePrefix] || []);
    const handleGenericErrors = useGenericResponseHandler()
    const [formData, setFormData] = useState(initialData || {});
    const [errors, setErrors] = useState({});
    const [isPending, setIsPending] = useState(false);


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

    async function handleSubmit (e) {
        e.preventDefault();
        setIsPending(true);

        const res = await createUpdateInv(new FormData(e.currentTarget))

        if (handleGenericErrors(res)) {
            setIsPending(false);
            return;
        }

        switch (res.status) {
            case 400:
                setErrors(res.data);
                setFormData(res.formData);
                setIsPending(false);
                break;
            case 200:
            case 201:
                toast.success(`done ${initialData?.id ? 'updated' : 'created'}`);
                res.data.id && 
                    redirect(`/invoice/${type}/view/${res.data.id}`)
        }
    }

    return (
        <div className={styles.invoiceContainer}>
            <form
                // action={action}
                onSubmit={handleSubmit}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>Invoice</h2>
                    {initialData?.id && (
                        <input type="hidden" name="id" value={initialData.id} />
                    )}

                    <input type="hidden" name="type" value={type} />

                    {type.includes('refund') && (
                        <input type="hidden" name="original_invoice" defaultValue={initialData?.id} />
                    )}
                </div>

                <div className={styles.invoiceDetails}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="issue_date">Issue Date</label>
                            <input
                                type="date"
                                id="issue_date"
                                name="issue_date"
                                defaultValue={formData?.issue_date || initialData?.issue_date || formatDateManual(new Date())}
                                required
                            />
                            <FieldError error={errors?.issue_date} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="due_date">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                defaultValue={formData?.due_date || initialData?.due_date || formatDateManual(addDays(14))}
                                required
                            />
                            <FieldError error={errors?.due_date} />
                        </div>
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`} >
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={'Owner'}
                            name="owner"
                            defaultValue={initialData?.owner ? { value: initialData?.owner, label: initialData?.owner_name } :  ''}
                            // required
                        />
                        <FieldError error={errors?.owner} />
                    </div>
                </div>

                <div className={styles.itemsSection}>
                    <div className={styles.itemsHeader}>
                        <h3>Invoice Items</h3>
                        {typeof errors?.[typePrefix]?.[0] === 'string' && 
                            <FieldError error={errors?.[typePrefix]} />
                        }
                    </div>

                    <SearchableDropdown
                        url={'/api/items/?s='}
                        label={'Add Item'}
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
                                            <span className={styles.itemId}>Item ID: {item.item || 'Not set'}</span>
                                        </div>
                                        <FieldError error={errors?.[typePrefix]?.[index]?.item} />
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
                                        <FieldError error={errors?.items?.[index]?.quantity} />
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
                                                <label>Unit Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(item.id, 'unit_price', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={errors?.[typePrefix]?.[index]?.unit_price} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Discount</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.discount}
                                                    onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={errors?.[typePrefix]?.[index]?.discount} />
                                            </div>
                                        </div>
                                        <div className={styles.detailsRow}>
                                            <div className={styles.formGroup}>
                                                <label>Tax Rate (%)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={item.tax_rate}
                                                    onChange={(e) => updateItem(item.id, 'tax_rate', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                <FieldError error={errors?.[typePrefix]?.[index]?.tax_rate} />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Description</label>
                                                <input
                                                    type="text"
                                                    placeholder="description"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                />
                                                <FieldError error={errors?.[typePrefix]?.[index]?.description} />
                                            </div>
                                        </div>
                                        <div className={styles.detailsRow}>
                                            <div className={styles.formGroup}>
                                            <label>Repository</label>
                                            <SearchableDropdown
                                                url={'/api/repositories/?s='}
                                                name={`items[${index}][repository]`}
                                                value={{value: item.repository, label: item.repository_name}}
                                                onChange={(repo) => {
                                                    setItems(items.map(iitem =>
                                                        iitem.id === item.id ? { ...iitem, repository_name: repo?.label || '', repository: repo?.value || '' } : iitem
                                                    ));}
                                                }
                                                placeholder="Select Repository"
                                            />
                                            <FieldError error={errors?.[typePrefix]?.[index]?.repository} />
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
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            defaultValue={initialData?.notes || ''}
                            placeholder="Additional notes..."
                        />
                        <FieldError error={errors?.notes} />
                    </div>

                    <div className={styles.totalSection}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total Amount:</span>
                            <span className={styles.totalAmount}>${calculateTotal(items)}</span>
                        </div>
                    </div>

                    <input type="hidden" name="total_amount" value={calculateTotal(items)} />
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn} disabled={isPending}>
                        {initialData?.id ? 'Update Invoice' : 'Create Invoice'}
                    </button>
                </div>
            </form>
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
