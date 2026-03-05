import GenericDataTable from '@/components/GenericDataTable';
import { getList } from "./actions";
import { getTranslations } from "next-intl/server";
import PaymentListTable from "./PaymentListTable";

export default async function List({ searchParams, type }) {
    const t = await getTranslations();

    // Since getList expects the 'type' string first, we need a custom fetchFn wrapper 
    const fetchFnWrapper = async (queryString) => {
        return await getList(type, queryString);
    };

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={fetchFnWrapper}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'owner__name', default: '', searchLabel: t('inputs.search.ownerName') },
                { key: 'no', default: '', searchLabel: t('inputs.search.paymentNumber') },
                { key: 'notes', default: '', searchLabel: t('inputs.search.notes') },
                { key: 'date', default: '', searchLabel: t('inputs.search.date'), inputType: 'date' },
                {
                    key: 'status',
                    default: '',
                    searchLabel: t('finance.fields.status'),
                    inputType: 'select',
                    selectOptions: [
                        { label: t('finance.statusOptions.pending'), value: '1' },
                        { label: t('finance.statusOptions.confirmed'), value: '2' },
                        { label: t('finance.statusOptions.rejected'), value: '3' },
                        { label: t('finance.statusOptions.reimbursed'), value: '4' }
                    ]
                },
                { key: 'business_account__account_name', default: '', searchLabel: t('inputs.search.accountName') }
            ]}
            emptyStateKey="global.errors"
            renderList={({ data }) => (
                <PaymentListTable
                    data={data}
                    type={type}
                />
            )}
        />
    );
}
