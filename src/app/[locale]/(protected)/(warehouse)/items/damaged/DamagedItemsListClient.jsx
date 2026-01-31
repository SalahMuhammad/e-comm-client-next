'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import DamagedItemsForm from './form/page';
import { DamagedItemsTable } from './Table';

// Create Damaged Item Button Component
function CreateDamagedItemButton({ onItemCreated }) {
    const t = useTranslations("warehouse.repositories.damagedItems");
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
                <button className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors mb-1 dark:bg-gray-600 dark:hover:bg-gray-700">
                    <PlusIcon className="w-4 h-4" />
                    <span>{t("table.create")}</span>
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 p-6 pt-0">
                    
                    {/* <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"> */}
                    <Dialog.Title className="sr-only">
                        {t("table.createTitle")}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                        {t("table.createDescription")}
                    </Dialog.Description>
                    <CreateDamagedItemFormModal key={formKey} onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} isModal={true} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// Modal Form Wrapper
function CreateDamagedItemFormModal({ onSuccess, onCancel, isModal }) {
    return <DamagedItemsForm obj={{}} onSuccess={onSuccess} onCancel={onCancel} isModal={isModal} />;
}

export default function DamagedItemsListClient({ initialItems }) {
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const handleItemCreated = (newItemData) => {
        // Add the new item to the beginning of the list
        if (newItemData) {
            // Ensure the new item has the properties expected by the table (formatting matching the server response)
            // The table expects: item (id), owner_name, repository_name, quantity, unit_price, date, notes
            // The form response returns: id, item, repository, quantity, unit_price, date, notes, item_name, repository_name, owner_name
            // We might need to map it if the names differ, but based on form it seems to return joined details
            setItems(prev => [newItemData, ...prev]);
        }
    };

    return (
        <>
            <CreateDamagedItemButton onItemCreated={handleItemCreated} />
            <DamagedItemsTable items={items} setItems={setItems} />
        </>
    );
}
