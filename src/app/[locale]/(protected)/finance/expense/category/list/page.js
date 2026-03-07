import GenericDataTable from '@/components/GenericDataTable';
import { getCategoryList } from "../actions";
import { getTranslations } from 'next-intl/server';
import ListClient from "../_common/ListClient";

export default async function Page({ searchParams }) {
    const t = await getTranslations();

    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getCategoryList}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 'name', default: '', searchLabel: t('inputs.search.name') },
                { key: 'description', default: '', searchLabel: t('finance.expense.category.description') }
            ]}
            emptyStateKey="global.errors"
            renderList={({ data }) => (
                <ListClient
                    initialItems={data?.results ?? []}
                    count={data?.count ?? 0}
                    next={data?.next}
                    previous={data?.previous}
                />
            )}
        />
    );
}
