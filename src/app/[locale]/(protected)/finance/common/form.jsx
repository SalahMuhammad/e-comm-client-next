"use client";

import { useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateTransaction } from "./actions"
import Form from "next/form";
import { NumberInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { redirect, useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";
import StaticSelect from "@/components/ReactStaticSelect";


function MyForm({ initialData, type }) {
    const [isPending, setIsPending] = useState(false)
    const [errors, setErrors] = useState()
    const [formData, setFormData] = useState()
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const router = useRouter();
    const options = type === 'payments' ? [
        { value: 'invoice_payment', label: 'invoice_payment' },
        { value: 'advance_payment', label: 'advance_payment' },
    ] : [
        { value: 'invoice_payment', label: 'invoice_payment' },
        { value: 'refund', label: 'refund' },
        { value: 'expense', label: 'expense' },
    ]


    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsPending(true)

        const res = await createUpdateTransaction(new FormData(e.currentTarget), type)
        if (handleGenericErrors(res)) return

        switch (res.status) {
            case 400:
                setErrors(res.data);
                setFormData(res.formData);
                setIsPending(false);
                break;
            case 200:
            case 201:
                toast.success(`${initialData?.id ? t('finance.success.updated') : t('finance.success.created')}...`);
                res.data.id &&
                    redirect(`/finance/${type}/view/${res.data.hashed_id}`);
        }

        setIsPending(false)
    }

    return (
        <div className={styles.invoiceContainer}>
            <Form
                onSubmit={handleSubmit}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{t("finance.fields.transaction")}</h2>
                </div>

                <div className={styles.invoiceDetails}>
                    {initialData?.id && (
                        <NumberInput 
                            placeholder={'id'} 
                            id="id" 
                            value={initialData.hashed_id} 
                            borderColor="border-green-500 dark:border-green-400" 
                            labelColor="text-green-600 dark:text-green-400" 
                            focusColor="" 
                            focusLabelColor="" 
                            name="id" 
                            readOnly 
                        />
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="date">{t('finance.fields.date')}</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={formData?.date || initialData?.date || formatDateManual(new Date())}
                            required
                        />
                        <FieldError error={errors?.date} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={'Owner'}
                            name="owner"
                            defaultValue={initialData?.owner ? { value: initialData?.owner, label: initialData?.owner_name } : ''}
                            required
                        />
                        <FieldError error={errors?.owner} />
                    </div>

                    <div className={styles.formGroup}>
                        <SearchableDropdown
                            url={'/api/payment/methods/?s='}
                            label={t('finance.fields.paymentMethod')}
                            name={'payment_method'}
                            defaultValue={initialData?.payment_method ? { value: initialData?.payment_method, label: initialData?.payment_method_name } : ''}
                        />
                        <FieldError error={errors?.payment_method} />
                    </div>

                    <div className={styles.detailsRow}>
                        <div className={styles.formGroup}>
                            <label>{t('finance.fields.amount')}</label>
                            <input
                                type="number"
                                name="amount"
                                step={'.01'}
                                defaultValue={formData?.amount || initialData?.amount || ''}
                                placeholder="0.00"
                            />
                            <FieldError error={errors?.amount} />
                        </div>
                        <div className={styles.formGroup}>
                            <StaticSelect 
                                options={options}
                                name={'payment_type'}
                                label={t('finance.fields.type')}
                                defaultValue={initialData?.payment_type ? { value: initialData?.payment_type, label: initialData?.payment_type } : 0}
                            />
                            <FieldError error={errors?.payment_type} />
                        </div>
                    </div>

                    <input type="hidden" name="paid" value="false" />

                    <div className={styles.formGroup}>
                        <div className="relative flex items-start py-4">
                            <div className="min-w-0 flex-1 text-sm leading-6">
                                <label htmlFor="isPaid" className="font-medium text-gray-900 dark:text-gray-100 select-none">
                                    {t('finance.status.paid')}:
                                </label>
                            </div>
                            <div className="ml-3 flex h-6 items-center">
                                <input
                                    id="isPaid"
                                    name="paid"
                                    type="checkbox"
                                    defaultChecked={formData?.paid || initialData?.paid}
                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 
                                    focus:ring-primary-600 focus:ring-offset-2 
                                    dark:border-gray-600 dark:bg-gray-700 
                                    dark:focus:ring-offset-gray-800 
                                    transition-colors duration-200 ease-in-out
                                    cursor-pointer hover:border-primary-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.invoiceSummary}>
                    <div className={styles.formGroup}>
                        <label htmlFor="note">Note</label>
                        <textarea
                            id="note"
                            name="note"
                            rows="3"
                            defaultValue={formData?.note || initialData?.note || ''}
                            placeholder="Additional notes..."
                        />
                        <FieldError error={errors?.note} />
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
