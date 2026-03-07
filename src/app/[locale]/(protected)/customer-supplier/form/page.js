"use client";

import { createUpdateCS } from "../actions"
import { useTranslations } from "next-intl";
import { useActionState } from "react"
import { toast } from 'sonner'
import { TextInput, TextAreaInput } from "@/components/inputs/index"
import GenericFormShell from '@/components/GenericFormShell';


function CSForm({ obj }) {
    const t = useTranslations("customer-supplier.form");
    const tGlobal = useTranslations("");
    const [state, formAction, isPending] = useActionState(createUpdateCS, { errors: {} });
    const defaultName = state?.formData?.name || (!state?.ok && obj?.name) || ''
    const defaultDetail = state?.formData?.detail || (!state?.ok && obj?.detail) || ''

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={obj}
            t={t}
            redirectPath={obj?.id ? "/customer-supplier/list/" : null}
            isModal={false}
        >
            <div className="flex flex-col gap-4">
                <TextInput name="name" id="name" defaultValue={defaultName} placeholder={t("name")} error={!state.ok && state.data?.name || ""} required />
                <TextAreaInput name="detail" id="detail" defaultValue={defaultDetail} placeholder={t("detail")} />
            </div>
        </GenericFormShell>
    )
}

export default CSForm
