import GenericDataTable from '@/components/GenericDataTable';
import { getTranslations } from "next-intl/server";
import { getTransfers } from "../actions";
import TransferListTable from './TransferListTable';

export default async function TransferList({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getTransfers}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'from', default: '', searchLabel: t('finance.fields.fromVault') },
                { key: 'to', default: '', searchLabel: t('finance.fields.toVault') },
                { key: 'notes', default: '', searchLabel: t('inputs.search.notes') },
                { key: 'date', default: '', searchLabel: t('inputs.search.date'), inputType: 'date' },
                {
                    key: 'transfer_type',
                    default: '',
                    searchLabel: t('finance.fields.transferType'),
                    inputType: 'select',
                    selectOptions: [
                        { label: t('finance.transferTypes.internal'), value: 'internal' },
                        { label: t('finance.transferTypes.external'), value: 'external' },
                        { label: t('finance.transferTypes.p2p'), value: 'p2p' }
                    ]
                }
            ]}
            emptyStateKey="global.errors"
            queryStringMapper={(params) => {
                // Map the 'from' and 'to' URL params back to the API query params
                const mappedParams = new URLSearchParams(params);
                if (mappedParams.has('from')) {
                    mappedParams.set('from_vault__account_name', mappedParams.get('from'));
                    mappedParams.delete('from');
                }
                if (mappedParams.has('to')) {
                    mappedParams.set('to_vault__account_name', mappedParams.get('to'));
                    mappedParams.delete('to');
                }
                return `?${mappedParams.toString()}`;
            }}
            renderList={({ data }) => (
                <TransferListTable data={data} />
            )}
        />
    );
}
