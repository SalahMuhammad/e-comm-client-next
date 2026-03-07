"use client";
import { DynamicOptionsInput } from "@/components/inputs/index"
import { createUpdateDamagedItem } from "../actions"
import { useEffect, useRef, useState } from "react";
import { TextInput, NumberInput, DateInput } from "@/components/inputs/index"
import { useTranslations } from "next-intl";
import { toast } from 'sonner';
import { useActionState } from 'react';
import { formatDateManual } from "@/utils/dateFormatter";
import GenericFormShell from '@/components/GenericFormShell';
import BarcodeScanner from '@/components/BarcodeScanner';
import BarcodeConfirmationModal from '@/components/BarcodeConfirmationModal';
import useBarcodeScanner from '@/components/custom hooks/useBarcodeScanner';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';


export function DamagedItemsForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.repositories.damagedItems.form");
    const tScanner = useTranslations("barcodeScanner");
    const [state, formAction, isPending] = useActionState(createUpdateDamagedItem, { errors: {} });
    const handleGenericErrors = useGenericResponseHandler();

    // Selected item state for the dropdown
    const [selectedItem, setSelectedItem] = useState(
        (obj?.item) ? { value: obj.item, label: obj?.item_name || obj?.item, p4: obj?.unit_price } : null
    );


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


    // Barcode scanner hook
    const {
        barcodeItem,
        showBarcodeConfirm,
        barcodeLoading,
        barcodeError,
        handleBarcodeScan,
        handleBarcodeConfirm,
        handleBarcodeCancel,
        handleManualSelect
    } = useBarcodeScanner({
        tScanner,
        handleGenericErrors,
        onConfirm: (item) => {
            setSelectedItem({
                value: item.value,
                label: item.label,
                p4: item.p4
            });
        }
    });

    // Handle dropdown item selection
    const handleItemSelect = (item) => {
        if (item) {
            handleManualSelect(item);
        } else {
            setSelectedItem(null);
        }
    };

    // Custom load options for items dropdown to include images and price
    const itemsLoadOptions = (res, callback) => {
        const options = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.name,
            p4: obj.price4,
            images: obj.images || [],
        }));
        callback(options);
    };


    return (
        <>
            <GenericFormShell
                state={state}
                formAction={formAction}
                isPending={isPending}
                obj={obj}
                t={t}
                redirectPath="/items/damaged/"
                isModal={isModal}
                onSuccess={onSuccess}
                formClassName="pt-5"
            >
                <div className="flex gap-3 items-start">
                    <div className="flex-1">
                        <DynamicOptionsInput
                            url={'/api/items/?name='}
                            label={t('item')}
                            name="item"
                            value={selectedItem}
                            onChange={handleItemSelect}
                            customLoadOptions={itemsLoadOptions}
                            defaultValue={(state?.item || obj?.item) ? { value: state?.item || obj.item, label: obj?.item_name || state?.item_name || obj?.item } : null}
                        />
                    </div>
                    <BarcodeScanner
                        onScan={handleBarcodeScan}
                        onError={(error) => toast.error('Scanner error: ' + error.message)}
                        disabled={isPending}
                    />
                </div>

                <div className="mt-6">
                    <DynamicOptionsInput
                        url={'/api/repositories/?s='}
                        label={t('repository')}
                        name="repository"
                        defaultValue={(state?.repository || obj?.repository) ? { value: state?.repository || obj.repository, label: obj?.repository_name || state?.repository_name || obj?.repository } : null}
                    />
                </div>

                <NumberInput
                    id="quantity"
                    name="quantity"
                    step={1}
                    placeholder={t("quantity")}
                    defaultValue={state?.quantity || obj?.quantity || 1}
                    error={!state?.ok ? state?.data?.quantity : ""}
                    className="mt-5"
                />

                <NumberInput
                    id="unit_price"
                    name="unit_price"
                    step={0.01}
                    placeholder={t("unitPrice")}
                    defaultValue={selectedItem?.p4 || state?.unit_price || obj?.unit_price}
                    key={selectedItem?.value || 'unit_price'}
                    error={!state?.ok ? state?.data?.unit_price : ""}
                />

                <DateInput
                    name="date"
                    id="date"
                    placeholder={t("date")}
                    defaultValue={formattedDate}
                    error={!state?.ok ? state?.data?.date : ""}
                />

                <div className="mt-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("notes")}</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        defaultValue={state?.notes || obj?.notes}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        placeholder={t("notes")}
                    />
                    {!state?.ok && state?.data?.notes && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{state.data.notes}</p>
                    )}
                </div>
            </GenericFormShell>

            {/* Barcode Confirmation Modal */}
            <BarcodeConfirmationModal
                item={barcodeItem}
                isOpen={showBarcodeConfirm}
                onClose={handleBarcodeCancel}
                onConfirm={handleBarcodeConfirm}
                isLoading={barcodeLoading}
                error={barcodeError}
            />
        </>
    )
}
