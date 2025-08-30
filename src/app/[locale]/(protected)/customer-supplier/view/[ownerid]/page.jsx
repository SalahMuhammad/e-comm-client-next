import Link from "next/link"
import { getCSView } from "../../actions"

async function page({ params }) {
    const ownerId = (await params).ownerid
    const res = await getCSView(ownerId)

    return (
        <div>
            <h1>"{res?.data?.owner_name}" - View</h1>
            <hr className="pb-5" />
            <div>
                <pre >{JSON.stringify(res?.data, null, 4)}</pre>
            </div>

            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>Sales invoices</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/purchases/list/ownerid'}>Purchase invoices</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>Customer Account Statemnet Report</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>Payments</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>expenses</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>refillable items refund</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>sales innvoice refunds</Link>
        </div>
    )
}

export default page
