"use client";

import { useTranslations } from "next-intl";
import { useActionState } from 'react';
import { formatDateManual } from "@/utils/dateFormatter";
import GenericFormShell from '@/components/GenericFormShell';
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput, NumberInput } from "@/components/inputs/index"
import { createRefundTransaction } from "../../actions";


function RefilledForm({ initialData }) {
    const t = useTranslations("refillableItems");
    const tGlobal = useTranslations("global");
    const [state, formAction, isPending] = useActionState(createRefundTransaction, { errors: {} });

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath="/refillable-items/refund/list"
            isModal={false}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date">{t("form.date")}</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        defaultValue={state?.formData?.date || initialData?.date || formatDateManual(new Date())}
                        required
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <FieldError error={!state?.ok ? state?.data?.date : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        label={t("form.owner")}
                        url={'/api/buyer-supplier-party/?s='}
                        name={`owner`}
                        defaultValue={state.formData?.id ? { value: state.formData?.owner, label: state.formData?.owner_name } : initialData?.id ? { value: initialData?.owner, label: initialData?.owner_name } : null}
                        placeholder={t("form.owner")}
                    />
                    <FieldError error={!state?.ok ? state?.data?.owner : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        label={t("form.item")}
                        name={'item'}
                        url="api/refillable-sys/item-transformer/?s="
                        customLoadOptions={handleItemTransformer}
                        className={state.data?.item && 'invalid-select'}
                        defaultValue={initialData?.id ? { value: initialData?.item, label: initialData?.item_name } : null}
                        placeholder={t("form.item")}
                    />
                    <FieldError error={!state?.ok ? state.data?.item : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <NumberInput
                        id="quantity"
                        name="quantity"
                        placeholder={t("form.quantity")}
                        error={!state?.ok ? state.data?.quantity : ""}
                        defaultValue={initialData?.id ? initialData?.quantity : state?.formData?.quantity || ''}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        label={t("form.repository")}
                        url={'/api/repositories/?s='}
                        name={`repository`}
                        defaultValue={initialData?.id ? { value: initialData.repository, label: initialData.repository_name } : { value: 10000, label: 'الرئيسي' }}
                        placeholder={t("form.repository")}
                    />
                    <FieldError error={!state?.ok ? state?.data?.repository : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="notes">{t("form.notes")}</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        defaultValue={state?.formData?.notes ? state?.formData?.notes : initialData?.notes || ''}
                        placeholder={t("form.moreNotes")}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <FieldError error={!state?.ok ? state?.data?.notes : null} />
                </div>
            </div>
        </GenericFormShell>
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
