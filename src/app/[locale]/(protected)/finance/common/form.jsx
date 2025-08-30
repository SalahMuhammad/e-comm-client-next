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
                    redirect(`/finance/${type}/view/${res.data.id}`);
        }

        setIsPending(false)
    }

    return (
        <Form
            onSubmit={handleSubmit}
            className="w-md max-w-lg mx-auto mt-5"
            style={{ paddingTop: '1rem' }}
        >
            {initialData?.id && (
                <NumberInput placeholder={'id'} id="id" value={initialData.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
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

            <div className={`mt-8 ${styles.formGroup}`} >
                <SearchableDropdown
                    url={'/api/buyer-supplier-party/?s='}
                    label={'Owner'}
                    name="owner"
                    defaultValue={initialData?.owner ? { value: initialData?.owner, label: initialData?.owner_name } : ''}
                    required
                />
                <FieldError error={errors?.owner} />
            </div>

            <div className="my-7">
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

            <div className="flex items-center mb-4">
                <input id="isPaid" type="checkbox" name="paid" defaultChecked={formData?.paid || initialData?.paid} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="isPaid" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{t('finance.status.paid')}</label>
            </div>

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

            <FormButton
                type="submit"
                variant={initialData?.id ? "secondary" : "danger"}
                size="md"
                bgColor="bg-neutral-100 dark:bg-neutral-800"
                hoverBgColor="bg-neutral-200 dark:bg-neutral-700"
                textColor="text-black dark:text-white"
                className="w-full mt-3"
                isLoading={isPending}
            >
                {initialData?.id ? t("global.form.edit") : t("global.form.submit")}
            </FormButton>
        </Form>
    )
}

export default MyForm
