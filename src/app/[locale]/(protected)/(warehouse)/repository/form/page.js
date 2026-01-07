"use client";
import { useActionState, useEffect } from "react"
import { useTranslations } from "next-intl";
import { createUpdateRepository } from "../actions"
import Form from "next/form";
import { TextInput, NumberInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";


function RepositoryForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.repositories.form");
    const [state, formAction, isPending] = useActionState(createUpdateRepository, { errors: {} });
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler()
    const defaultName = state?.formData?.name || (!state?.ok && obj?.name) || ''

    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        if (handleGenericErrors(state)) return


        if (state?.ok) {
            toast.success(t(obj?.id ? "successEdit" : "successCreate"));

            // If we have onSuccess callback (modal mode), call it instead of reloading
            if (isModal && onSuccess) {
                onSuccess(state.data);
                return;
            }

            if (obj?.id) {
                router.replace("/repository/list/");
            }

            // Only reload if not in modal mode
            if (!isModal) {
                // window.location.reload();
            }
        }
    }, [state, isModal, onSuccess])

    return (
        <Form
            action={formAction}
            className="max-w-md mx-auto mt-10"
            style={{ paddingTop: '1rem' }}
        >
            {obj?.id && (
                <NumberInput placeholder={t("id")} id="id" value={state?.id || obj.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
            )}

            <TextInput name="name" id="name" defaultValue={defaultName} placeholder={t("name")} error={!state?.ok && state?.data?.name || ""} required />

            <FormButton
                type="submit"
                variant={obj?.id ? "secondary" : "danger"}
                size="md"
                bgColor={obj?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                hoverBgColor={obj?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                textColor="text-white dark:text-gray-100"
                className="w-full mt-3"
                isLoading={isPending}
            >
                {obj?.id ? t("edit") : t("submit")}
            </FormButton>
        </Form>
    )
}

export default RepositoryForm
