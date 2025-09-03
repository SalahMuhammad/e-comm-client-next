import Link from "next/link"
import { getCSView } from "../../actions"

async function page({ params }) {
    const ownerId = (await params).ownerid
    const res = await getCSView(ownerId)

    return (
        <div>
            <h1>"{res?.data?.owner_name}" - View</h1>
            <hr className="m-5"/>
            <div>
                <pre >{JSON.stringify(res?.data, null, 4)}</pre>
            </div>

            <Link className="text-blue-600 hover:underline p-4" href={`/invoice/sales/list/?s=${res.data?.owner_name}`}>Sales invoices</Link>
            <Link className="text-blue-600 hover:underline p-4" href={`/invoice/purchases/list/?s=${res.data?.owner_name}`}>Purchase invoices</Link>
            <Link className="text-blue-600 hover:underline p-4" href={`/finance/payments/list?s=${res.data?.owner_name}`}>Payments</Link>
            <Link className="text-blue-600 hover:underline p-4" href={`/finance/expenses/list?s=${res.data?.owner_name}`}>expenses</Link>
            <Link className="text-blue-600 hover:underline p-4" href={`/invoice/sales/refund/list/?s=${res.data?.owner_name}`}>sales invoice refunds</Link>
            <Link className="text-blue-600 hover:underline p-4" href={'/invoices/sales/list/ownerid'}>refillable items refund</Link>
            <hr  className="m-5"/>
            <h3>Reports</h3>
            <Link className="text-blue-600 hover:underline p-4" href={`/reports/owner-account-statement/${ownerId}`}>Account Statemnet</Link>
            <Link className="text-blue-600 hover:underline p-4" href={`/reports/refillable-items-client-has/${ownerId}`}>due dcd cans</Link>
        </div>
    )
}

export default page
