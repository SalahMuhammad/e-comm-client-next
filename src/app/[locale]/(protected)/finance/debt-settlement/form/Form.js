"use client";

import { useActionState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateDebtSettlementTransaction } from "../actions"
import { DateInput, NumberInput, TextInput } from "@/components/inputs/index"
import GenericFormShell from "@/components/GenericFormShell";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput } from "@/components/inputs/index"
import { StaticOptionsInput } from "@/components/inputs/index";


function DebtSettlementForm({ initialData }) {
    const t = useTranslations()
    const [state, formAction, isPending] = useActionState(createUpdateDebtSettlementTransaction, {})
    const options = [
        { value: 'approved', label: t('finance.debtSettlement.status.approved') },
        { value: 'not_approved', label: t('finance.debtSettlement.status.not_approved') },
    ]
    const defaultDate = state.formData?.date || initialData?.date || formatDateManual(new Date())
    const defaultOwner = state.formData?.owner || initialData?.owner ? {
        value: state.formData?.owner || initialData?.owner,
        label: state.formData?.owner_name || initialData?.owner_name
    } : undefined
    const defaultStatus = state.formData?.status || initialData?.status ? {
        value: state.formData?.status || initialData?.status,
        label: t(`finance.debtSettlement.status.${state.formData?.status || initialData?.status}`)
    } : options[0]

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath="/finance/debt-settlement/list"
            isModal={false}
            customTitle={`${initialData?.id ? t("finance.general.update") : t("finance.general.add")} ${t("finance.debtSettlement.header")} ${t("finance.general.t")} ${initialData?.hashed_id ? "#" + initialData.hashed_id : ""}`.trim()}
            showIdField={false}
        >
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

                <div className={`${initialData?.hashed_id ? 'mt-3' : ''}`}>
                    <DateInput
                        id="date"
                        name="date"
                        placeholder={t('finance.fields.date')}
                        defaultValue={defaultDate}
                        error={!state?.ok ? state?.data?.date : ""}
                        required
                    />
                </div>

                <div className={`mt-8 ${styles.formGroup}`}>
                    <DynamicOptionsInput
                        url={'/api/buyer-supplier-party/?s='}
                        label={t('finance.fields.owner')}
                        name="owner"
                        defaultValue={defaultOwner}
                        required
                    />
                    <FieldError error={!state?.ok ? state.data?.owner : null} />
                </div>

                <div className={`${styles.detailsRow} mt-2`}>
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
                        <StaticOptionsInput
                            options={options}
                            name={'status'}
                            label={t('finance.fields.status')}
                            defaultValue={defaultStatus}
                        />
                        <FieldError error={!state?.ok ? state.data?.status : null} />
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
        </GenericFormShell>
    )
}

export default DebtSettlementForm
