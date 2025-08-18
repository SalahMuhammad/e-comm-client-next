
import InvoiceForm from "../../../../common/form"
import { getInv } from "@/app/[locale]/(protected)/invoice/common/actions"


async function page({ params }) {
    const ov = (await params).originalInvId;
    const inv = (await getInv('sales', ov)).data

    
    return (
        <InvoiceForm type={'sales/refund'} initialData={inv} />
    )
}

export default page
