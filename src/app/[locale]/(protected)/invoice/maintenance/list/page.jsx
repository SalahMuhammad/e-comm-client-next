import GenericDataTable from '@/components/GenericDataTable';
import { getTranslations } from 'next-intl/server';
import { getTransactions } from '../actions'
import MaintenanceList from './components/List'
import Header from './components/Header';


export default async function Items({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getTransactions}
            // columns={["serial_number"]}
            headerSlot={<Header />}
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
                <MaintenanceList initialData={ {results: data.results}} />
            )}
        />
    );
}
