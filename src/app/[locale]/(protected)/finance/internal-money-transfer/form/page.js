"use client";

import { useActionState, useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateTransfer } from "../actions"
import Form from "next/form";
import { TextInput, FileInput, DateInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";
import StaticSelect from "@/components/ReactStaticSelect";
import { getFormDefaultValue } from "@/utils/formDefaultValue";


function TransferForm({ initialData }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateTransfer, {})
    const router = useRouter();
    // Track image state with simpler logic
    const [imageState, setImageState] = useState({
        hadInitialImage: initialData?.proof ? true : false,  // Did we start with an image?
        currentlyHasFiles: initialData?.proof ? true : false, // Does FileInput currently have files?
        userDeleted: false  // Did user explicitly delete the initial image?
    })

    const transferTypeOptions = [
        { value: 'internal', label: t('finance.transferTypes.internal') },
        { value: 'external', label: t('finance.transferTypes.external') },
        { value: 'p2p', label: t('finance.transferTypes.p2p') },
    ]

    const defaultDate = getFormDefaultValue(state, initialData, 'date', {
        defaultValue: formatDateManual(new Date())
    })

    const defaultFromVault = getFormDefaultValue(state, initialData, 'from_vault', {
        labelKey: 'from_vault_name'
    })

    const defaultToVault = getFormDefaultValue(state, initialData, 'to_vault', {
        labelKey: 'to_vault_name'
    })

    const defaultTransferType = getFormDefaultValue(state, initialData, 'transfer_type', {
        selectOptions: transferTypeOptions,
        defaultValue: transferTypeOptions[0]
    })


    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
            if (state.data?.hashed_id) {
                router.replace(`/finance/internal-money-transfer/view/${state.data?.hashed_id}`);
            }
        }
    }, [state])


    const handleAccountTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.account_type_name + ' / ' + obj.account_name,
        }))
        callback(data)
    }

    return (
        <div className={styles.invoiceContainer}>
            <Form
                action={formAction}
                className={styles.invoiceForm}
            >
                <div className={styles.invoiceHeader}>
                    <h2>{initialData?.id ? t("finance.fields.update") : t("finance.fields.transaction")} {t("navLinks.finance.subLabels.internalTransfer")} {initialData?.hashed_id && "#"} {initialData?.hashed_id}</h2>
                </div>

                <div className={styles.invoiceDetails}>
                    {initialData?.hashed_id && (
                        <TextInput
                            placeholder={'id'}
                            id="hashed_id"
                            value={initialData?.hashed_id}
                            bordercolor="border-green-500 dark:border-green-400"
                            labelcolor="text-green-600 dark:text-green-400"
                            focuscolor=""
                            focuslabelcolor=""
                            name="hashed_id"
                            readOnly
                        />
                    )}

                    <div className={`${initialData?.hashed_id ? 'mt-3' : ''}`}>
                        <DateInput
                            id="date"
                            name="date"
                            placeholder={t('finance.fields.date')}
                            defaultValue={defaultDate}
                            error={!state?.ok ? state?.data?.date : ""}
                            required
                        />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/finance/account-vault/?is_active=true&account_name='}
                            label={t('finance.fields.fromVault')}
                            customLoadOptions={handleAccountTransformer}
                            name={'from_vault'}
                            defaultValue={defaultFromVault}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.from_vault : null} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/finance/account-vault/?is_active=true&account_name='}
                            label={t('finance.fields.toVault')}
                            customLoadOptions={handleAccountTransformer}
                            name={'to_vault'}
                            defaultValue={defaultToVault}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.to_vault : null} />
                    </div>

                    <div className={styles.detailsRow}>
                        <div className={styles.formGroup}>
                            <label>{t('finance.fields.amount')}</label>
                            <input
                                type="number"
                                name="amount"
                                step={'.01'}
                                defaultValue={getFormDefaultValue(state, initialData, 'amount')}
                                placeholder="0.00"
                                required
                            />
                            <FieldError error={!state?.ok ? state.data?.amount : null} />
                        </div>
                        <div className={`${styles.formGroup} relative z-50`}>
                            <StaticSelect
                                options={transferTypeOptions}
                                name={'transfer_type'}
                                label={t('finance.fields.transferType')}
                                defaultValue={defaultTransferType}
                            />
                            <FieldError error={!state?.ok ? state.data?.transfer_type : null} />
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className={styles.invoiceDetails}>
                    {/* Hidden input to signal if we should keep the existing image */}
                    <input
                        type="hidden"
                        name="keep_proof"
                        value={
                            // Keep if: had initial image AND user didn't delete it
                            imageState.hadInitialImage && !imageState.userDeleted ? "true" : "false"
                        }
                    />

                    <FileInput
                        name="proof"
                        id="proof"
                        placeholder={t('finance.fields.transferProof')}
                        acceptedTypes="images"
                        showPreview={true}
                        error={!state?.ok ? state.data?.proof : null}
                        defaultValue={initialData?.proof ? [{ img: initialData.proof }] : []}
                        onChange={({ newFiles, existingIds, hasChanges }) => {
                            // Update state based on current files
                            const totalFiles = newFiles.length + existingIds.length;

                            setImageState(prev => ({
                                hadInitialImage: prev.hadInitialImage, // This never changes
                                currentlyHasFiles: totalFiles > 0,
                                // User deleted if: had initial image AND made changes AND now has no files
                                userDeleted: prev.hadInitialImage && hasChanges && totalFiles === 0
                            }));
                        }}
                    />
                </div>

                <div className={styles.invoiceSummary}>
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">{t('finance.fields.note')}</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            defaultValue={getFormDefaultValue(state, initialData, 'notes')}
                            placeholder={t('finance.fields.moreNotes')}
                        />
                        <FieldError error={!state?.ok ? state.data?.notes : null} />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <FormButton
                        type="submit"
                        variant={initialData?.id ? "secondary" : "primary"}
                        size="md"
                        bgColor={initialData?.id ? "bg-emerald-500 dark:bg-emerald-600" : "bg-blue-500 dark:bg-blue-600"}
                        hoverBgColor={initialData?.id ? "bg-emerald-700 dark:bg-emerald-800" : "bg-blue-700 dark:bg-blue-800"}
                        textColor="text-white dark:text-gray-100"
                        className="w-full"
                        isLoading={isPending}
                    >
                        {initialData?.id ? t("global.form.edit") : t("global.form.submit")}
                    </FormButton>
                </div>
            </Form>
        </div>
    )
}

export default TransferForm
