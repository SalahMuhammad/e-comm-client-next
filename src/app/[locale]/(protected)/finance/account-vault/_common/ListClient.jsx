'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Form from './Form';
import Table from './Table';
import { PERMISSIONS } from '@/config/permissions.config';
import CreateDialogButton from '@/components/CreateDialogButton';

export default function ListClient({ type, initialItems, count, next, previous }) {
    const t = useTranslations();
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleItemCreated = (newItemData) => {
        if (newItemData) {
            setItems(prev => [newItemData, ...prev]);
        }
    };

    const createLabel = type === 'account'
        ? t("accountVault.actions.createAccount")
        : t("accountVault.actions.createType");

    // Determine table headers based on type
    const renderHeaders = () => {
        if (type === 'account') {
            return (
                <>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.accountName')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.accountType')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.accountNumber')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.phoneNumber')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.bankName')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.currentBalance')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.isActive')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('global.actions')}
                    </th>
                </>
            );
        } else {
            return (
                <>
                    <th scope="col" className="px-6 py-3">
                        {t('accountVault.fields.typeName')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('global.createdAt')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('global.updatedAt')}
                    </th>
                    <th scope="col" className="px-6 py-3">
                        {t('global.actions')}
                    </th>
                </>
            );
        }
    };

    return (
        <>
            <CreateDialogButton
                label={createLabel}
                title={createLabel}
                description={createLabel}
                FormComponent={Form}
                formProps={{ type, initialData: null }}
                onSuccess={handleItemCreated}
                permission={type === 'account' ? PERMISSIONS.BUSINESS_ACCOUNTS.ADD : PERMISSIONS.ACCOUNT_TYPES.ADD}
                buttonClassName="w-full mb-4"
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {renderHeaders()}
                        </tr>
                    </thead>

                    <Table type={type} items={items} setItems={setItems} />
                </table>
            </div>
        </>
    );
}
