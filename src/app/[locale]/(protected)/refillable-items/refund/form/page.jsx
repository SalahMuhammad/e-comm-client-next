"use client";

import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createRefundTransaction } from "../../actions";
import Form from "next/form";
import { NumberInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import styles from './form.module.css'
import { toast } from 'sonner'
import { redirect } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";


function RefilledForm({ initialData }) {
    const t = useTranslations("refillableItems");
    const tGlobal = useTranslations("global");
    const [state, formAction, isPending] = useActionState(createRefundTransaction, { errors: {} });
    const handleGenericErrors = useGenericResponseHandler()

    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        if (handleGenericErrors(state)) return


        if (state?.ok) {
            toast.success(t(initialData?.id ? "from.successEdit" : "form.successCreate"));
            if (state.data?.id) {
                redirect("/refillable-items/refund/list");
            }
        }
    }, [state])

    return (
        <div className={styles.formContainer}>
            <Form action={formAction} className={styles.formWrapper}>
                <div className={styles.formHeader}>
                    <h2>{initialData?.id ? t("title.editRefund") : t("title.createRefund")}</h2>
                </div>

                <div className={styles.formBody}>
                    {initialData?.id && (
                        <div className={styles.formGroup}>
                            <NumberInput 
                                placeholder={'ID'} 
                                id="id" 
                                value={state?.id || initialData.id} 
                                borderColor="border-green-500 dark:border-green-400" 
                                labelColor="text-green-600 dark:text-green-400" 
                                focusColor="" 
                                focusLabelColor="" 
                                name="id" 
                                readOnly 
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={state?.formData?.date || initialData?.date || formatDateManual(new Date())}
                            required
                        />
                        <FieldError error={state?.data?.date} />
                    </div>

                    <div className={styles.formGroup}>
                        <SearchableDropdown
                            label={t("form.owner")}
                            url={'/api/buyer-supplier-party/?s='}
                            name={`owner`}
                            defaultValue={state.formData?.id ? { value: state.formData?.owner, label: state.formData?.owner_name } : initialData?.id ? { value: initialData?.owner, label: initialData?.owner_name } : null }
                            placeholder={t("form.owner")}
                        />
                        <FieldError error={state?.data?.owner} />
                    </div>

                    <div className={styles.formGroup}>
                        <SearchableDropdown
                            label={t("form.item")}
                            name={'item'}
                            url="api/refillable-sys/item-transformer/?s="
                            customLoadOptions={handleItemTransformer}
                            className={state.data?.item && 'invalid-select'}
                            defaultValue={initialData?.id ? { value: initialData?.item, label: initialData?.item_name } : null}
                            placeholder={t("form.item")}
                        />
                        <FieldError error={state.data?.item} />
                    </div>

                    <div className={styles.formGroup}>
                        <NumberInput
                            id="quantity"
                            name="quantity"
                            placeholder={t("form.quantity")}
                            error={state.data?.quantity || ""}
                            defaultValue={initialData?.id ? initialData?.quantity : state?.formData?.quantity || ''}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <SearchableDropdown
                            label={t("form.repository")}
                            url={'/api/repositories/?s='}
                            name={`repository`}
                            defaultValue={initialData?.id ? { value: initialData.repository, label: initialData.repository_name } : { value: 10000, label: 'الرئيسي' }}
                            placeholder={t("form.repository")}
                        />
                        <FieldError error={state?.data?.repository} />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="notes">{t("form.notes")}</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            defaultValue={state?.formData?.notes ? state?.formData?.notes : initialData?.notes || ''}
                            placeholder={t("form.moreNotes")}
                        />
                        <FieldError error={state?.data?.notes} />
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
                        {initialData?.id ? tGlobal("form.edit") : tGlobal("form.submit")}
                    </FormButton>
                </div>
            </Form>
        </div>
    )
}

export default RefilledForm


const handleItemTransformer = (res, callback) => {
    const data = res?.results?.map((obj) => ({
        value: obj.item,
        label: obj.empty,
    }))
    callback(data)
}
