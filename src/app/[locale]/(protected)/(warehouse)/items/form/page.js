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
import BarcodeManager from './BarcodeManage';


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
    const [barcodes, setBarcodes] = useState([])

    useEffect(() => {
        if (state?.ok === undefined) return
        if (handleGenericErrors(state)) return
        if (state?.ok) {
            toast.success(t(obj?.id ? "successEdit" : "successCreate"));
            if (obj?.id) {
                router.replace("/items/list/");
            }
        }

        window.location.reload();
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
            className="w-xl max-w-2xl mx-auto"
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
                defaultValue={(state?.type || obj?.type) ? { value: state?.type || obj.type, label: obj.type_name}: {}}
                // defaultValue={state?.type ? {value: state.type, label: state.type_name} : {value: obj.type, label: obj.type_name} }
            />

            <TextInput name="name" id="name" placeholder={t("name")} defaultValue={state?.name || obj?.name} required error={state?.data?.name || ""} />

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
                        id="price1" 
                        name="price1" 
                        step={0.01}
                        placeholder={t("private")} 
                        onChange={(e) => { setP1(e.target.value) }} 
                        error={state?.data?.price1 ||  ""}
                        // value={p1} 
                        defaultValue={state?.price1 || obj?.price1 || p1} 
                        // {...(p1 !== undefined && p1 !== null
                        //     ? { value: p1 }
                        //     : { defaultValue: state?.price1 || obj?.price1 })}

                    />
                    <NumberInput id="price2" name="price2" step={0.01} placeholder={t("wholesale")} defaultValue={state?.price2 || obj?.price2} ref={p2} error={state?.data?.price2 || ""} />
                    <NumberInput id="price3" name="price3" step={0.01} placeholder={t("piece")} defaultValue={state?.price3 || obj?.price3} ref={p3} error={state?.data?.price3 || ""} />
                    <NumberInput id="price4" name="price4" step={0.01} placeholder={t("collapsible.prices")} defaultValue={state?.price4 || obj?.price4} ref={p4} error={state?.data?.price4 || ""} />
                </Collapsible.Content>
            </Collapsible.Root>

            {/* <input type="hidden" name="barcodes" value={state?.barcodes || obj?.barcodes || []} />
            <BarcodeManager 
                defaultBarcodes={state?.barcodes || obj?.barcodes || []}
                onChange={(barcodes) => setBarcodes(barcodes)}
            /> */}

            <TextInput name="origin" id="origin" defaultValue={state?.origin || obj?.origin} placeholder={t("origin")} error={state?.data?.origin || ""} />

            <TextInput name="place" id="place" defaultValue={state?.place || obj?.place} placeholder={t("place")} error={state?.data?.place || ""} />

            <FileInput
                name="images"
                id="images"
                acceptedTypes="images"
                multiple={true}
                className="mt-3"
                showPreview={true}
                setLoadind={setFileLoading}
                defaultValue={
                    state?.images || obj?.images || []
                }
                error={state?.data?.images || ""}
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
