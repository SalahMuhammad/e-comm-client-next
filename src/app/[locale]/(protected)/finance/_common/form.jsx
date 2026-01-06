"use client";

import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createUpdateTransaction } from "./actions"
import Form from "next/form";
import { TextInput } from "@/components/inputs/index"
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
    const options = type === 'payments' ? [
        { value: 'invoice_payment', label: 'invoice_payment' },
        { value: 'advance_payment', label: 'advance_payment' },
    ] : [
        { value: 'invoice_payment', label: 'invoice_payment' },
        { value: 'refund', label: 'refund' },
        { value: 'expense', label: 'expense' },
    ]
    const defaultDate = state.formData?.date || initialData?.date || formatDateManual(new Date())
    const defaultOwner = state.formData?.owner || initialData?.owner ? {
        value: state.formData?.owner || initialData?.owner,
        label: state.formData?.owner_name || initialData?.owner_name
    } : undefined
    const defaultPaymenType = state.formData?.payment_type || initialData?.payment_type ? {
        value: state.formData?.payment_type || initialData?.payment_type,
        label: state.formData?.payment_type || initialData?.payment_type
    } : options[0]
    const defaultPaymentMethod = state.formData?.payment_method || initialData?.payment_method ? {
        value: state.formData?.payment_method || initialData?.payment_method,
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
            toast.success(t(state.data?.id ? "successEdit" : "successCreate"));
            if (state.data?.id) {
                router.replace(`/finance/${type}/view/${state.data?.hashed_id}`);
            }
        }
    }, [state])

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

                    <div className={styles.formGroup}>
                        <label htmlFor="date">{t('finance.fields.date')}</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={defaultDate}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.date : null} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={t('finance.fields.owner')}
                            name="owner"
                            defaultValue={defaultOwner}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.owner : null} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/payment/methods/?s='}
                            label={t('finance.fields.paymentMethod')}
                            name={'payment_method'}
                            defaultValue={defaultPaymentMethod}
                        />
                        <FieldError error={!state?.ok ? state.data?.payment_method : null} />
                    </div>

                    <div className={styles.detailsRow}>
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
                        <div className={styles.formGroup}>
                            <StaticSelect
                                options={options}
                                name={'payment_type'}
                                label={t('finance.fields.type')}
                                defaultValue={defaultPaymenType}
                            />
                            <FieldError error={!state?.ok ? state.data?.payment_type : null} />
                        </div>
                    </div>

                    <input type="hidden" name="paid" value="false" />

                    <div className={styles.formGroup}>
                        <div className="relative flex items-start">
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
                                    defaultChecked={state.formData?.paid || initialData?.paid}
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
