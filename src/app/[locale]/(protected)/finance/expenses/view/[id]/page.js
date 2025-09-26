import TransactionView from '../../../_common/view'


async function page({ params }) {
    const id = (await params).id


    return (
        <TransactionView id={id} type={'expenses'} />
    )
}

export default page
