import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import numberFormatter from "@/utils/NumberFormatter"
import { getItemMovement } from "./actions"
import Link from "next/link"

export async function generateMetadata({ searchParams }) {
    const params = (await searchParams).data
    // const [fromDate, toDate] = dates.split('%20%20%20')

    // return {
    //     title: `Payments from ${fromDate} to ${toDate}`,
    //     description: '...',
    // };
}

async function page({ searchParams }) {
    const { item, start_date, end_date, repository_id } = await searchParams
    const res = await getItemMovement(item, start_date, end_date, repository_id)
    const data = res.data?.movements

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>Payments from {start_date} to {end_date}</h1>
                    </div>
                </CompanyDetailsHead>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
                                Type
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
                                Referance ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
                                quantity
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">
                                client | supplier
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data?.map((transaction, index) => (
                            <tr key={index} className={`border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700`}>
                                <td className="p-4 text-sm w-sm w-sm text-gray-900">
                                    {transaction.type}
                                </td>
                                <td className="p-4 text-sm w-sm">
                                    {transaction.date}
                                </td>
                                <td className="p-4 text-sm w-sm text-gray-900">
                                    <RefranceIDElement transaction={transaction} />
                                </td>
                                <td className="p-4 text-sm w-sm font-medium text-gray-900">
                                    {transaction?.quantity || 'None'}
                                </td>
                                <td className="p-4 text-sm whitespace-pre font-medium text-gray-900">
                                    {transaction?.owner ? (
                                        <Link className="text-blue-600 hover:underline" href={`/customer-supplier/view/${transaction.owner}`}>
                                            {transaction?.owner_name}
                                        </Link>
                                    ) : 'None'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center mt-12 text-gray-500 text-xs pb-1">
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date().toString().split(' GMT')[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default page


const RefranceIDElement = ({ transaction }) => {
    switch (transaction.type) {
        case 'SALE':
            return (
                <Link className="text-blue-600 hover:underline" href={`/invoice/sales/view/${transaction.reference_id}`}>
                    #{transaction.reference_id}
                </Link>
            )
        case 'PURCHASE':
            return (
                <Link className="text-blue-600 hover:underline" href={`/invoice/purchases/view/${transaction.reference_id}`}>
                    #{transaction.reference_id}
                </Link>
            )
        case 'SALES_REFUND':
            return (
                <Link className="text-blue-600 hover:underline" href={`/invoice/sales/refund/view/${transaction.reference_id}`}>
                    #{transaction.reference_id}
                </Link>
            )
        default:
            return (
                '#' + transaction.reference_id
            )
    }
}
