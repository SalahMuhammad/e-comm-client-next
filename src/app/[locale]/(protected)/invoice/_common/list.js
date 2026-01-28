import { getInvs } from "./actions";
import PaginationControls from '@/components/PaginationControls';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvoiceListTable from './InvoiceListTable';
import ErrorLoading from "@/components/ErrorLoading";

async function InvoiceList({ searchParams, type }) {
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const ownerName = params['owner__name'] ?? '';
    const orderNo = params['no'] ?? '';
    const note = params['note'] ?? '';
    const itemDesc = params['itemdesc'] ?? '';
    const itemName = params['itemname'] ?? '';
    const status = params['status'] ?? '';
    const repositoryPermit = params['repository_permit'] ?? '';
    const issueDateAfter = params['issue_date_after'] ?? '';
    const issueDateBefore = params['issue_date_before'] ?? '';
    const dueDateAfter = params['due_date_after'] ?? '';
    const dueDateBefore = params['due_date_before'] ?? '';
    const t = await getTranslations();
    const isRefund = type.split('/')[1] || false;


    const res = (await getInvs(`${type}`, `?limit=${limit}
&offset=${offset}${ownerName ? `&owner__name=${ownerName}` : ''}
${orderNo ? `&no=${orderNo}` : ''}
${note ? `&note=${note}` : ''}
${itemDesc ? `&itemdesc=${itemDesc}` : ''}
${itemName ? `&itemname=${itemName}` : ''}
${status ? `&status=${status}` : ''}
${repositoryPermit ? `&repository_permit=${repositoryPermit}` : ''}
${issueDateAfter ? `&issue_date_after=${issueDateAfter}` : ''}
${issueDateBefore ? `&issue_date_before=${issueDateBefore}` : ''}
${dueDateAfter ? `&due_date_after=${dueDateAfter}` : ''}
${dueDateBefore ? `&due_date_before=${dueDateBefore}` : ''}
`
    ));
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data

    // Build paramOptions based on invoice type
    const paramOptions = [
        { label: t('inputs.search.ownerName'), value: 'owner__name' },
        { label: t('inputs.search.orderNumber'), value: 'no' },
        { label: t('inputs.search.notes'), value: 'note' },
        { label: t('inputs.search.itemDescription'), value: 'itemdesc' },
        { label: t('inputs.search.itemName'), value: 'itemname' },
        {
            label: t('inputs.search.status'),
            value: 'status',
            inputType: 'select',
            selectOptions: [
                { label: t('invoice.form.statusOptions.3'), value: '3' },
                { label: t('invoice.form.statusOptions.4'), value: '4' },
                { label: t('invoice.form.statusOptions.5'), value: '5' },
                { label: t('invoice.form.statusOptions.6'), value: '6' },
            ]
        },
    ];

    // Add repository permit only for non-refund invoices
    if (!isRefund) {
        paramOptions.push({
            label: t('inputs.search.repositoryPermit'),
            value: 'repository_permit',
            inputType: 'select',
            selectOptions: [
                { label: t('inputs.search.repositoryPermitOptions.true'), value: 'true' },
                { label: t('inputs.search.repositoryPermitOptions.false'), value: 'false' },
            ]
        });
    }

    // Add date filters
    paramOptions.push(
        { label: t('inputs.search.issueDateAfter'), value: 'issue_date_after', inputType: 'date' },
        { label: t('inputs.search.issueDateBefore'), value: 'issue_date_before', inputType: 'date' },
        { label: t('inputs.search.dueDateAfter'), value: 'due_date_after', inputType: 'date' },
        { label: t('inputs.search.dueDateBefore'), value: 'due_date_before', inputType: 'date' },
    );

    return (
        <>
            <URLQueryParameterSetter
                paramOptions={paramOptions}
            />

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <InvoiceListTable initialData={data.results} type={type} />
            </div>
            {(data.count === 0 || !data.results || data.results.length === 0) &&
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

