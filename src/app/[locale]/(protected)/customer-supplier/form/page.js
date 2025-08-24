"use client";

import Form from "next/form";
import { createUpdateCS } from "../actions"
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton"
import { TextInput, TextAreaInput, NumberInput } from "@/components/inputs/index"
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";


function CSForm({ obj }) {
    const t = useTranslations("customer-supplier.form");
    const tGlobal = useTranslations("");
    const [state, formAction, isPending] = useActionState(createUpdateCS, { errors: {} });
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler()
    const defaultName = state?.formData?.name || (! state?.ok && obj?.name) || ''
    const defaultDetail = state?.formData?.detail || (! state?.ok && obj?.detail) || ''

    useEffect(() => {
        if (! state?.status) return
        if (handleGenericErrors(state)) return;

        if (state.ok) {
            if(obj?.id) {
                toast.success(tGlobal("global.form.editSuccess"));
            } else {
                toast.success(tGlobal("global.form.createSuccess"));
            }
            obj?.id &&
                router.replace("/customer-supplier/list/");
        }
    }, [state])

    return (
        <Form
            action={formAction}
            className="max-w-md mx-auto mt-15"
            style={{ paddingTop: '1rem' }}
            // className="flex flex-col gap-4 p-4"
        >
            {obj?.id && (
                <NumberInput placeholder={t("id")} id="id" value={state?.id || obj.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
            )}

            <TextInput name="name" id="name" defaultValue={defaultName} placeholder={t("name")} error={! state.ok && state.data?.name || ""} required />

            <TextAreaInput name="detail" id="detail" defaultValue={defaultDetail} placeholder={t("detail")} />

            <FormButton
                type="submit"
                variant={obj?.id ? "secondary" : "danger"}
                size="md"
                bgColor="bg-neutral-100 dark:bg-neutral-800"
                hoverBgColor="bg-neutral-200 dark:bg-neutral-700"
                textColor="text-black dark:text-white"
                className="w-full mt-3"
                isLoading={isPending}
            >
                {obj?.id ? tGlobal("global.form.edit") : tGlobal("global.form.submit")}
            </FormButton>  
        </Form>
    )
}

export default CSForm
