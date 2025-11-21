import { getTranslations } from 'next-intl/server';
import { deleteExpense } from './actions';
import DeleteButton from '@/components/serverActionButtons/DeleteButton';


async function DeleteTransaction({ hashed_id, isDeleteFromView = false }) {
    const t = await getTranslations('finance')
    const messages = {
        assert: t('assert.message'),
        success: t('success.delete')
    }

    return (
        <DeleteButton 
            onSuccessRedirectionURL={`/finance/expense/list`}
            messages={messages} 
            deleteAction={async () => { 
                'use server'
                return deleteExpense(hashed_id, isDeleteFromView)
            }}
            isDeleteFromView={isDeleteFromView}
        />
    )
}

export default DeleteTransaction
