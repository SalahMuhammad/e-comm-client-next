import { getDebtSettlements } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import DeleteTransaction from "../DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StatusToggle from "./StatusToggle";
import { formatDate } from "@/utils/dateFormatter";


async function List({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations();


    const res = (await getDebtSettlements(`?limit=${limit}&offset=${offset}${search ? `&owner=${search}` : ''}`));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    const columns = [
        {
            header: t('finance.fields.owner'),
            cell: (row) => (
                <Link href={`/customer-supplier/view/${row.owner}`} className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200">
                    {row.owner_name}
                </Link>
            )
        },
        {
            header: t('finance.fields.date'),
            cell: (row) => formatDate(row.date)
        },
        {
            header: 'settlement ' + t('finance.fields.amount'),
            cell: (row) => numberFormatter(row.amount)
        },
        {
            header: t('finance.fields.status'),
            cell: (row) => (<StatusToggle obj={row} />)

        },
        {
            header: t('finance.fields.note'),
            cell: (row) => row.note
        },
        {
            header: '',
            cell: (row) => (
                <div className="flex gap-2">
                    <Link
                        href={`/finance/debt-settlement/form/${row.hashed_id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {t('finance.table.edit')}
                    </Link>
                    <DeleteTransaction id={row.hashed_id} />
                    <ToolTip obj={row} />
                </div>
            )
        }
    ];

    return (
        <>
            <QueryParamSetterInput
                paramName={searchParamName}
                paramOptions={[
                    { label: t('inputs.search.ownerName'), value: 's' },
                ]}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns?.map((column, i) => (
                                <th key={i} scope="col" className="px-6 py-3">
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results?.map((obj) => (
                            <tr key={obj.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">

                                {columns?.map((column, i) => (
                                    <td key={i} scope="col" className="px-6 py-3">
                                        {column.cell(obj)}
                                    </td>
                                ))}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaginationControls
                resCount={data.count}
                hasNext={data.next}
                hasPrev={data.previous}
            />
        </>
    )
}

export default List
