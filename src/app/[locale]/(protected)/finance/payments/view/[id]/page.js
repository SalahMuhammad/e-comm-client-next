import { getPayment } from '../../../_common/actions';
import TransactionView from '../../../_common/view'

export async function generateMetadata({ params }) {
    const id = (await params).id
    const transaction = (await getPayment(id, 'payment')).data

    return {
        title: transaction?.id ? `${transaction.owner_name} - ${transaction.date} - Receipt No #${transaction.hashed_id}` : 'Not Found',
        description: '...',
    };
}

async function page({ params }) {
    const id = (await params).id


    return (
        <TransactionView id={id} type={'payment'} />
    )
}

export default page
