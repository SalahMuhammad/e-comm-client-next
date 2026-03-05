"use client";
import { useActionState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateRepository } from "../actions"
import { TextInput } from "@/components/inputs/index"
import GenericFormShell from "@/components/GenericFormShell";

export function RepositoryForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.repositories.form");
    const [state, formAction, isPending] = useActionState(createUpdateRepository, { errors: {} });
    const defaultName = state?.formData?.name || (!state?.ok && obj?.name) || ''

    return (
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending}
            obj={obj}
            t={t}
            redirectPath="/repository/list/"
            isModal={isModal}
            onSuccess={onSuccess}
            formClassName="pt-5"
        >
            <TextInput
                className={`${!obj?.id && "-mb-4 -mt-5"}`}
                name="name"
                id="name"
                defaultValue={defaultName}
                placeholder={t("name")}
                error={!state?.ok && state?.data?.name || ""}
                required
            />
        </GenericFormShell>
    )
}
