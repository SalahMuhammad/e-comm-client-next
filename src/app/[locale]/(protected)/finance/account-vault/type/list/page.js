import { getAccountTypeList } from "../../actions";
import PaginationControls from '@/components/PaginationControls';
import { URLQueryParameterSetter } from '@/components/inputs/index';
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ErrorLoading from "@/components/ErrorLoading";
import ListClient from "../../_common/ListClient";


async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations();

    const res = await getAccountTypeList(`?limit=${limit}&offset=${offset}${search ? `&name=${search}` : ''}`);

    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')

    const data = res.data

    return (
        <>
            <URLQueryParameterSetter
                paramName={searchParamName}
                paramOptions={[
                    { label: t('inputs.search.name'), value: 's' },
                ]}
            />

            <ListClient
                type="type"
                initialItems={data.results}
                count={data.count}
                next={data.next}
                previous={data.previous}
            />

            {data?.count == 0 &&
                <ErrorLoading name="global.errors" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5 rounded-md mt-3" />
            }

            <PaginationControls
                resCount={data?.count}
                hasNext={data?.next}
                hasPrev={data?.previous}
            />
        </>
    )
}

export default Page
