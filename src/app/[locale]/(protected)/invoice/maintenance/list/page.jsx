import GenericDataTable from '@/components/GenericDataTable';
import { getTranslations } from 'next-intl/server';
import MaintenanceList from '../components/List'
import Header from '../components/Header';
import { httpRequest } from '@/utils/HTTPMethods';


export default async function Items({ searchParams }) {
    const t = await getTranslations('maintenance.view');

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={(qs) => httpRequest('api/maintenance/' + qs)}
            // columns={["serial_number"]}
            headerSlot={<Header />}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'client_name', default: '', searchLabel: t('client') },
                { key: 'serial_numbers', default: '', searchLabel: t('serialNumber') },
                { key: 'notes', default: '', searchLabel: t('notes') },
                { key: 'malfunctions', default: '', searchLabel: t('malfunctions') },
                { key: 'date_in', default: '', searchLabel: t('dateIn') },
                { key: 'maintenance_date', default: '', searchLabel: t('maintenanceDate') },
                { key: 'date_out', default: '', searchLabel: t('dateOut') },
                { key: 'maintained_by', default: '', searchLabel: t('handledBy') },
                { key: 'status', default: '', searchLabel: t('status.status') },
            ]}
            emptyStateKey="warehouse.repositories.table"
            renderList={({ data }) => (
                <MaintenanceList initialData={ {results: data.results}} />
            )}
        />
    );
}
