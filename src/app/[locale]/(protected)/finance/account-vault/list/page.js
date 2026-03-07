import GenericDataTable from '@/components/GenericDataTable';
import { getAccountList } from "../actions";
import { getTranslations } from "next-intl/server";
import ListClient from "../_common/ListClient";

export default async function Page({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getAccountList}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'account_name', default: '', searchLabel: t('accountVault.placeholders.searchAccountName') },
                { key: 'account_type__name', default: '', searchLabel: t('accountVault.placeholders.searchAccountType') },
                { key: 'phone_number', default: '', searchLabel: t('accountVault.fields.phoneNumber') },
                { key: 'bank_name', default: '', searchLabel: t('accountVault.fields.bankName') },
                {
                    key: 'is_active',
                    default: '',
                    searchLabel: t('accountVault.fields.isActive'),
                    inputType: 'select',
                    selectOptions: [
                        { label: t('accountVault.status.active'), value: 'true' },
                        { label: t('accountVault.status.inactive'), value: 'false' }
                    ]
                }
            ]}
            emptyStateKey="global.errors"
            renderList={({ data }) => (
                <ListClient
                    type="account"
                    initialItems={data?.results ?? []}
                    count={data?.count ?? 0}
                    next={data?.next}
                    previous={data?.previous}
                />
            )}
        />
    );
}
