'use client'

import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteCS } from '../actions';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';

function DeleteButton({ id, onDelete }) {
    const handleGenericErrors = useGenericResponseHandler()
    const t = useTranslations('customer-supplier.table');

    const handleDelete = () => {
        toast(t("remove.confirm"), {
            description: 'This action cannot be undone.',
            action: {
                label: t('remove.yes'),
                onClick: async () => {
                    const res = await deleteCS(id);
                    if (handleGenericErrors(res)) return

                    if (res.ok) {
                        toast.success(t('remove.success'));
                        onDelete?.();
                    }
                },
            },
            cancel: {
                label: t('remove.no'),
                onClick: () => {
                    toast.info(t('remove.canceled'));
                },
            },
            duration: 10000,
        });
    };

    return (
        <button
            onClick={handleDelete}
            className="
      group flex items-center gap-1 px-2 py-1 rounded-md
      text-red-600 dark:text-red-500 cursor-pointer
      transition-all duration-300 ease-in-out
    "
        >
            <TrashIcon
                className="
        h-4 w-4
        transition-transform duration-300 ease-in-out
        group-hover:rotate-[15deg]
        group-hover:scale-125
      "
            />
            <span
                className="
        text-sm font-medium
        transition-opacity duration-300 group-hover:opacity-90
      "
            >
                {t('remove.label')}
            </span>
        </button>

    )
}

export default DeleteButton
