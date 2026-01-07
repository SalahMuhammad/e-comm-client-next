"use client";
import SearchableDropdown from "@/components/SearchableDropdown"
import { createUpdateDamagedItem } from "../actions"
import { useEffect, useRef, useState } from "react";
import { TextInput, NumberInput, DateInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useActionState } from 'react';
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import { formatDateManual } from "@/utils/dateFormatter";


function DamagedItemsForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.repositories.damagedItems.form");
    const [state, formAction, isPending] = useActionState(createUpdateDamagedItem, { errors: {} });
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler(t)


    useEffect(() => {
        if (state?.ok === undefined) return
        if (handleGenericErrors(state)) return
        if (state?.ok) {
            toast.success(t(obj?.id ? "successEdit" : "successCreate"));

            if (isModal && onSuccess) {
                onSuccess(state.data);
                return;
            }

            if (obj?.id) {
                router.replace("/items/damaged/");
            }

            if (!isModal) {
                // simple reload workaround if not in modal, though usually router.refresh() 
                // or router.replace is better in Next.js, but matching existing pattern
                window.location.reload();
            }
        }
    }, [state, isModal, onSuccess])

    // Ensure date is in YYYY-MM-DD format
    // Ensure date is in YYYY-MM-DD format
    const getFormattedDate = () => {
        const rawDate = state?.date || obj?.date;
        if (rawDate) {
            if (typeof rawDate === 'string' && rawDate.length === 10) return rawDate;
            try {
                return formatDateManual(new Date(rawDate));
            } catch (e) {
                return rawDate;
            }
        }
        if (!obj?.id) return formatDateManual(new Date());
        return '';
    };

    const formattedDate = getFormattedDate();


    return (
        <Form
            action={formAction}
            className="w-full max-w-2xl mx-auto flex flex-col gap-6 px-4 md:px-0"
            style={{ paddingTop: '3rem' }}
        >
            {obj?.id && (
                <NumberInput placeholder={t("id")} id="id" value={state?.id || obj.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
            )}

            <SearchableDropdown
                url={'/api/items/?name='}
                label={t('item')}
                name="item"
                defaultValue={(state?.item || obj?.item) ? { value: state?.item || obj.item, label: obj?.item_name || state?.item_name || obj.item } : {}}
            />

            <SearchableDropdown
                url={'/api/repositories/?s='}
                label={t('repository')}
                name="repository"
                defaultValue={(state?.repository || obj?.repository) ? { value: state?.repository || obj.repository, label: obj?.repository_name || state?.repository_name || obj.repository } : {}}
            />

            <NumberInput
                id="quantity"
                name="quantity"
                step={1}
                placeholder={t("quantity")}
                defaultValue={state?.quantity || obj?.quantity}
                error={!state?.ok ? state?.data?.quantity : ""}
            />

            <NumberInput
                id="unit_price"
                name="unit_price"
                step={0.01}
                placeholder={t("unitPrice")}
                defaultValue={state?.unit_price || obj?.unit_price}
                error={!state?.ok ? state?.data?.unit_price : ""}
            />

            <DateInput
                name="date"
                id="date"
                placeholder={t("date")}
                defaultValue={formattedDate}
                error={!state?.ok ? state?.data?.date : ""}
            />

            <TextInput name="notes" id="notes" placeholder={t("notes")} defaultValue={state?.notes || obj?.notes} error={!state?.ok ? state?.data?.notes : ""} />

            <FormButton
                type="submit"
                variant="secondary"
                size="md"
                bgColor={obj?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                hoverBgColor={obj?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                textColor="text-white dark:text-gray-100"
                className="w-full"
                isLoading={isPending ? true : false}
            >
                {obj?.id ? t("edit") : t("submit")}
            </FormButton>

        </Form>
    )
}

export default DamagedItemsForm
