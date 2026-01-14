'use client';

import { useEffect, useState } from 'react';
import { getCategoryList } from "../actions";
import PaginationControls from '@/components/PaginationControls';
import QueryParamSetterInput from '@/components/QueryParamSetterInput';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import ErrorLoading from "@/components/ErrorLoading";
import ListClient from "../_common/ListClient";


export default function Page() {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getCategoryList(`?${searchParams.toString()}`);
            if (res?.ok) {
                setData(res.data);
            }
        };
        fetchCategories();
    }, [searchParams]);

    return (
        <>
            <QueryParamSetterInput
                paramOptions={[
                    { label: t('inputs.search.name'), value: 'name' },
                    { label: t('finance.expense.category.description'), value: 'description' },
                ]}
            />

            <ListClient
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
