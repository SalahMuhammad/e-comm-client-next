import InvoicePrintableView from "@/app/[locale]/(protected)/invoice/common/view"
import { getInv } from "../../../common/actions";

export async function generateMetadata({ params }) {
    const id = (await params).id
    const invoice = (await getInv('purchases', id)).data

    return {
        title: invoice?.id ? `${invoice.owner_name} - ${invoice.issue_date} - order No#${invoice.hashed_id}` : 'Invoice Not Found',
        description: '...',
    };
}

async function page({ params }) {
    const id = (await params).id;

    return (
        <InvoicePrintableView id={id} type='purchases' />
    )
}

export default page
