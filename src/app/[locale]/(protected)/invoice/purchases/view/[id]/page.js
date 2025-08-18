import InvoicePrintableView from "@/app/[locale]/(protected)/invoice/common/view"


async function page({ params }) {
    const id = (await params).id;

    return (
        <InvoicePrintableView id={id} type='purchases' />
    )
}

export default page
