'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCategory } from '../actions';
import { toast } from 'sonner';
import LocalizedDate from '@/components/LocalizedDate';

function DeleteButton({ item, onDelete }) {
    const t = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        toast(t('finance.expense.category.deleteConfirm'), {
            action: {
                label: t('global.delete.actionLabel'),
                onClick: async () => {
                    setIsDeleting(true);
                    const res = await deleteCategory(item.id);
                    if (handleGenericErrors(res, t('global.errors.deleteError'))) return;
                    if (res.ok) {
                        toast.success(t('finance.expense.category.deleteSuccess'));
                        onDelete(item.id);
                    }
                    setIsDeleting(false);
                },
            },
            cancel: {
                label: t('global.delete.cancelLabel'),
                onClick: () => {
                    toast.info(t('global.delete.assert.canceled'));
                },
            },
            duration: 10000,
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-2 flex items-center text-red-600 hover:text-red-800 group transition duration-300 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
        >
            <TrashIcon
                className="
                    h-4 w-4 mr-1
                    transition-all duration-300 ease-in-out
                    group-hover:scale-110
                    group-hover:-translate-y-0.5
                    group-hover:drop-shadow-sm
                "
            />
            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                {t("finance.table.delete")}
            </span>
        </button>
    );
}

export default function Table({ items, setItems }) {
    const t = useTranslations();

    const handleItemDeleted = (deletedId) => {
        setItems(prev => prev.filter(item => item.id !== deletedId));
    };

    return (
        <tbody>
            {items.map((item) => (
                <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item.name}
                    </td>
                    <td className="px-6 py-4">
                        {item.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                        <LocalizedDate date={item.created_at} />
                    </td>
                    <td className="px-6 py-4">
                        <LocalizedDate date={item.updated_at} />
                    </td>
                    <td className="px-6 py-4 align-middle">
                        <div className="flex items-center">
                            <Link
                                className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                                href={`/finance/expense/category/view/${item.id}`}
                            >
                                <EyeIcon
                                    className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                />
                                <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                    {t("finance.table.view")}
                                </span>
                            </Link>

                            <Link
                                href={`/finance/expense/category/form/${item.id}`}
                                className="ml-2 flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                            >
                                <PencilIcon
                                    className="
                                        h-4 w-4 mr-1
                                        transition-all duration-300 ease-in-out
                                        group-hover:rotate-[8deg]
                                        group-hover:-translate-y-0.5
                                        group-hover:scale-110
                                        group-hover:drop-shadow-sm
                                    "
                                />
                                <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                    {t("finance.table.edit")}
                                </span>
                            </Link>

                            <DeleteButton item={item} onDelete={handleItemDeleted} />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
