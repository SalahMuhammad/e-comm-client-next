'use client'

import { toast } from 'sonner';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { useTranslations } from 'use-intl';
import { redirect } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';


function DeleteButton({ onSuccessRedirectionURL, messages, deleteAction, isDeleteFromView = false }) {
    const t = useTranslations()
    const genericErrorHandler = useGenericResponseHandler()


    const handleDelete = async () => {
        toast(messages?.assert, {
            description: t('global.delete.assert.description'),
            action: {
                label: t('global.delete.actionLabel'),
                onClick: async () => {
                    const res = await deleteAction();
                    if (genericErrorHandler(res)) return;

                    res?.ok &&
                        toast.success(messages?.success);

                    isDeleteFromView &&
                        redirect(onSuccessRedirectionURL)
                }
            },
            cancel: {
                label: t('global.delete.cancelLabel'),
                onClick: () => {
                    toast.info(t('global.delete.assert.canceled'));
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
                {t('global.delete.label')}
            </span>
        </button>
    )
}

export default DeleteButton
