import { getInvs } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import DeleteButton from "./DeleteButton";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import ToolTip from "@/components/ToolTip";
import RepositoryPermitButton from "./RepositoryPermitButton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


async function InvoiceList({ searchParams, type }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations("invoice");
    const isRefund = type.split('/')[1] || false;


    const res = (await getInvs(`${type}`, `?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`));
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
                            {t('table.head.owner')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.issueDate')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.dueDate')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.totalAmount')}
                        </th>
                        {!isRefund && (
                            <th scope="col" className="px-6 py-3">
                                {t('table.head.repositoryPremit')}
                            </th>
                        )}
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.notes')}
                        </th>
                        {isRefund && (
                            <th scope="col" className="px-6 py-3">
                                {t('table.head.originalInvoice')}
                            </th>
                        )}
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.results.map((inv) => (
                        <tr key={inv.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {inv.owner_name}
                            </th>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                <Link href={`/invoice/${type}/view/${inv.id}`} className="hover:bg-gray-100 dark:hover:bg-gray-600" passHref>
                                    {inv.issue_date}
                                </Link>
                            </td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                {inv.due_date}
                            </td>
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                {numberFormatter(inv.total_amount)}
                            </td>
                            {! isRefund && (
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    <RepositoryPermitButton id={inv.id} type={type} permitValue={inv.repository_permit} />
                                </td>
                            )}
                            <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                <pre className="whitespace-pre-wrap">
                                    {inv.notes}
                                </pre>
                            </td>
                            {isRefund && (
                                <td className="px-6 py-4 max-w-xs overflow-x-auto">
                                    #<Link href={`/invoice/${type.split('/')[0]}/view/${inv.original_invoice}`} className="text-blue-600 hover:underline">
                                        {inv.original_invoice}
                                    </Link>
                                </td>
                            )}
                            
                            <td className="flex items-center px-6 py-4">
                                {! isRefund && (
                                    <>
                                        <DeleteButton type={type} id={inv.id} />
                                        <Link href={`/invoice/${type}/form/${inv.id}`} className="ml-2 text-blue-600 hover:underline">
                                            Edit
                                        </Link>
                                    </>
                                )}
                                <ToolTip obj={inv} />
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

export default InvoiceList
