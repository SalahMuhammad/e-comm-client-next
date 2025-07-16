"use client";
import SearchableDropdown from "@/components/SearchableDropdown"
import { getPP, submitItemForm } from "../actions"
import { useEffect, useRef, useState } from "react";
import { TextInput, NumberInput, FileInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import * as Collapsible from "@radix-ui/react-collapsible";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useActionState } from 'react';
import { toast } from 'sonner'

function page() {
    const t = useTranslations("warehouse.items.form");
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(submitItemForm, { errors: {} });
    const [p1, setP1] = useState(1);
    const [pp, setPP] = useState(null);
    const p2 = useRef()
    const p3 = useRef()
    const p4 = useRef()


    useEffect(() => {
        if (!state?.success) {
            return
        }
        if (state?.success) {
            toast.success(t('success'));
        }

        const errorCode = state?.errors?.general;
        switch (errorCode) {
            case 400:
                toast.error(t('errors.400'));
                break;

            default:
                if (errorCode >= 500) {
                    toast.error(t("errors.500"));
                } else if (errorCode) {
                    toast.error(t("errors.etc"));
                }
                //  else {
                //     toast.error(t("errors.etc"));
                // }
        }
    }, [state])

    useEffect(() => {
        getPP().then(a => setPP(a)).catch(console.error);
    }, []);

    useEffect(() => {
        if (pp) {
            p2.current.value = Number(p1) + Number(p1 * pp.price2);
            p3.current.value = Number(p1) + Number(p1 * pp.price3);
            p4.current.value = Number(p1) + Number(p1 * pp.price4);
        }
    }, [p1])

    return (
        <Form
            action={formAction}
            // method="POST"
            className="max-w-md mx-auto"
            style={{ paddingTop: '3rem' }}
        // className="flex flex-col gap-4 p-4"
        >
            {/* Causes Hydration issue */}
            <SearchableDropdown
                url={'api/items/types/?s='}
                label={t('type')}
                name="type"
            />

            <TextInput name="name" id="name" placeholder={t("name")} deffaultValue={state?.name} required error={state?.errors?.name ? t("errors.inputs.name") : ""} />

            <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-3">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">{t('collapsible.prices')}</span>
                    <Collapsible.Trigger asChild>
                        <button
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                            aria-label="Toggle Price Inputs"
                        >
                            {open ? t("collapsible.hide") : t("collapsible.show")} {t("collapsible.inputs")}
                            <ChevronDownIcon
                                className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>
                    </Collapsible.Trigger>
                </div>

                <Collapsible.Content
                    className="grid md:grid-cols-2 md:gap-2 mt-5 mb-1  transition-all duration-300 ease-in-out data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
                >
                    <NumberInput value={p1} id="p1" name="p1" placeholder={t("private")} deffaultValue={state?.p1} onChange={(e) => { setP1(e.target.value) }} error={state?.errors?.price1 ? t("errors.inputs.price1") : ""} />
                    <NumberInput id="p2" name="p2" placeholder={t("wholesale")} deffaultValue={state?.p2} ref={p2} error={state?.errors?.price2 ? t("errors.inputs.price2") : ""} />
                    <NumberInput id="p3" name="p3" placeholder={t("piece")} deffaultValue={state?.p3} ref={p3} error={state?.errors?.price3 ? t("errors.inputs.price3") : ""} />
                    <NumberInput id="p4" name="p4" placeholder={t("collapsible.prices")} deffaultValue={state?.p4} ref={p4} error={state?.errors?.price4 ? t("errors.inputs.price4") : ""} />
                </Collapsible.Content>
            </Collapsible.Root>

            <TextInput name="origin" id="origin" deffaultValue={state?.origin} placeholder={t("origin")} error={state?.errors?.origin ? t("errors.inputs.origin") : ""} />

            <TextInput name="place" id="place" deffaultValue={state?.place} placeholder={t("place")} error={state?.errors?.place ? t("errors.inputs.place") : ""} />

            <FileInput
                name="images_upload"
                id="images_upload"
                acceptedTypes="images"
                multiple={true}
                className="mt-3"
                
                state={state}

                error={state?.errors?.images_upload ? t("errors.inputs.images_upload") : ""}
            />

            <FormButton
                type="submit"
                variant="secondary"
                size="md"
                bgColor="bg-neutral-100 dark:bg-neutral-800"
                hoverBgColor="bg-neutral-200 dark:bg-neutral-700"
                textColor="text-black dark:text-white"
                className="w-full"
                isLoading={isPending}
            >
                {t('submit')}
            </FormButton>

        </Form>
    )
}

export default page
