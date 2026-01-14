'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { deleteAccount, deleteAccountType } from '../actions';
import { useRouter } from 'next/navigation';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';

const DeleteButton = ({ type, id, onDelete, isViewPage = false }) => {
    const t = useTranslations();
    const router = useRouter();
    const handleGenericErrors = useGenericResponseHandler();

    const handleDelete = () => {
        toast(t('global.delete.confirmMessage'), {
            action: {
                label: t('global.delete.actionLabel'),
                onClick: async () => {
                    const deleteFunc = type === 'account' ? deleteAccount : deleteAccountType;
                    const res = await deleteFunc(id, isViewPage);
                    if (handleGenericErrors(res, t('global.errors.deleteError'))) return;

                    if (res?.ok) {
                        toast.success(t('global.delete.success'));

                        if (isViewPage) {
                            // Navigate back to list on view pages
                            const listPath = type === 'account'
                                ? '/finance/account-vault/list'
                                : '/finance/account-vault/type/list';
                            router.push(listPath);
                        } else {
                            // Call callback for list pages
                            onDelete?.();
                        }
                    }
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

    // View page style (with red hover)
    if (isViewPage) {
        return (
            <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-red-600 dark:bg-gray-700 dark:hover:bg-red-600 text-gray-700 hover:text-white dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
                <TrashIcon className="h-4 w-4 mr-2" />
                {t('global.delete.actionLabel')}
            </button>
        );
    }

    // List page style (red text with animation)
    return (
        <button
            onClick={handleDelete}
            className="group flex items-center gap-1 px-2 py-1 rounded-md text-red-600 dark:text-red-500 cursor-pointer transition-all duration-300 ease-in-out"
        >
            <TrashIcon
                className="h-4 w-4 transition-transform duration-300 ease-in-out group-hover:rotate-[15deg] group-hover:scale-125"
            />
            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                {t('finance.table.delete')}
            </span>
        </button>
    );
};

export default DeleteButton;
