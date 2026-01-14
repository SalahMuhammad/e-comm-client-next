"use client";

import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createUpdateCategory } from "../actions"
import Form from "next/form";
import { TextInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import FieldError from "@/components/FieldError";


function CategoryForm({ initialData, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, wrappedFormAction, isPending] = useActionState(createUpdateCategory, {})
    const router = useRouter();

    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));

            // If we have onSuccess callback (modal mode), call it instead of navigating
            if (isModal && onSuccess) {
                onSuccess(state.data);
                return;
            }

            if (state.data?.id) {
                // router.replace(`/finance/expense/category/view/${state.data?.id}`);
                router.replace(`/finance/expense/category/list`);
            }
        }
    }, [state, isModal, onSuccess, handleGenericErrors, router, t, initialData?.id])

    const formTitle = initialData?.id
        ? t("finance.expense.category.edit")
        : t("finance.expense.category.create");

    return (
        <div className={isModal ? "" : styles.invoiceContainer}>
            <Form
                action={wrappedFormAction}
                className={isModal ? "" : styles.invoiceForm}
            >
                {!isModal && (
                    <div className={styles.invoiceHeader}>
                        <h2>
                            {formTitle}
                            {initialData?.id && " #"}
                            {initialData?.id}
                        </h2>
                    </div>
                )}

                <div className={isModal ? "" : styles.invoiceDetails}>
                    {initialData?.id && (
                        <TextInput
                            placeholder={'id'}
                            id="id"
                            value={initialData?.id}
                            bordercolor="border-green-500 dark:border-green-400"
                            labelcolor="text-green-600 dark:text-green-400"
                            focuscolor=""
                            focuslabelcolor=""
                            name="id"
                            readOnly
                        />
                    )}

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

                <div className={isModal ? "mt-4" : styles.formActions}>
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

export default CategoryForm
