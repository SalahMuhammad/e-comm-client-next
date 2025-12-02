import { getInvs } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvoiceListTable from './InvoiceListTable';
import ErrorLoading from "@/components/ErrorLoading";

async function InvoiceList({ searchParams, type }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const orderNo = params['no'] ?? '';
    const note = params['note'] ?? '';
    const itemDesc = params['itemdesc'] ?? '';
    const itemName = params['itemname'] ?? '';
    const t = await getTranslations("invoice");
    const isRefund = type.split('/')[1] || false;


    const res = (await getInvs(`${type}`, `?limit=${limit}
&offset=${offset}${search ? `&owner=${search}` : ''}
${orderNo ? `&no=${orderNo}` : ''}
${note ? `&note=${note}` : ''}
${itemDesc ? `&itemdesc=${itemDesc}` : ''}
${itemName ? `&itemname=${itemName}` : ''}
`
    ));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
            redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    return (
        <>
            <QueryParamSetterInput 
                paramOptions={[
                    { label: 'Owner Name', value: 's' },
                    { label: 'Order Nu', value: 'no' },
                    { label: 'Note', value: 'note' },
                    { label: 'Item Description', value: 'itemdesc' },
                    { label: 'Item Name', value: 'itemname' },
                ]}
            />
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <InvoiceListTable initialData={data.results} type={type} />
            </div>
            {data.count == 0 && 
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
export default InvoiceList
