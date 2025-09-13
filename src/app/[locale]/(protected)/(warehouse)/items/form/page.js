"use client";
import SearchableDropdown from "@/components/SearchableDropdown"
import { getPP, createUpdateItem } from "../actions"
import { useEffect, useRef, useState } from "react";
import { TextInput, NumberInput, FileInput, DateInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import * as Collapsible from "@radix-ui/react-collapsible";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useActionState } from 'react';
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";

function ItemsForm({obj}) {
    const t = useTranslations("warehouse.items.form");
    const [open, setOpen] = useState(false);
    const [FileLoading, setFileLoading] = useState(true);
    const [state, formAction, isPending] = useActionState(createUpdateItem, { errors: {} });
    const router = useRouter();
    const [p1, setP1] = useState(1);
    const [pp, setPP] = useState(null);
    const p2 = useRef()
    const p3 = useRef()
    const p4 = useRef()
    const handleGenericErrors = useGenericResponseHandler(t)

    useEffect(() => {
        if (state?.ok === undefined) return
        if (handleGenericErrors(state)) return
        if (state?.success) {
            toast.success(t(obj?.id ? "successEdit" : "successCreate"));
            if (obj?.id) {
                router.replace("/items/list/");
            }
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
            {obj?.id && (
                <NumberInput placeholder={t("id")} id="id" value={state?.id || obj.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
            )}

            {/* Causes Hydration issue */}
            <input type="text" className="hidden" name="type_name" value={state.type_name ?? ''} readOnly />
            <SearchableDropdown
                url={'api/items/types/?s='}
                label={t('type')}
                name="type"
                // defaultValue={obj.type ? {value: obj.type, label: obj.type}}
                // defaultValue={state?.type ? {value: state.type, label: state.type_name} : {value: obj.type, label: obj.type_name} }
            />

            <TextInput name="name" id="name" placeholder={t("name")} defaultValue={state?.name || obj?.name} required error={state?.errors?.name || ""} />

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
                    <NumberInput  
                        id="p1" 
                        name="p1" 
                        placeholder={t("private")} 
                        onChange={(e) => { setP1(e.target.value) }} 
                        error={state?.errors?.price1 ||  ""}
                        // value={p1} 
                        // defaultValue={state?.p1} 
                        {...(p1 !== undefined && p1 !== null
                            ? { value: p1 }
                            : { defaultValue: state?.p1 || obj?.p1 })}

                    />
                    <NumberInput id="p2" name="p2" placeholder={t("wholesale")} defaultValue={state?.p2 || obj?.p2} ref={p2} error={state?.errors?.price2 || ""} />
                    <NumberInput id="p3" name="p3" placeholder={t("piece")} defaultValue={state?.p3 || obj?.p3} ref={p3} error={state?.errors?.price3 || ""} />
                    <NumberInput id="p4" name="p4" placeholder={t("collapsible.prices")} defaultValue={state?.p4 || obj?.p4} ref={p4} error={state?.errors?.price4 || ""} />
                </Collapsible.Content>
            </Collapsible.Root>

            <TextInput name="origin" id="origin" defaultValue={state?.origin || obj?.origin} placeholder={t("origin")} error={state?.errors?.origin || ""} />

            <TextInput name="place" id="place" defaultValue={state?.place || obj?.place} placeholder={t("place")} error={state?.errors?.place || ""} />

            {/* <input type="text" className="hidden" name="images_upload_urls" value={obj?.images || state?.images_upload_urls} readOnly /> */}
            <input
                type="text"
                className="hidden"
                name="images_upload_urls"
                value={
                    Array.isArray(obj?.images)
                    ? obj.images.join(",")
                    : typeof obj?.images === "string"
                    ? obj.images
                    : state?.images_upload_urls || ""
                }
                readOnly
            />


            <FileInput
                name="images_upload"
                id="images_upload"
                acceptedTypes="images"
                multiple={true}
                className="mt-3"
                showPreview={true}
                setLoadind={setFileLoading}
                defaultValue={
                    obj?.images ??
                    (state?.images_upload_urls
                        ? state.images_upload_urls.includes(',')
                        ? state.images_upload_urls.split(',').map(url => url.trim())
                        : [state.images_upload_urls.trim()]
                        : null)
                }

                error={state?.errors?.images_upload || ""}
            />

            <FormButton
                type="submit"
                variant="secondary"
                size="md"
                bgColor="bg-neutral-100 dark:bg-neutral-800"
                hoverBgColor="bg-neutral-200 dark:bg-neutral-700"
                textColor="text-black dark:text-white"
                className="w-full"
                isLoading={(FileLoading || isPending ) ? true : false}
            >
                {obj?.id ? t("edit") : t("submit")}
            </FormButton>

        </Form>
    )
}

export default ItemsForm
