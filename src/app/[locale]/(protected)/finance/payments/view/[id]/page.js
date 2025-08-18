import TransactionView from '../../../common/view'


async function page({ params }) {
    const id = (await params).id


    return (
        <TransactionView id={id} type={'payments'} />
    )
}

export default page
