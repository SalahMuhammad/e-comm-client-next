import GenericDataTable from '@/components/GenericDataTable';
import GenericDeleteButton from '@/components/GenericDeleteButton';
import { PermissionGateServer } from '@/components/PermissionGateServer';
import { PERMISSIONS } from '@/config/permissions.config';
import { getCSs, deleteCS } from '../actions';
import { getTranslations } from 'next-intl/server';
import CustomerSupplierTable from './CustomerSupplierTable';

export default async function Page({ searchParams }) {
    const t = await getTranslations();
    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getCSs}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 's', default: '', searchLabel: t('inputs.search.ownerName') },
            ]}
            emptyStateKey="warehouse.repositories.table"
            showTooltip={false}
            renderList={({ data }) => (
                <div className="relative overflow-x-auto shadow-md rounded-md">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('customer-supplier.table.head.name')}</th>
                                <th scope="col" className="px-6 py-3">{t('customer-supplier.table.head.details')}</th>
                                <th scope="col" className="px-6 py-3">{t('customer-supplier.table.head.actions')}</th>
                            </tr>
                        </thead>
                        <CustomerSupplierTable CSs={data?.results ?? []} />
                    </table>
                </div>
            )}
        />
    );
}
