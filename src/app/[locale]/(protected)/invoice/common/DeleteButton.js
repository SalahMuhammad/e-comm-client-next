'use client'

import { toast } from 'sonner';
import { deleteInv } from './actions';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { redirect } from 'next/navigation';


function DeleteButton({ type, id, isDeleteFromView = false }) {
    const genericErrorHandler = useGenericResponseHandler()

    const handleDelete = async () => {
        toast('are you sure you want to delete this item?', {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: async () => {
                    const res = await deleteInv(type, id, isDeleteFromView);
                    if (genericErrorHandler(res)) return;

                    res?.ok &&
                        toast.success('Item deleted successfully');

                    isDeleteFromView &&
                        redirect(`/invoice/${type}/list`)
                }
            },
            cancel: {
                label: 'Cancel',
                onClick: () => {
                    toast.info('canceled');
                }
            }
        });
    }

    return (
        <button
            className={`font-medium text-red-600 dark:text-red-500 hover:underline ms-3 cursor-pointer`}
            onClick={() => handleDelete()
            }>
            Remove
        </button>
    )
}

export default DeleteButton
