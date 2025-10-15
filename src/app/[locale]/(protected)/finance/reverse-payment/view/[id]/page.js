import TransactionView from '../../../_common/view'


async function page({ params }) {
    const id = (await params).id


    return (
        <TransactionView id={id} type={'reverse-payment'} />
    )
}

export default page
