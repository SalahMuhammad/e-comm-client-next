import ToolTip from "@/components/ToolTip"
import TableNote from "@/components/TableNote";
import { getRefilledItems } from "../../actions"
import DeleteButton from "./DeleteButton"
import PaginationControls from "@/components/PaginationControls"
import ErrorLoading from "@/components/ErrorLoading";
import { getTranslations } from "next-intl/server";
import { URLQueryParameterSetter } from "@/components/inputs/index";


async function page({ searchParams }) {
    const t = await getTranslations()
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const rItem = params['ritem'] ?? 0;
    const uItem = params['uitem'] ?? 0;
    const note = params['note'] ?? 0;
    const res = await getRefilledItems(`
?offset=${offset}
${limit ? `&limit=${limit}` : ''}
${rItem ? `&ritem=${rItem}` : ''}
${uItem ? `&uitem=${uItem}` : ''}
${note ? `&note=${note}` : ''}
`)

    return (
        <div>
            <URLQueryParameterSetter
                paramOptions={[
                    { label: t('inputs.search.refilledItem'), value: 'ritem' },
                    { label: t('inputs.search.usedItem'), value: 'uitem' },
                    { label: t('inputs.search.notes'), value: 'note' },
                    { label: t('inputs.search.limit'), value: 'limit' },
                ]}
            />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.refilledItem")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.quantity")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.usedItem")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.quantity")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.date")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.repo")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.employee")}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t("refillableItems.refilled.list.notes")}
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
                                        <TableNote note={transaction.notes} />
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
    )
}

export default page
