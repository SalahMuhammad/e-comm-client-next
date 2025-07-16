import { getRepositories } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { getTranslations } from "next-intl/server";
import DeleteButton from "./DeleteButton";
import Link from 'next/link';





async function Page({ searchParams }) {
    const searchParamName = 's';
    const params = await searchParams;
    const limit = params['limit'] ?? 12;
    const offset = params['offset'] ?? 0;
    const search = params[searchParamName] ?? '';
    const t = await getTranslations("warehouse.repositories");


    const data = await getRepositories(`?limit=${limit}&offset=${offset}${search ? `&s=${search}` : ''}`);

    return (
        <>
        <QueryParamSetterInput 
            paramName={searchParamName}
        />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.name')}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            {t('table.head.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.results.map((repository) => (
                        <tr key={repository.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {repository.name}
                            </th>
                            <td className="flex items-center px-6 py-4">
                                <DeleteButton id={repository.id} />
                                <Link href={`/repository/form/${repository.id}`} className="ml-2 text-blue-600 hover:underline">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        
        <PaginationControls 
                resCount={data.count}
                hasNext={data.next}
                hasPrev={data.previous}
        />  
        </>
    )
}

export default Page
