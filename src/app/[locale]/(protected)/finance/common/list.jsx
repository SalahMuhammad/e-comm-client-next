import { getList } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import DeleteButton from "./DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Toggle from "./StatusToggle";


async function List({ searchParams, type }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations("finance");


    const res = (await getList(`${type}`, `?limit=${limit}&offset=${offset}${search ? `&owner=${search}` : ''}`));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    return (
        <>
            <QueryParamSetterInput
                paramName={searchParamName}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.owner')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.paymentMethod')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.amount')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.status')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.type')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.date')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {t('fields.note')}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.results?.map((payment) => (
                            <tr key={payment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 w-[12rem] max-w-[12rem] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link href={`/customer-supplier/view/${payment.owner}`} className="text-blue-600 hover:underline">
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
                                    <Toggle obj={payment} type={type} />
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment.payment_type}
                                </td>
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    {payment.date}
                                </td>
                                <td className="px-6 py-4 w-[12rem] max-w-[12rem]">
                                    <pre>
                                        {payment.note}
                                    </pre>
                                </td>

                                <td className="flex items-center px-6 py-4">
                                    <>
                                        <Link className="text-blue-600 hover:underline" href={`/finance/${type}/view/${payment.id}`}>
                                            view
                                        </Link>
                                        <DeleteButton type={type} id={payment.id} />
                                        <Link href={`/finance/${type}/form/${payment.id}`} className="ml-2 text-blue-600 hover:underline">
                                            Edit
                                        </Link>
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
