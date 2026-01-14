'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import Form from './Form';
import Table from './Table';

// Create Button Component
function CreateButton({ onItemCreated }) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleSuccess = (newItemData) => {
        setIsOpen(false);
        setFormKey(prev => prev + 1); // Reset form
        if (onItemCreated && newItemData) {
            onItemCreated(newItemData);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors mb-4 dark:bg-gray-600 dark:hover:bg-gray-700">
                    <PlusIcon className="w-4 h-4" />
                    <span>{t('finance.expense.category.create')}</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 p-6">
                    <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {t('finance.expense.category.create')}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                        {t('finance.expense.category.create')}
                    </Dialog.Description>
                    <CreateFormModal key={formKey} onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} isModal={true} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// Modal Form Wrapper
function CreateFormModal({ onSuccess, onCancel, isModal }) {
    return <Form initialData={null} onSuccess={onSuccess} onCancel={onCancel} isModal={isModal} />;
}

export default function ListClient({ initialItems, count, next, previous }) {
    const t = useTranslations();
    const [items, setItems] = useState(initialItems);

    // Update items when initialItems changes (e.g., after search)
    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleItemCreated = (newItemData) => {
        // Add the new item to the beginning of the list
        if (newItemData) {
            setItems(prev => [newItemData, ...prev]);
        }
    };

    return (
        <>
            <CreateButton onItemCreated={handleItemCreated} />

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
