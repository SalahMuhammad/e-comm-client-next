import { getRepositories } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
// import DeleteButton from "./DeleteButton";
// import Link from 'next/link';
import ErrorLoading from "@/components/ErrorLoading";
import RepositoryTable from "./RepositoryTable";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations("warehouse.repositories");


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
                        paramOptions={[{ label: 'Repository Name', value: 's' }]}
                    />

                    <div className="relative overflow-x-auto shadow-md sm:rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        {t('table.head.name')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {/* {t('table.head.actions')} */}
                                    </th>
                                </tr>
                            </thead>

                            <RepositoryTable repositories={data.results} />
                        </table>
                        {data.count == 0 &&
                            <ErrorLoading name="warehouse.repositories.table" err="nothing" className="w-full transform-translate-x-1/2 flex justify-center items-center bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 p-5" />
                        }
                    </div>


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
