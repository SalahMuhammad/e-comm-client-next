"use client";

import { useActionState, useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateTransfer } from "../actions"
import Form from "next/form";
import { TextInput, FileInput } from "@/components/inputs/index"
import FormButton from "@/components/FormButton"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import { formatDateManual } from "@/utils/dateFormatter";
import FieldError from "@/components/FieldError";
import SearchableDropdown from "@/components/SearchableDropdown";
import StaticSelect from "@/components/ReactStaticSelect";


function TransferForm({ initialData }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const [state, formAction, isPending] = useActionState(createUpdateTransfer, {})
    const router = useRouter();

    const transferTypeOptions = [
        { value: 'internal', label: 'Internal' },
        { value: 'external', label: 'External' },
        { value: 'p2p', label: 'Peer to Peer' },
    ]

    const defaultDate = state.formData?.date || initialData?.date || formatDateManual(new Date())
    const defaultFromVault = state.formData?.from_vault || initialData?.from_vault ? {
        value: state.formData?.from_vault || initialData?.from_vault,
        label: state.formData?.from_vault_name || initialData?.from_vault_name
    } : undefined

    const defaultToVault = state.formData?.to_vault || initialData?.to_vault ? {
        value: state.formData?.to_vault || initialData?.to_vault,
        label: state.formData?.to_vault_name || initialData?.to_vault_name
    } : undefined

    const defaultTransferType = state.formData?.transfer_type || initialData?.transfer_type ? {
        value: state.formData?.transfer_type || initialData?.transfer_type,
        label: state.formData?.transfer_type || initialData?.transfer_type
    } : transferTypeOptions[0]


    useEffect(() => {
        if (state?.ok === undefined) {
            return
        }
        const res = { ...state }
        delete res['formData']
        if (handleGenericErrors(res)) return

        if (state?.ok) {
            toast.success(t(state.data?.id ? "successEdit" : "successCreate"));
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
                    <h2>{initialData?.id ? t("finance.fields.update") : t("finance.fields.transaction")} Internal Money Transfer {initialData?.hashed_id && "#"} {initialData?.hashed_id}</h2>
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

                    <div className={styles.formGroup}>
                        <label htmlFor="date">{t('finance.fields.date')}</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            defaultValue={defaultDate}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.date : null} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/finance/account-vault/?account_name='}
                            label="From Vault"
                            customLoadOptions={handleAccountTransformer}
                            name={'from_vault'}
                            defaultValue={defaultFromVault}
                            required
                        />
                        <FieldError error={!state?.ok ? state.data?.from_vault : null} />
                    </div>

                    <div className={`mt-8 ${styles.formGroup}`}>
                        <SearchableDropdown
                            url={'/api/finance/account-vault/?account_name='}
                            label="To Vault"
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
                                defaultValue={state.formData?.amount || initialData?.amount || ''}
                                placeholder="0.00"
                                required
                            />
                            <FieldError error={!state?.ok ? state.data?.amount : null} />
                        </div>
                        <div className={styles.formGroup}>
                            <StaticSelect
                                options={transferTypeOptions}
                                name={'transfer_type'}
                                label="Transfer Type"
                                defaultValue={defaultTransferType}
                            />
                            <FieldError error={!state?.ok ? state.data?.transfer_type : null} />
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className={styles.invoiceDetails}>
                    <FileInput
                        name="proof"
                        id="proof"
                        placeholder={t('finance.fields.transferProof')}
                        acceptedTypes="images"
                        error={!state?.ok ? state.data?.proof : null}
                        defaultValue={initialData?.proof ? [{ img: initialData.proof }] : []}
                    />
                </div>

                <div className={styles.invoiceSummary}>
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">{t('finance.fields.note')}</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            defaultValue={state.formData?.notes || initialData?.notes || ''}
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
