import GenericDataTable from '@/components/GenericDataTable';
import { getDamagedItems } from "./actions";
import DamagedItemsListClient from './DamagedItemsListClient';
import { getTranslations } from 'next-intl/server';

export default async function DamagedItems({ searchParams }) {
    const t = await getTranslations('inputs.search');

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getDamagedItems}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'item__name', default: '', searchLabel: t('itemName') },
                { key: 'owner__name', default: '', searchLabel: t('ownerName') },
                { key: 'repository__name', default: '', searchLabel: t('repository') },
                { key: 'notes', default: '', searchLabel: t('notes') }
            ]}
            emptyStateKey="warehouse.repositories.table"
            renderList={({ data }) => (
                <DamagedItemsListClient initialItems={data?.results ?? []} />
            )}
        />
    );
}