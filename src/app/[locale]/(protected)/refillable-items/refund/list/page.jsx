import ToolTip from "@/components/ToolTip"
import { getRefundedItems } from "../../actions";
import DeleteButton from "./DeleteButton"
import PaginationControls from "@/components/PaginationControls"
import Link from "next/link";
import ErrorLoading from "@/components/ErrorLoading";


async function page({ searchParams }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const ownerId = params['s'] ?? '';
    const res = await getRefundedItems(`?limit=${limit}&offset=${offset}&ownerid=${ownerId}`)

    return (
        <>
        {/* {data?.ok ?
            <ErrorLoading name="warehouse.repositories.table" message={data.err} />
        : */}
        <div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Client
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Refunded
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Repository
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
                                        <Link className="text-blue-600 hover:underline" href={`/customer-supplier/view/${transaction.owner}`}>
                                            {transaction.owner_name}
                                        </Link>
                                    </th>
                                    <td className="px-6 py-4">
                                        {transaction.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.item_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        {transaction.repository_name}
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

            {res.data?.results?.length == 0 &&
                <ErrorLoading name="warehouse.repositories.table" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 mt-3 rounded" />
            }

            <PaginationControls
                resCount={res.data?.count}
                hasNext={res.data?.next}
                hasPrev={res.data?.previous}
            />
        </div>
        {/* } */}
        </>
    )
}

export default page
