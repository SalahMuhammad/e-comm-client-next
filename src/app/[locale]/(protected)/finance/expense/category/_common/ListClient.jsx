'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Form from './Form';
import Table from './Table';
import { PERMISSIONS } from '@/config/permissions.config';
import CreateDialogButton from '@/components/CreateDialogButton';

export default function ListClient({ initialItems, count, next, previous }) {
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

    return (
        <>
            <CreateDialogButton
                label={t('finance.expense.category.create')}
                title={t('finance.expense.category.create')}
                description={t('finance.expense.category.create')}
                FormComponent={Form}
                formProps={{ initialData: null }}
                onSuccess={handleItemCreated}
                permission={PERMISSIONS.EXPENSE_CATEGORIES.ADD}
                buttonClassName="w-full mb-4"
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.expense.category.name')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.expense.category.description')}
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
                        </tr>
                    </thead>

                    <Table items={items} setItems={setItems} />
                </table>
            </div>
        </>
    );
}
