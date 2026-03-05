import GenericDataTable from '@/components/GenericDataTable';
import GenericDeleteButton from '@/components/GenericDeleteButton';
import { PermissionGateServer } from '@/components/PermissionGateServer';
import { PERMISSIONS } from '@/config/permissions.config';
import { getDebtSettlements, deleteDebtSettlement } from '../actions';
import { getTranslations } from "next-intl/server";
import Link from 'next/link';
import numberFormatter from "@/utils/NumberFormatter";
import StatusToggle from "./StatusToggle";
import { PencilIcon } from "@heroicons/react/24/outline";
import TableNote from "@/components/TableNote";
import LocalizedDate from "@/components/LocalizedDate";

export default async function Page({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getDebtSettlements}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'owner', default: '', searchLabel: t('inputs.search.ownerName') },
                { key: 'notes', default: '', searchLabel: t('inputs.search.notes') },
                { key: 'date', default: '', searchLabel: t('inputs.search.date'), inputType: 'date' },
                {
                    key: 'status',
                    default: '',
                    searchLabel: t('finance.debtSettlement.status.label'),
                    inputType: 'select',
                    selectOptions: [
                        { label: t('finance.debtSettlement.status.approved'), value: 'approved' },
                        { label: t('finance.debtSettlement.status.not_approved'), value: 'not_approved' }
                    ]
                }
            ]}
            columns={[
                {
                    label: t('finance.fields.owner'),
                    render: (row) => (
                        <Link href={`/customer-supplier/view/${row.owner}`} className="text-blue-600 dark:text-blue-200 hover:underline dark:hover:text-white hover:text-gray-700 transition-all duration-200">
                            {row.owner_name}
                        </Link>
                    )
                },
                {
                    label: t('finance.fields.date'),
                    render: (row) => <LocalizedDate date={row.date} />
                },
                {
                    label: 'settlement ' + t('finance.fields.amount'),
                    render: (row) => numberFormatter(row.amount)
                },
                {
                    label: t('finance.fields.status'),
                    render: (row) => <StatusToggle obj={row} />
                },
                {
                    label: t('finance.fields.note'),
                    render: (row) => <TableNote note={row.note} />
                },
                {
                    label: '',
                    hideHeader: true,
                    render: (row) => (
                        <div className="flex items-center gap-2">
                            <PermissionGateServer permission={PERMISSIONS.DEBT_SETTLEMENT.CHANGE}>
                                <Link
                                    href={`/finance/debt-settlement/form/${row.hashed_id}`}
                                    className="flex items-center text-blue-600 hover:text-blue-800 group transition duration-300 dark:text-blue-200 dark:hover:text-white"
                                >
                                    <PencilIcon
                                        className="h-4 w-4 mr-1 transition-all duration-300 ease-in-out group-hover:rotate-[8deg] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:drop-shadow-sm"
                                    />
                                    <span className="transition-opacity duration-300 group-hover:opacity-90 text-sm">
                                        {t('finance.table.edit')}
                                    </span>
                                </Link>
                            </PermissionGateServer>

                            <PermissionGateServer permission={PERMISSIONS.DEBT_SETTLEMENT.DELETE}>
                                <GenericDeleteButton
                                    id={row.hashed_id}
                                    deleteAction={deleteDebtSettlement}
                                    translationKey="finance.table"
                                />
                            </PermissionGateServer>
                        </div>
                    )
                }
            ]}
            emptyStateKey="global.errors"
            showTooltip={true}
        />
    );
}
