'use client'

import { toast } from 'sonner';
import { deletePayment } from './actions';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { useTranslations } from 'use-intl';
import { redirect } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';


function DeleteButton({ type, id, isDeleteFromView = false }) {
    const t = useTranslations()
    const genericErrorHandler = useGenericResponseHandler()

    const handleDelete = async () => {
        toast(t('finance.assert.message'), {
            description: t('global.delete.assert.description'),
            action: {
                label: t('global.delete.actionLabel'),
                onClick: async () => {
                    const res = await deletePayment(type, id, isDeleteFromView);
                    if (genericErrorHandler(res)) return;

                    res?.ok &&
                        toast.success(t('finance.success.delete'));

                    isDeleteFromView &&
                        redirect(`/finance/${type}/list`)
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

    if (isDeleteFromView) {
        return (
            <button
                onClick={handleDelete}
                style={{ backgroundColor: '#b91c1c', opacity: 1 }}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
                <TrashIcon className="h-4 w-4" />
                {t('global.delete.label')}
            </button>
        )
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
