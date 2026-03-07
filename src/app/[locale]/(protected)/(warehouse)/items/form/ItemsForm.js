"use client";
import { DynamicOptionsInput } from "@/components/inputs/index"
import { getPP, createUpdateItem } from "../actions"
import { useEffect, useRef, useState, useCallback, useActionState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, NumberInput, FileInput, DateInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import * as Collapsible from "@radix-ui/react-collapsible";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import BarcodeManager from '@/components/BarcodeManager';
import GenericFormShell from '@/components/GenericFormShell';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGate } from '@/components/PermissionGate';
import { PERMISSIONS } from '@/config/permissions.config';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';

function ItemsForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.items.form");
    const { can } = usePermissions();
    const canAddImages = can(PERMISSIONS.ITEMS.IMAGES.ADD);
    const canDeleteImages = can(PERMISSIONS.ITEMS.IMAGES.DELETE);
    const [open, setOpen] = useState(false);
    const [FileLoading, setFileLoading] = useState(true);
    const [keepImageIds, setKeepImageIds] = useState([]); // Track image IDs to keep
    const [state, formAction, isPending] = useActionState(createUpdateItem, { errors: {} });
    const router = useRouter();
    const [p1, setP1] = useState(1);
    const [pp, setPP] = useState(null);
    const p2 = useRef()
    const p3 = useRef()
    const p4 = useRef()
    const handleGenericErrors = useGenericResponseHandler(t)

    // Memoize the onChange callback to prevent infinite renders
    const handleImageChange = useCallback(({ newFiles, existingIds, hasChanges }) => {
        // For multi-image support, keep track of existing image IDs
        setKeepImageIds(existingIds || []);
    }, []);




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
        <GenericFormShell
            state={state}
            formAction={formAction}
            isPending={isPending || FileLoading}
            obj={obj}
            t={t}
            redirectPath="/items/list/"
            isModal={isModal}
            onSuccess={onSuccess}
            formClassName="pt-5"
        >
            {/* Causes Hydration issue */}
            <input type="text" className="hidden" name="type_name" value={state.type_name ?? ''} readOnly />
            <DynamicOptionsInput
                url={'api/items/types/?s='}
                label={t('type')}
                name="type"
                defaultValue={(state?.type || obj?.type) ? { value: state?.type || obj.type, label: obj.type_name } : {}}
            // defaultValue={state?.type ? {value: state.type, label: state.type_name} : {value: obj.type, label: obj.type_name} }
            />

            <TextInput name="name" id="name" placeholder={t("name")} defaultValue={state?.name || obj?.name} required error={!state?.ok ? state?.data?.name : ""} />

            <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-3">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">{t('collapsible.prices')}</span>
                    <Collapsible.Trigger asChild>
                        <button
                            type="button"
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
                        error={!state?.ok ? state?.data?.price1 : ""}
                        // value={p1} 
                        defaultValue={state?.price1 || obj?.price1 || p1}
                    // {...(p1 !== undefined && p1 !== null
                    //     ? { value: p1 }
                    //     : { defaultValue: state?.price1 || obj?.price1 })}

                    />
                    <NumberInput id="price2" name="price2" step={0.01} placeholder={t("wholesale")} defaultValue={state?.price2 || obj?.price2} ref={p2} error={!state?.ok ? state?.data?.price2 : ""} />
                    <NumberInput id="price3" name="price3" step={0.01} placeholder={t("piece")} defaultValue={state?.price3 || obj?.price3} ref={p3} error={!state?.ok ? state?.data?.price3 : ""} />
                    <NumberInput id="price4" name="price4" step={0.01} placeholder={t("collapsible.prices")} defaultValue={state?.price4 || obj?.price4} ref={p4} error={!state?.ok ? state?.data?.price4 : ""} />
                </Collapsible.Content>
            </Collapsible.Root>

            <PermissionGate permission={PERMISSIONS.ITEMS.BARCODES.VIEW}>
                <BarcodeManager
                    defaultBarcodes={state?.barcodes || obj?.barcodes || []}
                />
            </PermissionGate>

            <TextInput name="origin" id="origin" defaultValue={state?.origin || obj?.origin} placeholder={t("origin")} error={!state?.ok ? state?.data?.origin : ""} />

            <TextInput name="place" id="place" defaultValue={state?.place || obj?.place} placeholder={t("place")} error={!state?.ok ? state?.data?.place : ""} />

            {/* Hidden input to track which image IDs to keep — always sent regardless of image permission */}
            <input type="hidden" name="keep_images" value={keepImageIds.join(',')} />

            <PermissionGate permission={PERMISSIONS.ITEMS.IMAGES.VIEW}>
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
                    onChange={handleImageChange}
                    error={!state?.ok ? state?.data?.images : ""}
                    canAdd={canAddImages}
                    canDelete={canDeleteImages}
                />
            </PermissionGate>
        </GenericFormShell>
    )
}
export default ItemsForm
