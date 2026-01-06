import { getCSs } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import CustomerSupplierTable from "./CustomerSupplierTable"
import ErrorLoading from "@/components/ErrorLoading";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations();

    const res = await getCSs(`?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`);
    (res?.status === 403 && res.data?.detail?.includes('jwt')) &&
        redirect(`/auth/logout?nexturl=${(await headers()).get('x-original-url') || ''}`, 'replace')
    const data = res.data


    return (
        <>
            {data?.err ?
                <ErrorLoading name="warehouse.repositories.table" message={data.err} />
                :
                <>
                    <QueryParamSetterInput
                        paramName={searchParamName}
                        paramOptions={[{ label: t('inputs.search.ownerName'), value: 's' }]}
                    />

                    <div className="relative overflow-x-auto shadow-md rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        {t('customer-supplier.table.head.name')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('customer-supplier.table.head.details')}
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        {t('customer-supplier.table.head.actions')}
                                    </th>
                                </tr>
                            </thead>

                            <CustomerSupplierTable CSs={data.results} />

                        </table>
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
