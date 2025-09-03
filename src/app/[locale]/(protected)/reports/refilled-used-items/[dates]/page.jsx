import CompanyDetailsHead from "@/components/CompanyDetailsHead"
import { getdOreItemsList, getdRefillableItems } from "../../actions"
import { getRefilledItems } from "../../../refillable-items/actions"

export async function generateMetadata({ params }) {
    const dates = (await params).dates
    const [fromDate, toDate] = dates.split('%20%20%20')

    return {
        title: `Refilled and used items from ${fromDate} to ${toDate}`,
        description: '...',
    };
}

async function page({ params }) {
    const dates = (await params).dates
    const [fromDate, toDate] = dates.split('%20%20%20')
    const res = await getRefilledItems(`?full_report&from=${fromDate}&to=${toDate}`)
    const data = res?.data?.results || []
    const itemTransformerRes = await getdRefillableItems()
    const itemTransformerData = itemTransformerRes.data?.results || []
    const oreItemsRes = await getdOreItemsList()
    const oreItemsData = oreItemsRes.data?.results || []

    const refiledItemsList = []
    itemTransformerData.map((item) => {

        const qty = data.reduce((acc, curr) => acc += Number(item.item === curr.refilled_item ? curr.refilled_quantity : 0), 0)
        refiledItemsList.push(
            {
                item: item.empty,
                refilled: qty
            }
        )
    })

    const oreItemsList = []
    oreItemsData.map((item) => {

        const qty = data.reduce((acc, curr) => acc += Number(item.item === curr.used_item_id ? curr.used_quantity : 0), 0)
        oreItemsList.push(
            {
                item: item.item_name,
                used: qty
            }
        )
    })

    if (data.length === 0) return 'no data found'

    return (
        <div id="printarea" className="min-w-2xl bg-white">
            <div className="overflow-x-auto shadow-[8px_8px_8px_-5px_rgba(0,0,0,0.3)]">
                <CompanyDetailsHead>
                    <div className="mx-auto text-base text-black">
                        <h1 className={`text-xl font-bold font-serif`}>Refilled and Used Items from {fromDate} to {toDate}</h1>
                    </div>
                </CompanyDetailsHead>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-300">
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">refilled</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">qty</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">used</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">qty</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm uppercase tracking-wider">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {data?.map((transaction, index) => (
                            <tr key={index} className={`border-b border-gray-100 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 dark:border-gray-700`}>
                                <td className="p-4 text-sm w-sm w-sm text-gray-900">
                                    {transaction.refilled_item_name}
                                </td>
                                <td className="p-4 text-sm w-sm">
                                    {transaction.refilled_quantity}
                                </td>
                                <td className="p-4 text-sm w-sm text-gray-900">
                                    {transaction.used_item_name}
                                </td>
                                <td className="p-4 text-sm w-sm font-medium text-gray-900">
                                    {transaction.used_quantity}
                                </td>
                                <td className="p-4 text-sm w-sm font-medium text-gray-900">
                                    {transaction.date}
                                </td>
                                <td className="p-4 text-sm whitespace-pre font-medium text-gray-900">
                                    {transaction.notes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="grid grid-cols-3 gap-4 pt-8">
                    <div>
                        <h1>Refilled Items Totals</h1>
                        {refiledItemsList.map((item, index) => (
                            item.refilled > 0 && <p key={index} className="">{item.item}: {item.refilled}</p>
                        ))}
                    </div>

                    <div>
                        <h1>Used Items Totals</h1>
                        {oreItemsList.map((item, index) => (
                            item.used > 0 && <p key={index} className="">{item.item}: {item.used}</p>
                        ))}
                    </div>

                    <div>
                        <h1>Remaining Big Cans</h1>
                        {oreItemsData.map((item, index) => {
                            const i = item.stocks.reduce((acc, curr) => acc += Number(curr.quantity), 0)
                            return (
                                i > 0 && <p key={index} className="">{item.item_name}: {i}</p>
                            )
                        })}
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-500 text-xs pb-1">
                    <p>Thank you for your business!</p>
                    <p>Generated on {new Date().toString().split(' GMT')[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default page
