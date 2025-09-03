import { getPayment } from '../../../common/actions';
import TransactionView from '../../../common/view'

export async function generateMetadata({ params }) {
    const id = (await params).id
    const transaction = (await getPayment(id, 'payments')).data

    return {
        title: transaction?.id ? `${transaction.owner_name} - ${transaction.date} - No #${transaction.hashed_id}` : 'Not Found',
        description: '...',
    };
}

async function page({ params }) {
    const id = (await params).id


    return (
        <TransactionView id={id} type={'payments'} />
    )
}

export default page
