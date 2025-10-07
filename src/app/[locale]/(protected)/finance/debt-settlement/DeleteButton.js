import { getTranslations } from 'next-intl/server';
import { deleteDebtSettlement } from './actions';
import DeleteButton from '@/components/serverActionButtons/DeleteButton';


async function DeleteTransaction({ id, isDeleteFromView = false }) {
    const t = await getTranslations('finance')
    const messages = {
        assert: t('assert.message'),
        success: t('success.delete')
    }

    return (
        <DeleteButton 
            onSuccessRedirectionURL={`/finance/debt-settlement/list`}
            messages={messages} 
            deleteAction={async () => { 
                'use server'
                return deleteDebtSettlement(id, isDeleteFromView)
            }}
            isDeleteFromView={isDeleteFromView}
        />
    )
}

export default DeleteTransaction
