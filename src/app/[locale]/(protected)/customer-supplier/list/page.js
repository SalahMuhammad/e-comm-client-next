import { getCSs } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import Link from 'next/link';
import CustomerSupplierTable from "./CustomerSupplierTable"
import ErrorLoading from "@/components/ErrorLoading";

async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations("customer-supplier");

    const data = await getCSs(`?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`);

    return (
        <>
            {data?.err ?
                <ErrorLoading name="warehouse.repositories.table" message={data.err} />
                :
                <>
                <QueryParamSetterInput 
                    paramName={searchParamName}
                />

                <div className="relative overflow-x-auto shadow-md rounded-md">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    {t('table.head.name')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {t('table.head.details')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    {t('table.head.actions')}
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
