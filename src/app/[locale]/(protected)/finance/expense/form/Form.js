"use client";

import { useActionState, useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateExpense } from "../actions"
import { DateInput, FileInput, TextInput } from "@/components/inputs/index"
import GenericFormShell from "@/components/GenericFormShell";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput } from "@/components/inputs/index"
import { StaticOptionsInput } from "@/components/inputs/index";
import { getFormDefaultValue } from "@/utils/formDefaultValue";


function ExpenseForm({ initialData }) {
    const t = useTranslations()
    const [state, formAction, isPending] = useActionState(createUpdateExpense, {})
    // Track image state with simpler logic
    const [imageState, setImageState] = useState({
        hadInitialImage: initialData?.image ? true : false,  // Did we start with an image?
        currentlyHasFiles: initialData?.image ? true : false, // Does FileInput currently have files?
        userDeleted: false  // Did user explicitly delete the initial image?
    })

    const statusOptions = [
        { value: '1', label: t('finance.statusOptions.pending') },
        { value: '2', label: t('finance.statusOptions.confirmed') },
        { value: '3', label: t('finance.statusOptions.rejected') },
        { value: '4', label: t('finance.statusOptions.reimbursed') }
    ]

    const defaultDate = getFormDefaultValue(state, initialData, 'date', {
        defaultValue: formatDateManual(new Date())
    })

    const defaultCategory = getFormDefaultValue(state, initialData, 'category', {
        labelKey: 'category_name'
    })

    const defaultBusinessAccount = getFormDefaultValue(state, initialData, 'business_account', {
        labelKey: 'payment_method_name'
    })

    const defaultStatus = getFormDefaultValue(state, initialData, 'status', {
        selectOptions: statusOptions,
        defaultValue: statusOptions[0]
    })


    const handleAccountTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.account_type_name + ' / ' + obj.account_name,
        }))
        callback(data)
    }

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath="/finance/expense/list"
            isModal={false}
            customTitle={`${initialData?.hashed_id ? t("finance.general.update") : t("finance.general.add")} ${t("finance.expense.header")} ${initialData?.hashed_id ? "#" + initialData.hashed_id : ""}`.trim()}
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
                        url={'/api/finance/account-vault/?is_active=true&account_name='}
                        label={t('finance.fields.toVault')}
                        customLoadOptions={handleAccountTransformer}
                        name={'business_account'}
                        defaultValue={defaultBusinessAccount}
                        required
                    />
                    <FieldError error={!state?.ok ? state.data?.business_account : null} />
                </div>

                <div className={`mt-8 ${styles.formGroup}`}>
                    <DynamicOptionsInput
                        url={'/api/finance/expenses/category/list/?name='}
                        label={t('finance.fields.category')}
                        name="category"
                        defaultValue={defaultCategory}
                    />
                    <FieldError error={!state?.ok ? state.data?.category : null} />
                </div>

                <div className={styles.detailsRow}>
                    <div className={styles.formGroup}>
                        <label>{t('finance.fields.amount')}</label>
                        <input
                            type="number"
                            name="amount"
                            step={'.01'}
                            defaultValue={getFormDefaultValue(state, initialData, 'amount')}
                            placeholder="0.00"
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.amount : null} />
                    </div>

                    <div className={`${styles.formGroup} z-20`}>
                        <StaticOptionsInput
                            options={statusOptions}
                            name={'status'}
                            label={t('finance.fields.status')}
                            defaultValue={defaultStatus}
                        />
                        <FieldError error={!state?.ok ? state.data?.status : null} />
                    </div>
                </div>
            </div>

            {/* File Upload Section */}
            <div className={styles.invoiceDetails}>
                {/* Hidden input to signal if we should keep the existing image */}
                <input
                    type="hidden"
                    name="keep_image"
                    value={
                        // Keep if: had initial image AND user didn't delete it
                        imageState.hadInitialImage && !imageState.userDeleted ? "true" : "false"
                    }
                />

                <FileInput
                    name="image"
                    id="image"
                    placeholder={t('finance.fields.image')}
                    acceptedTypes="images"
                    showPreview={true}
                    error={!state?.ok ? state.data?.image : null}
                    defaultValue={initialData?.image ? [{ img: initialData.image }] : []}
                    onChange={({ newFiles, existingIds, hasChanges }) => {
                        // Update state based on current files
                        const totalFiles = newFiles.length + existingIds.length;

                        setImageState(prev => ({
                            hadInitialImage: prev.hadInitialImage, // This never changes
                            currentlyHasFiles: totalFiles > 0,
                            // User deleted if: had initial image AND made changes AND now has no files
                            userDeleted: prev.hadInitialImage && hasChanges && totalFiles === 0
                        }));
                    }}
                />
            </div>

            <div className={styles.invoiceSummary}>
                <div className={styles.formGroup}>
                    <label htmlFor="notes">{t('finance.fields.note')}</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        defaultValue={state.formData?.notes || initialData?.notes || ''}
                        placeholder={t('finance.fields.moreNotes')}
                    />
                    <FieldError error={!state?.ok ? state.data?.notes : null} />
                </div>
            </div>
        </GenericFormShell>
    )
}

export default ExpenseForm
