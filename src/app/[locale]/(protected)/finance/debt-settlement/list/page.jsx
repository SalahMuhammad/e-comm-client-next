import { getDebtSettlements } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import { getTranslations } from "next-intl/server";
import DeleteTransaction from "../DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StatusToggle from "./StatusToggle";
import ErrorLoading from "@/components/ErrorLoading";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import TableNote from "@/components/TableNote";
import LocalizedDate from "@/components/LocalizedDate";


async function List({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const notes = params['notes'] ?? '';
    const date = params['date'] ?? '';
    const status = params['status'] ?? '';
    const t = await getTranslations();


    const res = (await getDebtSettlements(`?limit=${limit}&offset=${offset}${search ? `&owner=${search}` : ''}${notes ? `&notes=${notes}` : ''}${date ? `&date=${date}` : ''}${status ? `&status=${status}` : ''}`));
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
            cell: (row) => <LocalizedDate date={row.date} />
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
            cell: (row) => <TableNote note={row.note} />
        },
        {
            header: '',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link
                        className="flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                        href={`/finance/debt-settlement/view/${row.hashed_id}`}
                    >
                        <EyeIcon
                            className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                        />
                        <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                            {t('finance.table.view')}
                        </span>
                    </Link> */}
                    <Link
                        href={`/finance/debt-settlement/form/${row.hashed_id}`}
                        className="flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                    >
                        <PencilIcon
                            className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm"
                        />
                        <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                            {t('finance.table.edit')}
                        </span>
                    </Link>
                    <DeleteTransaction id={row.hashed_id} />
                    <ToolTip obj={row} />
                </div>
            )
        }
    ];

    return (
        <>
            <URLQueryParameterSetter
                paramName={searchParamName}
                paramOptions={[
                    { label: t('inputs.search.ownerName'), value: 's' },
                    { label: t('inputs.search.notes'), value: 'notes' },
                    { label: t('inputs.search.date'), value: 'date', inputType: 'date' },
                    {
                        label: t('finance.debtSettlement.status.label'),
                        value: 'status',
                        inputType: 'select',
                        selectOptions: [
                            { label: t('finance.debtSettlement.status.approved'), value: 'approved' },
                            { label: t('finance.debtSettlement.status.not_approved'), value: 'not_approved' }
                        ]
                    }
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
                                    <td key={i} scope="col" className={`px-6 py-3 ${i === 0 || i === 1 ? 'whitespace-nowrap' : ''} ${i === 3 ? 'text-center' : ''}`}>
                                        {column.cell(obj)}
                                    </td>
                                ))}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data?.count == 0 &&
                <ErrorLoading name="global.errors" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md mt-3" />
            }

            <PaginationControls
                resCount={data.count}
                hasNext={data.next}
                hasPrev={data.previous}
            />
        </>
    )
}

export default List
