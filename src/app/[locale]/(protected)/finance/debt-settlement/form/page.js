"use client";

import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createUpdateDebtSettlementTransaction } from "../actions"
import Form from "next/form";
import { NumberInput, TextInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";
import StaticSelect from "@/components/ReactStaticSelect";


function DebtSettlementForm({ initialData }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateDebtSettlementTransaction, {})
    const router = useRouter();
    const options = [
        { value: 'approved', label: 'approved' },
        { value: 'not_approved', label: 'not_approved' },
    ]
    const defaultDate = state.formData?.date || initialData?.date || formatDateManual(new Date())
    const defaultOwner = state.formData?.owner || initialData?.owner ? { 
        value: state.formData?.owner      || initialData?.owner, 
        label: state.formData?.owner_name || initialData?.owner_name
    } : undefined
    const defaultStatus = state.formData?.status || initialData?.status ? { 
        value: state.formData?.status   || initialData?.status, 
        label: state.formData?.status   || initialData?.status 
    } : options[0]


    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(state.data?.id ? "successEdit" : "successCreate");
            // if (state.data?.id) {
                router.replace(`/finance/debt-settlement/list`);
            // }
        }
    }, [state])

    return (
        <div className={styles.invoiceContainer}>
            <Form
                action={formAction}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{initialData?.id ? t("finance.general.update") : t("finance.general.add")} {t("finance.debtSettlement.header")} {t("finance.general.t")} {initialData?.hashed_id && "#"} {initialData?.hashed_id}</h2>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="date">{t('finance.fields.date')}</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={defaultDate}
                            required
                        />
                        <FieldError error={state.data?.date} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/buyer-supplier-party/?s='}
                            label={t('finance.fields.owner')}
                            name="owner"
                            defaultValue={defaultOwner}
                            required
                        />
                        <FieldError error={state.data?.owner} />
                    </div>

                    <div className={styles.detailsRow}>
                        <div className={styles.formGroup}>
                            <NumberInput  
                                id="amount" 
                                name="amount" 
                                step={0.01}
                                placeholder={t("finance.fields.amount")} 
                                error={state?.data?.amount ||  ""}
                                defaultValue={state.formData?.amount || initialData?.amount || ''}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <StaticSelect 
                                options={options}
                                name={'status'}
                                label={t('finance.fields.status')}
                                defaultValue={defaultStatus}
                            />
                            <FieldError error={state.data?.status} />
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
                        <FieldError error={state.data?.note} />
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

export default DebtSettlementForm
