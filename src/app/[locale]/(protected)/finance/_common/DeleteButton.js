'use client'

import { toast } from 'sonner';
import { deletePayment } from './actions';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { useTranslations } from 'use-intl';
import { redirect } from 'next/navigation';


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

    return (
        <button
            className={`font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer`}
            onClick={() => handleDelete()
            }>
            {t('global.delete.label')}
        </button>
    )
}

export default DeleteButton
