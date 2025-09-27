import InvoicePrintableView from "@/app/[locale]/(protected)/invoice/_common/view"


async function page({ params }) {
    const id = (await params).id;

    return (
        <InvoicePrintableView id={id} type='sales/refund' />
    )
}

export default page
