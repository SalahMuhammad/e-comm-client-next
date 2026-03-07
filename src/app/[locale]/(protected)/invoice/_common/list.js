import GenericDataTable from '@/components/GenericDataTable';
import { getInvs } from "./actions";
import { getTranslations } from "next-intl/server";
import InvoiceListTable from './InvoiceListTable';

export default async function InvoiceList({ searchParams, type }) {
    const t = await getTranslations();
    const isRefund = type.split('/')[1] || false;

    // Build queryParams based on invoice type
    const baseQueryParams = [
        { key: 'limit', default: 12 },
        { key: 'offset', default: 0 },
        { key: 'owner__name', default: '', searchLabel: t('inputs.search.ownerName') },
        { key: 'no', default: '', searchLabel: t('inputs.search.orderNumber') },
        { key: 'note', default: '', searchLabel: t('inputs.search.notes') },
        { key: 'itemdesc', default: '', searchLabel: t('inputs.search.itemDescription') },
        { key: 'itemname', default: '', searchLabel: t('inputs.search.itemName') },
        {
            key: 'status',
            default: '',
            searchLabel: t('inputs.search.status'),
            inputType: 'select',
            selectOptions: [
                { label: t('invoice.form.statusOptions.3'), value: '3' },
                { label: t('invoice.form.statusOptions.4'), value: '4' },
                { label: t('invoice.form.statusOptions.5'), value: '5' },
                { label: t('invoice.form.statusOptions.6'), value: '6' },
            ]
        },
        { key: 'issue_date_after', default: '', searchLabel: t('inputs.search.issueDateAfter'), inputType: 'date' },
        { key: 'issue_date_before', default: '', searchLabel: t('inputs.search.issueDateBefore'), inputType: 'date' },
        { key: 'due_date_after', default: '', searchLabel: t('inputs.search.dueDateAfter'), inputType: 'date' },
        { key: 'due_date_before', default: '', searchLabel: t('inputs.search.dueDateBefore'), inputType: 'date' }
    ];

    if (!isRefund) {
        baseQueryParams.push({
            key: 'repository_permit',
            default: '',
            searchLabel: t('inputs.search.repositoryPermit'),
            inputType: 'select',
            selectOptions: [
                { label: t('inputs.search.repositoryPermitOptions.true'), value: 'true' },
                { label: t('inputs.search.repositoryPermitOptions.false'), value: 'false' }
            ]
        });
    }

    const fetchFnWrapper = async (queryString) => {
        return await getInvs(type, queryString);
    };

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={fetchFnWrapper}
            queryParams={baseQueryParams}
            emptyStateKey="global.errors"
            renderList={({ data }) => (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <InvoiceListTable
                        initialData={data?.results ?? []}
                        type={type}
                    />
                </div>
            )}
        />
    );
}
