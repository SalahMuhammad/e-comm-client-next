import GenericDataTable from '@/components/GenericDataTable';
import GenericDeleteButton from '@/components/GenericDeleteButton';
import { PermissionGateServer } from '@/components/PermissionGateServer';
import { PERMISSIONS } from '@/config/permissions.config';
import { getRefundedItems, deleteRefundedItems } from '../../actions';
import { getTranslations } from 'next-intl/server';
import TableNote from '@/components/TableNote';
import Link from 'next/link';

export default async function Page({ searchParams }) {
    const t = await getTranslations('refillableItems.refund.list');
    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getRefundedItems}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'client', default: '', searchLabel: t('client') },
                { key: 'item', default: '', searchLabel: t('refunded') },
                { key: 'repo', default: '', searchLabel: t('repo') },
                { key: 'notes', default: '', searchLabel: t('notes') },
                { key: 'date_after', default: '', searchLabel: t('dateFrom'), inputType: 'date' },
                { key: 'date_before', default: '', searchLabel: t('dateTo'), inputType: 'date' },
            ]}
            columns={[
                {
                    label: t('client'),
                    render: (row) => (
                        <Link
                            className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200"
                            href={`/customer-supplier/view/${row.owner}`}
                        >
                            {row.owner_name}
                        </Link>
                    ),
                },
                { label: t('date'), render: (row) => row.date },
                { label: t('refunded'), render: (row) => row.item_name },
                { label: t('quantity'), render: (row) => row.quantity },
                { label: t('repo'), render: (row) => row.repository_name },
                { label: t('notes'), render: (row) => <TableNote note={row.notes} /> },
                {
                    label: '',
                    hideHeader: true,
                    render: (row) => (
                        <PermissionGateServer permission={PERMISSIONS.REFUNDED_REFILLABLE_ITEMS.DELETE}>
                            <GenericDeleteButton
                                id={row.id}
                                deleteAction={deleteRefundedItems}
                                translationKey="warehouse.repositories.table"
                            />
                        </PermissionGateServer>
                    ),
                },
            ]}
            emptyStateKey="warehouse.repositories.table"
            showTooltip={true}
        />
    );
}
