import GenericDataTable from '@/components/GenericDataTable';
import { getRepositories } from '../actions';
import { getTranslations } from 'next-intl/server';
import RepositoryListClient from './RepositoryListClient';

export default async function Page({ searchParams }) {
    const t = await getTranslations();
    return (
        <GenericDataTable
            searchParams={searchParams}
            fetchFn={getRepositories}
            queryParams={[
                { key: 'limit', default: 12 },
                { key: 'offset', default: 0 },
                { key: 's', default: '', searchLabel: t('inputs.search.repositoryName') },
            ]}
            emptyStateKey="warehouse.repositories.table"
            showTooltip={false}
            renderList={({ data }) => (
                // RepositoryListClient owns its own table + create modal button
                <RepositoryListClient
                    initialRepositories={data?.results ?? []}
                    count={data?.count}
                    next={data?.next}
                    previous={data?.previous}
                />
            )}
        />
    );
}
