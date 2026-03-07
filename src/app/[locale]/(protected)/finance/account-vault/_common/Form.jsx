"use client";

import { useActionState } from "react"
import { useTranslations } from "next-intl";
import { createUpdateAccount, createUpdateAccountType } from "../actions"
import { TextInput } from "@/components/inputs/index"
import { toast } from 'sonner'
import { useRouter } from "next/navigation";
import GenericFormShell from "@/components/GenericFormShell";
import styles from '@/app/[locale]/(protected)/invoice/_common/form.module.css'
import FieldError from "@/components/FieldError";
import { DynamicOptionsInput } from "@/components/inputs/index"
import useGenericResponseHandler from "@/components/custom hooks/useGenericResponseHandler";

function AccountVaultForm({ type, initialData, onSuccess, onCancel, isModal = false }) {
    const t = useTranslations()
    const handleGenericErrors = useGenericResponseHandler()
    const formAction = type === 'account' ? createUpdateAccount : createUpdateAccountType;
    const [state, wrappedFormAction, isPending] = useActionState(formAction, {})
    const router = useRouter();

    const defaultAccountType = state.formData?.account_type || initialData?.account_type ? {
        value: state.formData?.account_type || initialData?.account_type,
        label: state.formData?.account_type_name || initialData?.account_type_name
    } : undefined

    const handleAccountTypeTransformer = (res, callback) => {
        const data = res?.results?.map((obj) => ({
            value: obj.id,
            label: obj.name,
        }))
        callback(data)
    }

    const isAccount = type === 'account';
    const formTitle = isAccount
        ? (initialData?.id ? t("accountVault.actions.editAccount") : t("accountVault.actions.createAccount"))
        : (initialData?.id ? t("accountVault.actions.editType") : t("accountVault.actions.createType"));

    return (
        <GenericFormShell
            state={state}
            formAction={wrappedFormAction}
            isPending={isPending}
            obj={initialData}
            t={t}
            redirectPath={null}
            isModal={isModal}
            customTitle={formTitle + (initialData?.hashed_id ? ` #${initialData.hashed_id}` : "")}
            showIdField={false} /* Custom ID field using hashed_id instead of id */
            onSuccess={(data) => {
                if (isModal && onSuccess) {
                    onSuccess(data);
                } else {
                    toast.success(t(initialData?.id ? "successEdit" : "successCreate"));
                    if (data?.hashed_id) {
                        const viewPath = type === 'account'
                            ? `/finance/account-vault/view/${data?.hashed_id}`
                            : `/finance/account-vault/type/view/${data?.hashed_id}`;
                        router.replace(viewPath);
                    }
                }
            }}
        >
            <div className={isModal ? "" : styles.invoiceDetails}>
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

                {isAccount ? (
                    // Business Account fields
                    <>
                        {/* Account Type - Required */}
                        <div className={`mt-8 ${styles.formGroup}`}>
                            <DynamicOptionsInput
                                url={'/api/finance/account-vault/type/?name='}
                                label={t('accountVault.fields.accountType')}
                                customLoadOptions={handleAccountTypeTransformer}
                                name="account_type"
                                defaultValue={defaultAccountType}
                                required
                            />
                            <FieldError error={!state?.ok ? state.data?.account_type : null} />
                        </div>

                        {/* Account Name - Required */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label htmlFor="account_name">{t('accountVault.fields.accountName')} *</label>
                            <input
                                type="text"
                                id="account_name"
                                name="account_name"
                                defaultValue={state.formData?.account_name || initialData?.account_name || ''}
                                required
                            />
                            <FieldError error={!state?.ok ? state.data?.account_name : null} />
                        </div>

                        {/* Account Number - Optional */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label htmlFor="account_number">{t('accountVault.fields.accountNumber')}</label>
                            <input
                                type="text"
                                id="account_number"
                                name="account_number"
                                defaultValue={state.formData?.account_number || initialData?.account_number || ''}
                                placeholder={t('accountVault.placeholders.accountNumber')}
                            />
                            <FieldError error={!state?.ok ? state.data?.account_number : null} />
                        </div>

                        {/* Phone Number - Optional */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label htmlFor="phone_number">{t('accountVault.fields.phoneNumber')}</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                defaultValue={state.formData?.phone_number || initialData?.phone_number || ''}
                                placeholder={t('accountVault.placeholders.phoneNumber')}
                            />
                            <FieldError error={!state?.ok ? state.data?.phone_number : null} />
                        </div>

                        {/* Bank Name - Optional */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label htmlFor="bank_name">{t('accountVault.fields.bankName')}</label>
                            <input
                                type="text"
                                id="bank_name"
                                name="bank_name"
                                defaultValue={state.formData?.bank_name || initialData?.bank_name || ''}
                                placeholder={t('accountVault.placeholders.bankName')}
                            />
                            <FieldError error={!state?.ok ? state.data?.bank_name : null} />
                        </div>

                        {/* Current Balance - Optional */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label htmlFor="current_balance">{t('accountVault.fields.currentBalance')}</label>
                            <input
                                type="number"
                                id="current_balance"
                                name="current_balance"
                                step="0.01"
                                defaultValue={state.formData?.current_balance || initialData?.current_balance || '0.00'}
                                placeholder="0.00"
                            />
                            <FieldError error={!state?.ok ? state.data?.current_balance : null} />
                        </div>

                        {/* Is Active - Optional */}
                        <div className={`${styles.formGroup} mt-3`}>
                            <label className="flex items-center cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked={state.formData?.is_active !== undefined ? state.formData?.is_active === 'on' : initialData?.is_active !== false}
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span>{t('accountVault.fields.isActive')}</span>
                            </label>
                            <FieldError error={!state?.ok ? state.data?.is_active : null} />
                        </div>
                    </>
                ) : (
                    // Account Type fields
                    <>
                        {/* Type Name - Required */}
                        <div className={styles.formGroup}>
                            <label htmlFor="name">{t('accountVault.fields.typeName')} *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={state.formData?.name || initialData?.name || ''}
                                placeholder={t('accountVault.placeholders.typeName')}
                                required
                            />
                            <FieldError error={!state?.ok ? state.data?.name : null} />
                        </div>
                    </>
                )}
            </div>
        </GenericFormShell>
    )
}

export default AccountVaultForm
