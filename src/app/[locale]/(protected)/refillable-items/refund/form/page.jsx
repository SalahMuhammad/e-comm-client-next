"use client";

import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createRefundTransaction } from "../../actions";
import Form from "next/form";
import { NumberInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { redirect } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";


function RefilledForm({ initialData }) {
    const t = useTranslations("warehouse.repositories.form");
    const [state, formAction, isPending] = useActionState(createRefundTransaction, { errors: {} });
    const handleGenericErrors = useGenericResponseHandler()

    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        if (handleGenericErrors(state)) return


        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
            if (state.data?.id) {
                redirect("/refillable-items/refund/list");
            }
        }
    }, [state])

    return (
        <Form
            action={formAction}
            className="max-w-3xl w-2xl mx-auto"
            style={{ paddingTop: '1rem' }}
        >
            {initialData?.id && (
                <NumberInput placeholder={'ID'} id="id" value={state?.id || initialData.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
            )}

            <div className={`flex flex-col py-3`}>
                <label className="text-sm font-medium text-gray-600 mb-1.5" htmlFor="date">Date</label>
                <input
                    className="border border-gray-300 rounded p-2"
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={state?.formData?.date || initialData?.date || formatDateManual(new Date())}
                    required
                />
                <FieldError error={state?.data?.date} />
            </div>

            <SearchableDropdown
                url={'/api/buyer-supplier-party/?s='}
                name={`owner`}
                defaultValue={state.formData?.id ? { value: state.formData?.owner, label: state.formData?.owner_name } : initialData?.id ? { value: initialData?.owner, label: initialData?.owner_name } : null }
                placeholder={"Client"}
            />
            <FieldError error={state?.data?.owner} />

            <SearchableDropdown
                name={'item'}
                url="api/refillable-sys/item-transformer/?s="
                customLoadOptions={handleItemTransformer}
                className={state.data?.item && 'invalid-select'}
                defaultValue={initialData?.id ? { value: initialData?.item, label: initialData?.item_name } : null}
            />
            <FieldError error={state.data?.item} />

            <NumberInput
                id="quantity"
                name="quantity"
                placeholder={"Quantity"}
                error={state.data?.quantity || ""}
                defaultValue={initialData?.id ? initialData?.quantity : state?.formData?.quantity || ''}
            />

            <SearchableDropdown
                url={'/api/repositories/?s='}
                name={`repository`}
                defaultValue={initialData?.id ? { value: initialData.repository, label: initialData.repository_name } : { value: 10000, label: 'الرئيسي' }}
                placeholder={"Repository"}
            />
            <FieldError error={state?.data?.repository} />

            <div className="flex flex-col">
                <label htmlFor="notes" className="text-sm font-medium text-gray-600 mb-1.5">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    className="border border-gray-300 rounded p-2"
                    defaultValue={state?.formData?.notes ? state?.formData?.notes : initialData?.notes || ''}
                    placeholder={"additional Notes..."}
                />
                <FieldError error={state?.data?.notes} />
            </div>

            <FormButton
                type="submit"
                variant={initialData?.id ? "secondary" : "danger"}
                size="md"
                bgColor="bg-neutral-100 dark:bg-neutral-800"
                hoverBgColor="bg-neutral-200 dark:bg-neutral-700"
                textColor="text-black dark:text-white"
                className="w-full mt-3"
                isLoading={isPending}
            >
                {initialData?.id ? t("edit") : t("submit")}
            </FormButton>
        </Form>
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
