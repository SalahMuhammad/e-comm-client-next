'use client'

import { toast } from 'sonner';
import { deleteInv } from './actions';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TrashIcon } from '@heroicons/react/24/outline';

function DeleteButton({ type, id, onDelete, isDeleteFromView = false }) {
    const genericErrorHandler = useGenericResponseHandler()
    const t = useTranslations('invoice.table.remove');

    const handleDelete = async () => {
        toast(t("confirm"), {
            // description: t("description"),
            action: {
                label: t('yes'),
                onClick: async () => {
                    const res = await deleteInv(type, id, isDeleteFromView);
                    if (genericErrorHandler(res)) return;

                    isDeleteFromView &&
                        redirect(`/invoice/${type}/list`)

                  if (res?.ok) {
                        toast.success(t('success'));
                        onDelete?.(); 
                    }
                }
            },
            cancel: {
                label: t('no'),
                onClick: () => {
                    toast.info('canceled');
                }
            }
        });
    }

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
                {t('label')}
            </span>
        </button>
    )
}

export default DeleteButton
