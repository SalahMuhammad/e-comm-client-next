'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import RepositoryForm from '../form/page';
import RepositoryTable from './RepositoryTable';

// Create Repository Button Component
function CreateRepositoryButton({ onRepositoryCreated }) {
    const t = useTranslations("warehouse.repositories");
    const [isOpen, setIsOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const handleSuccess = (newRepositoryData) => {
        setIsOpen(false);
        setFormKey(prev => prev + 1); // Reset form
        if (onRepositoryCreated && newRepositoryData) {
            onRepositoryCreated(newRepositoryData);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors mb-4 dark:bg-gray-600 dark:hover:bg-gray-700">
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
                    <CreateRepositoryFormModal key={formKey} onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} isModal={true} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// Modal Form Wrapper
function CreateRepositoryFormModal({ onSuccess, onCancel, isModal }) {
    return <RepositoryForm obj={{}} onSuccess={onSuccess} onCancel={onCancel} isModal={isModal} />;
}

export default function RepositoryListClient({ initialRepositories, count, next, previous }) {
    const t = useTranslations("warehouse.repositories");
    const [repositories, setRepositories] = useState(initialRepositories);

    // Update repositories when initialRepositories changes (e.g., when search results update)
    useEffect(() => {
        setRepositories(initialRepositories);
    }, [initialRepositories]);

    const handleRepositoryCreated = (newRepositoryData) => {
        // Add the new repository to the beginning of the list
        if (newRepositoryData) {
            setRepositories(prev => [newRepositoryData, ...prev]);
        }
    };

    return (
        <>
            <CreateRepositoryButton onRepositoryCreated={handleRepositoryCreated} />

            <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('table.head.name')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {/* {t('table.head.actions')} */}
                            </th>
                        </tr>
                    </thead>

                    <RepositoryTable repositories={repositories} setRepositories={setRepositories} />
                </table>
            </div>
        </>
    );
}
