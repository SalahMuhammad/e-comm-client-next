"use client";

import { useActionState, useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateExpense } from "../actions"
import Form from "next/form";
import { DateInput, FileInput, TextInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput } from "@/components/inputs/index"
import { StaticOptions } from "@/components/inputs/index";
import { getFormDefaultValue } from "@/utils/formDefaultValue";


function ExpenseForm({ initialData }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateExpense, {})
    const router = useRouter();
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

    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(initialData?.hashed_id ? t("global.form.successEdit") : t("global.form.successCreate"));
            if (state.data?.hashed_id) {
                router.replace(`/finance/expense/list`);
            }
        }
    }, [state, handleGenericErrors, router, t])

    const handleAccountTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.account_type_name + ' / ' + obj.account_name,
        }))
        callback(data)
    }

    return (
        <div className={`${styles.invoiceContainer} w-20`}>
            <Form
                action={formAction}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{initialData?.hashed_id ? t("finance.general.update") : t("finance.general.add")} {t("finance.expense.header")} {initialData?.hashed_id && "#"} {initialData?.hashed_id}</h2>
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
                            <StaticOptions
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

                <div className={styles.formActions}>
                    <FormButton
                        type="submit"
                        variant={initialData?.hashed_id ? "secondary" : "primary"}
                        size="md"
                        bgColor={initialData?.hashed_id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                        hoverBgColor={initialData?.hashed_id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                        textColor="text-white dark:text-gray-100"
                        className="w-full"
                        isLoading={isPending}
                    >
                        {initialData?.hashed_id ? t("global.form.edit") : t("global.form.submit")}
                    </FormButton>
                </div>
            </Form>
        </div>
    )
}

export default ExpenseForm
