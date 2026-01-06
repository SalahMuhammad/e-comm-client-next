import { getRepositories } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import ErrorLoading from "@/components/ErrorLoading";
import RepositoryListClient from "./RepositoryListClient";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations();


    const res = await getRepositories(`?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`);
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data;

    return (
        <>
            {data?.err ?
                <ErrorLoading name="warehouse.repositories.table" message={data.err} />
                :
                <>
                    <QueryParamSetterInput
                        paramName={searchParamName}
                        paramOptions={[{ label: t('inputs.search.repositoryName'), value: 's' }]}
                    />

                    <RepositoryListClient
                        initialRepositories={data.results}
                        count={data.count}
                        next={data.next}
                        previous={data.previous}
                    />

                    {data.count == 0 &&
                        <ErrorLoading name="warehouse.repositories.table" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5" />
                    }

                    <PaginationControls
                        resCount={data.count}
                        hasNext={data.next}
                        hasPrev={data.previous}
                    />
                </>
            }
        </>
    )
}

export default Page
