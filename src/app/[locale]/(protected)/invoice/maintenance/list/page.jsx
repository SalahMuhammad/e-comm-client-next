import GenericDataTable from '@/components/GenericDataTable';
import { getTranslations } from 'next-intl/server';
import MaintenanceList from '../components/List'
import Header from '../components/Header';
import { httpRequest } from '@/utils/HTTPMethods';


export default async function Items({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={(qs) => httpRequest('api/maintenance/?' + qs)}
            // columns={["serial_number"]}
            headerSlot={<Header />}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'client_name', default: '', searchLabel: t('inputs.search.name') },
                { key: 'serial_numbers', default: '', searchLabel: t('inputs.search.serial_number') },
                { key: 'notes', default: '', searchLabel: t('inputs.search.notes') },
                { key: 'malfunctions', default: '', searchLabel: t('inputs.search.malfunctions') },
                { key: 'date_in', default: '', searchLabel: t('inputs.search.date_in') },
                { key: 'maintenance_date', default: '', searchLabel: t('inputs.search.maintenance_date') },
                { key: 'date_out', default: '', searchLabel: t('inputs.search.date_out') },
                { key: 'maintained_by', default: '', searchLabel: t('inputs.search.maintained_by') },
                { key: 'status', default: '', searchLabel: 'Status' },
            ]}
            emptyStateKey="warehouse.repositories.table"
            renderList={({ data }) => (
                <MaintenanceList initialData={ {results: data.results}} />
            )}
        />
    );
}
