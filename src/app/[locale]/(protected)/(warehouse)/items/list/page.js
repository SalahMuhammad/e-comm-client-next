import GenericDataTable from '@/components/GenericDataTable';
import { ItemsView } from './Card'
import { getItems } from "./actions";
import { getTranslations } from 'next-intl/server';

export default async function Items({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getItems}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'name', default: '', searchLabel: t('inputs.search.name') },
                { key: 'type', default: '', searchLabel: t('inputs.search.type') },
                { key: 'id', default: '', searchLabel: t('inputs.search.id') },
                { key: 'barcode', default: '', searchLabel: t('inputs.search.barcode') },
                { key: 'place', default: '', searchLabel: t('inputs.search.place') },
                { key: 'origin', default: '', searchLabel: t('inputs.search.origin') },
            ]}
            emptyStateKey="warehouse.repositories.table"
            renderList={({ data }) => (
                <ItemsView items={data?.results ?? []} />
            )}
        />
    );
}