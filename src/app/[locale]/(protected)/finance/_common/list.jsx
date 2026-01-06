import { getList } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
// import DeleteButton from "./DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip2";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toggle from "./StatusToggle";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";


async function List({ searchParams, type }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const paymen_no = params['no'] ?? '';
    const t = await getTranslations();


    const res = (await getList(`${type}`, `?limit=${limit}&offset=${offset}${search ? `&owner=${search}` : ''}${paymen_no ? `&no=${paymen_no}` : ''}`));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    return (
        <>
            <QueryParamSetterInput
                paramName={searchParamName}
                paramOptions={[
                    { label: t('inputs.search.ownerName'), value: 's' },
                    { label: t('inputs.search.paymentNumber'), value: 'no' }
                ]}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.owner')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.paymentMethod')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.amount')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.status')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.ref')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.date')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('finance.fields.note')}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results?.map((payment) => (
                            <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 w-[12rem] max-w-[16rem] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link href={`/customer-supplier/view/${payment.owner}`} className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200">
                                        {payment.owner_name}
                                    </Link>
                                </th>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment.payment_method_name}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {numberFormatter(payment.amount)}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <StatusBadge status={payment.status} />
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment?.ref ? (
                                        <Link className="
                                            ml-2 flex items-center text-blue-700 
                                            hover:text-blue-800 group transition 
                                            duration-300 dark:text-blue-200 
                                            dark:hover:text-white" href={`/invoice/${type == 'payment' ? 'sales' : 'purchases'}/view/${payment.ref}`}
                                        >
                                            #{payment.ref}
                                        </Link>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment.date}
                                </td>
                                <td className="px-6 py-4 w-[10rem] max-w-[10rem] overflow-auto">
                                    <pre>
                                        {payment.notes}
                                    </pre>
                                </td>

                                <td className="flex items-center px-6 py-4">
                                    <>
                                        <Link className="ml-2 flex items-center text-blue-700 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white" href={`/finance/${type}${type == 'payment' ? 's' : ''}/view/${payment.hashed_id}`}>
                                            <EyeIcon
                                                className="h-5 w-5 mr-1 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-sm"
                                            />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("finance.table.view")}
                                            </span>
                                        </Link>
                                        {/* <DeleteButton type={type} id={payment.hashed_id} />
                                        <Link
                                            href={`/finance/${type}/form/${payment.hashed_id}`}
                                            className="ml-2 flex items-center text-blue-600 hover:text-blue-500 group transition-colors dark:text-blue-200 dark:hover:text-white"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm" />
                                            <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                                {t("table.edit")}
                                            </span>
                                        </Link> */}
                                    </>
                                    <ToolTip obj={payment} />
                                </td>
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


function StatusBadge({ status }) {
    const statusConfig = {
        '1': {
            label: 'Pending',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            dotColor: 'bg-yellow-500'
        },
        '2': {
            label: 'Confirmed',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            dotColor: 'bg-blue-500'
        },
        '3': {
            label: 'Rejected',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            dotColor: 'bg-red-500'
        },
        '4': {
            label: 'Reimbursed',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            dotColor: 'bg-green-500'
        }
    };

    const config = statusConfig[status] || statusConfig['1'];

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50">
            <div className="space-y-8">
                {/* <div>
                    <h2 className="text-sm font-medium text-gray-600 mb-4">All Status Badges:</h2>
                    <div className="flex flex-wrap gap-3">
                        {Object.keys(statusConfig).map((key) => {
                            const cfg = statusConfig[key];
                            return (
                                <span
                                    key={key}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cfg.bgColor} ${cfg.textColor}`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${cfg.dotColor} mr-2`}></span>
                                    {cfg.label}
                                </span>
                            );
                        })}
                    </div>
                </div> */}

                <div>
                    {/* <h2 className="text-sm font-medium text-gray-600 mb-4">Selected Status:</h2> */}
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-2`}></span>
                        {config.label}
                    </span>
                </div>

                {/* <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Usage Example:</h3>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                        {`<StatusBadge status="1" /> // Pending
<StatusBadge status="2" /> // Confirmed
<StatusBadge status="3" /> // Rejected
<StatusBadge status="4" /> // Reimbursed`}
                    </pre>
                </div> */}
            </div>
        </div>
    );
}
