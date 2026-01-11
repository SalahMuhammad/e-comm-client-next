"use client";

import { useActionState, useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateTransaction } from "./actions"
import Form from "next/form";
import { TextInput, FileInput, DateInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";
import StaticSelect from "@/components/ReactStaticSelect";


function MyForm({ initialData, type }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateTransaction, {})
    const router = useRouter();
    const [selectedOwner, setSelectedOwner] = useState(initialData?.owner || null)
    const [saleValue, setSaleValue] = useState(initialData?.sale ? {
        value: initialData.sale,
        label: `Sale #${initialData.related_order_ref || initialData.sale}`
    } : null)
    // Track whether to keep payment_proof image
    const [keepPaymentProof, setKeepPaymentProof] = useState(initialData?.payment_proof ? true : false)

    // const options = type === 'payments' ? [
    //     { value: 'invoice_payment', label: 'invoice_payment' },
    //     { value: 'advance_payment', label: 'advance_payment' },
    // ] : [
    //     { value: 'invoice_payment', label: 'invoice_payment' },
    //     { value: 'refund', label: 'refund' },
    //     { value: 'expense', label: 'expense' },
    // ]
    const defaultDate = state.formData?.date || initialData?.date || formatDateManual(new Date())
    const defaultOwner = state.formData?.owner || initialData?.owner ? {
        value: state.formData?.owner || initialData?.owner,
        label: state.formData?.owner_name || initialData?.owner_name
    } : undefined
    const [ownerValue, setOwnerValue] = useState(defaultOwner)
    // const defaultPaymenType = state.formData?.payment_type || initialData?.payment_type ? {
    //     value: state.formData?.payment_type || initialData?.payment_type,
    //     label: state.formData?.payment_type || initialData?.payment_type
    // } : options[0]
    const defaultPaymentMethod = state.formData?.business_account || initialData?.business_account ? {
        value: state.formData?.business_account || initialData?.business_account,
        label: state.formData?.payment_method_name || initialData?.payment_method_name
    } : undefined


    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
            if (state.data?.id) {
                router.replace(`/finance/${type}/view/${state.data?.hashed_id}`);
            }
        }
    }, [state])


    const handleAccountTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.account_type_name + ' / ' + obj.account_name,
        }))
        callback(data)
    }

    const handleSaleTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => {
            // Format the date to be more readable (e.g., "2025-08-07" -> "Aug 7, 2025")
            const issueDate = new Date(obj.issue_date)
            const formattedDate = issueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })

            // Create a user-friendly label showing: Invoice ID - Owner - Date - Amount
            const label = `#${obj.hashed_id} - ${obj.owner_name} - ${formattedDate} - $${obj.total_amount}`

            return {
                value: obj.id,
                label: label,
                // Store owner data for auto-population
                ownerData: {
                    owner: obj.owner,
                    owner_name: obj.owner_name
                }
            }
        })
        callback(data)
    }

    // Auto-populate owner when sale is selected
    const handleSaleChange = (selected) => {
        setSaleValue(selected)
        if (selected?.ownerData && !selectedOwner) {
            setSelectedOwner(selected.ownerData.owner)
            setOwnerValue({
                value: selected.ownerData.owner,
                label: selected.ownerData.owner_name
            })
        }
    }

    return (
        <div className={styles.invoiceContainer}>
            <Form
                action={formAction}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{initialData?.id ? t("finance.fields.update") : t("finance.fields.transaction")} {initialData?.hashed_id && "#"} {initialData?.hashed_id}</h2>
                </div>

                <div className={styles.invoiceDetails}>
                    {initialData?.hashed_id && (
                        <TextInput
                            placeholder={'id'}
                            id="hashed_id"
                            value={initialData?.hashed_id}
                            bordercolor="border-green-500 dark:border-green-400"
                            labelcolor="text-green-600 dark:text-green-400"
                            focuscolor=""
                            focuslabelcolor=""
                            name="hashed_id"
                            readOnly
                        />
                    )}

                    <input type="hidden" name="type" value={type} />

                    <DateInput
                        id="date"
                        name="date"
                        defaultValue={defaultDate}
                        required
                    />

                    {/* <div className={styles.formGroup}>
                        <label htmlFor="date">{t('finance.fields.date')}</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={defaultDate}
                            required
                        />
                        <DateInput
                            id="date"
                            name="date"
                            defaultValue={defaultDate}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.date : null} />
                    </div> */}

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={t('finance.fields.owner')}
                            name="owner"
                            value={ownerValue}
                            onChange={(selected) => {
                                setSelectedOwner(selected?.value || null)
                                setOwnerValue(selected)
                            }}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.owner : null} />
                    </div>

                    {/* Sales Invoice Dropdown - Filtered by Owner */}
                    {(type === 'payment' || type === 'payments' || type === 'reverse-payment') && (
                        <div className={`mt-8 ${styles.formGroup}`}>
                            <SearchableDropdown
                                url={selectedOwner ? `/api/sales/?owner=${selectedOwner}&status=3,4&no=` : '/api/sales/?no='}
                                label={t('finance.fields.relatedInvoice')}
                                customLoadOptions={handleSaleTransformer}
                                name="sale"
                                value={saleValue}
                                onChange={handleSaleChange}
                                key={selectedOwner}
                            />
                            <FieldError error={!state?.ok ? state.data?.sale : null} />
                        </div>
                    )}

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/finance/account-vault/?account_name='}
                            label={t('finance.fields.paymentMethod')}
                            customLoadOptions={handleAccountTransformer}
                            name={'business_account'}
                            defaultValue={defaultPaymentMethod}
                        />
                        <FieldError error={!state?.ok ? state.data?.business_account : null} />
                    </div>

                    {/* Status */}
                    <div className={styles.formGroup + ' z-20'}>
                        <StaticSelect
                            options={[
                                { value: '1', label: t('finance.statusOptions.confirmed') },
                                { value: '2', label: t('finance.statusOptions.pending') },
                                { value: '4', label: t('finance.statusOptions.rejected') },
                                { value: '3', label: t('finance.statusOptions.reimbursed') },
                            ]}
                            name="status"
                            label={t('finance.fields.status')}
                            defaultValue={state.formData?.status || initialData?.status ? {
                                value: state.formData?.status || initialData?.status,
                                label: state.formData?.status || initialData?.status
                            } : undefined}
                        />
                        <FieldError error={!state?.ok ? state.data?.status : null} />
                    </div>

                    <div
                        // className={styles.detailsRow}
                        className="mb-5"
                    >
                        <div className={styles.formGroup}>
                            <label>{t('finance.fields.amount')}</label>
                            <input
                                type="number"
                                name="amount"
                                step={'.01'}
                                defaultValue={state.formData?.amount || initialData?.amount || ''}
                                placeholder="0.00"
                            />
                            <FieldError error={!state?.ok ? state.data?.amount : null} />
                        </div>
                        {/* <div className={styles.formGroup}>
                            <StaticSelect
                                options={options}
                                name={'payment_type'}
                                label={t('finance.fields.type')}
                                defaultValue={defaultPaymenType}
                            />
                            <FieldError error={!state?.ok ? state.data?.payment_type : null} />
                        </div> */}
                    </div>

                </div>

                {/* File Upload Section - Conditional based on module type */}
                {(type === 'payments' || type === 'reverse-payment') && (
                    <div className={styles.invoiceDetails}>
                        {/* Hidden input to signal if we should keep or delete the image */}
                        <input type="hidden" name="delete_payment_proof" value={keepPaymentProof ? "false" : "true"} />

                        <FileInput
                            name="payment_proof"
                            id="payment_proof"
                            placeholder={t('finance.fields.paymentProof')}
                            acceptedTypes="images"
                            showPreview={true}
                            error={!state?.ok ? state.data?.payment_proof : null}
                            defaultValue={initialData?.payment_proof ? [{ img: initialData.payment_proof }] : []}
                            onChange={(files, imageIds) => {
                                // If there are any files (new or existing), keep the image
                                // If no files, user deleted it
                                setKeepPaymentProof(files.length > 0 || imageIds.length > 0);
                            }}
                        />
                    </div>
                )}

                {/* Optional Fields - Only for Payment/Reverse Payment types */}
                {(type === 'payment' || type === 'payments' || type === 'reverse-payment') && (
                    <div className={styles.invoiceDetails}>
                        <details className="mb-4">
                            <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors select-none">
                                {t('finance.fields.optionalFields')}
                            </summary>

                            <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                {/* Payment Reference */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="payment_ref">{t('finance.fields.paymentRef')}</label>
                                    <input
                                        type="text"
                                        id="payment_ref"
                                        name="payment_ref"
                                        defaultValue={state.formData?.payment_ref || initialData?.payment_ref || ''}
                                        placeholder={t('finance.placeholders.paymentRef')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t('finance.fields.paymentRefHelper')}
                                    </p>
                                    <FieldError error={!state?.ok ? state.data?.payment_ref : null} />
                                </div>

                                {/* Transaction ID */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="transaction_id">{t('finance.fields.transactionId')}</label>
                                    <input
                                        type="text"
                                        id="transaction_id"
                                        name="transaction_id"
                                        defaultValue={state.formData?.transaction_id || initialData?.transaction_id || ''}
                                        placeholder={t('finance.placeholders.transactionId')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('finance.helpers.transactionId')}</p>
                                    <FieldError error={!state?.ok ? state.data?.transaction_id : null} />
                                </div>

                                {/* Sender Phone */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="sender_phone">{t('finance.fields.senderPhone')}</label>
                                    <input
                                        type="text"
                                        id="sender_phone"
                                        name="sender_phone"
                                        defaultValue={state.formData?.sender_phone || initialData?.sender_phone || ''}
                                        placeholder={t('finance.placeholders.senderPhone')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('finance.helpers.senderPhone')}</p>
                                    <FieldError error={!state?.ok ? state.data?.sender_phone : null} />
                                </div>

                                {/* Sender Name */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="sender_name">{t('finance.fields.senderName')}</label>
                                    <input
                                        type="text"
                                        id="sender_name"
                                        name="sender_name"
                                        defaultValue={state.formData?.sender_name || initialData?.sender_name || ''}
                                        placeholder={t('finance.placeholders.senderName')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('finance.helpers.senderName')}</p>
                                    <FieldError error={!state?.ok ? state.data?.sender_name : null} />
                                </div>

                                {/* Bank Name */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="bank_name">{t('finance.fields.bankName')}</label>
                                    <input
                                        type="text"
                                        id="bank_name"
                                        name="bank_name"
                                        defaultValue={state.formData?.bank_name || initialData?.bank_name || ''}
                                        placeholder={t('finance.placeholders.bankName')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('finance.helpers.bankName')}</p>
                                    <FieldError error={!state?.ok ? state.data?.bank_name : null} />
                                </div>

                                {/* Received By */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="received_by">{t('finance.fields.receivedBy')}</label>
                                    <input
                                        type="text"
                                        id="received_by"
                                        name="received_by"
                                        defaultValue={state.formData?.received_by || initialData?.received_by || ''}
                                        placeholder={t('finance.placeholders.receivedBy')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('finance.helpers.receivedBy')}</p>
                                    <FieldError error={!state?.ok ? state.data?.received_by : null} />
                                </div>
                            </div>
                        </details>
                    </div>
                )}

                <div className={styles.invoiceSummary}>
                    <div className={styles.formGroup}>
                        <label htmlFor="note">{t('finance.fields.note')}</label>
                        <textarea
                            id="note"
                            name="note"
                            rows="3"
                            defaultValue={state.formData?.note || initialData?.note || ''}
                            placeholder={t('finance.fields.moreNotes')}
                        />
                        <FieldError error={!state?.ok ? state.data?.note : null} />
                    </div>
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
                        {initialData?.id ? t("global.form.edit") : t("global.form.submit")}
                    </FormButton>
                </div>
            </Form>
        </div>
    )
}

export default MyForm
