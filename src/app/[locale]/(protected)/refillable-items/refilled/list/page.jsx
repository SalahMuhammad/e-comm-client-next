import GenericDataTable from '@/components/GenericDataTable';
import GenericDeleteButton from '@/components/GenericDeleteButton';
import { PermissionGateServer } from '@/components/PermissionGateServer';
import { PERMISSIONS } from '@/config/permissions.config';
import { getRefilledItems, deleteRefilledTransaction } from '../../actions';
import { getTranslations } from 'next-intl/server';
import TableNote from '@/components/TableNote';

export default async function Page({ searchParams }) {
    const t = await getTranslations('refillableItems.refilled.list');
    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getRefilledItems}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'ritem', default: '', searchLabel: t('refilledItem') },
                { key: 'uitem', default: '', searchLabel: t('usedItem') },
                { key: 'note', default: '', searchLabel: t('notes') },
                { key: 'repo', default: '', searchLabel: t('repo') },
                { key: 'employee_name', default: '', searchLabel: t('employee') },
                { key: 'date_after', default: '', searchLabel: t('dateFrom'), inputType: 'date' },
                { key: 'date_before', default: '', searchLabel: t('dateTo'), inputType: 'date' },
            ]}
            columns={[
                { label: t('refilledItem'), render: (row) => row.refilled_item_name },
                { label: t('quantity'), render: (row) => row.refilled_quantity },
                { label: t('usedItem'), render: (row) => row.used_item_name },
                { label: t('quantity'), render: (row) => row.used_quantity },
                { label: t('date'), render: (row) => row.date },
                { label: t('repo'), render: (row) => row.repository_name },
                { label: t('employee'), render: (row) => row.employee_name },
                { label: t('notes'), render: (row) => <TableNote note={row.notes} /> },
                {
                    label: '',
                    hideHeader: true,
                    render: (row) => (
                        <PermissionGateServer permission={PERMISSIONS.REFILLABLE_ITEMS.DELETE}>
                            <GenericDeleteButton
                                id={row.id}
                                deleteAction={deleteRefilledTransaction}
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
