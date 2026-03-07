import GenericDataTable from '@/components/GenericDataTable';
import { getAccountTypeList } from "../../actions";
import { getTranslations } from "next-intl/server";
import ListClient from "../../_common/ListClient";

export default async function Page({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getAccountTypeList}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'name', default: '', searchLabel: t('accountVault.placeholders.searchAccountType') },
            ]}
            emptyStateKey="global.errors"
            renderList={({ data }) => (
                <ListClient
                    type="type"
                    initialItems={data?.results ?? []}
                    count={data?.count ?? 0}
                    next={data?.next}
                    previous={data?.previous}
                />
            )}
        />
    );
}
