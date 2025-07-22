"use client";
import Form from "next/form";
import { createUpdateCS } from "../actions"
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton"
import { TextInput, TextAreaInput, NumberInput } from "@/components/inputs/index"

function CSForm({ obj }) {
    const t = useTranslations("customer-supplier.form");
    const tGlobal = useTranslations("");
    const [state, formAction, isPending] = useActionState(createUpdateCS, { errors: {} });
    const router = useRouter();

    useEffect(() => {
        if (!state?.success) {
            return
        }
        if (state?.success) {
            toast.success(t(obj?.id ? "successEdit" : "successCreate"));
            if (obj?.id) {
                router.replace("/customer-supplier/list/");
            }
        }

        const errorCode = state?.errors?.general.status;
        switch (errorCode) {
            case 400:
                toast.error(state?.errors || tGlobal('errors.400'));
                break;

            default:
                if (errorCode >= 500) {
                    toast.error(state?.errors?.general.text || tGlobal("errors.500"));
                } else if (errorCode) {
                    toast.error(state?.errors?.general.text || tGlobal("errors.etc"));
                }
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

            <TextInput name="name" id="name" defaultValue={state?.name || obj?.name} placeholder={t("detail")} error={state?.errors?.name || ""} required />

            <TextAreaInput name="detail" id="detail" defaultValue={state?.detail || obj?.detail} placeholder={t("detail")} />

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
                {obj?.id ? t("edit") : t("submit")}
            </FormButton>  
        </Form>
    )
}

export default CSForm
