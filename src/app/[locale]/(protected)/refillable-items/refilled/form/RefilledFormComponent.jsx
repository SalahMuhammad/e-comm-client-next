"use client";

import { useTranslations } from "next-intl";
import { useActionState } from 'react';
import { formatDateManual } from "@/utils/dateFormatter";
import GenericFormShell from '@/components/GenericFormShell';
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput, NumberInput } from "@/components/inputs/index"
import { createRefilledItemsTransaction } from "../../actions";


function RefilledForm({ initialData }) {
    const t = useTranslations("refillableItems");
    const tGlobal = useTranslations("global");
    const [state, formAction, isPending] = useActionState(createRefilledItemsTransaction, { errors: {} });

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath="/refillable-items/refilled/list"
            isModal={false}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date">Date</label>
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
                        name={'refilled_item'}
                        url="api/refillable-sys/item-transformer/?s="
                        customLoadOptions={handleItemTransformer}
                        className={state.data?.owner && 'invalid-select'}
                        defaultValue={initialData?.id ? { value: initialData?.refilled_item, label: initialData?.refilled_item_name } : null}
                        placeholder={t("form.refilledItem")}
                    />
                    <FieldError error={!state?.ok ? state.data?.refilled_item : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <NumberInput
                        id="refilled_quantity"
                        name="refilled_quantity"
                        placeholder={t("form.quantity")}
                        error={!state?.ok ? state.data?.refilled_quantity : ""}
                        defaultValue={initialData?.id ? initialData?.refilled_quantity : state?.formData?.refilled_quantity || ''}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        name={'used_item'}
                        url="api/refillable-sys/ore-item/?s="
                        customLoadOptions={handleLoadOre}
                        className={state.data?.owner && 'invalid-select'}
                        defaultValue={initialData?.id ? { value: initialData?.used_item, label: initialData?.used_item_name } : null}
                        placeholder={t("form.usedItem")}
                    />
                    <FieldError error={!state?.ok ? state.data?.used_item : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <NumberInput
                        id="used_quantity"
                        name="used_quantity"
                        step={'0.01'}
                        placeholder={t("form.usedQuantity")}
                        error={!state?.ok ? state.data?.used_quantity : ""}
                        defaultValue={initialData?.id ? initialData?.used_quantity : state?.formData?.used_quantity || ''}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        url={'/api/repositories/?s='}
                        name={`repository`}
                        defaultValue={initialData?.id ? { value: initialData.repository, label: initialData.repository_name } : { value: 10000, label: 'الرئيسي' }}
                        placeholder={t("form.repository")}
                    />
                    <FieldError error={!state?.ok ? state?.data?.repository : null} />
                </div>

                <div className="flex flex-col gap-2">
                    <DynamicOptionsInput
                        url={'/api/employees/?s='}
                        customLoadOptions={handleLoadEmployees}
                        name={`employee`}
                        defaultValue={state.formData?.id ? { value: state.formData?.employee, label: state.formData?.employee_name } : initialData?.id ? { value: initialData?.employee, label: initialData?.employee_name } : null}
                        placeholder={t("form.employee")}
                    />
                    <FieldError error={!state?.ok ? state?.data?.employee : null} />
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


const handleLoadOre = (res, callback) => {
    const data = res?.results?.map((obj) => ({
        value: obj.id,
        label: obj.item_name,
    }))
    callback(data)
}

const handleItemTransformer = (res, callback) => {
    const data = res?.results?.map((obj) => ({
        value: obj.item,
        label: obj.empty,
    }))
    callback(data)
}

const handleLoadEmployees = (res, callback) =>
    callback(res?.results?.map((obj) => ({
        value: obj.id,
        label: obj.first_name + ' ' + obj.last_name,
    })))

