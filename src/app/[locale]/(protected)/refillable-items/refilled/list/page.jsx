import ToolTip from "@/components/ToolTip"
import { getRefilledItems } from "../../actions"
import DeleteButton from "./DeleteButton"
import PaginationControls from "@/components/PaginationControls"


async function page({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const res = await getRefilledItems(`?limit=${limit}&offset=${offset}`)

    return (
        <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Refilled Item
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Used Item
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Repository
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Employee
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Notes
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            res.data?.results?.map((transaction) => (
                                <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {transaction.refilled_item_name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {transaction.refilled_quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.used_item_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.used_quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.repository_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.employee_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <pre className="whitespace-pre-wrap">
                                            {transaction.notes}
                                        </pre>
                                    </td>
                                    <td className="flex items-center px-6 py-4 dark:text-gray-300">
                                        <DeleteButton id={transaction.id} />

                                        <ToolTip obj={transaction} className="ml-3" />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <PaginationControls
                resCount={res.data?.count}
                hasNext={res.data?.next}
                hasPrev={res.data?.previous}
            />
        </div>
    )
}

export default page
