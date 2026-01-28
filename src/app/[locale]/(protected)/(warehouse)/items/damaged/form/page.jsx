"use client";
import { DynamicOptionsInput } from "@/components/inputs/index"
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
import styles from '../../../_common/form.module.css';
import BarcodeScanner from '@/components/BarcodeScanner';
import BarcodeConfirmationModal from '@/components/BarcodeConfirmationModal';
import useBarcodeScanner from '@/components/custom hooks/useBarcodeScanner';


function DamagedItemsForm({ obj, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations("warehouse.repositories.damagedItems.form");
    const tScanner = useTranslations("barcodeScanner");
    const [state, formAction, isPending] = useActionState(createUpdateDamagedItem, { errors: {} });
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler()

    // Selected item state for the dropdown
    const [selectedItem, setSelectedItem] = useState(
        (obj?.item) ? { value: obj.item, label: obj?.item_name || obj?.item, p4: obj?.unit_price } : null
    );

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
                //     window.location.reload();
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
        <div className={styles.formContainer}>
            <Form
                action={formAction}
                className={styles.form}
            >
                <div className={styles.formHeader}>
                    <h2>{t(obj?.id ? "edit" : "title")}</h2>
                </div>

                <div className={styles.formContent}>
                    {obj?.id && (
                        <NumberInput placeholder={t("id")} id="id" value={state?.id || obj?.id} borderColor="border-green-500 dark:border-green-400" labelColor="text-green-600 dark:text-green-400" focusColor="" focusLabelColor="" name="id" readOnly />
                    )}

                    <div className="flex gap-3 items-start">
                        <div className="flex-1">
                            <DynamicOptionsInput
                                url={'/api/items/?name='}
                                label={t('item')}
                                name="item"
                                value={selectedItem}
                                onChange={handleItemSelect}
                                customLoadOptions={itemsLoadOptions}
                                defaultValue={(state?.item || obj?.item) ? { value: state?.item || obj.item, label: obj?.item_name || state?.item_name || obj?.item } : null }
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
                </div>

                <div className={styles.formActions}>
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
                </div>
            </Form>

            {/* Barcode Confirmation Modal */}
            <BarcodeConfirmationModal
                item={barcodeItem}
                isOpen={showBarcodeConfirm}
                onClose={handleBarcodeCancel}
                onConfirm={handleBarcodeConfirm}
                isLoading={barcodeLoading}
                error={barcodeError}
            />
        </div>
    )
}

export default DamagedItemsForm

