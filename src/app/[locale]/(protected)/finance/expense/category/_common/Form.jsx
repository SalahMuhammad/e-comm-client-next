"use client";

import { useActionState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateCategory } from "../actions"
import { TextInput } from "@/components/inputs/index"
import GenericFormShell from "@/components/GenericFormShell";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import FieldError from "@/components/FieldError";


function CategoryForm({ initialData, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations()
    const [state, wrappedFormAction, isPending] = useActionState(createUpdateCategory, {})
    const formTitle = initialData?.id
        ? t("finance.expense.category.edit")
        : t("finance.expense.category.create");

    return (
        <GenericFormShell
            state={state}
            formAction={wrappedFormAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath="/finance/expense/category/list"
            isModal={isModal}
            onSuccess={onSuccess}
            customTitle={`${formTitle} ${initialData?.id ? "#" + initialData.id : ""}`.trim()}
        >
            <div className={isModal ? "" : styles.invoiceDetails}>
                {/* Category Name - Required */}
                <div className={styles.formGroup}>
                    <label htmlFor="name">{t('finance.expense.category.name')} *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={state.formData?.name || initialData?.name || ''}
                        placeholder={t('finance.expense.category.namePlaceholder')}
                        required
                    />
                    <FieldError error={!state?.ok ? state.data?.name : null} />
                </div>

                {/* Description - Optional */}
                <div className={`${styles.formGroup} mt-3`}>
                    <label htmlFor="description">{t('finance.expense.category.description')}</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        defaultValue={state.formData?.description || initialData?.description || ''}
                        placeholder={t('finance.expense.category.descriptionPlaceholder')}
                    />
                    <FieldError error={!state?.ok ? state.data?.description : null} />
                </div>
            </div>
        </GenericFormShell>
    )
}

export default CategoryForm
